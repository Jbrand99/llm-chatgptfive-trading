import crypto from 'crypto';
import axios from 'axios';
import WebSocket from 'ws';

export interface OrderRequest {
  instrument_name: string;
  side: 'BUY' | 'SELL';
  type: 'LIMIT' | 'MARKET' | 'STOP_LOSS' | 'STOP_LIMIT' | 'TAKE_PROFIT' | 'TAKE_PROFIT_LIMIT';
  quantity: string;
  price?: string;
  client_oid?: string;
  time_in_force?: 'GOOD_TILL_CANCEL' | 'FILL_OR_KILL' | 'IMMEDIATE_OR_CANCEL';
  exec_inst?: string[];
}

export interface WithdrawalRequest {
  currency: string;
  amount: string;
  address: string;
  address_tag?: string;
  client_wid?: string;
}

export class CryptocomExchangeService {
  private apiKey: string;
  private secretKey: string;
  private baseUrl: string;
  private wsUrl: string;
  private ws: WebSocket | null = null;

  constructor() {
    this.apiKey = process.env.CRYPTOCOM_API_KEY || '';
    this.secretKey = process.env.CRYPTOCOM_SECRET_KEY || '';
    this.baseUrl = 'https://api.crypto.com/exchange/v1';
    this.wsUrl = 'wss://stream.crypto.com/exchange/v1/user';
  }

  private generateSignature(method: string, id: number, apiKey: string, params: any, nonce: number): string {
    const isObject = (obj: any) => obj !== undefined && obj !== null && obj.constructor === Object;
    const isArray = (obj: any) => obj !== undefined && obj !== null && obj.constructor === Array;
    
    const arrayToString = (obj: any[]): string => {
      return obj.reduce((a, b) => {
        return a + (isObject(b) ? objectToString(b) : (isArray(b) ? arrayToString(b) : b));
      }, "");
    };
    
    const objectToString = (obj: any): string => {
      if (obj == null) return "";
      return Object.keys(obj).sort().reduce((a, b) => {
        return a + b + (isArray(obj[b]) ? arrayToString(obj[b]) : (isObject(obj[b]) ? objectToString(obj[b]) : obj[b]));
      }, "");
    };

    const paramsString = objectToString(params);
    const sigPayload = method + id + apiKey + paramsString + nonce;
    
    return crypto.createHmac('sha256', this.secretKey).update(sigPayload).digest('hex');
  }

