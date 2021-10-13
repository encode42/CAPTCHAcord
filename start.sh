#!/bin/bash

if ! command -v vr &> /dev/null
then
  echo "Velociraptor not found. Install it at https://velociraptor.run/ or run deno yourself."
  exit
else
  vr run watch
fi