import { Context } from "oak/mod.ts";
import { DOMParser } from "dom/deno-dom-wasm.ts";
import { app } from "../../index.ts";
import { config, Guild } from "../../../config/index.ts";
import { getGuild } from "../../../bot/index.ts";

/**
 * Endpoint page to serve
 */
const endpoint = `${Deno.cwd()}/private/endpoint.html`;

/**
 * Generated and cached sites
 */
const sites: Map<String, String> = new Map();

/**
 * Invite webpages endpoint
 */
async function route(): Promise<void> {
    // Initialize sites
    generate();

    // Watch for changes
    watch();

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

/**
 * Generate the endpoint sites
 */
async function generate() {
    // Get the endpoint file
    const page = Deno.readTextFileSync(endpoint);
    const document = new DOMParser().parseFromString(page, "text/html");
    const script = document?.getElementById("data-script");

    // Generate data for each site
    for (const key of Object.keys(config.discord.guilds)) {
        const value: Guild = config.discord.guilds[key];

        // Generate site data
        if (script) {
            script.innerHTML = `
                const siteKey = "${config.recaptcha["site-key"]}";
                const serverName = "${value?.name || (await getGuild(key)).name}";
                const key = "${key}";
            `;
        }

        // Import the script
        const endpoint = value?.endpoint || `/${key}`;
        sites.set(endpoint, document?.documentElement?.outerHTML || page);
    }
}

/**
 * Watch for endpoint file changes
 */
async function watch() {
    const watcher = Deno.watchFs(endpoint);
    for await (const event of watcher) {
        if (event.kind === "modify") {
            console.log(`Reloading ${endpoint}...`)
            generate();
        }
    }
}

export { route };