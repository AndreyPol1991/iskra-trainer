#!/usr/bin/env bash
# Автотест атласа диаграмм (js/x-atlas.js) в headless Chrome: все вкладки, все карточки в PlantUML и Mermaid,
# песочница, мастер подбора, самопроверка, переход в тренировку. Печатает JSON: errors (надо чинить), n — сколько проверок.
#   bash _dev/atlas-test.sh
set -u
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
URL="file:///${ROOT//\\//}/_dev/atlas-test.html"
PROFILE="$(mktemp -d)"
OUT="$("$CHROME" --headless=new --disable-gpu --no-first-run --no-default-browser-check --allow-file-access-from-files \
  --user-data-dir="$PROFILE" --virtual-time-budget=20000 --dump-dom "$URL" 2>/dev/null)"
rm -rf "$PROFILE" 2>/dev/null
JSON="$(printf '%s' "$OUT" | tr '\n' '\001' | sed -n 's/.*@@JSON@@\(.*\)@@END@@.*/\1/p' | tr '\001' '\n')"
if [ -z "$JSON" ]; then
  echo "Тест не завершился (нет JSON). Первые строки DOM:"; printf '%s' "$OUT" | head -c 1500
  exit 1
fi
printf '%s\n' "$JSON" | sed 's/&quot;/"/g; s/&lt;/</g; s/&gt;/>/g; s/&amp;/\&/g'
