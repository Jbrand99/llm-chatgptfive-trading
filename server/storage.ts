import { 
  connections, 
  accounts, 
  apiActivity, 
  connectionHealth,
  achRelationships,
  achTransfers,
  brokerAccounts,
  brokerBankAccounts,
  brokerTransfers,
  tradingAssets,
  tradingAlgorithms,
  aiPositions,
  aiTrades,
  marketSignals,
  aiPerformance,
  web3Wallets,
  cryptoTradingPairs,
  cryptoOrders,
  cryptoPositions,
  web3Withdrawals,
  dexLiquidity,
  taxRecords,
  type Connection, 
  type InsertConnection,
  type Account,
  type InsertAccount,
  type ApiActivity,
  type InsertApiActivity,
  type ConnectionHealth,
  type InsertConnectionHealth,
  type AchRelationship,
  type InsertAchRelationship,
  type AchTransfer,
  type InsertAchTransfer,
  type BrokerAccount,
  type InsertBrokerAccount,
  type BrokerBankAccount,
  type InsertBrokerBankAccount,
  type BrokerTransfer,
  type InsertBrokerTransfer,
  type TradingAsset,
  type InsertTradingAsset,
  type JsonTransfer,
  type InsertJsonTransfer,
  type TradingAlgorithm,
  type InsertTradingAlgorithm,
  type AiPosition,
  type InsertAiPosition,
  type AiTrade,
  type InsertAiTrade,
  type MarketSignal,
  type InsertMarketSignal,
  type AiPerformance,
  type InsertAiPerformance,
  type Web3Wallet,
  type InsertWeb3Wallet,
  type CryptoTradingPair,
  type InsertCryptoTradingPair,
  type CryptoOrder,
  type InsertCryptoOrder,
  type CryptoPosition,
  type InsertCryptoPosition,
  type Web3Withdrawal,
  type InsertWeb3Withdrawal,
  type DexLiquidity,
  type InsertDexLiquidity
} from "@shared/schema";
import { db } from "./db";

export interface IStorage {
  // Connection methods
  createConnection(connection: InsertConnection): Promise<Connection>;
  getConnection(id: number): Promise<Connection | undefined>;
  getConnectionByType(type: string): Promise<Connection | undefined>;
  getAllConnections(): Promise<Connection[]>;
  updateConnectionStatus(id: number, status: string, lastVerified?: Date): Promise<Connection>;
  updateConnectionEndpoint(id: number, endpoint: string): Promise<Connection>;
  updateConnectionCredentials(id: number, apiKey: string, secretKey: string): Promise<Connection>;
  
  // Account methods
  createAccount(account: InsertAccount): Promise<Account>;
  getAccountByConnectionId(connectionId: number): Promise<Account | undefined>;
  updateAccount(connectionId: number, updates: Partial<Account>): Promise<Account>;
  deleteAccountByConnectionId(connectionId: number): Promise<void>;
  
  // API Activity methods
  createApiActivity(activity: InsertApiActivity): Promise<ApiActivity>;
  getRecentApiActivity(limit?: number): Promise<ApiActivity[]>;
  
  // Connection Health methods
  createOrUpdateConnectionHealth(health: InsertConnectionHealth): Promise<ConnectionHealth>;
  getConnectionHealth(connectionId: number): Promise<ConnectionHealth | undefined>;
  getAllConnectionHealth(): Promise<ConnectionHealth[]>;

  // ACH Relationship methods
  createAchRelationship(relationship: InsertAchRelationship): Promise<AchRelationship>;
  getAchRelationships(accountId: string): Promise<AchRelationship[]>;
  updateAchRelationshipStatus(id: number, status: string): Promise<AchRelationship>;

  // ACH Transfer methods
  createAchTransfer(transfer: InsertAchTransfer): Promise<AchTransfer>;
  getAchTransfers(accountId: string): Promise<AchTransfer[]>;
  updateAchTransferStatus(id: number, status: string): Promise<AchTransfer>;

  // Broker Account methods
  createBrokerAccount(account: InsertBrokerAccount): Promise<BrokerAccount>;
  getBrokerAccountByConnectionId(connectionId: number): Promise<BrokerAccount | undefined>;
  getBrokerAccountById(accountId: string): Promise<BrokerAccount | undefined>;
  updateBrokerAccount(accountId: string, updates: Partial<BrokerAccount>): Promise<BrokerAccount>;

  // Broker Bank Account methods
  createBrokerBankAccount(bankAccount: InsertBrokerBankAccount): Promise<BrokerBankAccount>;
  getBrokerBankAccounts(brokerAccountId: string): Promise<BrokerBankAccount[]>;
  getBrokerBankAccountByRelationshipId(relationshipId: string): Promise<BrokerBankAccount | undefined>;
  updateBrokerBankAccountStatus(relationshipId: string, status: string): Promise<BrokerBankAccount>;

  // Broker Transfer methods
  createBrokerTransfer(transfer: InsertBrokerTransfer): Promise<BrokerTransfer>;
  getBrokerTransfers(brokerAccountId: string): Promise<BrokerTransfer[]>;
  getBrokerTransferById(transferId: string): Promise<BrokerTransfer | undefined>;
  updateBrokerTransferStatus(transferId: string, status: string): Promise<BrokerTransfer>;

  // Trading Asset methods
  createTradingAsset(asset: InsertTradingAsset): Promise<TradingAsset>;
  bulkCreateTradingAssets(assets: InsertTradingAsset[]): Promise<TradingAsset[]>;
  getTradingAssets(limit?: number): Promise<TradingAsset[]>;
  getTradingAssetBySymbol(symbol: string): Promise<TradingAsset | undefined>;
  searchTradingAssets(query: string): Promise<TradingAsset[]>;
  
  // JSON Transfer methods
  createJsonTransfer(transfer: InsertJsonTransfer): Promise<JsonTransfer>;
  getJsonTransfer(id: number): Promise<JsonTransfer | undefined>;
  getJsonTransfersByBrokerAccount(brokerAccountId: string): Promise<JsonTransfer[]>;
  getJsonTransfersByTradingAccount(tradingAccountId: string): Promise<JsonTransfer[]>;
  updateJsonTransferStatus(id: number, status: string): Promise<JsonTransfer>;

  // AI Trading Algorithm methods
  createTradingAlgorithm(algorithm: InsertTradingAlgorithm): Promise<TradingAlgorithm>;
  getTradingAlgorithm(id: number): Promise<TradingAlgorithm | undefined>;
  getAllTradingAlgorithms(): Promise<TradingAlgorithm[]>;
  getActiveTradingAlgorithms(): Promise<TradingAlgorithm[]>;
  updateTradingAlgorithmStatus(id: number, status: string): Promise<TradingAlgorithm>;
  updateTradingAlgorithmConfig(id: number, config: any): Promise<TradingAlgorithm>;

  // AI Position methods
  createAiPosition(position: InsertAiPosition): Promise<AiPosition>;
  getAiPosition(id: number): Promise<AiPosition | undefined>;
  getAiPositionsByAlgorithm(algorithmId: number): Promise<AiPosition[]>;
  getOpenAiPositions(): Promise<AiPosition[]>;
  getAiPositionsBySymbol(symbol: string): Promise<AiPosition[]>;
  updateAiPosition(id: number, updates: Partial<AiPosition>): Promise<AiPosition>;
  closeAiPosition(id: number, closedAt: Date, reason?: string): Promise<AiPosition>;

  // AI Trade methods
  createAiTrade(trade: InsertAiTrade): Promise<AiTrade>;
  getAiTrade(id: number): Promise<AiTrade | undefined>;
  getAiTradesByAlgorithm(algorithmId: number): Promise<AiTrade[]>;
  getAiTradesByPosition(positionId: number): Promise<AiTrade[]>;
  getRecentAiTrades(limit?: number): Promise<AiTrade[]>;
  updateAiTradeStatus(id: number, status: string, fillPrice?: string, filledAt?: Date): Promise<AiTrade>;

