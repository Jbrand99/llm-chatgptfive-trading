import crypto from 'crypto';
import axios from 'axios';

export interface PaymentRequest {
  amount: string;
  currency: string;
  order_id: string;
  description?: string;
  return_url?: string;
  cancel_url?: string;
}

export interface PaymentResponse {
  payment_id: string;
  checkout_url: string;
  status: string;
  amount: string;
  currency: string;
  order_id: string;
}

export class CryptocomPayService {
  private apiKey: string;
  private secretKey: string;
  private webhookSecret: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.CRYPTOCOM_PAY_API_KEY || '';
    this.secretKey = process.env.CRYPTOCOM_PAY_SECRET_KEY || '';
    this.webhookSecret = process.env.CRYPTOCOM_WEBHOOK_SECRET || '';
    this.baseUrl = 'https://pay.crypto.com/api/payments';
  }

  private generateSignature(method: string, path: string, body: string, timestamp: string): string {
    const message = `${method}${path}${body}${timestamp}`;
    return crypto.createHmac('sha256', this.secretKey).update(message).digest('hex');
  }

  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    const timestamp = Date.now().toString();
    const body = JSON.stringify(paymentRequest);
    const path = '/payments';
    
    const signature = this.generateSignature('POST', path, body, timestamp);

    try {
      const response = await axios.post(`${this.baseUrl}${path}`, paymentRequest, {
        headers: {
          'Content-Type': 'application/json',
          'X-Pay-Token': this.apiKey,
          'X-Pay-Timestamp': timestamp,
          'X-Pay-Signature': signature,
        },
      });

      console.log(`✅ CRYPTO.COM PAYMENT CREATED: ${paymentRequest.amount} ${paymentRequest.currency}`);
      console.log(`🔗 Checkout URL: ${response.data.checkout_url}`);

      return response.data;
    } catch (error: any) {
      console.error('❌ Crypto.com Pay payment creation failed:', error.response?.data || error.message);
      throw error;
    }
  }

  async getPaymentStatus(paymentId: string): Promise<any> {
    const timestamp = Date.now().toString();
    const path = `/payments/${paymentId}`;
    
    const signature = this.generateSignature('GET', path, '', timestamp);

    try {
      const response = await axios.get(`${this.baseUrl}${path}`, {
        headers: {
          'X-Pay-Token': this.apiKey,
          'X-Pay-Timestamp': timestamp,
          'X-Pay-Signature': signature,
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('❌ Crypto.com Pay status check failed:', error.response?.data || error.message);
      throw error;
    }
  }

  verifyWebhook(signature: string, body: string): boolean {
    const expectedSignature = crypto
      .createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');

    return crypto.timingSafeEqual(
      Buffer.from(signature, 'hex'),
      Buffer.from(expectedSignature, 'hex')
    );
  }

  async processWithdrawal(amount: number, currency: string = 'USD'): Promise<boolean> {
    try {
      console.log(`💸 PROCESSING CRYPTO.COM PAY WITHDRAWAL`);
      console.log(`💰 Amount: ${amount} ${currency}`);

      const paymentRequest: PaymentRequest = {
        amount: amount.toString(),
        currency: currency,
        order_id: `withdrawal-${Date.now()}`,
        description: 'Trading profit withdrawal',
        return_url: process.env.REPLIT_URL || 'https://your-app.replit.app',
        cancel_url: process.env.REPLIT_URL || 'https://your-app.replit.app'
      };

      const payment = await this.createPayment(paymentRequest);
      
      console.log(`✅ CRYPTO.COM PAY WITHDRAWAL INITIATED`);
      console.log(`🔗 Payment ID: ${payment.payment_id}`);
      
      return true;
    } catch (error) {
      console.error(`❌ Crypto.com Pay withdrawal failed:`, error);
      return false;
    }
  }
}

export const cryptocomPayService = new CryptocomPayService();