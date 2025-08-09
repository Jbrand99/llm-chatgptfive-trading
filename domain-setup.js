// Alternative Domain Setup for AItradingWeb3.com
// This script helps configure external domain forwarding

import fs from 'fs';

// Get current Repl URL
function getCurrentReplUrl() {
  // Replit provides the REPL_ID and REPLIT_URL environment variables
  const replId = process.env.REPL_ID;
  const replUser = process.env.REPLIT_USER || 'user';
  
  if (replId) {
    return `https://${replId}.${replUser}.repl.co`;
  }
  
  // Fallback to localhost for development
  return 'http://localhost:5000';
}

// Configuration for external domain setup
const domainConfig = {
  customDomain: 'AItradingWeb3.com',
  targetUrl: getCurrentReplUrl(),
  methods: {
    cloudflare: {
      type: 'Page Rules',
      rule: `${getCurrentReplUrl()}/*`,
      setting: 'Forwarding URL',
      statusCode: 301,
      destinationUrl: 'AItradingWeb3.com/$1'
    },
    namecheap: {
      type: 'URL Redirect',
      source: 'AItradingWeb3.com',
      destination: getCurrentReplUrl(),
      redirectType: 'Permanent (301)'
    },
    godaddy: {
      type: 'Forwarding',
      domain: 'AItradingWeb3.com',
      forwardTo: getCurrentReplUrl(),
      redirectType: 'Permanent'
    }
  }
};

// Save configuration for reference
fs.writeFileSync('domain-config.json', JSON.stringify(domainConfig, null, 2));

console.log('🌐 Alternative Domain Setup Configuration');
console.log('========================================');
console.log(`Target Domain: ${domainConfig.customDomain}`);
console.log(`Current Repl URL: ${domainConfig.targetUrl}`);
console.log('\n📋 Configuration saved to domain-config.json');
console.log('\n🛠️ Setup Methods Available:');
console.log('1. Cloudflare Page Rules');
console.log('2. Domain Registrar Forwarding'); 
console.log('3. Reverse Proxy Setup');

module.exports = domainConfig;