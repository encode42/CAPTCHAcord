import { ensureDir, exists } from "fs/mod.ts";
import { parse as loadYAML } from "encoding/yaml.ts";

/**
 * Config file interface.
 */
interface Config {
    webserver: {
        port: number
    },
    recaptcha: {
        "site-key": string
    },
    discord: {
        link: string,
        guild: string,
        channel: string,
        name: string
    }
}

/**
 * Tokens file interface.
 */
interface Tokens {
    recaptcha: string,
    discord: string
}

/**
 * Captcha's configuration.
 */
let config: Config;

/**
 * Captcha's private tokens.
 */
let tokens: Tokens;

/**
 * Initialize the configuration files.
 */
async function init(): Promise<void> {
    await ensureDir("config");

    // Copy the default config files
    let createdFiles = false;
    if (!await exists("config/config.yml")) {
        await Deno.copyFile("src/config/defaults/config.yml", "config/config.yml");
        createdFiles = true;
    }

    if (!await exists("config/tokens.yml")) {
        await Deno.copyFile("src/config/defaults/tokens.yml", "config/tokens.yml");
        createdFiles = true;
    }

    // Exit if files were created
    if (createdFiles) {
        console.log("New config files were created. Please fill them out as needed!");
        Deno.exit(0);
    }

    // Read the config files
    const configFile = await Deno.readTextFile("config/config.yml");
    const tokensFile = await Deno.readTextFile("config/tokens.yml");

    // Parse the YAML files
    config = loadYAML(configFile) as Config;
    tokens = loadYAML(tokensFile) as Tokens;



    console.log("Loaded the configuration files.");
}

export { init, config, tokens };