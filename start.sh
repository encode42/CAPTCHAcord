#!/bin/bash
cd "$(dirname "$0")" || exit

deno run --allow-net --allow-read --allow-write=config/ --unstable --import-map=src/imports.json src/index.ts