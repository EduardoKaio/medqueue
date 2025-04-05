#!/usr/bin/env bash
set -euo pipefail

README="README.md"
START_TAG="<!-- COMMIT_STATS_START -->"
END_TAG="<!-- COMMIT_STATS_END -->"

# 1) Gera estatísticas em commit-stats.md
cat <<EOF > commit-stats.md
## 📊 Estatísticas de Commits

👤 Contribuições por autor:
$(git shortlog -sn | awk '{count=$1; $1=""; name=substr($0,2); printf "- %s: %s commits\n", name, count}')

🛠️ Commits por tipo:
$(for type in feat fix docs chore refactor test style; do
    c=$(git log --grep="^${type}:" --oneline | wc -l | xargs)
    echo "- ${type}: ${c}"
done)
EOF

# 2) Substitui apenas entre os marcadores no README.md
awk -v start="$START_TAG" -v end="$END_TAG" -v stats="$(sed 's/\\/\\\\/g; s/&/\\&/g' commit-stats.md)" '
  $0 == start { print; print stats; inblock=1; next }
  $0 == end   { inblock=0; print; next }
  !inblock    { print }
' "$README" > README.tmp

mv README.tmp "$README"
rm commit-stats.md
