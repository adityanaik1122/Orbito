/**
 * Authentication Flow Test
 * Tests user registration, login, and admin access
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in backend/.env');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Test data
const testUser = {
  email: `testuser${Date.now()}@gmail.com`,
  password: 'TestPass123!',
  fullName: 'Test User'
};

const adminUser = {
  email: 'adityanaik817@gmail.com',
  password: 'NewPassword123!'
};

async function runTests() {
  console.log('🧪 Starting Authentication Flow Tests\n');
  console.log('=' .repeat(60));

  let testsPassed = 0;
  let testsFailed = 0;

  // Test 1: User Registration
  console.log('\n📝 Test 1: User Registration');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabase.auth.signUp({
      email: testUser.email,
      password: testUser.password,
      options: {
        data: {
          full_name: testUser.fullName
        }
      }
    });

    if (error) throw error;

    if (data.user) {
      console.log('✅ PASSED: User registration successful');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      testsPassed++;
    } else {
      throw new Error('No user data returned');
    }
  } catch (error) {
    console.log('❌ FAILED: User registration failed');
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }

  // Wait a bit for profile creation
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Test 2: Check Profile Creation
  console.log('\n👤 Test 2: Profile Auto-Creation');
  console.log('-'.repeat(60));
  try {
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', testUser.email)
      .single();

    if (error) throw error;

    if (profile) {
      console.log('✅ PASSED: Profile created automatically');
      console.log(`   Email: ${profile.email}`);
      console.log(`   Role: ${profile.role}`);
      console.log(`   Full Name: ${profile.full_name || 'Not set'}`);
      testsPassed++;
    } else {
      throw new Error('Profile not found');
    }
  } catch (error) {
    console.log('❌ FAILED: Profile creation failed');
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }

  // Test 3: User Login (New User)
  console.log('\n🔐 Test 3: User Login (New Test User)');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: testUser.password
    });

    if (error) throw error;

    if (data.session) {
      console.log('✅ PASSED: User login successful');
      console.log(`   Access Token: ${data.session.access_token.substring(0, 20)}...`);
      console.log(`   User ID: ${data.user.id}`);
      testsPassed++;

      // Sign out
      await supabase.auth.signOut();
    } else {
      throw new Error('No session returned');
    }
  } catch (error) {
    console.log('❌ FAILED: User login failed');
    console.log(`   Error: ${error.message}`);
    testsFailed++;
  }

  // Test 4: Admin Login
  console.log('\n👑 Test 4: Admin Login');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: adminUser.email,
      password: adminUser.password
    });

    if (error) throw error;

    if (data.session) {
      console.log('✅ PASSED: Admin login successful');
      console.log(`   User ID: ${data.user.id}`);
      console.log(`   Email: ${data.user.email}`);
      testsPassed++;

      // Test 5: Check Admin Role
      console.log('\n🔑 Test 5: Admin Role Verification');
      console.log('-'.repeat(60));
      try {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('email', adminUser.email)
          .single();

        if (profileError) throw profileError;

        if (profile && profile.role === 'admin') {
          console.log('✅ PASSED: Admin role verified');
          console.log(`   Role: ${profile.role}`);
          testsPassed++;
        } else {
          throw new Error(`Expected role 'admin', got '${profile?.role}'`);
        }
      } catch (error) {
        console.log('❌ FAILED: Admin role verification failed');
        console.log(`   Error: ${error.message}`);
        testsFailed++;
      }

      // Sign out
      await supabase.auth.signOut();
    } else {
      throw new Error('No session returned');
    }
  } catch (error) {
    console.log('❌ FAILED: Admin login failed');
    console.log(`   Error: ${error.message}`);
    console.log('   💡 Tip: Make sure you ran the SQL to reset password:');
    console.log('   UPDATE auth.users SET encrypted_password = crypt(\'NewPassword123!\', gen_salt(\'bf\'))');
    console.log('   WHERE email = \'adityanaik817@gmail.com\';');
    testsFailed++;
  }

  // Test 6: Invalid Login Attempt
  console.log('\n🚫 Test 6: Invalid Login (Security Test)');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: testUser.email,
      password: 'WrongPassword123!'
    });

    if (error) {
      console.log('✅ PASSED: Invalid login properly rejected');
      console.log(`   Error message: ${error.message}`);
      testsPassed++;
    } else {
      throw new Error('Invalid login should have failed');
    }
  } catch (error) {
    if (error.message === 'Invalid login should have failed') {
      console.log('❌ FAILED: Invalid login was accepted (SECURITY ISSUE!)');
      testsFailed++;
    } else {
      console.log('✅ PASSED: Invalid login properly rejected');
      testsPassed++;
    }
  }

  // Test 7: Email Format Validation
  console.log('\n📧 Test 7: Email Format Validation');
  console.log('-'.repeat(60));
  try {
    const { data, error } = await supabase.auth.signUp({
      email: 'invalid-email',
      password: 'TestPass123!'
    });

    if (error) {
      console.log('✅ PASSED: Invalid email format rejected');
      console.log(`   Error: ${error.message}`);
      testsPassed++;
    } else {
      throw new Error('Invalid email should have been rejected');
    }
  } catch (error) {
    if (error.message === 'Invalid email should have been rejected') {
      console.log('❌ FAILED: Invalid email was accepted');
      testsFailed++;
    } else {
      console.log('✅ PASSED: Invalid email format rejected');
      testsPassed++;
    }
  }

  // Summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${testsPassed}`);
  console.log(`❌ Failed: ${testsFailed}`);
  console.log(`📈 Success Rate: ${((testsPassed / (testsPassed + testsFailed)) * 100).toFixed(1)}%`);
  
  if (testsFailed === 0) {
    console.log('\n🎉 All tests passed! Authentication system is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }

  console.log('\n' + '='.repeat(60));
  console.log('🧹 CLEANUP');
  console.log('='.repeat(60));
  console.log(`Test user created: ${testUser.email}`);
  console.log('To clean up, run this SQL in Supabase:');
  console.log(`DELETE FROM profiles WHERE email = '${testUser.email}';`);
  console.log(`DELETE FROM auth.users WHERE email = '${testUser.email}';`);

  process.exit(testsFailed > 0 ? 1 : 0);
}

// Run tests
runTests().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
