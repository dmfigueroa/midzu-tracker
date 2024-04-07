# Midzu Tracker

This project was made to try Cloudflare Workers with KV. The functionality is simple, it is a cronjob that updates a value from the KV that indicates when was the last time one of the Twitch channels was live on stream.

## Requirements

1. Node.js >= 20
1. pnpm
1. A Cloudflare developer account
1. A CLoudflare KV store
1. A Twitch application with Client and Secret ids - docs

## Previous steps

### Environment variables

Cloudflare workers don't work with `.env` files but with `.local.vars`. However this only works on a local environment. The same environment variables needs to be setup on the Worker's configuration.

- TWITCH_CLIENT_ID
- TWITCH_CLIENT_SECRET

### Wrangler file

You may need to update the `wrangler.toml` file since it has the KV namespace ID hardcoded. If you fork this and want to deploy it yourself you need to change this to your own, otherwise it won't work on your account.

## How to start

Once you have all the required files you may run the following commands.

### 1. Install dependencies

```bash
pnpm install
```

You can use any other package manager like npm or yarn.

### 2. Run the cronjob (locally)

You can run the server using pnpm.

```bash
npm run start
```

## Deploy

This project doesn't implement automatic deployments via Github Actions or any other CD solution to keep it simple. In order to deploy it to your Cloudflare Workers just use the commad

```bash
pnpm run deploy
```

> It is important to write `run deploy` instead of just `deploy` since that a reserved pnpm command
