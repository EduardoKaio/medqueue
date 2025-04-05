#!/usr/bin/env bash
set -euo pipefail

README="README.md"
START_TAG="<!-- COMMIT_STATS_START -->"
END_TAG="<!-- COMMIT_STATS_END -->"

# 1) Monta o conteúdo em commit-stats.md
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
    echo "- ${type}: ${c}"
  done
} > commit-stats.md

# 2) Substitui só a área entre os marcadores no README.md
tmp=$(mktemp)
in_block=0

while IFS= read -r line; do
  if [[ "$line" == "$START_TAG" ]]; then
    echo "$line" >> "$tmp"
    cat commit-stats.md >> "$tmp"
    in_block=1
    continue
  fi

  if [[ "$line" == "$END_TAG" ]]; then
    in_block=0
    echo "$line" >> "$tmp"
    continue
  fi

  if [[ $in_block -eq 1 ]]; then
    # pula todas as linhas entre START e END
    continue
  fi

  # fora do bloco, só copia
  echo "$line" >> "$tmp"
done < "$README"

mv "$tmp" "$README"
rm commit-stats.md
