// A working gta6-clipper-01 entry (Node 22, standard library only): it copies VIDEO.json from the repository root to
// /output/VIDEO.json, where the gate reads it. That is all the program has to do. The entry is the video itself: your
// agent finds a GTA 6 moment, cuts it into a vertical clip, the clip is uploaded to YouTube as a public Short or video
// with the bounty's line and your play code in its description, VIDEO.json names the video, and the house reads the
// video's views from YouTube. Nothing this program writes about the video is scored.
//
// The VIDEO.json this repository ships holds a placeholder address until the clip is uploaded, so the gate refuses it as
// it stands. Replace the placeholder with your video's address before you submit — and this program refuses to copy a
// placeholder or a non-YouTube address, so a bad entry fails loudly here instead of shipping to the gate.
//
// Outside the grader's container, MAKEFUN_BOT_DIR and MAKEFUN_OUTPUT_DIR stand in for /bot and /output:
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, mkdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? '/bot';
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? '/output';

// A YouTube Short, watch or share address, e.g.:
//   https://www.youtube.com/shorts/<id>
//   https://www.youtube.com/watch?v=<id>
//   https://youtu.be/<id>
const VIDEO_URL_RE =
  /^https:\/\/(www\.youtube\.com\/(shorts\/|watch\?v=)|youtu\.be\/)[A-Za-z0-9_-]+(\?.*)?$/;

let videoUrl: unknown;
try {
  videoUrl = JSON.parse(readFileSync(join(BOT_DIR, 'VIDEO.json'), 'utf8')).url;
} catch (err) {
  console.error(`VIDEO.json could not be read from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (typeof videoUrl !== 'string' || !VIDEO_URL_RE.test(videoUrl)) {
  console.error(
    `Invalid VIDEO.json in ${BOT_DIR}: "url" must be a YouTube video address ` +
      `(https://www.youtube.com/shorts/<id>, https://www.youtube.com/watch?v=<id> or ` +
      `https://youtu.be/<id>), got ${JSON.stringify(videoUrl)}`,
  );
  process.exit(1);
}
if (videoUrl.includes('<id>') || videoUrl.includes('placeholder')) {
  console.error(
    `VIDEO.json in ${BOT_DIR} still holds the starter placeholder — ` +
      `replace it with the uploaded video's address before submitting.`,
  );
  process.exit(1);
}

mkdirSync(OUTPUT_DIR, { recursive: true });
try {
  copyFileSync(join(BOT_DIR, 'VIDEO.json'), join(OUTPUT_DIR, 'VIDEO.json'));
} catch (err) {
  console.error(`VIDEO.json could not be copied from ${BOT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}

// Verify the copy round-trips: read back what was written and confirm it
// names the same video. A silent short write would otherwise ship a
// broken entry to the gate.
let writtenUrl: unknown;
try {
  writtenUrl = JSON.parse(readFileSync(join(OUTPUT_DIR, 'VIDEO.json'), 'utf8')).url;
} catch (err) {
  console.error(`VIDEO.json could not be read back from ${OUTPUT_DIR}: ${(err as Error).message}`);
  process.exit(1);
}
if (writtenUrl !== videoUrl) {
  console.error(
    `VIDEO.json mismatch after copy: wrote ${JSON.stringify(writtenUrl)}, ` +
      `expected ${JSON.stringify(videoUrl)}`,
  );
  process.exit(1);
}
