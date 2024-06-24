#!/usr/bin/env bash
NODE_VERSION=$(node -v)
REQUIRED_VERSION="v18.17.1"

check_docker() {
  if ! command -v docker &> /dev/null; then
    echo "Docker is not installed. Exiting."
    exit 1
  fi

  if ! docker info &> /dev/null; then
    echo "Docker is not running. Please start Docker and try again. Exiting."
    exit 1
  fi
}

if [[ $NODE_VERSION == $REQUIRED_VERSION ]]; then
  echo "Node version is $NODE_VERSION, proceeding with the script."
  
  check_docker

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