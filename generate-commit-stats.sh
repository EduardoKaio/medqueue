#!/usr/bin/env bash
set -euo pipefail

README="README.md"
START_TAG="<!-- COMMIT_STATS_START -->"
END_TAG="<!-- COMMIT_STATS_END -->"

# 1) Gerar estatísticas em commit-stats.md
{
  echo "## 📊 Estatísticas de Commits"
  echo
  echo "👤 Contribuições por autor:"
  git log --format='%aN' \
    | sort \
    | uniq -c \
    | sort -rn \
    | awk '{count=$1; $1=""; name=substr($0,2); printf "- %s: %s commits\n", name, count}'
  echo
  echo "🛠️ Commits por tipo:"
  for type in feat fix docs chore refactor test style; do
    c=$(git log --grep="^${type}:" --oneline | wc -l | xargs)
    # substituímos o printf problemático por echo:
    echo "- ${type}: ${c}"
  done
} > commit-stats.md

# 2) Substituir apenas a seção marcada no README.md
awk -v start="$START_TAG" -v end="$END_TAG" '
  $0 == start { print; system("cat commit-stats.md"); in=1; next }
  $0 == end   { in=0; print; next }
  !in         { print }
' "$README" > README.tmp

mv README.tmp "$README"
rm commit-stats.md