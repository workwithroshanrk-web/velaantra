# Velaantra — Vercel edition

This is the Velaantra site adapted from ChatGPT Sites to standard Next.js for Vercel. The form needs a persistent Postgres database; a page-only deployment will not save enquiries.

## Deploy

1. Upload this folder to a Git repository and import it as a Next.js project in Vercel, or use the Vercel CLI from this folder.
2. In the Vercel project, add a Postgres database through **Storage → Marketplace** (Neon is one option). Set `DATABASE_URL` in the project's Production environment to its pooled Postgres connection string. Keep it secret; never prefix it with `NEXT_PUBLIC_`.
3. Run `schema.sql` once in that database's SQL editor to create the `enquiries` table.
4. Deploy or redeploy after setting the environment variable. Test one submission and confirm a row appears in the database table viewer.
5. Add your own domain under the Vercel project's **Settings → Domains** and follow Vercel's DNS instructions for your registrar.

The prior ChatGPT Sites D1 data is separate and does not move automatically. Existing enquiries remain in that project's database. This package does not expose an owner dashboard; view submissions in the database provider's table viewer. There are no email notifications yet.

## Local development

Copy `.env.example` to `.env.local`, replace its sample connection string with your database URL, run `npm install`, then `npm run dev`. Never commit `.env.local`.
