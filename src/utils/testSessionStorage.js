// Test script for session storage functionality
import sessionStorage from './sessionStorage';

export const testSessionStorage = async () => {
  console.log('🧪 Testing Session Storage Functionality\n');

  try {
    // Test 1: Initialize session
    console.log('1. Testing session initialization...');
    const sessionId = await sessionStorage.initializeSession();
    console.log('✅ Session initialized:', sessionId);

    // Test 2: Start user session
    console.log('\n2. Testing user session start...');
    const mockUserData = {
      id: 'test_user_123',
      name: 'Test User',
      email: 'test@example.com',
      userType: 'worker',
      phone: '+919876543210'
    };
    const mockToken = 'mock_jwt_token_12345';
    
    const sessionStarted = await sessionStorage.startUserSession(mockUserData, mockToken);
    console.log('✅ User session started:', sessionStarted);

    // Test 3: Get session data
    console.log('\n3. Testing session data retrieval...');
    const sessionData = await sessionStorage.getSessionData();
    console.log('✅ Session data retrieved:', {
      hasUserData: !!sessionData.userData,
      hasToken: !!sessionData.token,
      sessionId: sessionData.sessionId,
      isExpired: sessionData.isExpired
    });

    // Test 4: Update last activity
    console.log('\n4. Testing last activity update...');
    await sessionStorage.updateLastActivity();
    console.log('✅ Last activity updated');

    // Test 5: Check session expiry
    console.log('\n5. Testing session expiry check...');
    const isExpired = await sessionStorage.isSessionExpired();
    console.log('✅ Session expired check:', isExpired);

    // Test 6: Get session info
    console.log('\n6. Testing session info retrieval...');
    const sessionInfo = await sessionStorage.getSessionInfo();
    console.log('✅ Session info:', {
      sessionDuration: sessionInfo.sessionDuration,
      timeSinceLastActivity: sessionInfo.timeSinceLastActivity,
      appVersion: sessionInfo.appVersion,
      deviceId: sessionInfo.deviceId
    });

    // Test 7: Refresh session
    console.log('\n7. Testing session refresh...');
    const refreshed = await sessionStorage.refreshSession();
    console.log('✅ Session refreshed:', refreshed);

    // Test 8: Clear session
    console.log('\n8. Testing session clear...');
    const cleared = await sessionStorage.clearSession();
    console.log('✅ Session cleared:', cleared);

    // Test 9: Verify session is cleared
    console.log('\n9. Testing session data after clear...');
    const clearedSessionData = await sessionStorage.getSessionData();
    console.log('✅ Session data after clear:', {
      hasUserData: !!clearedSessionData.userData,
      hasToken: !!clearedSessionData.token,
      isExpired: clearedSessionData.isExpired
    });

    console.log('\n🎉 All session storage tests completed successfully!');
    return true;

  } catch (error) {
    console.error('❌ Session storage test failed:', error);
    return false;
  }
};

// Test session timeout simulation
export const testSessionTimeout = async () => {
  console.log('\n🧪 Testing Session Timeout Simulation\n');

  try {
    // Initialize session
    await sessionStorage.initializeSession();
    
    // Start user session
    const mockUserData = {
      id: 'timeout_test_user',
      name: 'Timeout Test User',
      userType: 'customer'
    };
    const mockToken = 'timeout_test_token';
    
    await sessionStorage.startUserSession(mockUserData, mockToken);
    console.log('✅ Test session started');

    // Simulate old activity (25 hours ago)
    const oldTimestamp = Date.now() - (25 * 60 * 60 * 1000); // 25 hours ago
    await sessionStorage.updateLastActivity(oldTimestamp);
    console.log('✅ Set last activity to 25 hours ago');

    // Check if session is expired
    const isExpired = await sessionStorage.isSessionExpired();
    console.log('✅ Session timeout test result:', isExpired ? 'EXPIRED' : 'ACTIVE');

    // Clean up
    await sessionStorage.clearSession();
    console.log('✅ Test session cleaned up');

    return isExpired;

  } catch (error) {
    console.error('❌ Session timeout test failed:', error);
    return false;
  }
};

// Usage example
export const runAllSessionTests = async () => {
  console.log('🚀 Running All Session Storage Tests\n');
  
  const test1 = await testSessionStorage();
  const test2 = await testSessionTimeout();
  
  console.log('\n📊 Test Results:');
  console.log('Session Storage Tests:', test1 ? '✅ PASSED' : '❌ FAILED');
  console.log('Session Timeout Tests:', test2 ? '✅ PASSED' : '❌ FAILED');
  
  return test1 && test2;
};

export default {
  testSessionStorage,
  testSessionTimeout,
  runAllSessionTests
};
