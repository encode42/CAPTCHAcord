import * as log from "log/mod.ts";
import { Context } from "oak/mod.ts";
import { DOMParser } from "dom/deno-dom-wasm.ts";
import { app } from "../../index.ts";
import { config, domains, Guild } from "../../../config/index.ts";
import { getGuild } from "../../../bot/index.ts";

/**
 * Endpoint page to serve
 */
const template = `${Deno.cwd()}/private/endpoint.html`;

/**
 * Generated and cached endpoints
 */
const endpoints = new Map<string, Map<string, string>>();

/**
 * Invite webpages endpoint
 */
async function init(): Promise<void> {
    log.debug("Initializing dynamic website endpoints...");

    // Initialize sites
    generate();

    // Watch for changes
    watch();

    // Serve endpoints
    app.use(async (context: Context, next: Function) => {
        // Get endpoints for domain
        const endpoint = endpoints.has(context.request.url.hostname) ? endpoints.get(context.request.url.hostname) : endpoints.get("default");

        // Check if endpoint exists
        if (endpoint?.has(context.request.url.pathname)) {
            // Serve the file
            context.response.body = endpoint.get(context.request.url.pathname);
        } else {
            await next();
        }
    });
}

/**
 * Generate the endpoint sites
 */
async function generate() {
    log.debug("Generating dynamic sites...");

    // Get the endpoint file
    const page = Deno.readTextFileSync(template);
    const document = new DOMParser().parseFromString(page, "text/html");
    const title = document?.getElementsByTagName("title")[0];
    const redirect = document?.getElementById("redirect");
    const captcha = document?.getElementsByClassName("g-recaptcha")[0];
    const siteKey = document?.getElementById("key");

    if (siteKey) {
        siteKey.attributes.name = "key";
    }

    // Generate data for each site
    for (const [key, value] of Object.entries(domains)) {
        const domainMap = new Map<string, string>();

        for (const endpoint of value) {
            log.debug(`Generating site for ${endpoint}...`);

            let customName;
            if (endpoint.name) {
                customName = endpoint.name;
            } else if (endpoint.key) {
                const guild = await getGuild(endpoint.key);
                customName = guild?.name;
            }

            // Generate the site info
            if (title) {
                title.innerHTML = title.innerHTML + (customName && ` - ${customName}`);
            }

            if (redirect) {
                redirect.innerHTML = `You will be redirected${customName && ` to ${customName}`} after solving a captcha.`;
            }

            if (captcha) {
                captcha.attributes["data-sitekey"] = config.recaptcha["site-key"];
            }

            if (siteKey && endpoint.key) {
                siteKey.attributes.value = endpoint.key;
            }

            // Done!
            domainMap.set(endpoint?.endpoint || `/${endpoint.key}`, document?.documentElement?.outerHTML || page);
        }

        endpoints.set(key, domainMap);
    }
}

/**
 * Watch for endpoint file changes
 */
async function watch() {
    const watcher = Deno.watchFs(template);
    for await (const event of watcher) {
        if (event.kind === "modify") {
            log.debug(`Changed detected in ${template}! Reloading...`);
            generate();
        }
    }
}

export { init };
