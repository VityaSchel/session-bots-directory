# [Session bots directory](https://sessionbots.directory)

Session bots directory website is a place to discover new bots created by Session developers community. Visit the website: <https://sessionbots.directory>

[![Screenshot](https://github.com/VityaSchel/session-bots-directory/assets/59040542/a798cd77-27ca-4d45-8bd5-ce9cb064a59d)](https://sessionbots.directory)

It's free for everyone, does not require any personal info to sign up and simple to use.

## Get started

Want to add your own Session bot to sessionbots.directory?

1. Please make sure your bot follows [general guidelines](./GUIDELINES.md) for adding bots
2. Start developing with [session-nodejs-bot](https://github.com/VityaSchel/session-nodejs-bot) or any other tool, then host your bot somewhere
3. Go to [sessionbots.directory](https://sessionbots.directory) and create account using **Sign up** button in navigation. It is adviced to keep credentials to your account in case you need to update info or hide your bot. In case you lost it, don't worry because you can always restore your bots and you will be required to verify authority of bot anyway
4. Fill info about your bot. It will be reviewed by our automated system to check if it follows our [general guidelines](./GUIDELINES.md)
5. Verify your bot. The system will ask you to add a specific secret command that responds with another specific text to verify that you are author of this bot. In case this bot was already added to sessionbots.directory, info will be updated and it will be moved to your account
6. When you're done, your bot will appear on frontpage. Our automated system will periodically create empty accounts and write to your bot to check your bot to see if it's 1) online and 2) does not send anything illegal to user

## About this website

I wanted to try something new, so I've decided to go with Remix this time. Also the goal was to keep this website resource-efficient so I wanted something performant and simple. The website is built with React, Tailwind+shadcn/ui and Redis. Reports are send to Telegram bot. To prevent abuse, site uses hCaptcha.

## Contact

In case you need any assistance with the website, do not hestitate to contact me via e-mail or Telegram (can be found in my GitHub profile). Please, kindly put "URGENT" to your message if it needs immediate attention (such as removing bot with illegal content in it).