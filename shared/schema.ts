import { pgTable, text, serial, integer, boolean, timestamp, decimal, json } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const connections = pgTable("connections", {
  id: serial("id").primaryKey(),
  type: text("type").notNull(), // 'broker' | 'trading'
  apiKey: text("api_key").notNull(),
  secretKey: text("secret_key").notNull(),
  endpoint: text("endpoint").notNull(),
  status: text("status").notNull().default('disconnected'), // 'connected' | 'disconnected' | 'error'
  lastVerified: timestamp("last_verified"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const accounts = pgTable("accounts", {
  id: serial("id").primaryKey(),
  connectionId: integer("connection_id").notNull(),
  accountId: text("account_id").notNull(),
  accountNumber: text("account_number"), // Store account number separately
  accountType: text("account_type"),
  status: text("status"),
  buyingPower: decimal("buying_power", { precision: 12, scale: 2 }),
  cash: decimal("cash", { precision: 12, scale: 2 }),
  portfolioValue: decimal("portfolio_value", { precision: 12, scale: 2 }),
  dayTradingBuyingPower: decimal("day_trading_buying_power", { precision: 12, scale: 2 }),
  positionsCount: integer("positions_count").default(0),
  permissions: text("permissions").array(),
  linkedBrokerAccountId: text("linked_broker_account_id"), // Link to broker account
  createdAt: timestamp("created_at"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const apiActivity = pgTable("api_activity", {
  id: serial("id").primaryKey(),
  connectionId: integer("connection_id").notNull(),
  endpoint: text("endpoint").notNull(),
  method: text("method").notNull(),
  statusCode: integer("status_code").notNull(),
  responseTime: integer("response_time").notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export const connectionHealth = pgTable("connection_health", {
  id: serial("id").primaryKey(),
  connectionId: integer("connection_id").notNull(),
  responseTime: integer("response_time"),
  rateLimit: integer("rate_limit"),
  rateLimitUsed: integer("rate_limit_used"),
  lastError: text("last_error"),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achRelationships = pgTable("ach_relationships", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  connectionId: integer("connection_id").notNull(),
  bankAccountNumber: text("bank_account_number").notNull(),
  bankRoutingNumber: text("bank_routing_number").notNull(),
  accountOwnerName: text("account_owner_name").notNull(),
  bankAccountType: text("bank_account_type").notNull(), // 'CHECKING' | 'SAVINGS'
  nickname: text("nickname"),
  status: text("status").notNull().default('QUEUED'), // 'QUEUED' | 'APPROVED' | 'REJECTED'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const achTransfers = pgTable("ach_transfers", {
  id: serial("id").primaryKey(),
  accountId: text("account_id").notNull(),
  connectionId: integer("connection_id").notNull(),
  relationshipId: integer("relationship_id").notNull(),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  direction: text("direction").notNull(), // 'INCOMING' | 'OUTGOING'
  status: text("status").notNull().default('QUEUED'), // 'QUEUED' | 'APPROVED' | 'SENT' | 'REJECTED'
  transferType: text("transfer_type").notNull().default('ach'),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
});

export const insertConnectionSchema = createInsertSchema(connections).omit({
  id: true,
  lastVerified: true,
  createdAt: true,
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  updatedAt: true,
});

export const insertApiActivitySchema = createInsertSchema(apiActivity).omit({
  id: true,
  timestamp: true,
});

export const insertConnectionHealthSchema = createInsertSchema(connectionHealth).omit({
  id: true,
  updatedAt: true,
});

export const insertAchRelationshipSchema = createInsertSchema(achRelationships).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAchTransferSchema = createInsertSchema(achTransfers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  expiresAt: true,
});

export type InsertConnection = z.infer<typeof insertConnectionSchema>;
export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type InsertApiActivity = z.infer<typeof insertApiActivitySchema>;
export type InsertConnectionHealth = z.infer<typeof insertConnectionHealthSchema>;
export type InsertAchRelationship = z.infer<typeof insertAchRelationshipSchema>;
export type InsertAchTransfer = z.infer<typeof insertAchTransferSchema>;

// AI Trading Algorithm Tables
export const tradingAlgorithms = pgTable("trading_algorithms", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  strategy: text("strategy").notNull(), // 'momentum', 'mean_reversion', 'breakout', 'sentiment'
  status: text("status").notNull().default('inactive'), // 'active', 'inactive', 'paused'
  riskLevel: integer("risk_level").notNull().default(3), // 1-5 scale
  maxPositions: integer("max_positions").notNull().default(5),
  maxPositionSize: decimal("max_position_size", { precision: 12, scale: 2 }).notNull(),
  stopLossPercent: decimal("stop_loss_percent", { precision: 5, scale: 2 }).notNull(),
  takeProfitPercent: decimal("take_profit_percent", { precision: 5, scale: 2 }).notNull(),
  config: json("config").notNull(), // Algorithm-specific configuration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const aiPositions = pgTable("ai_positions", {
  id: serial("id").primaryKey(),
  algorithmId: integer("algorithm_id").notNull(),
  accountId: text("account_id").notNull(),
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // 'long', 'short'
  quantity: decimal("quantity", { precision: 12, scale: 6 }).notNull(),
  entryPrice: decimal("entry_price", { precision: 12, scale: 4 }).notNull(),
  currentPrice: decimal("current_price", { precision: 12, scale: 4 }),
  stopLoss: decimal("stop_loss", { precision: 12, scale: 4 }),
  takeProfit: decimal("take_profit", { precision: 12, scale: 4 }),
  status: text("status").notNull().default('open'), // 'open', 'closed', 'closing'
  pnl: decimal("pnl", { precision: 12, scale: 2 }),
  pnlPercent: decimal("pnl_percent", { precision: 5, scale: 2 }),
  openedAt: timestamp("opened_at").defaultNow().notNull(),
  closedAt: timestamp("closed_at"),
  reason: text("reason"), // Reason for opening/closing
});

export const aiTrades = pgTable("ai_trades", {
  id: serial("id").primaryKey(),
  algorithmId: integer("algorithm_id").notNull(),
  positionId: integer("position_id"),
  accountId: text("account_id").notNull(),
  symbol: text("symbol").notNull(),
  side: text("side").notNull(), // 'buy', 'sell'
  orderType: text("order_type").notNull(), // 'market', 'limit', 'stop', 'stop_limit'
  quantity: decimal("quantity", { precision: 12, scale: 6 }).notNull(),
  price: decimal("price", { precision: 12, scale: 4 }),
  fillPrice: decimal("fill_price", { precision: 12, scale: 4 }),
  status: text("status").notNull().default('pending'), // 'pending', 'filled', 'cancelled', 'rejected'
  orderId: text("order_id"), // Alpaca order ID
  confidence: decimal("confidence", { precision: 3, scale: 2 }), // AI confidence score 0-100
  signals: json("signals"), // Market signals that triggered the trade
  executedAt: timestamp("executed_at").defaultNow().notNull(),
  filledAt: timestamp("filled_at"),
});

export const marketSignals = pgTable("market_signals", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(),
  signalType: text("signal_type").notNull(), // 'momentum', 'volume', 'price_action', 'sentiment'
  strength: decimal("strength", { precision: 3, scale: 2 }).notNull(), // -100 to +100
  timeframe: text("timeframe").notNull(), // '1m', '5m', '15m', '1h', '1d'
  data: json("data").notNull(), // Signal-specific data
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiPerformance = pgTable("ai_performance", {
  id: serial("id").primaryKey(),
  algorithmId: integer("algorithm_id").notNull(),
  date: timestamp("date").notNull(),
  totalTrades: integer("total_trades").notNull().default(0),
  winningTrades: integer("winning_trades").notNull().default(0),
  losingTrades: integer("losing_trades").notNull().default(0),
  totalPnl: decimal("total_pnl", { precision: 12, scale: 2 }).notNull().default('0'),
  winRate: decimal("win_rate", { precision: 5, scale: 2 }),
  avgWin: decimal("avg_win", { precision: 12, scale: 2 }),
  avgLoss: decimal("avg_loss", { precision: 12, scale: 2 }),
  sharpeRatio: decimal("sharpe_ratio", { precision: 5, scale: 3 }),
  maxDrawdown: decimal("max_drawdown", { precision: 5, scale: 2 }),
});

// Web3 Crypto Trading Tables
export const web3Wallets = pgTable("web3_wallets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull().unique(),
  network: text("network").notNull(), // ethereum, bsc, polygon, xrpl
  privateKey: text("private_key"), // encrypted
  isActive: boolean("is_active").default(true),
  balance: decimal("balance", { precision: 18, scale: 8 }).default('0'),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const cryptoTradingPairs = pgTable("crypto_trading_pairs", {
  id: serial("id").primaryKey(),
  symbol: text("symbol").notNull(), // ETH/USDT, XRP/USDT
  baseAsset: text("base_asset").notNull(), // ETH, XRP
  quoteAsset: text("quote_asset").notNull(), // USDT, BTC
  exchange: text("exchange").notNull(), // uniswap, pancakeswap, binance
  network: text("network").notNull(), // ethereum, bsc
  contractAddress: text("contract_address"),
  isActive: boolean("is_active").default(true),
  minTradeAmount: decimal("min_trade_amount", { precision: 18, scale: 8 }),
  tradingFee: decimal("trading_fee", { precision: 8, scale: 4 }),
});

export const cryptoOrders = pgTable("crypto_orders", {
  id: serial("id").primaryKey(),
  algorithmId: integer("algorithm_id").references(() => tradingAlgorithms.id),
  walletId: integer("wallet_id").notNull().references(() => web3Wallets.id),
  pairId: integer("pair_id").notNull().references(() => cryptoTradingPairs.id),
  orderId: text("order_id"), // Exchange order ID
  txHash: text("tx_hash"), // Blockchain transaction hash
  orderType: text("order_type").notNull(), // market, limit, swap
  side: text("side").notNull(), // buy, sell
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  price: decimal("price", { precision: 18, scale: 8 }),
  filled: decimal("filled", { precision: 18, scale: 8 }).default('0'),
  status: text("status").notNull().default('pending'), // pending, filled, cancelled, failed
  exchange: text("exchange").notNull(),
  network: text("network").notNull(),
  gasFee: decimal("gas_fee", { precision: 18, scale: 8 }),
  slippage: decimal("slippage", { precision: 8, scale: 4 }),
  createdAt: timestamp("created_at").defaultNow(),
  filledAt: timestamp("filled_at"),
});

export const cryptoPositions = pgTable("crypto_positions", {
  id: serial("id").primaryKey(),
  algorithmId: integer("algorithm_id").references(() => tradingAlgorithms.id),
  walletId: integer("wallet_id").notNull().references(() => web3Wallets.id),
  pairId: integer("pair_id").notNull().references(() => cryptoTradingPairs.id),
  side: text("side").notNull(), // long, short
  entryPrice: decimal("entry_price", { precision: 18, scale: 8 }).notNull(),
  currentPrice: decimal("current_price", { precision: 18, scale: 8 }),
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  collateral: decimal("collateral", { precision: 18, scale: 8 }),
  leverage: decimal("leverage", { precision: 8, scale: 2 }).default('1'),
  pnl: decimal("pnl", { precision: 18, scale: 8 }).default('0'),
  pnlPercent: decimal("pnl_percent", { precision: 8, scale: 4 }).default('0'),
  stopLoss: decimal("stop_loss", { precision: 18, scale: 8 }),
  takeProfit: decimal("take_profit", { precision: 18, scale: 8 }),
  status: text("status").notNull().default('open'), // open, closed, liquidated
  openedAt: timestamp("opened_at").defaultNow(),
  closedAt: timestamp("closed_at"),
  reason: text("reason"),
});

export const web3Withdrawals = pgTable("web3_withdrawals", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => web3Wallets.id),
  targetAddress: text("target_address").notNull(),
  asset: text("asset").notNull(), // XRP, ETH, USDT
  amount: decimal("amount", { precision: 18, scale: 8 }).notNull(),
  network: text("network").notNull(),
  txHash: text("tx_hash"),
  destinationTag: text("destination_tag"), // For XRP
  status: text("status").notNull().default('pending'), // pending, confirmed, failed
  gasFee: decimal("gas_fee", { precision: 18, scale: 8 }),
  triggerType: text("trigger_type"), // manual, auto_profit, stop_loss
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

export const dexLiquidity = pgTable("dex_liquidity", {
  id: serial("id").primaryKey(),
  walletId: integer("wallet_id").notNull().references(() => web3Wallets.id),
  pairId: integer("pair_id").notNull().references(() => cryptoTradingPairs.id),
  exchange: text("exchange").notNull(),
  poolAddress: text("pool_address"),
  token0Amount: decimal("token0_amount", { precision: 18, scale: 8 }),
  token1Amount: decimal("token1_amount", { precision: 18, scale: 8 }),
  lpTokens: decimal("lp_tokens", { precision: 18, scale: 8 }),
  apy: decimal("apy", { precision: 8, scale: 4 }),
  status: text("status").default('active'), // active, withdrawn
  createdAt: timestamp("created_at").defaultNow(),
  withdrawnAt: timestamp("withdrawn_at"),
});

// Schema for inserts
export const insertTradingAlgorithmSchema = createInsertSchema(tradingAlgorithms).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertAiPositionSchema = createInsertSchema(aiPositions).omit({
  id: true,
  openedAt: true,
  closedAt: true,
});

export const insertAiTradeSchema = createInsertSchema(aiTrades).omit({
  id: true,
  executedAt: true,
  filledAt: true,
});

export const insertMarketSignalSchema = createInsertSchema(marketSignals).omit({
  id: true,
  createdAt: true,
});

export const insertAiPerformanceSchema = createInsertSchema(aiPerformance).omit({
  id: true,
});

// Web3 Schema for inserts
export const insertWeb3WalletSchema = createInsertSchema(web3Wallets).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCryptoTradingPairSchema = createInsertSchema(cryptoTradingPairs).omit({
  id: true,
});

export const insertCryptoOrderSchema = createInsertSchema(cryptoOrders).omit({
  id: true,
  createdAt: true,
  filledAt: true,
});

export const insertCryptoPositionSchema = createInsertSchema(cryptoPositions).omit({
  id: true,
  openedAt: true,
  closedAt: true,
});

export const insertWeb3WithdrawalSchema = createInsertSchema(web3Withdrawals).omit({
  id: true,
  createdAt: true,
  confirmedAt: true,
});

export const insertDexLiquiditySchema = createInsertSchema(dexLiquidity).omit({
  id: true,
  createdAt: true,
  withdrawnAt: true,
});

// Types for TypeScript
export type InsertTradingAlgorithm = z.infer<typeof insertTradingAlgorithmSchema>;
export type InsertAiPosition = z.infer<typeof insertAiPositionSchema>;
export type InsertAiTrade = z.infer<typeof insertAiTradeSchema>;
export type InsertMarketSignal = z.infer<typeof insertMarketSignalSchema>;
export type InsertAiPerformance = z.infer<typeof insertAiPerformanceSchema>;

// Web3 Types
export type InsertWeb3Wallet = z.infer<typeof insertWeb3WalletSchema>;
export type InsertCryptoTradingPair = z.infer<typeof insertCryptoTradingPairSchema>;
export type InsertCryptoOrder = z.infer<typeof insertCryptoOrderSchema>;
export type InsertCryptoPosition = z.infer<typeof insertCryptoPositionSchema>;
export type InsertWeb3Withdrawal = z.infer<typeof insertWeb3WithdrawalSchema>;
export type InsertDexLiquidity = z.infer<typeof insertDexLiquiditySchema>;

export type TradingAlgorithm = typeof tradingAlgorithms.$inferSelect;
export type AiPosition = typeof aiPositions.$inferSelect;
export type AiTrade = typeof aiTrades.$inferSelect;
export type MarketSignal = typeof marketSignals.$inferSelect;
export type AiPerformance = typeof aiPerformance.$inferSelect;

// Web3 Select Types
export type Web3Wallet = typeof web3Wallets.$inferSelect;
export type CryptoTradingPair = typeof cryptoTradingPairs.$inferSelect;
export type CryptoOrder = typeof cryptoOrders.$inferSelect;
export type CryptoPosition = typeof cryptoPositions.$inferSelect;
export type Web3Withdrawal = typeof web3Withdrawals.$inferSelect;
export type DexLiquidity = typeof dexLiquidity.$inferSelect;

// Add broker account specific tables
export const brokerAccounts = pgTable("broker_accounts", {
  id: serial("id").primaryKey(),
  connectionId: integer("connection_id").notNull(),
  accountId: text("account_id").notNull().unique(),
  accountNumber: text("account_number").notNull(),
  status: text("status").notNull(), // SUBMITTED, ACTIVE, etc.
  cryptoStatus: text("crypto_status"),
  currency: text("currency").notNull().default('USD'),
  lastEquity: decimal("last_equity", { precision: 12, scale: 2 }).default('0'),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  contactAddress: text("contact_address").array(),
  contactCity: text("contact_city"),
  contactState: text("contact_state"),
  contactPostalCode: text("contact_postal_code"),
  identityGivenName: text("identity_given_name"),
  identityFamilyName: text("identity_family_name"),
  identityDateOfBirth: text("identity_date_of_birth"),
  accountType: text("account_type").notNull(),
  tradingType: text("trading_type"),
  enabledAssets: text("enabled_assets").array(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brokerBankAccounts = pgTable("broker_bank_accounts", {
  id: serial("id").primaryKey(),
  brokerAccountId: text("broker_account_id").notNull(),
  relationshipId: text("relationship_id").notNull().unique(),
  accountOwnerName: text("account_owner_name").notNull(),
  bankAccountType: text("bank_account_type").notNull(),
  bankAccountNumber: text("bank_account_number").notNull(),
  bankRoutingNumber: text("bank_routing_number").notNull(),
  nickname: text("nickname"),
  status: text("status").notNull().default('QUEUED'),
  processorToken: text("processor_token"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const brokerTransfers = pgTable("broker_transfers", {
  id: serial("id").primaryKey(),
  transferId: text("transfer_id").notNull().unique(),
  relationshipId: text("relationship_id").notNull(),
  brokerAccountId: text("broker_account_id").notNull(),
  transferType: text("transfer_type").notNull().default('ach'),
  status: text("status").notNull(),
  currency: text("currency").notNull().default('USD'),
  amount: decimal("amount", { precision: 12, scale: 2 }).notNull(),
  instantAmount: decimal("instant_amount", { precision: 12, scale: 2 }).default('0'),
  direction: text("direction").notNull(),
  requestedAmount: decimal("requested_amount", { precision: 12, scale: 2 }),
  fee: decimal("fee", { precision: 12, scale: 2 }).default('0'),
  feePaymentMethod: text("fee_payment_method"),
  reason: text("reason"),
  holdUntil: timestamp("hold_until"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const tradingAssets = pgTable("trading_assets", {
  id: serial("id").primaryKey(),
  assetId: text("asset_id").notNull().unique(),
  cusip: text("cusip"),
  assetClass: text("asset_class").notNull(),
  exchange: text("exchange"),
  symbol: text("symbol").notNull(),
  name: text("name").notNull(),
  status: text("status").notNull(),
  tradable: boolean("tradable").notNull(),
  marginable: boolean("marginable").notNull(),
  maintenanceMarginRequirement: integer("maintenance_margin_requirement"),
  marginRequirementLong: text("margin_requirement_long"),
  marginRequirementShort: text("margin_requirement_short"),
  shortable: boolean("shortable").notNull(),
  easyToBorrow: boolean("easy_to_borrow").notNull(),
  fractionable: boolean("fractionable").notNull(),
  attributes: text("attributes").array(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// JSON Transfers table for broker to trading account transfers
export const jsonTransfers = pgTable("json_transfers", {
  id: serial("id").primaryKey(),
  transferId: text("transfer_id").notNull(),
  fromBrokerAccountId: text("from_broker_account_id").notNull(),
  toTradingAccountId: text("to_trading_account_id").notNull(),
  transferType: text("transfer_type").notNull(), // 'funds', 'assets', 'data'
  amount: text("amount"),
  assetSymbol: text("asset_symbol"),
  assetQuantity: text("asset_quantity"),
  status: text("status").notNull().default('pending'), // 'pending', 'processing', 'completed', 'failed'
  metadata: json("metadata"),
  transferData: json("transfer_data").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Insert schemas for new tables
export const insertBrokerAccountSchema = createInsertSchema(brokerAccounts).omit({
  id: true,
  updatedAt: true,
});

export const insertBrokerBankAccountSchema = createInsertSchema(brokerBankAccounts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBrokerTransferSchema = createInsertSchema(brokerTransfers).omit({
  id: true,
  updatedAt: true,
});

export const insertTradingAssetSchema = createInsertSchema(tradingAssets).omit({
  id: true,
  updatedAt: true,
});

export const insertJsonTransferSchema = createInsertSchema(jsonTransfers).omit({
  id: true,
  updatedAt: true,
});

export type Connection = typeof connections.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type ApiActivity = typeof apiActivity.$inferSelect;
export type ConnectionHealth = typeof connectionHealth.$inferSelect;
export type AchRelationship = typeof achRelationships.$inferSelect;
export type AchTransfer = typeof achTransfers.$inferSelect;

export type BrokerAccount = typeof brokerAccounts.$inferSelect;
export type BrokerBankAccount = typeof brokerBankAccounts.$inferSelect;
export type BrokerTransfer = typeof brokerTransfers.$inferSelect;
export type TradingAsset = typeof tradingAssets.$inferSelect;
export type JsonTransfer = typeof jsonTransfers.$inferSelect;

export type InsertBrokerAccount = z.infer<typeof insertBrokerAccountSchema>;
export type InsertBrokerBankAccount = z.infer<typeof insertBrokerBankAccountSchema>;
export type InsertBrokerTransfer = z.infer<typeof insertBrokerTransferSchema>;
export type InsertTradingAsset = z.infer<typeof insertTradingAssetSchema>;
export type InsertJsonTransfer = z.infer<typeof insertJsonTransferSchema>;

// Tax Records Table for IRS Compliance and Detailed Transaction Tracking
export const taxRecords = pgTable("tax_records", {
  id: serial("id").primaryKey(),
  transactionHash: text("transaction_hash").notNull(),
  date: timestamp("date").notNull(),
  type: text("type").notNull(), // 'profit_withdrawal', 'trade_profit', 'mining_reward', etc.
  usdAmount: decimal("usd_amount", { precision: 12, scale: 2 }).notNull(),
  cryptoAmount: decimal("crypto_amount", { precision: 18, scale: 6 }).notNull(),
  cryptoAsset: text("crypto_asset").notNull(),
  source: text("source").notNull(), // which trading algorithm generated this
  exchangeRate: decimal("exchange_rate", { precision: 12, scale: 6 }).notNull(),
  targetAddress: text("target_address"),
  memoTag: text("memo_tag"),
  taxYear: integer("tax_year").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTaxRecordSchema = createInsertSchema(taxRecords).omit({
  id: true,
  createdAt: true,
});

export type SelectTaxRecord = typeof taxRecords.$inferSelect;
export type InsertTaxRecord = z.infer<typeof insertTaxRecordSchema>;


