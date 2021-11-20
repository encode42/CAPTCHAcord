import { Client, Guild, GatewayIntents } from "harmony/mod.ts";
import { config, tokens } from "../config/index.ts";

let client: Client;

/**
 * Initialize the Discord bot.
 */
async function init(): Promise<void> {
    client = new Client({
        presence: {
            status: "offline"
        }
    });

    // Connect to Discord
    client.connect(tokens.discord, [
        GatewayIntents.GUILDS,
        GatewayIntents.GUILD_INVITES
    ]);

    await client.on("ready", async () => {
        console.log("Discord bot is ready!");
    });
}

// Guild cache
let guilds: Map<String, Guild> = new Map();

// Get the guild
async function getGuild(key: string): Promise<Guild> {
    if (!guilds.has(key)) {
        guilds.set(key, await client.guilds.fetch(config.discord.guilds[key].id));
    }

    return guilds.get(key)!;
}

export { init, client, getGuild };