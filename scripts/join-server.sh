#!/bin/sh
host="localhost"
port="43663"
username="Bot"

for arg in "$@"; do
  case "$arg" in
    host=*) host="${arg#host=}" ;;
    port=*) port="${arg#port=}" ;;
    username=*) username="${arg#username=}" ;;
  esac
done

node bot.js "$host" "$port" "$username"
