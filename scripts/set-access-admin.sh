#!/bin/bash
# Set access control for crown site - requireAuth: true, basic_author role for ynaka@yahoo.com
# See: https://www.aem.live/docs/authentication-setup-authoring#admin-roles
#
# Usage:
#   AEM_AUTH_TOKEN=your-token ./scripts/set-access-admin.sh

set -e

ORG="ynaka-adobe"
SITE="crown"
AUTH_TOKEN="${AEM_AUTH_TOKEN:-${HLX_AUTH_TOKEN:-}}"

if [ -z "$AUTH_TOKEN" ]; then
  echo "Error: AEM_AUTH_TOKEN is required."
  echo ""
  echo "Get your auth token from:"
  echo "  - https://admin.hlx.page (login, then copy x-auth-token from network tab)"
  echo "  - https://tools.aem.live"
  echo ""
  echo "Then run:"
  echo "  AEM_AUTH_TOKEN=your-token ./scripts/set-access-admin.sh"
  exit 1
fi

echo "Updating access control for ${ORG}/${SITE}..."
echo "  - requireAuth: true (authentication always enforced)"
echo "  - basic_author role: ynaka@yahoo.com"
echo ""

curl -X POST "https://admin.hlx.page/config/${ORG}/sites/${SITE}/access/admin.json" \
  -H 'content-type: application/json' \
  -H "x-auth-token: ${AUTH_TOKEN}" \
  --data '{
  "role": {
    "basic_author": [ "ynaka@yahoo.com" ]
  },
  "requireAuth": true
}'

echo ""
echo "Done! Authentication is now required. ynaka@yahoo.com has basic_author access."
