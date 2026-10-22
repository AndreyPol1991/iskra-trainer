#!/usr/bin/env bash
# Автотест тренировок в headless Chrome.
#   bash _dev/test.sh                     — все тренировки
#   bash _dev/test.sh m3-bpmn1 m3-bpmn2   — только указанные
# Печатает JSON: по каждой тренировке errors (надо чинить) и warnings (стоит посмотреть).
# Скриншот страницы: bash _dev/shot.sh m3-bpmn1 [ширина] [высота] → _dev/shots/m3-bpmn1.png
set -u
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
[ -x "$CHROME" ] || CHROME="/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe"
IDS="$(IFS=,; echo "$*")"
URL="file:///${ROOT//\\//}/_dev/test.html"
[ -n "$IDS" ] && URL="$URL?stage=$IDS"
PROFILE="$(mktemp -d)"
OUT="$("$CHROME" --headless=new --disable-gpu --no-first-run --no-default-browser-check --allow-file-access-from-files \
  --user-data-dir="$PROFILE" --virtual-time-budget=60000 --dump-dom "$URL" 2>/dev/null)"
rm -rf "$PROFILE" 2>/dev/null
JSON="$(printf '%s' "$OUT" | tr '\n' '\001' | sed -n 's/.*@@JSON@@\(.*\)@@END@@.*/\1/p' | tr '\001' '\n')"
if [ -z "$JSON" ]; then
  echo "Тест не завершился (нет JSON). Вероятно, синтаксическая ошибка в одном из js-файлов или бесконечный цикл."
  echo "Первые строки DOM:"; printf '%s' "$OUT" | head -c 1500
  exit 1
fi
printf '%s\n' "$JSON" | sed 's/&quot;/"/g; s/&lt;/</g; s/&gt;/>/g; s/&amp;/\&/g'
