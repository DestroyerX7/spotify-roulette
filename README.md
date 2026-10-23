# 🎵 Spotify Roulette

A multiplayer game where you and your friends guess **whose Spotify song is playing**.

**Play it here:** [spotify-roulette-ryz8.onrender.com](https://spotify-roulette-ryz8.onrender.com/)

## How It Works

1. **Log in** with your Spotify account.
2. **Create or join a lobby** with your friends.
3. A **random song** from one of the players' liked songs is picked and played.
4. Everyone **guesses whose song it is**.
5. Reveal the answer, see who got it right, and go again!

## Tech Stack

| Area | Technology |
| --- | --- |
| Framework | [Next.js 15](https://nextjs.org/) (App Router) + React 19 |
| UI | [shadcn/ui](https://ui.shadcn.com/), Radix UI, Tailwind CSS 4 |
| Realtime | [Socket.IO](https://socket.io/) with a custom Node server |
| Music | [Spotify Web API](https://developer.spotify.com/documentation/web-api) and [react-spotify-web-playback](https://github.com/gilbarbara/react-spotify-web-playback) |
| Forms & validation | React Hook Form + Zod |
| Language | TypeScript |
| Hosting | [Render](https://render.com/) |

## Getting Started

### Prerequisites

- Node.js 20+
- A Spotify account (Premium is required for in-browser playback)
- A Spotify app created in the [Spotify Developer Dashboard](https://developer.spotify.com/dashboard)

### Installation

```bash
git clone https://github.com/DestroyerX7/spotify-roulette.git
cd spotify-roulette
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
NEXT_PUBLIC_SPOTIFY_CLIENT_ID=your_client_id
SPOTIFY_CLIENT_SECRET=your_client_secret
NEXT_PUBLIC_SPOTIFY_REDIRECT_URI=http://localhost:3000/callback
```

### Run Locally

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

> The `dev` script uses Windows `set` syntax for `NODE_OPTIONS`. On macOS/Linux, run `NODE_OPTIONS="--loader ts-node/esm --no-warnings" ts-node server.mts` instead.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the custom Next.js + Socket.IO server in development |
| `npm run build` | Build the Next.js app and compile the server to `dist/` |
| `npm start` | Run the production server (`dist/server.mjs`) |
| `npm run lint` | Lint the project with ESLint |

## Deployment

The app is hosted on **Render** as a Node web service.

- **Build command:** `npm install && npm run build`
- **Start command:** `npm start`
- Set the same environment variables in Render, using your production URL for the Spotify redirect URI.
