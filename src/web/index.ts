import { Application, Context, Router } from "oak/mod.ts";
import { config, Guild } from "../config/index.ts";
import { route as submit } from "./post/submit.ts";
import {getGuild} from "../bot/index.ts";

let app: Application;
let router: Router;

/**
 * Initialize the web application.
 */
async function init(): Promise<void> {
    // Create the applications
    app = new Application();
    router = new Router();

    // Logger
    app.use(async (context: Context, next: Function) => {
        console.log(`${context.request.ip}: ${context.request.method} ${context.request.url}`);

        try {
            await next();
        } catch (e) {
            console.error(e);
        }
    });

    // Dynamic routers
    submit();
    app.use(router.routes());

    // Initialize sites
    const sites: Map<String, String> = new Map();
    for (const key of Object.keys(config.discord.guilds)) {
        const value: Guild = config.discord.guilds[key];

        const page = Deno.readTextFileSync(`${Deno.cwd()}/public/endpoint.html`);
        const script = `
            <script>
                    const siteKey = "${config.recaptcha["site-key"]}";
                    const serverName = "${value?.name || (await getGuild(key)).name}";
                    const key = "${key}";
            </script>
        `

        const replaced = page.replace("%dataScript", script);
        const endpoint = value?.endpoint || `/${key}`;
        sites.set(endpoint, replaced);
    }

    app.use(async (context: Context, next: Function) => {
        if (context.request.headers.get("accept")?.includes("text/html") && sites.has(context.request.url.pathname)) {
            context.response.body = sites.get(context.request.url.pathname);
        } else {
            try {
                await context.send({
                    root: `${Deno.cwd()}/public`,
                    index: "not-found.html"
                });
            } catch {
                await next();
            }
        }
    });

    // Not found
    const notFound = Deno.readTextFileSync(`${Deno.cwd()}/public/not-found.html`);
    app.use(async (context: Context) => {
        context.response.body = notFound;
    });

    app.listen({ port: config.webserver.port });
    console.log("Webserver is now listening to requests!");
}

export { init, app, router };