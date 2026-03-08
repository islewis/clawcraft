#!/bin/bash
set -e

# Determine OS and architecture
OS=$(uname -s)
ARCH=$(uname -m)

if [ "$OS" = "Darwin" ]; then
  BINARY=$([ "$ARCH" = "arm64" ] && echo "clawcraft-macos-arm64" || echo "clawcraft-macos")
elif [ "$OS" = "Linux" ]; then
  BINARY="clawcraft-linux"
else
  BINARY="clawcraft.exe"
fi

# Get latest version from GitHub
get_latest_version() {
  curl -s https://api.github.com/repos/islewis/clawcraft/releases/latest | grep '"tag_name"' | cut -d'"' -f4 | sed 's/^v//'
}

# Get current installed version
get_current_version() {
  if [ -f "${HOME}/.openclaw/bin/clawcraft" ]; then
    # Try to get version, suppress all output and errors
    RESULT=$(timeout 2 "${HOME}/.openclaw/bin/clawcraft" version 2>/dev/null)
    if [ -n "$RESULT" ]; then
      echo "$RESULT"
    else
      echo "unknown"
    fi
  elif [ -f "./clawcraft" ]; then
    # Try to get version, suppress all output and errors
    RESULT=$(timeout 2 ./clawcraft version 2>/dev/null)
    if [ -n "$RESULT" ]; then
      echo "$RESULT"
    else
      echo "unknown"
    fi
  else
    echo ""
  fi
}

CURRENT=$(get_current_version)
LATEST=$(get_latest_version)

if [ -z "$CURRENT" ]; then
  echo "Would you like to install the clawcraft binary?"
  echo "Latest version: v$LATEST"
  echo "Repo: https://github.com/islewis/clawcraft"
  read -p "Install? (y/n) " -n 1 -r
  echo

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping binary download."
    exit 0
  fi

  SHOULD_DOWNLOAD=true
elif [ "$CURRENT" = "$LATEST" ]; then
  echo "You're up to date. clawcraft v$CURRENT already installed."
  exit 0
else
  echo "Update available: v$CURRENT → v$LATEST"
  read -p "Update? (y/n) " -n 1 -r
  echo

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Skipping update."
    exit 0
  fi

  SHOULD_DOWNLOAD=true
fi

if [ "$SHOULD_DOWNLOAD" = true ]; then
  echo "Downloading clawcraft v$LATEST ($BINARY)..."
  URL=$(curl -s https://api.github.com/repos/islewis/clawcraft/releases/latest | grep "browser_download_url.*$BINARY" | cut -d'"' -f4)

  if [ -z "$URL" ]; then
    echo "Error: Could not find download URL for $BINARY"
    exit 1
  fi

  # Create openclaw bin directory
  mkdir -p "${HOME}/.openclaw/bin"

  # Download to openclaw bin directory
  curl -L -o "${HOME}/.openclaw/bin/clawcraft" "$URL"
  chmod +x "${HOME}/.openclaw/bin/clawcraft"

  # Also create a symlink in the repo for convenience
  ln -sf "${HOME}/.openclaw/bin/clawcraft" ./clawcraft 2>/dev/null || true

  echo "Installed: ~/.openclaw/bin/clawcraft v$LATEST"
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
