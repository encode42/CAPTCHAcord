import * as log from "log/mod.ts";
import { Client, Guild, GatewayIntents } from "harmony/mod.ts";
import { config, tokens } from "../config/index.ts";

/**
 * The Discord bot client
 */
let client: Client;

/**
 * Initialize the Discord bot
 */
async function init(): Promise<void> {
    log.debug("Initializing Discord bot...");

    client = new Client({
        presence: {
            status: "offline"
        }
    });

    // Connect to Discord
    log.debug("Connecting to Discord...");
    client.connect(tokens.discord, [
        GatewayIntents.GUILDS,
        GatewayIntents.GUILD_INVITES
    ]);

    log.info(await new Promise<string>(resolve => {
        client.on("ready", () => {
            resolve("Discord bot is ready!");
        });
    }));
}

const guilds: Map<String, Guild> = new Map();

/**
 * Get and store a guild from the config
 * @param key Key to retrieve
 */
async function getGuild(key: string): Promise<Guild | undefined> {
    log.debug(`Getting guild for ${key}...`);

    if (!guilds.has(key)) {
        log.debug(`Guild is not in the cache! Adding...`);
        guilds.set(key, await client.guilds.fetch(config.discord.guilds[key].id));
    }

    return guilds.get(key);
}

export { init, getGuild };