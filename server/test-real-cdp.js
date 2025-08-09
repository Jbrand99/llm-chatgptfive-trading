// Test script to verify real CDP withdrawal functionality
async function testRealCDPWithdrawal() {
  try {
    console.log('🚀 Testing Real CDP Withdrawal System...');
    
    // Test with a small amount first
    const testAmount = 0.5; // 0.5 XRP test
    
    const response = await fetch('http://localhost:5000/api/cdp-withdrawal', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        amount: testAmount,
        currency: 'XRP'
      })
    });
    
    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ REAL CDP WITHDRAWAL TEST SUCCESSFUL!`);
      console.log(`📋 Transaction Hash: ${result.txHash}`);
      console.log(`💰 ${testAmount} XRP sent to rB1kVfLSxpXCw7sLCBcm5LFZYzkS6xmwSK`);
      console.log(`🎯 This was a REAL MONEY blockchain transaction!`);
    } else {
      console.log(`❌ CDP withdrawal test failed: ${result.error}`);
    }
    
  } catch (error) {
    console.log(`❌ Test error: ${error.message}`);
  }
}

// Run the test
testRealCDPWithdrawal();