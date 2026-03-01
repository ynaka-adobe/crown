#!/bin/bash
# Add crown as a site in the AEM Configuration Service (repoless setup)
# See: https://www.aem.live/docs/config-service-setup
#
# Prerequisites:
# 1. ynaka-adobe org exists on GitHub and is synced with AEM Code Sync
# 2. You have an auth token - get one at https://admin.hlx.page or https://tools.aem.live
#
# Usage:
#   AEM_AUTH_TOKEN=your-token ./scripts/add-site-config.sh
#   -- or --
#   export AEM_AUTH_TOKEN=your-token && ./scripts/add-site-config.sh

set -e

ORG="ynaka-adobe"
SITE="crown"
AUTH_TOKEN="${AEM_AUTH_TOKEN:-${HLX_AUTH_TOKEN:-}}"

if [ -z "$AUTH_TOKEN" ]; then
  echo "Error: AEM_AUTH_TOKEN is required."
  echo ""
  echo "Get your auth token from:"
  echo "  - https://admin.hlx.page (login, then use developer tools to get token)"
  echo "  - https://tools.aem.live"
  echo ""
  echo "Then run:"
  echo "  AEM_AUTH_TOKEN=your-token ./scripts/add-site-config.sh"
  exit 1
fi

echo "Adding site ${SITE} to org ${ORG}..."
echo ""

curl -X PUT "https://admin.hlx.page/config/${ORG}/sites/${SITE}.json" \
  -H 'content-type: application/json' \
  -H "x-auth-token: ${AUTH_TOKEN}" \
  --data '{
  "version": 1,
  "code": {
    "owner": "ynaka-adobe",
    "repo": "crown"
  },
  "content": {
    "source": {
      "url": "https://content.da.live/ynaka-adobe/crown/",
      "type": "markup"
    }
  }
}'

echo ""
echo "Done! Site should be available at: https://main--crown--ynaka-adobe.aem.page"
echo "A 404 page may show until content has been previewed."
