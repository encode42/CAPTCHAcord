#!/bin/bash

if ! command -v vr &> /dev/null
then
  echo "Velociraptor not found. Install it at https://velociraptor.run/ or run deno yourself."
  exit
else
  cd "$(dirname "$0")" || exit
  vr run watch
fi