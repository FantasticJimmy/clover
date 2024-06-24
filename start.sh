#!/usr/bin/env bash

docker compose build
docker compose up -d

# Unfinished work for communication between convert and backend, so we are launching convert in local instead of container
cd apps/convert/
source venv/bin/activate
python main.py