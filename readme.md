[Support]: https://encode42.dev/support
[Discord Badge]: https://img.shields.io/discord/646517284453613578?color=7289da&labelColor=7289da&label=​&logo=discord&logoColor=white&style=flat-square
[Codacy]: https://app.codacy.com/gh/Encode42/CAPTCHAcord
[Codacy Badge]: https://img.shields.io/codacy/grade/79f97c356b6a47fc9251096465e3b7f0?color=172B4D&labelColor=172B4D&label=​&logo=codacy&style=flat-square
[Kevlar]: https://kevlar.to

> ### ⚠️ Deprecation Notice
> This is being replaced by [Kevlar], a web-based alternative.

<img src=".github/assets/badge.png" width="200px" align="left">

<div align="right">

# CAPTCHAcord
### A multi-use portal to automatically create single-use Discord invites after solving a captcha. Useful for large public servers that need to prevent spam-bots, or non-humans in general, from joining their server and wreaking havoc.
[![][Codacy Badge]][Codacy] [![][Discord Badge]][Support]
</div>

## 🔧 Setup
This guide is targeted towards knowledgeable Linux and Discord users.

1. Install [Deno](https://deno.land/). This is what the application is built on, and therefore is required!
2. `git clone` the repository and run the application at least once via `start.sh`. This will copy the default configuration files.
3. Configure the application. You're mostly on your own on this but here's the gist:
  - Create a **v2 invisible** [reCAPTCHA site](https://www.google.com/recaptcha/admin/create) and copy its public and private keys into `config.yml` and `tokens.yml` respectively.
  - Create a [Discord bot token](https://www.writebots.com/discord-bot-token/) and copy its token into `tokens.yml`.
  - Invite the bot to your servers with the `Create Instant Invite` permission only.
  - Fill out the information for your guilds in `config.yml`.
4. Start it up! Remove all existing invite links from your servers, dissallow creation of new invites, and redirect new members to the CAPTCHAcord site instance!

## ⚙️ Updating
Updating the application is extremely easy!

As always, you're recommended to create a backup of your instance first, but everything should be fine.

1. Enter the terminal and navigate to the target instance.
2. Run `git pull` and wait for it to complete. If you encounter merge conflicts, you must resolve them before continuing.
3. Restart the target instance! Customizations to the `public` and `config` directories should be left alone.

## ❔ FAQ
<details>
<summary>
How do I change how the site looks?
</summary>

Changes to in the `public` and `private` directories will never be modified, unless a commit changes said files.
All dynamic routes, strings, etc. are generated in code and are harder to modify.
</details>

<details>
<summary>
Is it possible to redirect to more than one server?
</summary>

Yes! In your `config.yml`, you can define multiple routes in the `discord.guilds` key. Keep in mind, the bot needs to be in each server and have sufficient permissions.

Example config:
```yaml
# Discord settings
discord:
  # Guilds to provide endpoints for
  guilds:
    # id: Guild to create invites for. (Discord guild ID)
    # channel: Channel to create invite to. (Discord channel ID)
    # name: (optional) Override the name of the guild displayed on the website.
    #       Defaults to the guild's display name if non-existent.
    # endpoint: (optional) Endpoint to attach and listen to. (HTTP location)
    #           Defaults to the name of the key.
    default:
      id: "684495087534866437"
      channel: "684550338291957896"
      endpoint: "/my-server"

    test:
      id: "365455168583499776"
      channel: "365455168583499779"
      name: ""
```

This will redirect `/my-server` to the guild `684495087534866437`, and `/test` to `365455168583499776`!
</details>
