import { Application, Context, Router } from "oak/mod.ts";
import { config } from "../config/index.ts";
import { route as submit } from "./post/submit.ts";
import { writeKeys } from "../config/static.ts";

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

    // Static pages
    app.use(async (context: Context, next: Function) => {
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
    app.use(async (context: Context) => {
        context.response.redirect("/");
    });

    // Generate static config files
    await writeKeys();

    app.listen({ port: config.webserver.port });
    console.log("Webserver is now listening to requests!");
}

export { init, app, router };