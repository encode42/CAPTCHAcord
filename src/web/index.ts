import { Application, Context, Router, Request } from "oak/mod.ts";
import { config, Guild } from "../config/index.ts";
import { route as generic } from "./endpoints/generic/generic.ts";
import { route as sites } from "./endpoints/generic/sites.ts";
import { route as submit } from "./endpoints/post/submit.ts";

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
        console.log(`${getForwardedIP(context.request)}: ${context.request.method} ${context.request.url}`);

        try {
            await next();
        } catch (e) {
            console.error(e);
        }
    });

    // Dynamic routers
    await submit();
    app.use(router.routes());

    // Dynamic sites
    await sites();
    await generic();


    app.listen({ port: config.webserver.port });
    console.log("Webserver is now listening to requests!");
}

function getForwardedIP(request: Request) {
    const forwardedHeader = request.headers.get("X-Forwarded-For");
    return forwardedHeader || request.ip;
}

export { init, app, router, getForwardedIP };