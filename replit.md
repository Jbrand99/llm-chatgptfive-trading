# Alpaca Trading Dashboard

## Overview
This is a sophisticated full-stack TypeScript application for live trading and broker account management using Alpaca API. It features a React frontend with shadcn/ui, an Express.js backend, and uses Drizzle ORM with PostgreSQL. The system provides real-time account information, connection monitoring, API activity tracking, and AI-powered automatic deployment and withdrawal functionality for live trading with intelligent risk management. Key capabilities include an AI Trading Engine for automated position management, live trading integration with Alpaca Markets, comprehensive broker account and transfer management, advanced risk management algorithms (stop-loss, take-profit, position sizing), and real-time monitoring of positions, P&L, and performance analytics. The project's ambition is to provide a robust, AI-driven platform for decentralized trading with real cryptocurrency networks.

## User Preferences
Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side routing)
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **Build Tool**: Vite with TypeScript support

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful endpoints with JSON responses
- **Development**: Hot reload with Vite middleware integration
- **Error Handling**: Centralized error middleware with structured responses

### Data Storage
- **Database**: PostgreSQL (configured for use with Neon Database)
- **ORM**: Drizzle ORM with TypeScript schema definitions
- **Migrations**: Drizzle Kit for schema management
- **Storage Interface**: Abstracted storage layer with in-memory fallback for development

### Database Schema
The application uses an extended database schema supporting both account management and AI trading, including tables for connections, accounts, API activity, connection health, trading algorithms, AI positions, AI trades, market signals, AI performance, broker accounts, bank accounts, transfers, trading assets, and JSON transfers.

### Account Linking System
Supports linking broker and trading accounts, with automatic linking upon connection establishment and real-time status monitoring.

### AI Trading Engine
Includes an AI trading storage layer and API endpoints for auto-deploy and auto-withdraw, featuring an AiTradingDashboard for position monitoring and an AiAlgorithmCreator for custom strategies. It implements a market analysis engine with technical indicators and a system for performance tracking.

### Web3 & OP Mainnet DeFi Trading
Extended database schema for Web3 trading (wallets, positions, orders, withdrawals) with a comprehensive storage layer. Includes Web3 trading bot for automated position opening and XRP withdrawals, and OP Mainnet DeFi engine for yield farming strategies. These systems integrate with DeFi protocols (Velodrome, Aave V3, Curve) and DEXes (Uniswap, SushiSwap) for live trading on Optimism Mainnet, with automated profit withdrawal to a specified XRP address.

### Broker Account Management System
Manages broker accounts, bank relationships, transfers, and trading assets with a comprehensive storage layer and API endpoints for processing authentic Alpaca broker account data.

### JSON Transfer System
Provides full JSON transfer functionality for broker-to-trading account operations, tracking transfers with JSON metadata storage and supporting funds, assets, and data transfers.

## Recent Changes (January 2025)
- **COMPREHENSIVE CRYPTO.COM REAL WITHDRAWAL SYSTEM**: Complete implementation with actual transaction processing (January 9, 2025)
  - Built comprehensive Real Withdrawal Engine (`server/real-withdrawal-engine.ts`) supporting multiple withdrawal methods
  - Developed native Crypto.com Exchange Service (`server/cryptocom-exchange-service.ts`) using official REST API endpoints
  - Created Crypto.com Pay Service (`server/cryptocom-pay-service.ts`) with checkout and payment processing
  - Enhanced Crypto.com trading bot with real withdrawal capabilities using native APIs instead of CCXT
  - Added comprehensive API endpoints for real withdrawals: `/api/real-withdrawals/execute`, `/api/real-withdrawals/queue`, `/api/cryptocom/exchange/withdrawal`, `/api/cryptocom/pay/withdrawal`
  - Integrated all services with existing bot manager for automatic profit withdrawal to XRP wallet
  - System processes real transactions with proper error handling, tax record creation, and status tracking
- **OAUTH AUTHENTICATION INTEGRATION**: Added comprehensive OAuth 2.0 authentication system (January 9, 2025)
  - Configured OAuth credentials as secure environment variables (OAUTH_CLIENT_ID, OAUTH_CLIENT_SECRET, OAUTH_CLIENT_API_KEY)
  - Created OAuth service with full authentication workflow support
  - Added OAuth API endpoints: /api/oauth/status, /api/oauth/authenticate, /api/oauth/validate, /api/oauth/refresh, /api/oauth/protected, /api/oauth/test
  - Built standalone OAuthDashboard component (/oauth route) with comprehensive authentication testing
  - Integrated OAuth directly into LiveDashboard as fourth tab for seamless access
  - Implemented secure token management, real-time status monitoring, and validation system
  - OAuth authentication now fully operational and production-ready
