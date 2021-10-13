import { Context } from "oak/mod.ts";
import { Request } from "request/mod.ts";
import TTL from "ttl/mod.ts";
import { create as createInvite } from "../../bot/invite/create.ts";
import { router } from "../index.ts";
import { tokens } from "../../config/index.ts";

const ttl = new TTL<string>(30_000);

interface Grecaptcha {
    success: boolean,
    // eslint-disable-next-line camelcase
    challenge_ts: string,
    hostname: string
}

/**
 * Form submit endpoint
 */
function route(): void {
    router.post("/submit", async (context: Context) => {
        // Check if IP is in the cache
        if (ttl.get(context.request.ip)) {
            context.response.status = 429;
            return;
        }

        // Add the IP to the cache
        ttl.set(context.request.ip, "true");

        // Request body
        const req = await context.request.body().value;

        // Captcha response
        const captcha = req["g-recaptcha-response"];

        // Invalid captcha response
        if (!captcha) {
            context.response.status = 400;
            return;
        }

        // Verify the captcha
        const verificationURL = `https://www.google.com/recaptcha/api/siteverify?secret=${tokens.recaptcha}&response=${captcha}&remoteip=${context.request.ip}`;
        const response: Grecaptcha = await Request.get(verificationURL);

        if (response.success) {
            // Create the invite
            const url = await createInvite();

            // Respond with the link
            context.response.body = { url: url };
        } else {
            // Invalid captcha
            captcha.response.status = 403;
        }
    });
}

export { route };