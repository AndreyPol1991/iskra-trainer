#!/usr/bin/env bash
# Найти элементы, которые вылезают за ширину телефона (390 px): bash _dev/overflow.sh <id|home>
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
PROFILE="$(mktemp -d)"
"/c/Program Files/Google/Chrome/Application/chrome.exe" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files --user-data-dir="$PROFILE" --virtual-time-budget=15000 --dump-dom "file:///${ROOT}/_dev/overflow.html?id=${1:-home}" 2>/dev/null | tr '\n' '\001' | sed -n 's/.*@@OUT@@\(.*\)@@END@@.*/\1/p' | tr '\001' '\n' | sed 's/&quot;/"/g; s/&lt;/</g; s/&gt;/>/g; s/&amp;/\&/g'
rm -rf "$PROFILE"
