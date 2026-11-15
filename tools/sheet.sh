#!/bin/bash
# tools/sheet.sh <outdir> <cols> t1 t2 ... -> renders stills and tiles them into <outdir>/sheet.png
set -e
OUT="$1"; COLS="$2"; shift 2
mkdir -p "$OUT/frames_$$"
node "$(dirname "$0")/stills.cjs" "$OUT/frames_$$" "$@"
N=$#; ROWS=$(( (N + COLS - 1) / COLS ))
ffmpeg -v error -y -pattern_type glob -i "$OUT/frames_$$/s_*.png" -vf "scale=640:-1,tile=${COLS}x${ROWS}" -frames:v 1 "$OUT/sheet.png"
echo "$OUT/frames_$$"
