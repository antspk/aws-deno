#!/bin/bash

DENO_VERSION="1.31.1"
DENO_RUNTIME_URL="https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip"
DENO_RUNTIME_DIR="./runtime/bin"

mkdir -p "$DENO_RUNTIME_DIR"

curl -sSL "$DENO_URL" | funzip | tar -xf - -C "$DENO_RUNTIME_DIR" deno

if [ ! -x "${DENO_RUNTIME_DIR}/deno" ]; then
  echo "Deno runtime executable not downloaded!"
  exit 1
fi
