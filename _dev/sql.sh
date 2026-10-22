#!/usr/bin/env bash
# Выполнить SQL в базе «Искры» (sql.js в headless Chrome): bash _dev/sql.sh "SELECT ... " ["SELECT ..."]
ROOT="$(cd "$(dirname "$0")/.." && (pwd -W 2>/dev/null || pwd))"
CHROME="/c/Program Files/Google/Chrome/Application/chrome.exe"
Q=""; for a in "$@"; do Q="$Q${Q:+;;}$a"; done
ENC="$(printf '%s' "$Q" | od -An -tx1 -v | tr -d ' \n' | sed 's/\(..\)/%\1/g')"
PROFILE="$(mktemp -d)"
"$CHROME" --headless=new --disable-gpu --no-first-run --allow-file-access-from-files --user-data-dir="$PROFILE" --virtual-time-budget=30000 --dump-dom "file:///${ROOT}/_dev/dbq.html?q=$ENC" 2>/dev/null | tr '\n' '\001' | sed -n 's/.*@@OUT@@\(.*\)@@END@@.*/\1/p' | tr '\001' '\n' | sed 's/&quot;/"/g; s/&lt;/</g; s/&gt;/>/g; s/&amp;/\&/g'
rm -rf "$PROFILE"
