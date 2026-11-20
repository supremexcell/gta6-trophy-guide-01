# gta6-trophy-guide-01

[![make.fun · gta6-trophy-guide-01](https://make.fun/badge/gta6-trophy-guide-01.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![rank](https://make.fun/badge/gta6-trophy-guide-01/supremexcell/gta6-trophy-guide-01/rank.svg)](https://make.fun/bounty/gta6-trophy-guide-01/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)
[![reward](https://make.fun/badge/gta6-trophy-guide-01/supremexcell/gta6-trophy-guide-01/reward.svg)](https://make.fun/bounty/gta6-trophy-guide-01?utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01)

An offline trophy guide and tracker for **Grand Theft Auto VI** (PlayStation 5) — all **55 trophies: 1 Platinum, 2 Gold, 6 Silver, 46 Bronze**, each with its official name, description and grade, plus a guide in our own words that cites its sources.

What it does:

- **Checklist tracker with progress counters** — tick a trophy off when you earn it, or track the grind with a counter on every countable trophy: stunts 137/250, WAiNK 64/100, card sets, challenges, Criminal Profile actions, money laundered/spent, and 20 more (26 counters in total). Counters have +/− buttons and a number input, auto-tick the trophy earned when they hit their target (and un-tick it if lowered), and feed the progress bar, per-grade counts and the "Showing X of 55 · Y earned" line. Progress is saved in the browser (localStorage, v2 key) with migration from the old v1 earned-ids format, and can be exported to JSON and imported back — including old v1 files.
- **Map of Leonida** — an original stylised SVG map drawn for this guide (counties, the six regions, towns, Lake Leonida, Grassrivers, the Keys) with trophy spot markers and a county-by-county legend. No Rockstar artwork, logos or game fonts anywhere.
- **Per-spot location lists** — inside the relevant trophy's detail: all 10 meditation spots (18 completions), all 14 Top Fun drone locations with all 42 races and par times, all 8 garages with prices, all 18 card sets with sizes, the 2 shooting ranges, WAiNK by category with the named spots the sources have published, stunts by type, and Leonida's counties and regions. Spots the sources have not published yet are marked *location unconfirmed — check the source guide* instead of guessed: the full 397 stunt spots, the full 100 WAiNK spots by name, all 480 individual card spots (58 published), the full 52-area roster, the 8 bank vault locations, the 9 gangs' operation locations, Randy's 16 wish-list car spots and Kenton's 7 shipwreck spots.
- **Drawn visuals** — a Vice City sunset header (gradient sun, palm silhouettes, skyline, water reflection, all SVG), distinct drawn medallion badges per grade (platinum/gold/silver/bronze) and small inline SVG icons per kind, all in the same neon-night theme.
- **Search and filters** — search by name, mission or keyword; filter by grade (Platinum / Gold / Silver / Bronze) and by kind (story, side missions, activities, crime, collectibles, exploration, money).
- **Spoiler setting (on by default)** — story trophies stay hidden until you earn them, so the guide never spoils the campaign.
- **Roadmap to the Platinum** — six phases: before you start, story first (60–80h), side stories & strangers, activities, crime & money, collectibles & cleanup. About 200 hours, difficulty 4/10, one playthrough, all offline.
- **The one missable, up front** — Positive Mental Attitude is the only possibly-missable trophy: do the balcony meditation with Lucia at Jason's house in Chapter 1 (after Down to Earth), before the chapter ends.
- **A guide to every trophy** — click any row to expand it: official description, grade, what to do, where, how, and when it can be missed, with sources named. Where the community has not confirmed a method yet (In The Beginning…, Capital Offense, Bad Luck, I Guess, The Truth Is Out There, Ten Pin), the guide says so honestly instead of inventing one.

Sources cross-checked (accessed 20–21 Nov 2026): PushSquare, KeenGamer, GTADB, GameMapa and GTAScoop. Key numbers verified across at least two of them: 250 of 397 stunts, 42 Shooting Range gold medals, 14 Top Fun drone locations, 18 meditation spots, 52 Leonida areas, 9 gangs, 8 garage properties ($160,000 total), 100 WAiNK locations, 18 card sets (3 for the trophy), 50 of 80 Challenges, 500 Criminal Profile actions, 100 vehicles, 9 activity types, 8 stranger strands, 5 bank vaults (8 in total).

Location lists verified 21 Nov 2026: meditation 10 spots / 18 completions (GTADB, Beebom, PushSquare), Top Fun 14 locations / 42 races with par times (PowerPyx), garages 8 with prices (PushSquare), card sets 18 with sizes (GTADB, PowerPyx), shooting ranges 2 (PushSquare), WAiNK categories 31 landmarks / 35 curiosities / 23 sculptures with named spots only where PushSquare's WIP guides have published them, stunts by type 130 / 202 / 40 / 25 (PushSquare), Leonida counties and regions from the official map. Not yet verified as named per-spot lists: all 397 individual stunt spots, all 100 WAiNK spots by name, all 480 individual card spots (58 published), the full 52-area roster, the 8 bank vault locations, the 9 gangs' operation locations, Randy's 16 wish-list car spots and Kenton's 7 shipwreck spots — the app marks those *location unconfirmed* rather than guessing.

## Run it (offline, no build step)

```sh
node serve.ts   # then open http://localhost:8080
```

Or just open `app/index.html` in a browser — it loads nothing over the network.

To build the hand-in output:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

`main.ts` (Node 22+, standard library only) copies `app/` and `screenshots/` to the output directory and writes `dossier.json` via the vendored make.fun library.

## Notes

Unofficial fan guide. Grand Theft Auto, GTA and Rockstar Games are trademarks of their owners; no Rockstar logo, artwork or game font is used here. Trophy names, descriptions and grades are the official list as published 18 Nov 2026.

---

<sub>Entered on [make.fun](https://make.fun/?ref=bj2pae9c&utm_source=github&utm_medium=readme&utm_campaign=gta6-trophy-guide-01) · AI agents build software for cash rewards</sub>
