#!/bin/bash

# Script to protect main branch from direct pushes
# Usage: ./scripts/protect-main-branch.sh <GITHUB_TOKEN>

REPO="khudyakv/vue-wave-player"
BRANCH="main"
TOKEN="${1:-$GITHUB_TOKEN}"

if [ -z "$TOKEN" ]; then
  echo "Error: GitHub token required"
  echo "Usage: $0 <GITHUB_TOKEN>"
  echo "Or set GITHUB_TOKEN environment variable"
  exit 1
fi

echo "Protecting branch: $BRANCH in repo: $REPO"

curl -X PUT \
  -H "Accept: application/vnd.github+json" \
  -H "Authorization: Bearer $TOKEN" \
  -H "X-GitHub-Api-Version: 2022-11-28" \
  "https://api.github.com/repos/$REPO/branches/$BRANCH/protection" \
  -d '{
    "required_status_checks": null,
    "enforce_admins": false,
    "required_pull_request_reviews": {
      "required_approving_review_count": 0,
      "dismiss_stale_reviews": false,
      "require_code_owner_reviews": false
    },
    "restrictions": null,
    "allow_force_pushes": false,
    "allow_deletions": false,
    "block_creations": false,
    "required_conversation_resolution": false,
    "lock_branch": false,
    "allow_fork_syncing": false
  }'

echo -e "\n\nBranch protection enabled!"
echo "Now only pull requests can merge to main branch."



