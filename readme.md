# Captchacord
A (very W.I.P.) single-instance portal to automatically create single-use Discord invites after solving a captcha.

This is useful for large public servers that need to prevent spam bots, or non-humans in general, from joining their server and wreaking havoc.

### Setup
1. Install [Deno](https://deno.land/). This is what I'm built on, and therefore is required!
2. (optional) Intall [Velociraptor](https://velociraptor.run/). This allows the usage of pre-made start scripts.
3. Run the application at least once. This will copy the default configuration files.
4. Configure the application. You're mostly on your own on this but here's the gist:
  - Create a **v2 invisible** [reCAPTCHA site](https://www.google.com/recaptcha/admin/create) and copy its public and private keys into `config.yml` and `tokens.yml` respectively.
  - Create a [Discord bot token](https://www.writebots.com/discord-bot-token/) and copy its token into `tokens.yml`.
  - Invite the bot to your server. Only one server per instance!
  - Fill out the guild and channel IDs in `config.yml`.
5. Start it up! Remove all existing invite links from the server and redirect new members to the Captchacord site instance!
