import * as log from "log/mod.ts";
import { ensureDir, exists } from "fs/mod.ts";
import { parse as loadYAML } from "encoding/yaml.ts";

/**
 * Guild config structure.
 */
interface Guild {
    "id": string,
    "channel": string,
    "name"?: string,
    "endpoint"?: string,
    "domain"?: string,
    "key"?: string
}

/**
 * Config file interface.
 */
interface Config {
    "webserver": {
        "port": number
    },
    "recaptcha": {
        "site-key": string
    },
    "discord": {
        "guilds": {
            [key: string]: Guild
        }
    }
}

/**
 * Tokens file interface.
 */
interface Tokens {
    "recaptcha": string,
    "discord": string
}

interface Domains {
    [key: string]: Guild[],
    "default": Guild[]
}

/**
 * CAPTCHAcord's configuration.
 */
let config: Config;

/**
 * CAPTCHAcord's private tokens.
 */
let tokens: Tokens;

/**
 * Domains to utilize.
 */
const domains: Domains = {
    "default": []
};

/**
 * Initialize the configuration files.
 */
async function init(): Promise<void> {
    log.debug("Initializing configuration files...");

    await ensureDir("config");
    let createdFiles = false;

    // Copy the default config files
    log.debug("Checking if configuration files exist...");
    if (!await exists("config/config.yml")) {
        log.debug("config.yml does not exist! Copying...");
        await Deno.copyFile("src/config/defaults/config.yml", "config/config.yml");
        createdFiles = true;
    }

    if (!await exists("config/tokens.yml")) {
        log.debug("tokens.yml does not exist! Copying...");
        await Deno.copyFile("src/config/defaults/tokens.yml", "config/tokens.yml");
        createdFiles = true;
    }

    // Exit if files were created
    if (createdFiles) {
        log.info("New config files were created. Please fill them out as needed!");
        Deno.exit(0);
    }

    // Read the config files
    log.debug("Reading configuration files...");
    const configFile = await Deno.readTextFile("config/config.yml");
    const tokensFile = await Deno.readTextFile("config/tokens.yml");

    // Parse the YAML files
    config = loadYAML(configFile) as Config;
    tokens = loadYAML(tokensFile) as Tokens;

    // Iterate each domain's endpoints
    for (const [key, value] of Object.entries(config.discord.guilds)) {
        const guild = config.discord.guilds[key];
        const domain = value.domain;

        guild.key = key;

        // Domain specified
        if (domain) {
            // Create array for domain endpoints
            if (!domains[domain]) {
                domains[domain] = [];
            }

            domains[domain].push(guild);
        } else {
            // Default domain
            domains.default.push(guild);
        }
    }

    log.info("Configuration files are ready!");
}

export { init, config, tokens, domains };
export type { Guild };
