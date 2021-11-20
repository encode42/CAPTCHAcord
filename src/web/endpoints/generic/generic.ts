import { Context } from "oak/mod.ts";
import { app } from "../../index.ts";

/**
 * Generic site routing
 */
function route(): void {
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
        context.response.redirect("/not-found.html");
    });
}

export { route };