import * as log from "log/mod.ts";
import { Context } from "oak/mod.ts";
import { Request } from "request/mod.ts";
import TTL from "ttl/mod.ts";
import { create as createInvite } from "../../../bot/invite/create.ts";
import { router, getForwardedIP } from "../../index.ts";
import { config, tokens } from "../../../config/index.ts";

/**
 * Response structure for reCAPTCHA
 */
interface Grecaptcha {
    success: boolean,
    // eslint-disable-next-line camelcase
    challenge_ts: string,
    hostname: string
}

const invites: Map<String, TTL<URL>> = new Map();

/**
 * Form submit endpoint
 */
function init(): void {
    log.debug("Initializing submit endpoint...");

    router.post("/submit", async (context: Context) => {
        // Request body
        const req = await context.request.body().value;

        // Form response
        const captcha = req["g-recaptcha-response"];
        const key = req.key;

        // Invalid captcha response
        const forwardedIP = getForwardedIP(context.request);
        if (!captcha || !config.discord.guilds[key]) {
            log.warning(`Got unknown response from ${forwardedIP}!`);
            context.response.status = 400;
            return;
        }

        // Check if invite already created
        log.debug("Checking for existing invites...");
        const existingInvite = invites.get(forwardedIP)?.get(key);
        if (existingInvite) {
            context.response.body = { url: existingInvite, isExisting: true };
            return;
        }

        // Verify the captcha
        log.debug("Verifying reCAPTCHA response...");
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${tokens.recaptcha}&response=${captcha}&remoteip=${forwardedIP}`;
        const response: Grecaptcha = await Request.get(verificationURL);

        if (response.success) {
            // Create the invite
            log.debug("Creating the invite...");
            const url = await createInvite(key);

            // Respond with the link
            context.response.body = { url: url.get(key) };

            // Add to cache
            invites.set(forwardedIP, url);
        } else {
            // Invalid captcha
            log.debug(`${forwardedIP} sent an invalid reCAPTCHA response!`);
            captcha.response.status = 403;
        }
    });
}

export { init };