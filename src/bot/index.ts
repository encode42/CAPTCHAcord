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
let guild: Guild;

// Get the guild
async function getGuild(): Promise<Guild> {
    if (!guild) {
        guild = await client.guilds.fetch(config.discord.guild);
    }

    return guild;
}

export { init, client, getGuild };