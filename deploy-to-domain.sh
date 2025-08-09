#!/bin/bash

# Deploy AI Trading Web3 Platform to AItradingWeb3.com
# Alternative deployment method without Replit deployment button

echo "🚀 DEPLOYING AI TRADING WEB3 PLATFORM"
echo "======================================"

# Get current Repl URL
REPL_URL="https://db1066b1-f9b5-425d-b211-cb0414c1c1c6.chatgptfive10.repl.co"
DOMAIN="AItradingWeb3.com"

echo "📍 Current Platform URL: $REPL_URL"
echo "🎯 Target Domain: $DOMAIN"
echo ""

# Test current platform status
echo "🔍 Testing current platform..."
curl -s -o /dev/null -w "Status: %{http_code}\n" "$REPL_URL"

echo ""
echo "✅ DEPLOYMENT CONFIGURATION READY"
echo "=================================="
echo ""
echo "📋 Next Steps for Domain Setup:"
echo ""
echo "1. Purchase domain: $DOMAIN"
echo "   - Recommended registrars: Namecheap, GoDaddy, Cloudflare"
echo "   - Cost: ~\$10-15/year"
echo ""
echo "2. Setup Cloudflare (FREE):"
echo "   - Create account at cloudflare.com"
echo "   - Add site: $DOMAIN"
echo "   - Update nameservers at registrar"
echo ""
echo "3. Configure Page Rules in Cloudflare:"
echo "   Rule 1:"
echo "   URL: *$DOMAIN/*"
echo "   Action: Forwarding URL (301)"
echo "   Destination: $REPL_URL/\$1"
echo ""
echo "   Rule 2:"
echo "   URL: $DOMAIN"
echo "   Action: Forwarding URL (301)"
echo "   Destination: $REPL_URL"
echo ""
echo "4. Enable SSL:"
echo "   - Always Use HTTPS: ON"
echo "   - SSL Mode: Flexible"
echo ""
echo "⏱️  Expected completion: 30-60 minutes"
echo "💰 Total cost: ~\$1/month"
echo ""
echo "🎉 Result: https://$DOMAIN will serve your live trading platform!"

# Create configuration files for different providers
cat > cloudflare-config.json << EOF
{
  "domain": "$DOMAIN",
  "target": "$REPL_URL",
  "rules": [
    {
      "url": "*$DOMAIN/*",
      "action": "forwarding_url",
      "status": 301,
      "destination": "$REPL_URL/\$1"
    },
    {
      "url": "$DOMAIN",
      "action": "forwarding_url", 
      "status": 301,
      "destination": "$REPL_URL"
    }
  ],
  "ssl": {
    "always_https": true,
    "mode": "flexible"
  }
}
EOF

cat > namecheap-config.txt << EOF
Namecheap URL Redirect Configuration:
====================================
1. Login to Namecheap account
2. Go to Domain List → Manage
3. Advanced DNS → Add Record
4. Type: URL Redirect Record
5. Host: @
6. Value: $REPL_URL
7. TTL: Automatic
8. Save changes

Subdomain (www):
Type: CNAME Record
Host: www  
Value: $DOMAIN
TTL: Automatic
EOF

echo "📁 Configuration files created:"
echo "   - cloudflare-config.json"
echo "   - namecheap-config.txt"
echo ""
echo "🔧 Platform Status: READY FOR DOMAIN DEPLOYMENT"