#!/bin/bash
set -e

# Check if clawcraft already exists
if [ -f "./clawcraft" ]; then
  echo "You're up to date. clawcraft binary already installed."
else
  echo "Would you like to install the clawcraft binary?"
  echo "Repo: https://github.com/islewis/clawcraft"
  read -p "Install? (y/n) " -n 1 -r
  echo

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping binary download."
  else
    OS=$(uname -s)
    ARCH=$(uname -m)

    if [ "$OS" = "Darwin" ]; then
      BINARY=$([ "$ARCH" = "arm64" ] && echo "clawcraft-macos-arm64" || echo "clawcraft-macos")
    elif [ "$OS" = "Linux" ]; then
      BINARY="clawcraft-linux"
    else
      BINARY="clawcraft.exe"
    fi

    echo "Downloading clawcraft ($BINARY)..."
    URL=$(curl -s https://api.github.com/repos/islewis/clawcraft/releases/latest | grep "browser_download_url.*$BINARY" | cut -d'"' -f4)

    curl -L -o clawcraft "$URL"
    chmod +x clawcraft

    echo "Installed: ./clawcraft"
  fi
fi
echo ""

SKILL_DIR="${HOME}/.openclaw/skills/minecraft"

# Check if skill already exists
if [ -f "$SKILL_DIR/SKILL.md" ]; then
  echo "OpenClaw skill already installed at: $SKILL_DIR"
  echo "Not overriding. Delete or rename it if you want to reinstall."
  exit 0
else
  echo "Would you like to install the OpenClaw skill?"
  echo "Preview: https://github.com/islewis/clawcraft/tree/main/SKILL"
  read -p "Install? (y/n) " -n 1 -r
  echo

  if [[ $REPLY =~ ^[Yy]$ ]]; then
    mkdir -p "$SKILL_DIR"

    echo "Installing OpenClaw skill to $SKILL_DIR..."

    # Download SKILL files from repo
    for file in SKILL.md references/bot-api.md references/getting-started.md references/repl-usage.md references/troubleshooting.md; do
      mkdir -p "$SKILL_DIR/$(dirname "$file")"
      url="https://raw.githubusercontent.com/islewis/clawcraft/main/SKILL/$file"
      if curl -f -o "$SKILL_DIR/$file" "$url"; then
        echo "  Downloaded: $file"
      else
        echo "  Failed to download: $file"
        echo "  URL: $url"
      fi
    done

    echo "Skill installed to: $SKILL_DIR"
  fi
fi

echo ""
echo "Usage: ./clawcraft -h <host> -u <username> [-a <auth>]"
echo "Example: ./clawcraft -h play.clawcraft.sh -u yourname"
