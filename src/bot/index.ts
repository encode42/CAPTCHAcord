import { Client, Guild, GatewayIntents } from "harmony/mod.ts";
import { config, tokens } from "../config/index.ts";

let client: Client;
let guild: Guild;

/**
 * Initialize the Discord bot.
 */
function init(): void {
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

    client.on("ready", async () => {
        console.log("Discord bot is ready!");

        guild = await client.guilds.fetch(config.discord.guild);
    });
}

export { init, client, guild };