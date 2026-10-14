# Prolific Properties

Property listing website with an admin panel, built with Next.js and MongoDB.

## Requirements

- Node.js 24+
- Docker (for the local MongoDB)

## First-time setup

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run db:up                # start MongoDB in Docker
npm run seed                 # load sample properties, blog posts, testimonials, jobs, settings and the admin user
```

The admin login is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local` the first time you run the seed.

## Start

```bash
npm run db:up
npm run dev
```

- Website: [http://localhost:3000](http://localhost:3000)
- Admin panel: [http://localhost:3000/admin](http://localhost:3000/admin)

## Stop

Press `Ctrl + C` in the terminal running `npm run dev`, then:

```bash
npm run db:down
```

Your data is kept in the `mongo-data` Docker volume, so it is still there the next time you run `npm run db:up`.

## Reset to sample data

```bash
npm run seed
```

This replaces properties, blog posts, testimonials, jobs and site settings with the sample data. The admin account and enquiries are kept. Restart `npm run dev` afterwards so the site picks up the new data.

## Commands

| Command | What it does |
| --- | --- |
| `npm run db:up` | Start MongoDB in Docker |
| `npm run db:down` | Stop and remove the MongoDB container (data is kept) |
| `npm run seed` | Load the sample data |
| `npm run dev` | Start the development server |
| `npm run build` | Production build (MongoDB must be running) |
| `npm run start` | Run the production build |
| `npm run lint` | Lint the code |
