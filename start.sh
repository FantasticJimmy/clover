#!/usr/bin/env bash
NODE_VERSION=$(node -v)
REQUIRED_VERSION="v18.17.1"


if [[ $NODE_VERSION == $REQUIRED_VERSION ]]; then
  echo "Node version is $NODE_VERSION, proceeding with the script."

  CURRENT_DIR=$(pwd)
  npm install
  nx build backend
  cd "$CURRENT_DIR/dist/apps/backend"
  node main.js &
  cd "$CURRENT_DIR/apps/convert/"
  source venv/bin/activate
  python main.py
else
  echo "Node version is $NODE_VERSION, required version is $REQUIRED_VERSION. Exiting."
  exit 1
fi