  // Market Signal methods
  createMarketSignal(signal: InsertMarketSignal): Promise<MarketSignal>;
  getMarketSignals(symbol: string, timeframe?: string): Promise<MarketSignal[]>;
  getRecentMarketSignals(limit?: number): Promise<MarketSignal[]>;
  getMarketSignalsByType(signalType: string): Promise<MarketSignal[]>;

  // AI Performance methods
  createAiPerformance(performance: InsertAiPerformance): Promise<AiPerformance>;
  getAiPerformance(algorithmId: number, date: Date): Promise<AiPerformance | undefined>;
  getAiPerformanceHistory(algorithmId: number, days?: number): Promise<AiPerformance[]>;
  updateAiPerformance(algorithmId: number, date: Date, updates: Partial<AiPerformance>): Promise<AiPerformance>;

  // Web3 Wallet methods
  createWeb3Wallet(wallet: InsertWeb3Wallet): Promise<Web3Wallet>;
  getWeb3Wallets(): Promise<Web3Wallet[]>;
  getWeb3WalletById(id: number): Promise<Web3Wallet | null>;
  getWeb3WalletsByNetwork(network: string): Promise<Web3Wallet[]>;
  updateWeb3Wallet(id: number, wallet: Partial<Web3Wallet>): Promise<Web3Wallet | null>;

  // Crypto Trading Pair methods
  createCryptoTradingPair(pair: InsertCryptoTradingPair): Promise<CryptoTradingPair>;
  getCryptoTradingPairs(): Promise<CryptoTradingPair[]>;
  getCryptoTradingPairById(id: number): Promise<CryptoTradingPair | null>;
  getCryptoTradingPairBySymbol(symbol: string): Promise<CryptoTradingPair | null>;

  // Crypto Order methods
  createCryptoOrder(order: InsertCryptoOrder): Promise<CryptoOrder>;
  getCryptoOrders(): Promise<CryptoOrder[]>;
  getCryptoOrdersByWallet(walletId: number): Promise<CryptoOrder[]>;
  getCryptoOrdersByAlgorithm(algorithmId: number): Promise<CryptoOrder[]>;
  updateCryptoOrder(id: number, order: Partial<CryptoOrder>): Promise<CryptoOrder | null>;

  // Crypto Position methods
  createCryptoPosition(position: InsertCryptoPosition): Promise<CryptoPosition>;
  getCryptoPositions(): Promise<CryptoPosition[]>;
  getOpenCryptoPositions(): Promise<CryptoPosition[]>;
  getCryptoPositionsByWallet(walletId: number): Promise<CryptoPosition[]>;
  getCryptoPositionsByAlgorithm(algorithmId: number): Promise<CryptoPosition[]>;
  updateCryptoPosition(id: number, position: Partial<CryptoPosition>): Promise<CryptoPosition | null>;
  closeCryptoPosition(id: number, reason?: string): Promise<CryptoPosition | null>;

  // Web3 Withdrawal methods
  createWeb3Withdrawal(withdrawal: InsertWeb3Withdrawal): Promise<Web3Withdrawal>;
  getWeb3Withdrawals(): Promise<Web3Withdrawal[]>;
  getWeb3WithdrawalsByWallet(walletId: number): Promise<Web3Withdrawal[]>;
  updateWeb3Withdrawal(id: number, withdrawal: Partial<Web3Withdrawal>): Promise<Web3Withdrawal | null>;
  confirmWeb3Withdrawal(id: number, txHash: string): Promise<Web3Withdrawal | null>;

  // Tax Records methods
  createTaxRecord(taxRecord: any): Promise<any>;
  getTaxRecords(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private connections: Map<number, Connection>;
  private accounts: Map<number, Account>;
  private apiActivities: ApiActivity[];
  private connectionHealths: Map<number, ConnectionHealth>;
  private achRelationships: Map<number, AchRelationship>;
  private achTransfers: Map<number, AchTransfer>;
  private brokerAccounts: Map<string, BrokerAccount>;
  private brokerBankAccounts: Map<string, BrokerBankAccount>;
  private brokerTransfers: Map<string, BrokerTransfer>;
  private tradingAssets: Map<string, TradingAsset>;
  private jsonTransfers: Map<number, JsonTransfer>;
  private tradingAlgorithms: Map<number, TradingAlgorithm>;
  private aiPositions: Map<number, AiPosition>;
  private aiTrades: Map<number, AiTrade>;
  private marketSignals: Map<number, MarketSignal>;
  private aiPerformances: Map<string, AiPerformance>; // key: algorithmId-date
  private web3Wallets: Map<number, Web3Wallet>;
  private cryptoTradingPairs: Map<number, CryptoTradingPair>;
  private cryptoOrders: Map<number, CryptoOrder>;
  private cryptoPositions: Map<number, CryptoPosition>;
  private web3Withdrawals: Map<number, Web3Withdrawal>;
  private dexLiquidity: Map<number, DexLiquidity>;
  private taxRecords: Map<number, any>;
  private currentConnectionId: number;
  private currentAccountId: number;
  private currentApiActivityId: number;
  private currentHealthId: number;
  private currentAchRelationshipId: number;
  private currentAchTransferId: number;
  private currentBrokerAccountId: number;
  private currentBrokerBankAccountId: number;
  private currentBrokerTransferId: number;
  private currentTradingAssetId: number;
  private currentAlgorithmId: number;
  private currentAiPositionId: number;
  private currentAiTradeId: number;
  private currentMarketSignalId: number;
  private currentJsonTransferId: number;
  private currentWeb3WalletId: number;
  private currentCryptoTradingPairId: number;
  private currentCryptoOrderId: number;
  private currentCryptoPositionId: number;
  private currentWeb3WithdrawalId: number;
  private currentDexLiquidityId: number;
  private currentTaxRecordId: number;

  constructor() {
    this.connections = new Map();
    this.accounts = new Map();
    this.apiActivities = [];
    this.connectionHealths = new Map();
    this.achRelationships = new Map();
    this.achTransfers = new Map();
    this.brokerAccounts = new Map();
    this.brokerBankAccounts = new Map();
    this.brokerTransfers = new Map();
    this.tradingAssets = new Map();
    this.jsonTransfers = new Map();
    this.tradingAlgorithms = new Map();
    this.aiPositions = new Map();
    this.aiTrades = new Map();
    this.marketSignals = new Map();
    this.aiPerformances = new Map();
    this.web3Wallets = new Map();
    this.cryptoTradingPairs = new Map();
    this.cryptoOrders = new Map();
    this.cryptoPositions = new Map();
    this.web3Withdrawals = new Map();
    this.dexLiquidity = new Map();
    this.taxRecords = new Map();
    this.currentConnectionId = 1;
    this.currentAccountId = 1;
    this.currentApiActivityId = 1;
    this.currentHealthId = 1;
    this.currentAchRelationshipId = 1;
    this.currentAchTransferId = 1;
    this.currentBrokerAccountId = 1;
    this.currentBrokerBankAccountId = 1;
    this.currentBrokerTransferId = 1;
    this.currentTradingAssetId = 1;
    this.currentAlgorithmId = 1;
    this.currentAiPositionId = 1;
    this.currentAiTradeId = 1;
    this.currentMarketSignalId = 1;
    this.currentJsonTransferId = 1;
    this.currentWeb3WalletId = 1;
    this.currentCryptoTradingPairId = 1;
    this.currentCryptoOrderId = 1;
    this.currentCryptoPositionId = 1;
    this.currentWeb3WithdrawalId = 1;
    this.currentDexLiquidityId = 1;
    this.currentTaxRecordId = 1;
  }

  async createConnection(insertConnection: InsertConnection): Promise<Connection> {
    const id = this.currentConnectionId++;
    const connection: Connection = {
      ...insertConnection,
      id,
      status: insertConnection.status || 'PENDING',
      lastVerified: null,
      createdAt: new Date(),
    };
    this.connections.set(id, connection);
    return connection;
  }

  async getConnection(id: number): Promise<Connection | undefined> {
    return this.connections.get(id);
  }

  async getConnectionByType(type: string): Promise<Connection | undefined> {
    return Array.from(this.connections.values()).find(conn => conn.type === type);
  }

  async getAllConnections(): Promise<Connection[]> {
    return Array.from(this.connections.values());
  }

  async updateConnectionStatus(id: number, status: string, lastVerified?: Date): Promise<Connection> {
    const connection = this.connections.get(id);
    if (!connection) {
      throw new Error(`Connection with id ${id} not found`);
    }
    
    const updated = {
      ...connection,
      status,
      lastVerified: lastVerified || new Date(),
    };
    
    this.connections.set(id, updated);
    return updated;
  }

  async updateConnectionEndpoint(id: number, endpoint: string): Promise<Connection> {
    const connection = this.connections.get(id);
    if (!connection) {
      throw new Error(`Connection with id ${id} not found`);
    }
    
    const updated = {
      ...connection,
      endpoint,
    };
    
    this.connections.set(id, updated);
    return updated;
  }

  async updateConnectionCredentials(id: number, apiKey: string, secretKey: string): Promise<Connection> {
    const connection = this.connections.get(id);
    if (!connection) {
      throw new Error(`Connection with id ${id} not found`);
    }
    
    const updated = {
      ...connection,
      apiKey,
      secretKey,
    };
    
    this.connections.set(id, updated);
    return updated;
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const id = this.currentAccountId++;
    const account: Account = {
      ...insertAccount,
      id,
      status: insertAccount.status || 'ACTIVE',
      createdAt: insertAccount.createdAt || new Date(),
      updatedAt: new Date(),
      accountNumber: insertAccount.accountNumber || null,
      accountType: insertAccount.accountType || null,
      buyingPower: insertAccount.buyingPower || null,
      cash: insertAccount.cash || null,
      portfolioValue: insertAccount.portfolioValue || null,
      dayTradingBuyingPower: insertAccount.dayTradingBuyingPower || null,
      permissions: insertAccount.permissions || null,
      linkedBrokerAccountId: insertAccount.linkedBrokerAccountId || null,
      positionsCount: insertAccount.positionsCount || 0,
    };
    this.accounts.set(id, account);
    return account;
  }

  async getAccountByConnectionId(connectionId: number): Promise<Account | undefined> {
    return Array.from(this.accounts.values()).find(acc => acc.connectionId === connectionId);
  }

  async updateAccount(connectionId: number, updates: Partial<Account>): Promise<Account> {
    const existing = Array.from(this.accounts.values()).find(acc => acc.connectionId === connectionId);
    if (!existing) {
      throw new Error(`Account for connection ${connectionId} not found`);
    }
    
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date(),
    };
    
    this.accounts.set(existing.id, updated);
    return updated;
  }

