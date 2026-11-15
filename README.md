# Gary the Cricketer: The Best Wickets in Cricket

A remake of the "Best Wickets in Cricket" explainer. Gary is now a proportioned, jointed human character
(face, expressions, helmet and grille, pads, gloves, bat) instead of a stick figure. The video keeps the original
narration and timing, adds a full stadium, camera moves, slow-mo, crowd reactions and an umpire, and turns the
five wickets into proper animated plays.

**Output:** `output/gary-best-wickets.mp4` (1920×1080, 60 fps, 1:54, original narration)

## Structure
| File | What it does |
| --- | --- |
| `src/rig.js` | Human character rig: 2-bone IK arms/legs, body, face expressions, kits (Gary, bowler, keeper, umpire…) |
| `src/props.js` | Stadium, pitch, stumps, ball, HUD, counter, captions, speech bubbles, cards, stamps, wipes |
| `src/scenes.js` | Choreography of every scene, keyed to the narration |
| `src/captions.js` | Word-timed captions taken from the original video |
| `src/main.js` | Composites scenes, transitions and captions into a frame for time `t` |
| `index.html` | Live preview player (open in a browser, press Play) |
| `render.cjs` | Renders frames with headless Chromium and encodes with ffmpeg |

## Render
Requires Node, Playwright (Chromium) and ffmpeg.

```bash
node render.cjs --workers 4
```

Options: `--fps 60`, `--from 15 --to 18` (render a clip), `--out path.mp4`.

Quick stills for checking a moment: `tools/sheet.sh /tmp/out 4 16.1 36.3 57.5`.

Fonts (OFL): Fira Sans Condensed, Baloo 2, Patrick Hand, Permanent Marker.
