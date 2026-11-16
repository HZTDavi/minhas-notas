#!/bin/bash
# Copia a interface (pasta web/ do app do PC) para dentro do app Android
set -e
cd "$(dirname "$0")"
rm -rf www && mkdir www
cp -r ../web/. www/
