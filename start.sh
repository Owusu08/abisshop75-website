#!/usr/bin/env bash
# Starts a local preview at http://localhost:8080  (Ctrl+C to stop)
cd "$(dirname "$0")"
echo "ABISSHOP 75 is running at http://localhost:8080"
(command -v xdg-open >/dev/null && xdg-open http://localhost:8080) || (command -v open >/dev/null && open http://localhost:8080) || true
if command -v python3 >/dev/null; then python3 -m http.server 8080; else npx --yes serve -l 8080 .; fi
