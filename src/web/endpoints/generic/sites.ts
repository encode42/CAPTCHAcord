import { Context } from "oak/mod.ts";
import { app } from "../../index.ts";
import { config, Guild } from "../../../config/index.ts";
import { getGuild } from "../../../bot/index.ts";

/**
 * Invite webpages endpoint
 */
async function route(): Promise<void> {
    // Initialize sites
    const sites: Map<String, String> = new Map();
    for (const key of Object.keys(config.discord.guilds)) {
        const value: Guild = config.discord.guilds[key];

        // Generate site data
        const page = Deno.readTextFileSync(`${Deno.cwd()}/public/endpoint.html`);
        const script = `
            <script>
                    const siteKey = "${config.recaptcha["site-key"]}";
                    const serverName = "${value?.name || (await getGuild(key)).name}";
                    const key = "${key}";
            </script>
        `

        // Import the script
        const replaced = page.replace("%dataScript", script);
        const endpoint = value?.endpoint || `/${key}`;
        sites.set(endpoint, replaced);
    }

    // Serve endpoints
    app.use(async (context: Context, next: Function) => {
        // Ensure headers and existence then serve
        if (sites.has(context.request.url.pathname)) {
            context.response.body = sites.get(context.request.url.pathname);
        } else {
            await next();
        }
    });
}

export { route };