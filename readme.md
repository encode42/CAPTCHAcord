[Support]: https://encode42.dev/support
[Discord Badge]: https://img.shields.io/discord/646517284453613578?color=7289da&labelColor=7289da&label=​&logo=discord&logoColor=white&style=flat-square
[Codacy]: https://app.codacy.com/gh/Encode42/CAPTCHAcord
[Codacy Badge]: https://img.shields.io/codacy/grade/79f97c356b6a47fc9251096465e3b7f0?color=172B4D&labelColor=172B4D&label=​&logo=codacy&style=flat-square

<img src=".github/assets/badge.png" width="200px" align="left">

<div align="right">

# CAPTCHAcord
### A single-instance portal to automatically create single-use Discord invites after solving a captcha. Useful for large public servers that need to prevent spam bots, or non-humans in general, from joining their server and wreaking havoc.
[![][Codacy Badge]][Codacy] [![][Discord Badge]][Support]
</div>

## 🔧 Setup
1. Install [Deno](https://deno.land/). This is what the service is built on, and therefore is required!
2. (optional) Intall [Velociraptor](https://velociraptor.run/). This allows the usage of pre-made start scripts.
3. Clone and run the application at least once. This will copy the default configuration files.
4. Configure the application. You're mostly on your own on this but here's the gist:
  - Create a **v2 invisible** [reCAPTCHA site](https://www.google.com/recaptcha/admin/create) and copy its public and private keys into `config.yml` and `tokens.yml` respectively.
  - Create a [Discord bot token](https://www.writebots.com/discord-bot-token/) and copy its token into `tokens.yml`.
  - Invite the bot to your server with the `Create Instant Invite` permission only. Only one server per instance!
  - Fill out the guild and channel IDs in `config.yml`.
5. Start it up! Remove all existing invite links from the server and redirect new members to the CAPTCHAcord site instance!

## ❔ FAQ
<details>
<summary>
How do I change how the site looks?
</summary>

Open the `public` directory and edit `style.css` or `index.html` to your liking! These files are static, they will never be overwritten.
</details>

<details>
<summary>
Is it possible to redirect to more than one server?
</summary>

Not with a single instance. As it stands currently, you must host a single instance for each server you connect to the bot.

This may change in the future, though.
</details>