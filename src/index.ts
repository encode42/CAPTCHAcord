import { init as initConfig } from "./config/index.ts";
import { init as initBot } from "./bot/index.ts";
import { init as initWeb } from "./web/index.ts";

// Initialize the configuration files
await initConfig();

// Start the bot
await initBot();

// Start the webserver
await initWeb();