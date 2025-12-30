# GalloConta Next.js Client

A Next.js interface based on [Vercel Blob Next.js Starter](https://vercel.com/templates/next.js/blob-starter) for the [GalloConta](https://github.com/rminguell/galloconta) project.

## Demo

https://galloconta.vercel.app

## How to Use

Run the following command to build a local copy of the app:

```bash
git clone https://github.com/rminguell/galloconta-client
cd galloconta-client
pnpm install
```

Once that's done, copy the .env.example file in this directory to .env.local (which will be ignored by Git):

```bash
cp .env.example .env.local
```

Then open `.env.local` and set the environment variables to match the ones in your Vercel Storage Dashboard.

Next, run Next.js in development mode:

```bash
pnpm dev
```
