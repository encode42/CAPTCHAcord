import * as log from "log/mod.ts";
import { Application, Context, Router, Request } from "oak/mod.ts";
import { config } from "../config/index.ts";
import * as generic from "./endpoints/generic/generic.ts";
import * as sites from "./endpoints/generic/sites.ts";
import * as submit from "./endpoints/post/submit.ts";

let app: Application;
let router: Router;

/**
 * Initialize the web application.
 */
async function init(): Promise<void> {
    log.debug("Initializing web server...");

    // Create the applications
    app = new Application();
    router = new Router();

    // Logger
    app.use(async (context: Context, next: Function) => {
        log.info(`[${getForwardedIP(context.request)}] ${context.request.method} ${context.request.url}`);

        try {
            await next();
        } catch (e) {
            log.error(e);
        }
    });

    // Dynamic routers
    submit.init();
    app.use(router.routes());

    // Dynamic sites
    await sites.init();
    generic.init();

    app.listen({ port: config.webserver.port });
    log.info("Webserver is ready!");
}

/**
 * Get the forwarded IP of a connection.
 * @param request Request to get forwarded IP for
 */
function getForwardedIP(request: Request): String {
    const forwardedHeader = request.headers.get("X-Forwarded-For");
    return forwardedHeader?.split(", ")[0] || request.ip;
}

export { init, app, router, getForwardedIP };