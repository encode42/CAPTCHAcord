import * as oak from "oak/mod.ts";
import * as submit from "./post/submit.ts";
import { config } from "../config/index.ts";

let app: oak.Application;
let router: oak.Router;

/**
 * Initialize the web application.
 */
async function init(): Promise<void> {
    // Create the applications
    app = new oak.Application();
    router = new oak.Router();

    // Logger
    app.use(async (context: oak.Context, next: Function) => {
        console.log(`${context.request.ip}: ${context.request.method} ${context.request.url}`);

        try {
            await next();
        } catch (e) {
            console.error(e);
        }
    });

    // Dynamic routers
    submit.route();
    app.use(router.routes());

    // Static pages
    app.use(async (context: oak.Context, next: Function) => {
        try {
            await context.send({
                root: `${Deno.cwd()}/public`,
                index: "index.html"
            });
        } catch {
            await next();
        }
    });

    // Not found
    app.use(async (context: oak.Context) => {
        context.response.redirect("/");
    });

    app.listen({ port: config.webserver.port });
    console.log("Webserver is now listening to requests!");
}

export { init, app, router };