import * as config from "./config/index.ts";
import * as bot from "./bot/index.ts";
import * as web from "./web/index.ts";

// Initialize the configuration files
await config.init();

// Start the bot
await bot.init();

// Start the webserver
await web.init();