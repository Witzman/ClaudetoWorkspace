#!/usr/bin/env bash
set -e

echo "🔧 Setup Node dependencies"

if [ -f package-lock.json ]; then
  npm ci
else
  npm install
fi

chmod +x .devcontainer/start-dev.sh

echo "✅ Setup finished"
