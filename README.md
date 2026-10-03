# Team Trivia (Stage 2: playable game, sample content)

## Run it on your computer (about 3 minutes)
1. Install Node.js (the "LTS" button at https://nodejs.org), then restart your terminal.
2. In this folder run:
   ```
   npm install
   cp .env.example .env.local
   npm run dev
   ```
3. Open http://localhost:3000 on your computer. For your phone, open the "Network" address `next dev` prints (same Wi-Fi).

`NEXT_PUBLIC_DEV_UNLOCK=true` in `.env.local` opens every category. Set it to `false` to see the locks and the free country of the day.

## What's here
- `src/components/Game.tsx` – every screen of the game
- `src/lib/categories.ts` – category list (5 general + 50 countries; only countries with a question file are playable)
- `data/questions/` – one JSON file per category (sample: 3 countries + 5 general, 1 question per level)
- `npm run validate` – checks the question files

## Coming next
Stage 3: Stripe payment, device-locked codes, SETUP.md. Stage 4: the full question bank and REVIEW.md.

## Known gaps in Stage 2
- PWA icon is SVG only. Android installs fine, iPhone home-screen icons need PNGs (added with SETUP.md).
- Unlock screen is a placeholder until Stage 3.
