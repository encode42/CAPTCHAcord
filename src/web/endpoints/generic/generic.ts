import * as log from "log/mod.ts";
import { Context } from "oak/mod.ts";
import { app } from "../../index.ts";

/**
 * Generic site routing
 */
function init(): void {
    log.debug("Initializing generic endpoints...");

    // Send the files if found
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
        log.debug(`${context.request.url} does not exist, redirecting!`);

        if (context.request.headers.get("accept")?.includes("text/html")) {
            context.response.redirect("/not-found.html");
            return;
        }

        context.response.status = 404;
    });
}

export { init };