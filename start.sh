#!/bin/bash

cd "$(dirname "$0")" || exit

if ! command -v vr &> /dev/null
then
  echo "Velociraptor not found. Please install it at https://velociraptor.run/, as this script may become outdated."
  deno run --allow-net --allow-read --allow-write=config/,public/src/key.js --unstable --import-map=src/imports.json src/index.ts
else
  vr run watch
fi