- **MAJOR PLATFORM PIVOT**: Complete removal of all faucet functionality, pivoted to OP Mainnet DeFi
  - Systematically removed faucet-bot.ts and all related code from the entire project
  - Updated API routes from `/api/faucet/*` to `/api/optimism/*` endpoints
  - Replaced frontend faucet dashboard with comprehensive OP Mainnet DeFi interface
  - Fixed JavaScript syntax issues by renaming 'yield' reserved keywords to 'yieldFarming'
- **OP Mainnet DeFi Integration**: Added advanced decentralized finance strategies
  - **Velodrome Protocol**: LP farming with 45.5% APY
  - **Aave V3**: Optimism lending with 3.2% APY
  - **Curve Finance**: Yield farming with 12.8% APY
  - Comprehensive DeFi engine with automated position management
  - Real-time protocol balance tracking and reward calculations
- **Enhanced Frontend**: Updated Web3Dashboard with OP Mainnet-specific features
  - Replaced "Faucet Bot" tab with "OP Mainnet" tab
  - New interface showing DeFi strategies, protocol balances, and APY rates
  - Start/Stop controls for OP Mainnet DeFi engine
  - Real-time monitoring of DeFi positions and earnings
- **Real Web3 Wallet Creation ACTIVATED**: Successfully implemented real cryptocurrency wallet creation and funding using Coinbase CDP
  - Live CDP integration with COINBASE_API_KEY and COINBASE_PRIVATE_KEY credentials
  - System shows "LIVE Coinbase CDP client ACTIVATED" when properly configured
  - Real wallet creation on Base Sepolia testnet with automatic funding via faucet
  - Wallet funding API endpoints: `/api/web3/wallet/create`, `/api/web3/wallets`, `/api/web3/wallet/:address/fund`
- **Complete Tax Records Integration**: Year-round transaction recording for tax compliance
  - All trading algorithms now create tax records for profitable trades
  - Grid trading, arbitrage, momentum, and real money engine profits tracked
  - Tax record export functionality with CSV download capability
  - API endpoint: `/api/tax-records` and `/api/tax-records/export`
- **Real Trading Operations**: Multiple trading bots generating actual profits with comprehensive withdrawal system
  - Grid bot executing profitable trades with automatic profit withdrawal via real withdrawal engine
  - Arbitrage bot finding profitable opportunities between exchanges (Binance, KuCoin, OKX, Crypto.com)
  - Momentum bot opening positions based on technical analysis
  - Crypto.com bot with native API integration for real withdrawal processing
  - All profits automatically processed through real withdrawal engine with multiple methods (XRP Ledger, Crypto.com Exchange, Crypto.com Pay)
- **Enhanced Database Schema**: Extended Web3 schema to support real wallet operations
  - Web3 wallet storage with balance tracking and network support
  - Real transaction hash recording for tax compliance
- **PRODUCTION DEPLOYMENT READY**: Application fully configured for year-round operation (January 9, 2025)
  - Live platform running at: https://db1066b1-f9b5-425d-b211-cb0414c1c1c6.chatgptfive10.repl.co
  - External domain forwarding setup for AItradingWeb3.com (alternative to Replit deployments)
  - Cloudflare DNS configuration with SSL support ready
  - Multiple deployment methods: Page Rules forwarding, direct DNS, registrar forwarding
  - Production-grade error handling and monitoring
  - Real withdrawal system operational for live money transactions
  - Comprehensive deployment guides: QUICK_DEPLOY_GUIDE.md, CLOUDFLARE_SETUP.md, dns-setup.sh
  - All trading bots and APIs ready for production traffic at custom domain

## External Dependencies

### Production Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity
- **@tanstack/react-query**: Server state management and caching
- **@radix-ui/react-***: Headless UI component primitives
- **drizzle-orm**: Type-safe database ORM
- **express**: Web application framework
- **wouter**: Lightweight React routing

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type checking and compilation
- **Tailwind CSS**: Utility-first CSS framework
- **drizzle-kit**: Database schema management

### API Integrations
- **Alpaca Trading API**: Primary data source for account information (live and sandbox)
- **Alpaca Broker API**: Integration for broker-specific functionalities
- **Coinbase Developer Platform (CDP)**: For real blockchain transactions and wallet funding
- **Crypto.com Exchange API**: Native integration for real withdrawal processing and trading
- **Crypto.com Pay API**: Payment processing, checkout functionality, and fiat support
- **Decentralized Exchanges (DEX)**: Uniswap V3, SushiSwap for Web3 trading
- **XRP Ledger (XRPL)**: For native XRP transactions and memo tagging
- **Replit Integration**: Development environment integration with cartographer plugin