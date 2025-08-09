import cron from 'node-cron';

class BotManager {
  private static instance: BotManager;
  private checkInterval: NodeJS.Timer | null = null;
  private isMonitoring = false;

  static getInstance(): BotManager {
    if (!BotManager.instance) {
      BotManager.instance = new BotManager();
    }
    return BotManager.instance;
  }

  async startAutoRestart() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('🤖 Bot Manager: Auto-restart monitoring ENABLED');
    
    // Check every 30 seconds if bots are running
    this.checkInterval = setInterval(async () => {
      await this.checkAndRestartBots();
    }, 30000);

    // Also schedule a daily restart at 6 AM to prevent memory leaks
    cron.schedule('0 6 * * *', async () => {
      console.log('🔄 Daily bot restart - preventing memory leaks');
      await this.restartAllBots();
    });
  }

  stopAutoRestart() {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.isMonitoring = false;
    console.log('🤖 Bot Manager: Auto-restart monitoring DISABLED');
  }

  private async checkAndRestartBots() {
    try {
      const bots = ['momentum', 'grid', 'arbitrage', 'cryptocom', 'optimism', 'web3'];
      
      for (const botType of bots) {
        const isRunning = await this.checkBotStatus(botType);
        if (!isRunning) {
          console.log(`🚨 Bot Manager: ${botType} bot is down, restarting...`);
          await this.restartBot(botType);
        }
      }
    } catch (error) {
      console.error('❌ Bot Manager check error:', error);
    }
  }

  private async checkBotStatus(botType: string): Promise<boolean> {
    try {
      const response = await fetch(`http://localhost:5000/api/${botType}/status`);
      const status = await response.json();
      return status.isRunning === true;
    } catch {
      return false;
    }
  }

  private async restartBot(botType: string) {
    try {
      const response = await fetch(`http://localhost:5000/api/${botType}/start`, {
        method: 'POST'
      });
      
      if (response.ok) {
        console.log(`✅ Bot Manager: ${botType} bot restarted successfully`);
      } else {
        console.error(`❌ Bot Manager: Failed to restart ${botType} bot`);
      }
    } catch (error) {
      console.error(`❌ Bot Manager: Error restarting ${botType} bot:`, error);
    }
  }

  private async restartAllBots() {
    console.log('🔄 Restarting all bots...');
    const bots = ['momentum', 'grid', 'arbitrage', 'cryptocom', 'optimism', 'web3'];
    
    for (const botType of bots) {
      await this.restartBot(botType);
      // Small delay between restarts
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
    
    console.log('✅ All bots restarted');
  }

  async ensureAllBotsRunning() {
    console.log('🚀 Ensuring all bots are running...');
    const bots = ['momentum', 'grid', 'arbitrage', 'cryptocom', 'optimism', 'web3'];
    
    for (const botType of bots) {
      const isRunning = await this.checkBotStatus(botType);
      if (!isRunning) {
        await this.restartBot(botType);
      }
    }
  }
}

export const botManager = BotManager.getInstance();