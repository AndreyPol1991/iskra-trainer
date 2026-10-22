#!/usr/bin/env bash
# Скриншот тренировки или обложки в headless Chrome (режим преподавателя: все задания открыты).
#   bash _dev/shot.sh m3-bpmn1 [ширина=1280] [высота=6000] [light]  → _dev/shots/m3-bpmn1.png
#   bash _dev/shot.sh home                                          → обложка
set -u
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
ID="${1:-home}"; W="${2:-1280}"; H="${3:-6000}"; THEME="${4:-dark}"
mkdir -p "$(dirname "$0")/shots"
OUTP="${ROOT//\\//}/_dev/shots/$ID${THEME:+-$THEME}.png"
HASH="#s-$ID"; [ "$ID" = "home" ] && HASH="#home"; [ "$ID" = "system" ] && HASH="#system"
PROFILE="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --no-first-run --no-default-browser-check --allow-file-access-from-files \
  --user-data-dir="$PROFILE" --hide-scrollbars --window-size="$([ "$W" -lt 600 ] && echo 600 || echo "$W"),$H" --virtual-time-budget=15000 \
  --screenshot="$OUTP" "file:///${ROOT//\\//}/_dev/shot.html?theme=$THEME&w=$W&h=$H$HASH" >/dev/null 2>&1
rm -rf "$PROFILE" 2>/dev/null
echo "$OUTP"
