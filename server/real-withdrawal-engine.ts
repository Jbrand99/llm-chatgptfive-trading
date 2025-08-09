import { Client, Wallet as XRPWallet, xrpToDrops, Payment } from 'xrpl';
import { cryptocomExchangeService } from './cryptocom-exchange-service';
import { cryptocomPayService } from './cryptocom-pay-service';
import { storage } from './storage';

export interface RealWithdrawalRequest {
  amount: number;
  currency: string;
  method: 'xrp_ledger' | 'cryptocom_exchange' | 'cryptocom_pay';
  targetAddress?: string;
  destinationTag?: string;
  source: string;
}

export class RealWithdrawalEngine {
  private xrpClient: Client | null = null;
  private targetXrpAddress = 'rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK';
  private destinationTag = 606424328;

  constructor() {
    this.initializeXRPClient();
  }

  private async initializeXRPClient(): Promise<void> {
    try {
      this.xrpClient = new Client('wss://xrplcluster.com/');
      console.log('🌐 XRP Ledger client initialized for real withdrawals');
    } catch (error) {
      console.error('❌ Failed to initialize XRP client:', error);
    }
  }

  async executeRealWithdrawal(request: RealWithdrawalRequest): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
    withdrawalId?: string;
  }> {
    console.log(`\n💸 EXECUTING REAL WITHDRAWAL`);
    console.log(`💰 Amount: ${request.amount} ${request.currency}`);
    console.log(`🔄 Method: ${request.method}`);
    console.log(`📍 Source: ${request.source}`);

    try {
      let result;

      switch (request.method) {
        case 'xrp_ledger':
          result = await this.executeXRPLedgerWithdrawal(request);
          break;
        case 'cryptocom_exchange':
          result = await this.executeCryptocomExchangeWithdrawal(request);
          break;
        case 'cryptocom_pay':
          result = await this.executeCryptocomPayWithdrawal(request);
          break;
        default:
          throw new Error(`Unsupported withdrawal method: ${request.method}`);
      }

      if (result.success) {
        await this.recordSuccessfulWithdrawal(request, result);
        console.log(`✅ REAL WITHDRAWAL COMPLETED SUCCESSFULLY`);
      }

      return result;
    } catch (error: any) {
      console.error(`❌ Real withdrawal failed:`, error.message);
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async executeXRPLedgerWithdrawal(request: RealWithdrawalRequest): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    if (!this.xrpClient) {
      throw new Error('XRP client not initialized');
    }

    try {
      await this.xrpClient.connect();
      console.log('🌐 Connected to XRP Ledger mainnet');

      // Generate and fund wallet
      const wallet = XRPWallet.generate();
      console.log(`📧 Generated XRP wallet: ${wallet.address}`);

      const fundResult = await this.xrpClient.fundWallet(wallet);
      if (!fundResult || !fundResult.wallet) {
        throw new Error('Failed to fund XRP wallet');
      }

      console.log(`✅ Wallet funded with ${fundResult.balance} XRP`);

      // Convert USD to XRP (approximate rate)
      const xrpAmount = request.currency === 'XRP' ? request.amount : request.amount / 0.62;
      const finalAmount = Math.min(xrpAmount, 50); // Cap at 50 XRP for safety

      // Create payment transaction
      const payment: Payment = {
        TransactionType: 'Payment',
        Account: wallet.address,
        Destination: request.targetAddress || this.targetXrpAddress,
        Amount: xrpToDrops(finalAmount.toString()),
        DestinationTag: typeof request.destinationTag === 'number' ? request.destinationTag : this.destinationTag,
        Fee: '12'
      };

      console.log(`📡 Broadcasting XRP payment to mainnet...`);
      const response = await this.xrpClient.submitAndWait(payment, { wallet });

      const txHash = response.result.hash;
      console.log(`✅ XRP LEDGER WITHDRAWAL SUCCESSFUL`);
      console.log(`🔗 TX Hash: ${txHash}`);
      console.log(`💰 Amount: ${finalAmount.toFixed(6)} XRP`);
      console.log(`🌐 Explorer: https://livenet.xrpl.org/transactions/${txHash}`);

      await this.xrpClient.disconnect();

      return {
        success: true,
        txHash: txHash
      };
    } catch (error: any) {
      console.error(`❌ XRP Ledger withdrawal failed:`, error.message);
      if (this.xrpClient) {
        await this.xrpClient.disconnect();
      }
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async executeCryptocomExchangeWithdrawal(request: RealWithdrawalRequest): Promise<{
    success: boolean;
    withdrawalId?: string;
    error?: string;
  }> {
    try {
      const result = await cryptocomExchangeService.executeRealWithdrawal(
        request.amount,
        request.currency,
        request.targetAddress || this.targetXrpAddress,
        request.destinationTag?.toString()
      );

      return {
        success: result,
        withdrawalId: result ? `cryptocom-${Date.now()}` : undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async executeCryptocomPayWithdrawal(request: RealWithdrawalRequest): Promise<{
    success: boolean;
    withdrawalId?: string;
    error?: string;
  }> {
    try {
      const result = await cryptocomPayService.processWithdrawal(request.amount, request.currency);

      return {
        success: result,
        withdrawalId: result ? `cryptocom-pay-${Date.now()}` : undefined
      };
    } catch (error: any) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  private async recordSuccessfulWithdrawal(
    request: RealWithdrawalRequest,
    result: { txHash?: string; withdrawalId?: string }
  ): Promise<void> {
    try {
      // Record in withdrawals table
      await storage.createWeb3Withdrawal({
        walletId: 1,
        targetAddress: request.targetAddress || this.targetXrpAddress,
        asset: request.currency,
        amount: request.amount.toString(),
        network: request.method === 'xrp_ledger' ? 'xrpl' : 'cryptocom',
        destinationTag: request.destinationTag?.toString() || this.destinationTag.toString(),
        triggerType: `real_${request.source}`,
        status: 'confirmed',
        txHash: result.txHash || result.withdrawalId
      });

      // Record tax record
      await storage.createTaxRecord({
        transactionHash: result.txHash || result.withdrawalId || `real-${Date.now()}`,
        date: new Date(),
        type: 'real_withdrawal',
        usdAmount: request.amount.toString(),
        cryptoAmount: request.currency === 'XRP' ? request.amount.toString() : (request.amount / 0.62).toFixed(6),
        cryptoAsset: request.currency,
        source: `real_${request.source}`,
        exchangeRate: request.currency === 'XRP' ? '1.0' : '0.62',
        targetAddress: request.targetAddress || this.targetXrpAddress,
        memoTag: request.destinationTag?.toString() || this.destinationTag.toString(),
        taxYear: new Date().getFullYear()
      });

      console.log(`📊 WITHDRAWAL RECORDED IN DATABASE`);
    } catch (error) {
      console.error(`❌ Failed to record withdrawal:`, error);
    }
  }

  async processAutomatedWithdrawals(): Promise<void> {
    console.log(`🔄 PROCESSING AUTOMATED REAL WITHDRAWALS`);

    try {
      // Get pending withdrawals from database
      const withdrawals = await storage.getWeb3Withdrawals();
      const pending = withdrawals
        .filter((w: any) => w.status === 'pending')
        .slice(0, 3); // Process max 3 at a time

      for (const withdrawal of pending) {
        const request: RealWithdrawalRequest = {
          amount: parseFloat(withdrawal.amount),
          currency: withdrawal.asset || 'XRP',
          method: withdrawal.network === 'xrpl' ? 'xrp_ledger' : 'cryptocom_exchange',
          targetAddress: withdrawal.targetAddress,
          destinationTag: typeof withdrawal.destinationTag === 'string' ? parseInt(withdrawal.destinationTag) : (withdrawal.destinationTag || undefined),
          source: withdrawal.triggerType || 'automated'
        };

        const result = await this.executeRealWithdrawal(request);

        if (result.success) {
          console.log(`✅ REAL WITHDRAWAL PROCESSED: ${withdrawal.amount} ${withdrawal.asset}`);
        }

        // Add delay between withdrawals
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    } catch (error) {
      console.error(`❌ Automated withdrawal processing failed:`, error);
    }
  }

  async queueRealWithdrawal(
    amount: number,
    currency: string,
    source: string,
    method: 'xrp_ledger' | 'cryptocom_exchange' | 'cryptocom_pay' = 'xrp_ledger'
  ): Promise<void> {
    await storage.createWeb3Withdrawal({
      walletId: 1,
      amount: amount.toString(),
      asset: currency,
      targetAddress: this.targetXrpAddress,
      status: 'pending',
      network: method === 'xrp_ledger' ? 'xrpl' : 'cryptocom',
      triggerType: `real_${source}`,
      destinationTag: this.destinationTag.toString()
    });

    console.log(`💸 REAL WITHDRAWAL QUEUED: ${amount} ${currency} via ${method}`);
  }
}

export const realWithdrawalEngine = new RealWithdrawalEngine();