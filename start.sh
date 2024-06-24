#!/usr/bin/env bash
NODE_VERSION=$(node -v)
REQUIRED_VERSION="v18.17.1"

if [[ $NODE_VERSION == $REQUIRED_VERSION ]]; then
  echo "Node version is $NODE_VERSION, proceeding with the script."
  
  npm install
  nx build backend
  docker compose build
  docker compose up -d

  # Unfinished work for communication between convert and backend, so we are launching convert in local instead of container
  cd apps/convert/
  source venv/bin/activate
  python main.py
else
  echo "Node version is $NODE_VERSION, required version is $REQUIRED_VERSION. Exiting."
  exit 1
fi