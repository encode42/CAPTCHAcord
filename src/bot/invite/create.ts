import { getGuild } from "../index.ts";
import { config } from "../../config/index.ts";

async function create(): Promise<URL> {
    // Create the invite
    const invite = await (await getGuild()).invites.create(config.discord.channel, { maxAge: 45, maxUses: 1 });
    return new URL(`https://discord.gg/${invite}`);
}

export { create };