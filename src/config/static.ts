import { exists } from "fs/mod.ts";
import { getGuild } from "../bot/index.ts";
import { config } from "./index.ts";

/**
 * Write the required keys and configuration values to the static site.
 */
async function writeKeys(): Promise<void> {
    // Write the site key to the static files
    const textEncoder = new TextEncoder();
    if (!await exists("public/src/key.js")) {
        // Variables to write to file
        const toWrite: any = {
            siteKey: config.recaptcha["site-key"],
            serverName: config.discord.name || (await getGuild()).name
        };

        const lines: string[] = [];

        // Push all lines to array
        for (const key in toWrite) {
            lines.push(getVar(key, toWrite[key]));
        }

        // Write to key.js
        await Deno.writeFile("public/src/key.js", textEncoder.encode(
            "// Automatically generated - delete to refresh!\n" +
            lines.join("\n")
        ));
    }
}

/**
 * Get a JavaScript variable from a key and value.
 * @param key Key to refer to
 * @param value Value of key
 * @private
 */
function getVar(key: string, value: string): string {
    return `const ${key} = "${value}";`;
}

export { writeKeys };