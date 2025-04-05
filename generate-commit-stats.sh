#!/bin/bash

# Gerar estatísticas em commit-stats.md
echo "## 📊 Estatísticas de Commits" > commit-stats.md
echo "" >> commit-stats.md

echo "👤 Contribuições por autor:" >> commit-stats.md
git log --format='%aN' | sort | uniq -c | sort -rn | awk '{author=""; for (i=2; i<=NF; i++) author = author $i " "; print "- " author ": " $1 " commits"}' >> commit-stats.md
echo "" >> commit-stats.md

echo "🛠️ Commits por tipo:" >> commit-stats.md
for type in feat fix docs chore refactor test style; do
  count=$(git log --pretty=format:"%s" | grep -i "^$type" | wc -l)
  echo "- $type: $count" >> commit-stats.md
done

# Substituir dentro do README
awk '/<!-- COMMIT_STATS_START -->/{print;system("cat commit-stats.md");skip=1} /<!-- COMMIT_STATS_END -->/{skip=0} !skip' README.md > README.tmp
mv README.tmp README.md
rm commit-stats.md