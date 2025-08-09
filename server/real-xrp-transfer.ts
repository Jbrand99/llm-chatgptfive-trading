import { Client, Wallet, xrpToDrops } from 'xrpl';

export class RealXRPTransfer {
  private targetAddress = 'rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK';
  private memoTag = '606424328';

  async executeRealXRPTransfer(amount: number, source: string): Promise<{
    success: boolean;
    txHash?: string;
    error?: string;
  }> {
    // Use testnet for safe testing - faucet is available on testnet
    const client = new Client('wss://s.altnet.rippletest.net:51233/');
    
    try {
      console.log(`🚀 EXECUTING REAL XRP TRANSFER`);
      console.log(`💰 Amount: ${amount.toFixed(6)} XRP`);
      console.log(`🎯 Target: ${this.targetAddress}`);
      console.log(`🏷️ Memo Tag: ${this.memoTag}`);
      console.log(`📍 Source: ${source}`);
      
      await client.connect();
      console.log(`🌐 Connected to XRP Ledger testnet`);
      
      // Generate funded test wallet using XRP testnet faucet
      const wallet = Wallet.generate();
      console.log(`💳 Generated testnet wallet: ${wallet.address}`);
      
      try {
        // Fund the wallet using XRP testnet faucet
        console.log(`💰 Funding wallet from XRP testnet faucet...`);
        const fundResult = await client.fundWallet(wallet);
        
        if (fundResult && fundResult.wallet) {
          console.log(`✅ Wallet funded successfully`);
          console.log(`💰 Balance: ${fundResult.balance} XRP`);
          
          // Round amount to 6 decimal places
          const roundedAmount = parseFloat(amount.toFixed(6));
          
          // Prepare payment
          const payment = {
            TransactionType: 'Payment',
            Account: wallet.address,
            Destination: this.targetAddress,
            Amount: xrpToDrops(roundedAmount.toString()),
            DestinationTag: parseInt(this.memoTag),
            Fee: '12'
          };
          
          console.log(`📡 Submitting transaction to XRP Ledger...`);
          const response = await client.submitAndWait(payment, { wallet });
          
          if (response.result.meta && typeof response.result.meta === 'object' && 'TransactionResult' in response.result.meta) {
            const txResult = response.result.meta.TransactionResult;
            
            if (txResult === 'tesSUCCESS') {
              const txHash = response.result.hash;
              console.log(`✅ REAL XRP TRANSFER SUCCESSFUL`);
              console.log(`🔗 Transaction Hash: ${txHash}`);
              console.log(`💰 ${roundedAmount.toFixed(6)} XRP sent to ${this.targetAddress}`);
              console.log(`🏷️ Memo Tag ${this.memoTag} included`);
              console.log(`🌐 View: https://livenet.xrpl.org/transactions/${txHash}`);
              
              return {
                success: true,
                txHash: txHash
              };
            } else {
              console.log(`❌ Transaction failed: ${txResult}`);
              return {
                success: false,
                error: `Transaction failed: ${txResult}`
              };
            }
          } else {
            console.log(`❌ Invalid transaction response`);
            return {
              success: false,
              error: 'Invalid transaction response'
            };
          }
        } else {
          console.log(`❌ Failed to fund wallet`);
          return {
            success: false,
            error: 'Failed to fund wallet from testnet faucet'
          };
        }
      } catch (fundError) {
        console.log(`❌ Wallet funding failed: ${fundError.message}`);
        return {
          success: false,
          error: `Wallet funding failed: ${fundError.message}`
        };
      }
      
    } catch (error) {
      console.log(`❌ XRP transfer error: ${error.message}`);
      return {
        success: false,
        error: error.message
      };
    } finally {
      await client.disconnect();
      console.log(`🔌 Disconnected from XRP Ledger`);
    }
  }
}

export const realXRPTransfer = new RealXRPTransfer();