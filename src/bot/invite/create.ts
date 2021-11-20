import TTL from "ttl/mod.ts";
import { getGuild } from "../index.ts";
import { config } from "../../config/index.ts";

async function create(key: string): Promise<TTL<URL>> {
    const value = config.discord.guilds[key];

    // Create the invite
    const invite = await (await getGuild(key)).invites.create(value.channel, { maxAge: 45, maxUses: 1 });

    const ttl = new TTL<URL>(45_000);
    ttl.set(key, new URL(`https://discord.gg/${invite}`))
    return ttl;
}

export { create };