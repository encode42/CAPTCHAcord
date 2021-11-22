import { parse } from "flags/mod.ts";
import * as log from "log/mod.ts";
import { init as initConfig } from "./config/index.ts";
import { init as initBot } from "./bot/index.ts";
import { init as initWeb } from "./web/index.ts";

// Parse the flags
const flags = parse(Deno.args, {
    "--": true,
    default: {
        "log-level": "INFO"
    },
    alias: {
        l: "log-level"
    }
});

// Log setup
await log.setup({
    handlers: {
        console: new log.handlers.ConsoleHandler(flags["log-level"], {
            formatter: "[{datetime}] [{levelName}] {msg}"
        })
    },
    loggers: {
        default: {
            level: "DEBUG",
            handlers: ["console"]
        }
    }
});

log.info("Starting CAPTCHAcord...");

// Initialize the configuration files
await initConfig();

// Start the bot
await initBot();

// Start the webserver
await initWeb();

log.info("CAPTCHAcord is ready!");