  private async makeRequest(method: string, params: any = {}): Promise<any> {
    const id = Date.now();
    const nonce = Date.now();
    
    const requestBody: any = {
      id,
      method,
      api_key: this.apiKey,
      params,
      nonce
    };

    const signature = this.generateSignature(method, id, this.apiKey, params, nonce);
    requestBody.sig = signature;

    try {
      const response = await axios.post(this.baseUrl, requestBody, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (response.data.code === 0) {
        return response.data.result;
      } else {
        throw new Error(`API Error: ${response.data.code} - ${response.data.message}`);
      }
    } catch (error: any) {
      console.error(`❌ Crypto.com Exchange API error:`, error.response?.data || error.message);
      throw error;
    }
  }

  async getAccountSummary(): Promise<any> {
    return await this.makeRequest('private/get-account-summary');
  }

  async getBalance(): Promise<any> {
    return await this.makeRequest('private/user-balance');
  }

  async createOrder(orderRequest: OrderRequest): Promise<any> {
    console.log(`📝 CRYPTO.COM EXCHANGE ORDER: ${orderRequest.side} ${orderRequest.quantity} ${orderRequest.instrument_name}`);
    
    const result = await this.makeRequest('private/create-order', orderRequest);
    
    console.log(`✅ ORDER CREATED: ID ${result.order_id}`);
    return result;
  }

  async cancelOrder(orderId: string, instrumentName: string): Promise<any> {
    return await this.makeRequest('private/cancel-order', {
      order_id: orderId,
      instrument_name: instrumentName
    });
  }

  async getOpenOrders(instrumentName?: string): Promise<any> {
    const params = instrumentName ? { instrument_name: instrumentName } : {};
    return await this.makeRequest('private/get-open-orders', params);
  }

  async getTrades(instrumentName?: string): Promise<any> {
    const params = instrumentName ? { instrument_name: instrumentName } : {};
    return await this.makeRequest('private/get-trades', params);
  }

  async createWithdrawal(withdrawalRequest: WithdrawalRequest): Promise<any> {
    console.log(`💸 CRYPTO.COM EXCHANGE WITHDRAWAL: ${withdrawalRequest.amount} ${withdrawalRequest.currency}`);
    console.log(`🎯 To address: ${withdrawalRequest.address}`);
    
    try {
      const result = await this.makeRequest('private/create-withdrawal', withdrawalRequest);
      
      console.log(`✅ WITHDRAWAL CREATED: ID ${result.id}`);
      console.log(`🔗 Status: ${result.status}`);
      
      return result;
    } catch (error) {
      console.error(`❌ Withdrawal failed:`, error);
      throw error;
    }
  }

  async getWithdrawalHistory(): Promise<any> {
    return await this.makeRequest('private/get-withdrawal-history');
  }

  async connectWebSocket(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.ws = new WebSocket(this.wsUrl);
      
      this.ws.on('open', () => {
        console.log('🌐 Connected to Crypto.com Exchange WebSocket');
        setTimeout(() => {
          this.authenticateWebSocket().then(resolve).catch(reject);
        }, 1000);
      });

      this.ws.on('message', (data: Buffer) => {
        const message = JSON.parse(data.toString());
        this.handleWebSocketMessage(message);
      });

      this.ws.on('error', (error: Error) => {
        console.error('❌ WebSocket error:', error);
        reject(error);
      });

      this.ws.on('close', () => {
        console.log('🔌 WebSocket connection closed');
        this.ws = null;
      });
    });
  }

  private async authenticateWebSocket(): Promise<void> {
    const id = Date.now();
    const nonce = Date.now();
    
    const method = 'public/auth';
    const params = {};
    
    const signature = this.generateSignature(method, id, this.apiKey, params, nonce);
    
    const authMessage = {
      id,
      method,
      api_key: this.apiKey,
      sig: signature,
      nonce
    };

    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(authMessage));
    }
  }

  private handleWebSocketMessage(message: any): void {
    if (message.method === 'public/auth' && message.code === 0) {
      console.log('✅ WebSocket authenticated successfully');
    } else if (message.method === 'subscribe') {
      console.log('📊 WebSocket subscription update:', message.result);
    } else {
      console.log('📨 WebSocket message:', message);
    }
  }

  async subscribeToOrderUpdates(): Promise<void> {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN) {
      await this.connectWebSocket();
    }

    const subscribeMessage = {
      id: Date.now(),
      method: 'subscribe',
      params: {
        channels: ['user.order']
      }
    };

    this.ws?.send(JSON.stringify(subscribeMessage));
    console.log('📡 Subscribed to order updates');
  }

  async executeRealWithdrawal(amount: number, currency: string, address: string, addressTag?: string): Promise<boolean> {
    try {
      console.log(`💸 EXECUTING REAL CRYPTO.COM WITHDRAWAL`);
      console.log(`💰 Amount: ${amount} ${currency}`);
      console.log(`🎯 Address: ${address}`);
      if (addressTag) console.log(`🏷️ Tag: ${addressTag}`);

      const withdrawalRequest: WithdrawalRequest = {
        currency: currency.toUpperCase(),
        amount: amount.toString(),
        address: address,
        address_tag: addressTag,
        client_wid: `real-withdrawal-${Date.now()}`
      };

      const result = await this.createWithdrawal(withdrawalRequest);
      
      console.log(`✅ REAL WITHDRAWAL SUCCESSFUL`);
      console.log(`🆔 Withdrawal ID: ${result.id}`);
      console.log(`📊 Status: ${result.status}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Real withdrawal failed:`, error);
      return false;
    }
  }
}

export const cryptocomExchangeService = new CryptocomExchangeService();