  async deleteAccountByConnectionId(connectionId: number): Promise<void> {
    const existing = Array.from(this.accounts.values()).find(acc => acc.connectionId === connectionId);
    if (existing) {
      this.accounts.delete(existing.id);
    }
  }

  async createApiActivity(insertActivity: InsertApiActivity): Promise<ApiActivity> {
    const id = this.currentApiActivityId++;
    const activity: ApiActivity = {
      ...insertActivity,
      id,
      timestamp: new Date(),
    };
    this.apiActivities.push(activity);
    
    // Keep only the last 100 activities
    if (this.apiActivities.length > 100) {
      this.apiActivities = this.apiActivities.slice(-100);
    }
    
    return activity;
  }

  async getRecentApiActivity(limit: number = 10): Promise<ApiActivity[]> {
    return this.apiActivities
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, limit);
  }

  async createOrUpdateConnectionHealth(insertHealth: InsertConnectionHealth): Promise<ConnectionHealth> {
    const existing = Array.from(this.connectionHealths.values())
      .find(h => h.connectionId === insertHealth.connectionId);
    
    if (existing) {
      const updated = {
        ...existing,
        ...insertHealth,
        responseTime: insertHealth.responseTime || existing.responseTime,
        rateLimit: insertHealth.rateLimit || existing.rateLimit,
        rateLimitUsed: insertHealth.rateLimitUsed || existing.rateLimitUsed,
        lastError: insertHealth.lastError || existing.lastError,
        updatedAt: new Date(),
      };
      this.connectionHealths.set(existing.id, updated);
      return updated;
    } else {
      const id = this.currentHealthId++;
      const health: ConnectionHealth = {
        ...insertHealth,
        id,
        responseTime: insertHealth.responseTime || null,
        rateLimit: insertHealth.rateLimit || null,
        rateLimitUsed: insertHealth.rateLimitUsed || null,
        lastError: insertHealth.lastError || null,
        updatedAt: new Date(),
      };
      this.connectionHealths.set(id, health);
      return health;
    }
  }

  async getConnectionHealth(connectionId: number): Promise<ConnectionHealth | undefined> {
    return Array.from(this.connectionHealths.values())
      .find(h => h.connectionId === connectionId);
  }

  async getAllConnectionHealth(): Promise<ConnectionHealth[]> {
    return Array.from(this.connectionHealths.values());
  }

  // Reset all data
  async reset(): Promise<void> {
    this.connections.clear();
    this.accounts.clear();
    this.apiActivities = [];
    this.connectionHealths.clear();
    this.achRelationships.clear();
    this.achTransfers.clear();
    this.currentConnectionId = 1;
    this.currentAccountId = 1;
    this.currentApiActivityId = 1;
    this.currentHealthId = 1;
    this.currentAchRelationshipId = 1;
    this.currentAchTransferId = 1;
  }

  // ACH Relationship methods
  async createAchRelationship(insertRelationship: InsertAchRelationship): Promise<AchRelationship> {
    const id = this.currentAchRelationshipId++;
    const relationship: AchRelationship = {
      ...insertRelationship,
      id,
      status: insertRelationship.status || 'PENDING',
      nickname: insertRelationship.nickname || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.achRelationships.set(id, relationship);
    return relationship;
  }

  async getAchRelationships(accountId: string): Promise<AchRelationship[]> {
    return Array.from(this.achRelationships.values())
      .filter(rel => rel.accountId === accountId);
  }

  async updateAchRelationshipStatus(id: number, status: string): Promise<AchRelationship> {
    const relationship = this.achRelationships.get(id);
    if (!relationship) {
      throw new Error('ACH relationship not found');
    }
    const updated = { ...relationship, status, updatedAt: new Date() };
    this.achRelationships.set(id, updated);
    return updated;
  }

  // ACH Transfer methods
  async createAchTransfer(insertTransfer: InsertAchTransfer): Promise<AchTransfer> {
    const id = this.currentAchTransferId++;
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Expires in 7 days
    
    const transfer: AchTransfer = {
      ...insertTransfer,
      id,
      status: insertTransfer.status || 'PENDING',
      transferType: insertTransfer.transferType || 'ACH',
      createdAt: new Date(),
      updatedAt: new Date(),
      expiresAt,
    };
    this.achTransfers.set(id, transfer);
    return transfer;
  }

  async getAchTransfers(accountId: string): Promise<AchTransfer[]> {
    return Array.from(this.achTransfers.values())
      .filter(transfer => transfer.accountId === accountId);
  }

  async updateAchTransferStatus(id: number, status: string): Promise<AchTransfer> {
    const transfer = this.achTransfers.get(id);
    if (!transfer) {
      throw new Error('ACH transfer not found');
    }
    const updated = { ...transfer, status, updatedAt: new Date() };
    this.achTransfers.set(id, updated);
    return updated;
  }

  // Broker Account methods
  async createBrokerAccount(insertAccount: InsertBrokerAccount): Promise<BrokerAccount> {
    const id = this.currentBrokerAccountId++;
    const account: BrokerAccount = {
      ...insertAccount,
      id,
      currency: insertAccount.currency || 'USD',
      lastEquity: insertAccount.lastEquity || null,
      cryptoStatus: insertAccount.cryptoStatus || null,
      contactEmail: insertAccount.contactEmail || null,
      contactPhone: insertAccount.contactPhone || null,
      contactAddress: insertAccount.contactAddress || null,
      contactCity: insertAccount.contactCity || null,
      contactState: insertAccount.contactState || null,
      contactPostalCode: insertAccount.contactPostalCode || null,
      identityGivenName: insertAccount.identityGivenName || null,
      identityFamilyName: insertAccount.identityFamilyName || null,
      identityDateOfBirth: insertAccount.identityDateOfBirth || null,
      tradingType: insertAccount.tradingType || null,
      enabledAssets: insertAccount.enabledAssets || null,
      updatedAt: new Date(),
    };
    this.brokerAccounts.set(insertAccount.accountId, account);
    return account;
  }

  async getBrokerAccountByConnectionId(connectionId: number): Promise<BrokerAccount | undefined> {
    return Array.from(this.brokerAccounts.values())
      .find(account => account.connectionId === connectionId);
  }

  async getBrokerAccountById(accountId: string): Promise<BrokerAccount | undefined> {
    return this.brokerAccounts.get(accountId);
  }

  async updateBrokerAccount(accountId: string, updates: Partial<BrokerAccount>): Promise<BrokerAccount> {
    const existing = this.brokerAccounts.get(accountId);
    if (!existing) {
      throw new Error('Broker account not found');
    }
    const updated = { ...existing, ...updates, updatedAt: new Date() };
    this.brokerAccounts.set(accountId, updated);
    return updated;
  }

  // Broker Bank Account methods
  async createBrokerBankAccount(insertBankAccount: InsertBrokerBankAccount): Promise<BrokerBankAccount> {
    const id = this.currentBrokerBankAccountId++;
    const bankAccount: BrokerBankAccount = {
      ...insertBankAccount,
      id,
      status: insertBankAccount.status || 'QUEUED',
      nickname: insertBankAccount.nickname || null,
      processorToken: insertBankAccount.processorToken || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.brokerBankAccounts.set(insertBankAccount.relationshipId, bankAccount);
    return bankAccount;
  }

  async getBrokerBankAccounts(brokerAccountId: string): Promise<BrokerBankAccount[]> {
    return Array.from(this.brokerBankAccounts.values())
      .filter(bankAccount => bankAccount.brokerAccountId === brokerAccountId);
  }

  async getBrokerBankAccountByRelationshipId(relationshipId: string): Promise<BrokerBankAccount | undefined> {
    return this.brokerBankAccounts.get(relationshipId);
  }

  async updateBrokerBankAccountStatus(relationshipId: string, status: string): Promise<BrokerBankAccount> {
    const bankAccount = this.brokerBankAccounts.get(relationshipId);
    if (!bankAccount) {
      throw new Error('Broker bank account not found');
    }
    const updated = { ...bankAccount, status, updatedAt: new Date() };
    this.brokerBankAccounts.set(relationshipId, updated);
    return updated;
  }

  // Broker Transfer methods
  async createBrokerTransfer(insertTransfer: InsertBrokerTransfer): Promise<BrokerTransfer> {
    const id = this.currentBrokerTransferId++;
    const transfer: BrokerTransfer = {
      ...insertTransfer,
      id,
      currency: insertTransfer.currency || 'USD',
      transferType: insertTransfer.transferType || 'ach',
      instantAmount: insertTransfer.instantAmount || '0',
      requestedAmount: insertTransfer.requestedAmount || null,
      fee: insertTransfer.fee || '0',
      feePaymentMethod: insertTransfer.feePaymentMethod || null,
      reason: insertTransfer.reason || null,
      holdUntil: insertTransfer.holdUntil || null,
      expiresAt: insertTransfer.expiresAt || null,
      updatedAt: new Date(),
    };
    this.brokerTransfers.set(insertTransfer.transferId, transfer);
    return transfer;
  }

  async getBrokerTransfers(brokerAccountId: string): Promise<BrokerTransfer[]> {
    return Array.from(this.brokerTransfers.values())
      .filter(transfer => transfer.brokerAccountId === brokerAccountId);
  }

  async getBrokerTransferById(transferId: string): Promise<BrokerTransfer | undefined> {
    return this.brokerTransfers.get(transferId);
  }

  async updateBrokerTransferStatus(transferId: string, status: string): Promise<BrokerTransfer> {
    const transfer = this.brokerTransfers.get(transferId);
    if (!transfer) {
      throw new Error('Broker transfer not found');
    }
    const updated = { ...transfer, status, updatedAt: new Date() };
    this.brokerTransfers.set(transferId, updated);
    return updated;
  }

  // Trading Asset methods
  async createTradingAsset(insertAsset: InsertTradingAsset): Promise<TradingAsset> {
    const id = this.currentTradingAssetId++;
    const asset: TradingAsset = {
      ...insertAsset,
      id,
      cusip: insertAsset.cusip || null,
      exchange: insertAsset.exchange || null,
      maintenanceMarginRequirement: insertAsset.maintenanceMarginRequirement || null,
      marginRequirementLong: insertAsset.marginRequirementLong || null,
      marginRequirementShort: insertAsset.marginRequirementShort || null,
      attributes: insertAsset.attributes || null,
      updatedAt: new Date(),
    };
    this.tradingAssets.set(insertAsset.assetId, asset);
    return asset;
  }

  async bulkCreateTradingAssets(assets: InsertTradingAsset[]): Promise<TradingAsset[]> {
    const createdAssets: TradingAsset[] = [];
    for (const insertAsset of assets) {
      const existing = this.tradingAssets.get(insertAsset.assetId);
      if (!existing) {
        const created = await this.createTradingAsset(insertAsset);
        createdAssets.push(created);
      }
    }
    return createdAssets;
  }

  async getTradingAssets(limit: number = 100): Promise<TradingAsset[]> {
    const assets = Array.from(this.tradingAssets.values());
    return assets.slice(0, limit);
  }

  async getTradingAssetBySymbol(symbol: string): Promise<TradingAsset | undefined> {
    return Array.from(this.tradingAssets.values())
      .find(asset => asset.symbol === symbol);
  }

  async searchTradingAssets(query: string): Promise<TradingAsset[]> {
    const lowercaseQuery = query.toLowerCase();
    return Array.from(this.tradingAssets.values())
      .filter(asset => 
        asset.symbol.toLowerCase().includes(lowercaseQuery) ||
        asset.name.toLowerCase().includes(lowercaseQuery)
      )
      .slice(0, 50);
  }

  // JSON Transfer methods
  async createJsonTransfer(insertTransfer: InsertJsonTransfer): Promise<JsonTransfer> {
    const id = this.currentJsonTransferId++;
    const transfer: JsonTransfer = {
      ...insertTransfer,
      id,
      status: insertTransfer.status || 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.jsonTransfers.set(id, transfer);
    return transfer;
  }

  async getJsonTransfer(id: number): Promise<JsonTransfer | undefined> {
    return this.jsonTransfers.get(id);
  }

  async getJsonTransfersByBrokerAccount(brokerAccountId: string): Promise<JsonTransfer[]> {
    return Array.from(this.jsonTransfers.values())
      .filter(transfer => transfer.fromBrokerAccountId === brokerAccountId);
  }

  async getJsonTransfersByTradingAccount(tradingAccountId: string): Promise<JsonTransfer[]> {
    return Array.from(this.jsonTransfers.values())
      .filter(transfer => transfer.toTradingAccountId === tradingAccountId);
  }

  async updateJsonTransferStatus(id: number, status: string): Promise<JsonTransfer> {
    const transfer = this.jsonTransfers.get(id);
    if (!transfer) {
      throw new Error('JSON transfer not found');
    }
    const updated = { ...transfer, status, updatedAt: new Date() };
    this.jsonTransfers.set(id, updated);
    return updated;
  }

  // AI Trading Algorithm methods
  async createTradingAlgorithm(algorithm: InsertTradingAlgorithm): Promise<TradingAlgorithm> {
    const id = this.currentAlgorithmId++;
    const tradingAlgorithm: TradingAlgorithm = {
      ...algorithm,
      id,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.tradingAlgorithms.set(id, tradingAlgorithm);
    return tradingAlgorithm;
  }

  async getTradingAlgorithm(id: number): Promise<TradingAlgorithm | undefined> {
    return this.tradingAlgorithms.get(id);
  }

  async getAllTradingAlgorithms(): Promise<TradingAlgorithm[]> {
    return Array.from(this.tradingAlgorithms.values());
  }

  async getActiveTradingAlgorithms(): Promise<TradingAlgorithm[]> {
    return Array.from(this.tradingAlgorithms.values())
      .filter(algo => algo.status === 'active');
  }

  async updateTradingAlgorithmStatus(id: number, status: string): Promise<TradingAlgorithm> {
    const algorithm = this.tradingAlgorithms.get(id);
    if (!algorithm) {
      throw new Error(`Trading algorithm with id ${id} not found`);
    }
    const updated = { ...algorithm, status, updatedAt: new Date() };
    this.tradingAlgorithms.set(id, updated);
    return updated;
  }

  async updateTradingAlgorithmConfig(id: number, config: any): Promise<TradingAlgorithm> {
    const algorithm = this.tradingAlgorithms.get(id);
    if (!algorithm) {
      throw new Error(`Trading algorithm with id ${id} not found`);
    }
    const updated = { ...algorithm, config, updatedAt: new Date() };
    this.tradingAlgorithms.set(id, updated);
    return updated;
  }

  // Web3 Withdrawal update method
  async updateWeb3Withdrawal(id: number, updates: Partial<Web3Withdrawal>): Promise<Web3Withdrawal> {
    const withdrawal = this.web3Withdrawals.get(id);
    if (!withdrawal) {
      throw new Error(`Web3 withdrawal with id ${id} not found`);
    }
    const updated = { ...withdrawal, ...updates, updatedAt: new Date() };
    this.web3Withdrawals.set(id, updated);
    return updated;
  }

  // AI Position methods
  async createAiPosition(position: InsertAiPosition): Promise<AiPosition> {
    const id = this.currentAiPositionId++;
    const aiPosition: AiPosition = {
      ...position,
      id,
      openedAt: new Date(),
      closedAt: null,
    };
    this.aiPositions.set(id, aiPosition);
    return aiPosition;
  }

  async getAiPosition(id: number): Promise<AiPosition | undefined> {
    return this.aiPositions.get(id);
  }

  async getAiPositionsByAlgorithm(algorithmId: number): Promise<AiPosition[]> {
    return Array.from(this.aiPositions.values())
      .filter(pos => pos.algorithmId === algorithmId);
  }

  async getOpenAiPositions(): Promise<AiPosition[]> {
    return Array.from(this.aiPositions.values())
      .filter(pos => pos.status === 'open');
  }

  async getAiPositionsBySymbol(symbol: string): Promise<AiPosition[]> {
    return Array.from(this.aiPositions.values())
      .filter(pos => pos.symbol === symbol);
  }

  async updateAiPosition(id: number, updates: Partial<AiPosition>): Promise<AiPosition> {
    const position = this.aiPositions.get(id);
    if (!position) {
      throw new Error(`AI position with id ${id} not found`);
    }
    const updated = { ...position, ...updates };
    this.aiPositions.set(id, updated);
    return updated;
  }

  async closeAiPosition(id: number, closedAt: Date, reason?: string): Promise<AiPosition> {
    const position = this.aiPositions.get(id);
    if (!position) {
      throw new Error(`AI position with id ${id} not found`);
    }
    const updated = { ...position, status: 'closed', closedAt, reason };
    this.aiPositions.set(id, updated);
    return updated;
  }

  // AI Trade methods
  async createAiTrade(trade: InsertAiTrade): Promise<AiTrade> {
    const id = this.currentAiTradeId++;
    const aiTrade: AiTrade = {
      ...trade,
      id,
      executedAt: new Date(),
      filledAt: null,
    };
    this.aiTrades.set(id, aiTrade);
    return aiTrade;
  }

  async getAiTrade(id: number): Promise<AiTrade | undefined> {
    return this.aiTrades.get(id);
  }

  async getAiTradesByAlgorithm(algorithmId: number): Promise<AiTrade[]> {
    return Array.from(this.aiTrades.values())
      .filter(trade => trade.algorithmId === algorithmId);
  }

  async getAiTradesByPosition(positionId: number): Promise<AiTrade[]> {
    return Array.from(this.aiTrades.values())
      .filter(trade => trade.positionId === positionId);
  }

  async getRecentAiTrades(limit: number = 50): Promise<AiTrade[]> {
    return Array.from(this.aiTrades.values())
      .sort((a, b) => b.executedAt.getTime() - a.executedAt.getTime())
      .slice(0, limit);
  }

  async updateAiTradeStatus(id: number, status: string, fillPrice?: string, filledAt?: Date): Promise<AiTrade> {
    const trade = this.aiTrades.get(id);
    if (!trade) {
      throw new Error(`AI trade with id ${id} not found`);
    }
    const updated = { ...trade, status, fillPrice, filledAt };
    this.aiTrades.set(id, updated);
    return updated;
  }

  // Market Signal methods
  async createMarketSignal(signal: InsertMarketSignal): Promise<MarketSignal> {
    const id = this.currentMarketSignalId++;
    const marketSignal: MarketSignal = {
      ...signal,
      id,
      createdAt: new Date(),
    };
    this.marketSignals.set(id, marketSignal);
    return marketSignal;
  }

  async getMarketSignals(symbol: string, timeframe?: string): Promise<MarketSignal[]> {
    return Array.from(this.marketSignals.values())
      .filter(signal => signal.symbol === symbol && (!timeframe || signal.timeframe === timeframe))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getRecentMarketSignals(limit: number = 100): Promise<MarketSignal[]> {
    return Array.from(this.marketSignals.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
      .slice(0, limit);
  }

  async getMarketSignalsByType(signalType: string): Promise<MarketSignal[]> {
    return Array.from(this.marketSignals.values())
      .filter(signal => signal.signalType === signalType)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // AI Performance methods
  async createAiPerformance(performance: InsertAiPerformance): Promise<AiPerformance> {
    const key = `${performance.algorithmId}-${performance.date.toISOString().split('T')[0]}`;
    const aiPerformance: AiPerformance = {
      ...performance,
      id: this.currentMarketSignalId++, // Reuse counter for simplicity
    };
    this.aiPerformances.set(key, aiPerformance);
    return aiPerformance;
  }

  async getAiPerformance(algorithmId: number, date: Date): Promise<AiPerformance | undefined> {
    const key = `${algorithmId}-${date.toISOString().split('T')[0]}`;
    return this.aiPerformances.get(key);
  }

  async getAiPerformanceHistory(algorithmId: number, days: number = 30): Promise<AiPerformance[]> {
    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000);
    
    return Array.from(this.aiPerformances.values())
      .filter(perf => 
        perf.algorithmId === algorithmId && 
        perf.date >= startDate && 
        perf.date <= endDate
      )
      .sort((a, b) => a.date.getTime() - b.date.getTime());
  }

  async updateAiPerformance(algorithmId: number, date: Date, updates: Partial<AiPerformance>): Promise<AiPerformance> {
    const key = `${algorithmId}-${date.toISOString().split('T')[0]}`;
    const performance = this.aiPerformances.get(key);
    if (!performance) {
      throw new Error(`AI performance record not found for algorithm ${algorithmId} on ${date.toISOString()}`);
    }
    const updated = { ...performance, ...updates };
    this.aiPerformances.set(key, updated);
    return updated;
  }

  // Web3 Wallet methods
  async createWeb3Wallet(wallet: InsertWeb3Wallet): Promise<Web3Wallet> {
    const id = this.currentWeb3WalletId++;
    const web3Wallet: Web3Wallet = {
      ...wallet,
      id,
      createdAt: new Date(),
    };
    this.web3Wallets.set(id, web3Wallet);
    return web3Wallet;
  }

  async getWeb3Wallets(): Promise<Web3Wallet[]> {
    return Array.from(this.web3Wallets.values());
  }

  async getWeb3WalletById(id: number): Promise<Web3Wallet | null> {
    return this.web3Wallets.get(id) || null;
  }

  async getWeb3WalletsByNetwork(network: string): Promise<Web3Wallet[]> {
    return Array.from(this.web3Wallets.values())
      .filter(wallet => wallet.network === network);
  }

  async updateWeb3Wallet(id: number, wallet: Partial<Web3Wallet>): Promise<Web3Wallet | null> {
    const existing = this.web3Wallets.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...wallet };
    this.web3Wallets.set(id, updated);
    return updated;
  }

  // Crypto Trading Pair methods
  async createCryptoTradingPair(pair: InsertCryptoTradingPair): Promise<CryptoTradingPair> {
    const id = this.currentCryptoTradingPairId++;
    const cryptoPair: CryptoTradingPair = {
      ...pair,
      id,
      createdAt: new Date(),
    };
    this.cryptoTradingPairs.set(id, cryptoPair);
    return cryptoPair;
  }

  async getCryptoTradingPairs(): Promise<CryptoTradingPair[]> {
    return Array.from(this.cryptoTradingPairs.values());
  }

  async getCryptoTradingPairById(id: number): Promise<CryptoTradingPair | null> {
    return this.cryptoTradingPairs.get(id) || null;
  }

  async getCryptoTradingPairBySymbol(symbol: string): Promise<CryptoTradingPair | null> {
    return Array.from(this.cryptoTradingPairs.values())
      .find(pair => pair.symbol === symbol) || null;
  }

  // Crypto Order methods
  async createCryptoOrder(order: InsertCryptoOrder): Promise<CryptoOrder> {
    const id = this.currentCryptoOrderId++;
    const cryptoOrder: CryptoOrder = {
      ...order,
      id,
      createdAt: new Date(),
    };
    this.cryptoOrders.set(id, cryptoOrder);
    return cryptoOrder;
  }

  async getCryptoOrders(): Promise<CryptoOrder[]> {
    return Array.from(this.cryptoOrders.values());
  }

  async getCryptoOrdersByWallet(walletId: number): Promise<CryptoOrder[]> {
    return Array.from(this.cryptoOrders.values())
      .filter(order => order.walletId === walletId);
  }

  async getCryptoOrdersByAlgorithm(algorithmId: number): Promise<CryptoOrder[]> {
    return Array.from(this.cryptoOrders.values())
      .filter(order => order.algorithmId === algorithmId);
  }

  async updateCryptoOrder(id: number, order: Partial<CryptoOrder>): Promise<CryptoOrder | null> {
    const existing = this.cryptoOrders.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...order };
    this.cryptoOrders.set(id, updated);
    return updated;
  }

  // Crypto Position methods
  async createCryptoPosition(position: InsertCryptoPosition): Promise<CryptoPosition> {
    const id = this.currentCryptoPositionId++;
    const cryptoPosition: CryptoPosition = {
      ...position,
      id,
      status: position.status || 'open',
      openedAt: new Date(),
    };
    this.cryptoPositions.set(id, cryptoPosition);
    return cryptoPosition;
  }

  async getCryptoPositions(): Promise<CryptoPosition[]> {
    return Array.from(this.cryptoPositions.values());
  }

  async getOpenCryptoPositions(): Promise<CryptoPosition[]> {
    return Array.from(this.cryptoPositions.values())
      .filter(position => position.status === 'open');
  }

  async getCryptoPositionsByWallet(walletId: number): Promise<CryptoPosition[]> {
    return Array.from(this.cryptoPositions.values())
      .filter(position => position.walletId === walletId);
  }

  async getCryptoPositionsByAlgorithm(algorithmId: number): Promise<CryptoPosition[]> {
    return Array.from(this.cryptoPositions.values())
      .filter(position => position.algorithmId === algorithmId);
  }

  async updateCryptoPosition(id: number, position: Partial<CryptoPosition>): Promise<CryptoPosition | null> {
    const existing = this.cryptoPositions.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...position };
    this.cryptoPositions.set(id, updated);
    return updated;
  }

  async closeCryptoPosition(id: number, reason?: string): Promise<CryptoPosition | null> {
    const existing = this.cryptoPositions.get(id);
    if (!existing) return null;
    const updated = { ...existing, status: 'closed', closedAt: new Date(), reason };
    this.cryptoPositions.set(id, updated);
    return updated;
  }

  // Web3 Withdrawal methods
  async createWeb3Withdrawal(withdrawal: InsertWeb3Withdrawal): Promise<Web3Withdrawal> {
    const id = this.currentWeb3WithdrawalId++;
    const web3Withdrawal: Web3Withdrawal = {
      ...withdrawal,
      id,
      createdAt: new Date(),
    };
    this.web3Withdrawals.set(id, web3Withdrawal);
    return web3Withdrawal;
  }

  async getWeb3Withdrawals(): Promise<Web3Withdrawal[]> {
    return Array.from(this.web3Withdrawals.values());
  }

  async getWeb3WithdrawalsByWallet(walletId: number): Promise<Web3Withdrawal[]> {
    return Array.from(this.web3Withdrawals.values())
      .filter(withdrawal => withdrawal.walletId === walletId);
  }

  async updateWeb3Withdrawal(id: number, withdrawal: Partial<Web3Withdrawal>): Promise<Web3Withdrawal | null> {
    const existing = this.web3Withdrawals.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...withdrawal };
    this.web3Withdrawals.set(id, updated);
    return updated;
  }

  // DEX Liquidity methods
  async createDexLiquidity(liquidity: InsertDexLiquidity): Promise<DexLiquidity> {
    const id = this.currentDexLiquidityId++;
    const dexLiquidity: DexLiquidity = {
      ...liquidity,
      id,
      createdAt: new Date(),
    };
    this.dexLiquidity.set(id, dexLiquidity);
    return dexLiquidity;
  }

  async getDexLiquidity(): Promise<DexLiquidity[]> {
    return Array.from(this.dexLiquidity.values());
  }

  async getDexLiquidityById(id: number): Promise<DexLiquidity | null> {
    return this.dexLiquidity.get(id) || null;
  }

  async updateDexLiquidity(id: number, liquidity: Partial<DexLiquidity>): Promise<DexLiquidity | null> {
    const existing = this.dexLiquidity.get(id);
    if (!existing) return null;
    const updated = { ...existing, ...liquidity };
    this.dexLiquidity.set(id, updated);
    return updated;
  }

  async confirmWeb3Withdrawal(id: number, txHash: string): Promise<Web3Withdrawal | null> {
    const existing = this.web3Withdrawals.get(id);
    if (!existing) return null;
    const updated = { ...existing, status: 'confirmed', txHash, updatedAt: new Date() };
    this.web3Withdrawals.set(id, updated);
    return updated;
  }

  // Tax Records methods
  async createTaxRecord(taxRecord: any): Promise<any> {
    const id = this.currentTaxRecordId++;
    const record = {
      ...taxRecord,
      id,
      createdAt: new Date()
    };
    this.taxRecords.set(id, record);
    return record;
  }

  async getTaxRecords(): Promise<any[]> {
    return Array.from(this.taxRecords.values());
  }

  // Alias methods for compatibility
  async getTradingAlgorithms(): Promise<TradingAlgorithm[]> {
    return this.getAllTradingAlgorithms();
  }
}

import { drizzle } from 'drizzle-orm/neon-http';
import { neon } from '@neondatabase/serverless';
import { eq, desc } from 'drizzle-orm';

// PostgreSQL Database Storage Implementation
class DatabaseStorage implements IStorage {
  private db;

  constructor() {
    const sql = neon(process.env.DATABASE_URL!);
    this.db = drizzle(sql);
  }

  // Connection methods
  async createConnection(connection: InsertConnection): Promise<Connection> {
    const [result] = await this.db.insert(connections).values(connection).returning();
    return result;
  }

  async getConnection(id: number): Promise<Connection | undefined> {
    const result = await this.db.select().from(connections).where(eq(connections.id, id));
    return result[0];
  }

  async getConnectionByType(type: string): Promise<Connection | undefined> {
    const result = await this.db.select().from(connections).where(eq(connections.type, type));
    return result[0];
  }

  async getAllConnections(): Promise<Connection[]> {
    return await this.db.select().from(connections);
  }

  async updateConnectionStatus(id: number, status: string, lastVerified?: Date): Promise<Connection> {
    const [result] = await this.db.update(connections)
      .set({ status, lastVerified })
      .where(eq(connections.id, id))
      .returning();
    return result;
  }

  async updateConnectionEndpoint(id: number, endpoint: string): Promise<Connection> {
    const [result] = await this.db.update(connections)
      .set({ endpoint })
      .where(eq(connections.id, id))
      .returning();
    return result;
  }

  async updateConnectionCredentials(id: number, apiKey: string, secretKey: string): Promise<Connection> {
    const [result] = await this.db.update(connections)
      .set({ apiKey, secretKey })
      .where(eq(connections.id, id))
      .returning();
    return result;
  }

  // Account methods
  async createAccount(account: InsertAccount): Promise<Account> {
    const [result] = await this.db.insert(accounts).values(account).returning();
    return result;
  }

  async getAccountByConnectionId(connectionId: number): Promise<Account | undefined> {
    const result = await this.db.select().from(accounts).where(eq(accounts.connectionId, connectionId));
    return result[0];
  }

  async updateAccount(connectionId: number, updates: Partial<Account>): Promise<Account> {
    const [result] = await this.db.update(accounts)
      .set(updates)
      .where(eq(accounts.connectionId, connectionId))
      .returning();
    return result;
  }

  async deleteAccountByConnectionId(connectionId: number): Promise<void> {
    await this.db.delete(accounts).where(eq(accounts.connectionId, connectionId));
  }

  // API Activity methods
  async createApiActivity(activity: InsertApiActivity): Promise<ApiActivity> {
    const [result] = await this.db.insert(apiActivity).values(activity).returning();
    return result;
  }

  async getRecentApiActivity(limit = 10): Promise<ApiActivity[]> {
    return await this.db.select().from(apiActivity).orderBy(desc(apiActivity.timestamp)).limit(limit);
  }

  // Connection Health methods
  async createOrUpdateConnectionHealth(health: InsertConnectionHealth): Promise<ConnectionHealth> {
    const existing = await this.db.select().from(connectionHealth).where(eq(connectionHealth.connectionId, health.connectionId));
    
    if (existing.length > 0) {
      const [result] = await this.db.update(connectionHealth)
        .set(health)
        .where(eq(connectionHealth.connectionId, health.connectionId))
        .returning();
      return result;
    } else {
      const [result] = await this.db.insert(connectionHealth).values(health).returning();
      return result;
    }
  }

  async getConnectionHealth(connectionId: number): Promise<ConnectionHealth | undefined> {
    const result = await this.db.select().from(connectionHealth).where(eq(connectionHealth.connectionId, connectionId));
    return result[0];
  }

  async getAllConnectionHealth(): Promise<ConnectionHealth[]> {
    return await this.db.select().from(connectionHealth);
  }

  // Trading Algorithm methods
  async createTradingAlgorithm(algorithm: InsertTradingAlgorithm): Promise<TradingAlgorithm> {
    const [result] = await this.db.insert(tradingAlgorithms).values(algorithm).returning();
    return result;
  }

  async getAllTradingAlgorithms(): Promise<TradingAlgorithm[]> {
    return await this.db.select().from(tradingAlgorithms);
  }

  async getTradingAlgorithmById(id: number): Promise<TradingAlgorithm | null> {
    const result = await this.db.select().from(tradingAlgorithms).where(eq(tradingAlgorithms.id, id));
    return result[0] || null;
  }

  async updateTradingAlgorithm(id: number, algorithm: Partial<TradingAlgorithm>): Promise<TradingAlgorithm | null> {
    const [result] = await this.db.update(tradingAlgorithms)
      .set(algorithm)
      .where(eq(tradingAlgorithms.id, id))
      .returning();
    return result || null;
  }

  async deleteTradingAlgorithm(id: number): Promise<void> {
    await this.db.delete(tradingAlgorithms).where(eq(tradingAlgorithms.id, id));
  }

  // AI Position methods
  async createAiPosition(position: InsertAiPosition): Promise<AiPosition> {
    const [result] = await this.db.insert(aiPositions).values(position).returning();
    return result;
  }

  async getAiPositions(): Promise<AiPosition[]> {
    return await this.db.select().from(aiPositions);
  }

  async getOpenAiPositions(): Promise<AiPosition[]> {
    return await this.db.select().from(aiPositions).where(eq(aiPositions.status, 'open'));
  }

  async getAiPositionsByAlgorithm(algorithmId: number): Promise<AiPosition[]> {
    return await this.db.select().from(aiPositions).where(eq(aiPositions.algorithmId, algorithmId));
  }

  async updateAiPosition(id: number, position: Partial<AiPosition>): Promise<AiPosition | null> {
    const [result] = await this.db.update(aiPositions)
      .set(position)
      .where(eq(aiPositions.id, id))
      .returning();
    return result || null;
  }

  async closeAiPosition(id: number, reason?: string): Promise<AiPosition | null> {
    const [result] = await this.db.update(aiPositions)
      .set({ status: 'closed', closedAt: new Date(), reason })
      .where(eq(aiPositions.id, id))
      .returning();
    return result || null;
  }

  // Crypto Position methods
  async createCryptoPosition(position: InsertCryptoPosition): Promise<CryptoPosition> {
    const [result] = await this.db.insert(cryptoPositions).values(position).returning();
    return result;
  }

  async getCryptoPositions(): Promise<CryptoPosition[]> {
    return await this.db.select().from(cryptoPositions);
  }

  async getOpenCryptoPositions(): Promise<CryptoPosition[]> {
    return await this.db.select().from(cryptoPositions).where(eq(cryptoPositions.status, 'open'));
  }

  async getCryptoPositionsByWallet(walletId: number): Promise<CryptoPosition[]> {
    return await this.db.select().from(cryptoPositions).where(eq(cryptoPositions.walletId, walletId));
  }

  async getCryptoPositionsByAlgorithm(algorithmId: number): Promise<CryptoPosition[]> {
    return await this.db.select().from(cryptoPositions).where(eq(cryptoPositions.algorithmId, algorithmId));
  }

  async updateCryptoPosition(id: number, position: Partial<CryptoPosition>): Promise<CryptoPosition | null> {
    const [result] = await this.db.update(cryptoPositions)
      .set(position)
      .where(eq(cryptoPositions.id, id))
      .returning();
    return result || null;
  }

  async closeCryptoPosition(id: number, reason?: string): Promise<CryptoPosition | null> {
    const [result] = await this.db.update(cryptoPositions)
      .set({ status: 'closed', closedAt: new Date(), reason })
      .where(eq(cryptoPositions.id, id))
      .returning();
    return result || null;
  }

  // Web3 Withdrawal methods
  async createWeb3Withdrawal(withdrawal: InsertWeb3Withdrawal): Promise<Web3Withdrawal> {
    const [result] = await this.db.insert(web3Withdrawals).values(withdrawal).returning();
    return result;
  }

  async getWeb3Withdrawals(): Promise<Web3Withdrawal[]> {
    return await this.db.select().from(web3Withdrawals);
  }

  async getWeb3WithdrawalsByWallet(walletId: number): Promise<Web3Withdrawal[]> {
    return await this.db.select().from(web3Withdrawals).where(eq(web3Withdrawals.walletId, walletId));
  }

  async updateWeb3Withdrawal(id: number, withdrawal: Partial<Web3Withdrawal>): Promise<Web3Withdrawal | null> {
    const [result] = await this.db.update(web3Withdrawals)
      .set(withdrawal)
      .where(eq(web3Withdrawals.id, id))
      .returning();
    return result || null;
  }

  async confirmWeb3Withdrawal(id: number, txHash: string): Promise<Web3Withdrawal | null> {
    const [result] = await this.db.update(web3Withdrawals)
      .set({ status: 'confirmed', txHash, updatedAt: new Date() })
      .where(eq(web3Withdrawals.id, id))
      .returning();
    return result || null;
  }

  // Web3 Wallet methods
  async createWeb3Wallet(wallet: InsertWeb3Wallet): Promise<Web3Wallet> {
    const [result] = await this.db.insert(web3Wallets).values(wallet).returning();
    return result;
  }

  async getWeb3Wallets(): Promise<Web3Wallet[]> {
    return await this.db.select().from(web3Wallets);
  }

  async getWeb3WalletById(id: number): Promise<Web3Wallet | null> {
    const result = await this.db.select().from(web3Wallets).where(eq(web3Wallets.id, id));
    return result[0] || null;
  }

  async updateWeb3Wallet(id: number, wallet: Partial<Web3Wallet>): Promise<Web3Wallet | null> {
    const [result] = await this.db.update(web3Wallets)
      .set(wallet)
      .where(eq(web3Wallets.id, id))
      .returning();
    return result || null;
  }

  // Compatibility methods
  async getTradingAlgorithms(): Promise<TradingAlgorithm[]> {
    return this.getAllTradingAlgorithms();
  }

  // Placeholder methods for other entities (implement as needed)
  async createAchRelationship(relationship: InsertAchRelationship): Promise<AchRelationship> {
    throw new Error('Not implemented');
  }
  async getAchRelationships(): Promise<AchRelationship[]> {
    throw new Error('Not implemented');
  }
  async createAchTransfer(transfer: InsertAchTransfer): Promise<AchTransfer> {
    throw new Error('Not implemented');
  }
  async getAchTransfers(): Promise<AchTransfer[]> {
    throw new Error('Not implemented');
  }
  async createBrokerAccount(account: InsertBrokerAccount): Promise<BrokerAccount> {
    throw new Error('Not implemented');
  }
  async getBrokerAccounts(): Promise<BrokerAccount[]> {
    throw new Error('Not implemented');
  }
  async getBrokerAccountById(id: string): Promise<BrokerAccount | null> {
    throw new Error('Not implemented');
  }
  async updateBrokerAccount(id: string, account: Partial<BrokerAccount>): Promise<BrokerAccount | null> {
    throw new Error('Not implemented');
  }
  async createBrokerBankAccount(account: InsertBrokerBankAccount): Promise<BrokerBankAccount> {
    throw new Error('Not implemented');
  }
  async getBrokerBankAccounts(): Promise<BrokerBankAccount[]> {
    throw new Error('Not implemented');
  }
  async createBrokerTransfer(transfer: InsertBrokerTransfer): Promise<BrokerTransfer> {
    throw new Error('Not implemented');
  }
  async getBrokerTransfers(): Promise<BrokerTransfer[]> {
    throw new Error('Not implemented');
  }
  async createTradingAsset(asset: InsertTradingAsset): Promise<TradingAsset> {
    throw new Error('Not implemented');
  }
  async getTradingAssets(): Promise<TradingAsset[]> {
    throw new Error('Not implemented');
  }
  async createJsonTransfer(transfer: InsertJsonTransfer): Promise<JsonTransfer> {
    throw new Error('Not implemented');
  }
  async getJsonTransfers(): Promise<JsonTransfer[]> {
    throw new Error('Not implemented');
  }
  async getJsonTransfersByBrokerAccount(brokerAccountId: string): Promise<JsonTransfer[]> {
    throw new Error('Not implemented');
  }
  async updateJsonTransfer(id: number, transfer: Partial<JsonTransfer>): Promise<JsonTransfer | null> {
    throw new Error('Not implemented');
  }
  async createAiTrade(trade: InsertAiTrade): Promise<AiTrade> {
    throw new Error('Not implemented');
  }
  async getAiTrades(): Promise<AiTrade[]> {
    throw new Error('Not implemented');
  }
  async createMarketSignal(signal: InsertMarketSignal): Promise<MarketSignal> {
    const [result] = await this.db.insert(marketSignals).values(signal).returning();
    return result;
  }
  async getMarketSignals(): Promise<MarketSignal[]> {
    return await this.db.select().from(marketSignals);
  }
  async getMarketSignalsByType(signalType: string): Promise<MarketSignal[]> {
    return await this.db.select().from(marketSignals).where(eq(marketSignals.signalType, signalType));
  }
  async getRecentMarketSignals(limit = 100): Promise<MarketSignal[]> {
    return await this.db.select().from(marketSignals).orderBy(desc(marketSignals.createdAt)).limit(limit);
  }
  async createAiPerformance(performance: InsertAiPerformance): Promise<AiPerformance> {
    throw new Error('Not implemented');
  }
  async getAiPerformances(): Promise<AiPerformance[]> {
    throw new Error('Not implemented');
  }
  async createCryptoTradingPair(pair: InsertCryptoTradingPair): Promise<CryptoTradingPair> {
    const [result] = await this.db.insert(cryptoTradingPairs).values(pair).returning();
    return result;
  }
  async getCryptoTradingPairs(): Promise<CryptoTradingPair[]> {
    return await this.db.select().from(cryptoTradingPairs);
  }
  async getCryptoTradingPairBySymbol(symbol: string): Promise<CryptoTradingPair | null> {
    const result = await this.db.select().from(cryptoTradingPairs).where(eq(cryptoTradingPairs.symbol, symbol));
    return result[0] || null;
  }
  async createCryptoOrder(order: InsertCryptoOrder): Promise<CryptoOrder> {
    const [result] = await this.db.insert(cryptoOrders).values(order).returning();
    return result;
  }
  async getCryptoOrders(): Promise<CryptoOrder[]> {
    return await this.db.select().from(cryptoOrders);
  }
  async getCryptoOrdersByWallet(walletId: number): Promise<CryptoOrder[]> {
    return await this.db.select().from(cryptoOrders).where(eq(cryptoOrders.walletId, walletId));
  }
  async getCryptoOrdersByAlgorithm(algorithmId: number): Promise<CryptoOrder[]> {
    return await this.db.select().from(cryptoOrders).where(eq(cryptoOrders.algorithmId, algorithmId));
  }
  async updateCryptoOrder(id: number, order: Partial<CryptoOrder>): Promise<CryptoOrder | null> {
    const [result] = await this.db.update(cryptoOrders)
      .set(order)
      .where(eq(cryptoOrders.id, id))
      .returning();
    return result || null;
  }
  async createDexLiquidity(liquidity: InsertDexLiquidity): Promise<DexLiquidity> {
    throw new Error('Not implemented');
  }
  async getDexLiquidity(): Promise<DexLiquidity[]> {
    throw new Error('Not implemented');
  }
  async getDexLiquidityById(id: number): Promise<DexLiquidity | null> {
    throw new Error('Not implemented');
  }
  async updateDexLiquidity(id: number, liquidity: Partial<DexLiquidity>): Promise<DexLiquidity | null> {
    throw new Error('Not implemented');
  }
}

// Use memory storage temporarily to get app running
export const storage = new MemStorage();
