# Gary the Cricketer: The Best Wickets in Cricket

A remake of the "Best Wickets in Cricket" explainer. Gary is now a proportioned, jointed human character
(face, expressions, helmet and grille, pads, gloves, bat) instead of a stick figure. The video keeps the original
narration and timing, adds a full stadium, camera moves, slow-mo, crowd reactions and an umpire, and turns the
five wickets into proper animated plays.

**Episodes** (1920×1080, 60 fps):
| Episode | Video | Narration |
| --- | --- | --- |
| The Best Wickets in Cricket | `output/gary-wickets.mp4` (1:54) | original voiceover |
| AB de Villiers' greatest shots | `output/gary-abd.mp4` (1:39) | Kokoro TTS, `bm_george` |
| Virat Kohli's greatest moves | `output/gary-kohli.mp4` (1:39) | Kokoro TTS, `bm_george` |

All three share a generated high-energy cricket soundtrack (music, crowd, SFX) from `tools/soundtrack.py`.

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

## Make an episode
Episodes live in `episodes/<name>/` (`script.txt`, `scenes.js`, `captions.js`, `cues.json`, audio). Preview with `index.html?ep=<name>`.

```bash
KOKORO_DIR=/path/to/kokoro python3 tools/narrate.py episodes/abd
```

```bash
python3 tools/cues.py abd
```

```bash
python3 tools/soundtrack.py episodes/abd/cues.json episodes/abd/narration.m4a episodes/abd/mix.m4a
```

```bash
node render.cjs --ep abd --workers 4
```

`narrate.py` voices the script with Kokoro (needs `pip install kokoro-onnx` plus `kokoro-v1.0.onnx` and `voices-v1.0.bin`) and writes word-timed captions and timing markers. Render options: `--fps 60`, `--from 15 --to 18`, `--out path.mp4`.

Quick stills for checking a moment: `EP=abd tools/sheet.sh /tmp/out 4 16.1 36.3 57.5`.

Fonts (OFL): Fira Sans Condensed, Baloo 2, Patrick Hand, Permanent Marker.
