# How this clip was built

## The moment chosen

One moment, not a montage: **Lucia walks out of prison and Jason is waiting for her**,
Rockstar's Grand Theft Auto VI Trailer 2 (`https://www.youtube.com/watch?v=VQRLujxTm3c`),
0:55–1:09 in the trailer.

I read frames across the whole trailer (0:05–2:40) before choosing. The other candidates
were Jason at a gas station, a sunset dock, a nightclub phone-camera shot and a night
truck chase — all quick cuts, none of them a single continuous scene. The prison release
is one continuous scene (visitor window → gate opening → reunion), the trailer's most
iconic beat, and "she's out" lands in the first seconds with no context needed. That is
why it holds a viewer: the reunion is the whole story, and the hook is the payoff.

## The creative

- Hook: the clip opens on the moment itself with `LUCIA IS OUT` burned in over the top
  for the first 3.5 s.
- Format: vertical 9:16, 1080 × 1920, 21.7 s (a YouTube Short). The trailer's 2.22:1
  frame is blur-filled (blurred, darkened copy behind the sharp picture), so nothing
  important falls off the sides.
- Pitch: the last 7 s freeze the reunion frame, dim it, and carry the pitch in plain
  text long enough to read — "Make clips like this with AI and earn money on make.fun",
  `make.fun/bounty/gta6-clipper-01`, play code `makefun-grotto-collar-thicket`.
- Audio: the trailer's own audio, faded out under the pitch card.

## The render

Run in this session, with ffmpeg, from this repository's directory (inputs live beside
it in `~/workspace/makefun/gta6-clipper-01/`):

```sh
ffmpeg -y -i /home/hatch/workspace/makefun/gta6-clipper-01/trailer2.mp4 \
  -framerate 30 -loop 1 -t 7 -i /home/hatch/workspace/makefun/gta6-clipper-01/freeze.png \
  -filter_complex \
  "[0:v]trim=start=55:end=69.7,setpts=PTS-STARTPTS,crop=1920:864:0:108,split=2[vm][vm2];
   [vm]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,
   gblur=sigma=40,eq=brightness=-0.2:saturation=0.9[bg];
   [vm2]scale=1080:486[fg];
   [bg][fg]overlay=(W-w)/2:717,
   drawtext=fontfile=/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf:
   textfile=/home/hatch/workspace/makefun/gta6-clipper-01/hook.txt:
   fontsize=96:fontcolor=white:borderw=4:bordercolor=black:
   x=(w-text_w)/2:y=280:enable='between(t,0,3.5)'[vmain];
   [1:v]crop=1920:864:0:108,split=2[em][em2];
   [em]scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920,
   gblur=sigma=40,eq=brightness=-0.45:saturation=0.7[ebg];
   [em2]scale=1080:486,eq=brightness=-0.45[efg];
   [ebg][efg]overlay=(W-w)/2:717,
   drawtext=...:textfile=.../pitch1.txt:fontsize=56:...:y=780,
   drawtext=...:textfile=.../pitch2.txt:fontsize=56:...:y=855,
   drawtext=...:textfile=.../pitch3.txt:fontsize=44:fontcolor=0xFFD60A:...:y=985,
   drawtext=...:textfile=.../pitch4.txt:fontsize=36:...:y=1075[vend];
   [vmain][vend]concat=n=2:v=1:a=0[vout];
   [0:a]atrim=start=55:end=69.7,asetpts=PTS-STARTPTS,
   afade=t=out:st=13.7:d=1,apad=whole_dur=21.7[aout]" \
  -map "[vout]" -map "[aout]" -c:v libx264 -pix_fmt yuv420p -r 30 \
  -c:a aac -b:a 128k -movflags +faststart \
  /home/hatch/workspace/makefun/gta6-clipper-01/repo/clip.mp4
```

(The `drawtext=...` lines above are abbreviated; the full command is in the session
transcript. `freeze.png` is the reunion frame at 68.5 s; `hook.txt` holds `LUCIA IS OUT`;
`pitch1–4.txt` hold the four pitch lines.)

The footage ends at 69.7 s because the trailer cuts to the `ROCKSTAR GAMES PRESENTS`
title card at ~69.8 s — checked frame by frame (69.5 s still reunion, 70.0 s title card).
The letterbox bars were measured with `cropdetect` (1920 × 864 content at y=108) before
cutting. The render was verified by reading frames at 1 s (hook), 8 s (Lucia walking out)
and 18 s (pitch card). It is deterministic: re-rendering produces byte-identical output
(md5 `ed658c5e76c96103155257c83a0b37a1`).

## Upload (still to do)

No YouTube channel credential is available to this session, so the upload is a hand-off:
upload `clip.mp4` from the phone as a public Short titled `Lucia Is Out | GTA 6`,
description carrying the bounty's line word for word plus the play code, then put the
Short's address in `VIDEO.json` and submit. See `README.md` for the exact description.
