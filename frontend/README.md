# Frontend - Scrum Poker

Next.js application for Scrum Poker planning.

## Development

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

Copy `.env.example` to `.env.local` and update:

```env
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

For production, set this to your Render backend URL.

## Deployment

Deploy to Vercel:

```bash
vercel --prod
```

See ../DEPLOYMENT.md for detailed instructions.
