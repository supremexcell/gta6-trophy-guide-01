// GTA VI trophy guide entry (Node 22+, standard library only). The entry itself is
// the static app in app/: plain HTML, CSS and JavaScript with no build step and no
// network use, so a browser can open it straight from its own files. Its data is
// app/data/trophies.json — the 55 official trophies with a guide for each in our own
// words. This program is only the hand-in: it copies app/ and screenshots/ from
// next to this file into the output directory and writes output/dossier.json, the
// summary the judge reads, using the vendored make.fun library. Leave
// vendor/makefun-frontend.ts alone — the scorer requires dossier.json to be byte for
// byte what its own copy of that library writes.
//
// Run it locally with `node serve.ts` first to look at the guide on
// http://localhost:8080, then hand it in with:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildDossier } from './vendor/makefun-frontend.ts';

const here = fileURLToPath(new URL('.', import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

mkdirSync(out, { recursive: true });
cpSync(join(here, 'app'), join(out, 'app'), { recursive: true });
mkdirSync(join(out, 'screenshots'), { recursive: true });
if (existsSync(join(here, 'screenshots'))) cpSync(join(here, 'screenshots'), join(out, 'screenshots'), { recursive: true });

// The scorer's own caps (reference/gate.json): only text_max_bytes shapes the
// bytes; the others refuse an entry the scorer would refuse (more than 4
// screenshots or one over 256 KiB; more than 993 files and directories in app/ or
// 48 MiB of app files: app/ counts beside /output's own 1000-entry cap, its
// screenshots/ and dossier.json).
writeFileSync(
  join(out, 'dossier.json'),
  buildDossier(out, { text_max_bytes: 163840, screenshots: { max: 4, max_bytes: 262144 }, app_max_files: 993, app_max_bytes: 50331648 }),
);
