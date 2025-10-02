# 🃏 Scrum Poker Cards

A modern, real-time collaborative Scrum poker planning application with no login required. Features a dark UNO-inspired theme with minimal colors and bold accents.

## ✨ Features

### � Real-Time Collaboration
- **Instant Sync**: See other participants join, vote, and select cards in real-time with 2-second heartbeat
- **Room-Based Sessions**: Create or join rooms with unique 6-character codes
- **Auto-Join**: Users automatically join the session when they enter
- **Live Presence**: Participants are removed automatically after 8 seconds of inactivity
- **Cross-Tab Sync**: Works across multiple browser tabs using BroadcastChannel API
- **Optimized Concurrency**: Improved real-time updates for better multi-user experience

### �🎴 Multiple Card Scales
- **Fibonacci**: 0, 1, 2, 3, 5, 8, 13, 21, ?, ☕
- **Powers of 2**: 0, 1, 2, 4, 8, 16, 32, 64, ?, ☕
- **T-Shirt Sizes**: XS, S, M, L, XL, XXL, ?, ☕
- **Custom Scale**: Create your own card values with add/remove functionality

### 👥 Collaborative Planning
- Virtual planning table with participants arranged in a circle
- Users join automatically - no manual participant addition
- Visual indicators showing who has voted
- Cards stay face-down until "Reveal Cards" is clicked
- **Vote Summary Panel**: Displays average, min, max, and most common votes when cards are revealed
- **Vote Distribution**: Shows the frequency of each vote value
- Start new rounds to reset all votes
- Color-coded avatars (Red, Blue, Yellow, Green)

### 🎨 UNO-Inspired Dark Theme
- Pure black background (#000000)
- Dark neutral UI elements (#171717, #262626, #404040)
- Bold accent colors: Red (#DC2626), Blue (#2563EB), Yellow (#EAB308), Green (#16A34A)
- Minimal, clean design with focus on functionality

### � Fully Responsive
- **Mobile-First Design**: Optimized for all screen sizes to fit on a single screen
- **Collapsible Settings**: Settings panel collapses on mobile for better UX
- **Touch-Friendly**: Large tap targets for cards and buttons
- **Adaptive Layout**: 1-column mobile, 4-column desktop grid
- **Scalable Elements**: Cards and avatars scale based on screen size
- **Compact Spacing**: Optimized padding and margins to maximize content visibility

## 🚀 Getting Started

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.



## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
