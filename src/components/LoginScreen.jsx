import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import colors from '../theme/colors';
import { signInWithPhoneNumber, confirmCode, createUserDocument } from '../config/firebase';

const LoginScreen = ({ onLogin, onSwitchToSignup }) => {
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [phoneError, setPhoneError] = useState('');
  const [showOTP, setShowOTP] = useState(false);
  const [confirmation, setConfirmation] = useState(null);

  const validateForm = () => {
    let isValid = true;
    
    // Clear previous errors
    setPhoneError('');

    // Validate phone
    if (!phone.trim()) {
      setPhoneError('Phone number is required');
      isValid = false;
    } else if (phone.length < 10) {
      setPhoneError('Please enter a valid phone number');
      isValid = false;
    } else if (!/^\d+$/.test(phone)) {
      setPhoneError('Phone number should contain only digits');
      isValid = false;
    }

    return isValid;
  };

  const handlePhoneLogin = async () => {
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Format phone number for Firebase (add +91 if not present)
      let formattedPhone = phone.trim();
      if (!formattedPhone.startsWith('+')) {
        formattedPhone = '+91' + formattedPhone;
      }

      // Send OTP using Firebase
      const result = await signInWithPhoneNumber(formattedPhone);
      
      if (result.success) {
        // Store confirmation for OTP verification
        setConfirmation(result.confirmation);
        setShowOTP(true);
      } else {
        setPhoneError(result.error || 'Failed to send OTP. Please try again.');
      }
    } catch (error) {
      console.error('Phone login error:', error);
      setPhoneError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);

    try {
      // Simulate Google login
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, create a mock user data
      const userData = {
        name: 'Google User',
        email: 'google.user@gmail.com',
        phone: '+91 98765 43210',
        userType: 'customer', // Default to customer for Google login
        id: 'google_user_' + Date.now(),
        loginMethod: 'google'
      };

      onLogin(userData);
    } catch (error) {
      setPhoneError('Google login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // OTP Verification Component
  const OTPVerification = () => {
    const [otp, setOtp] = useState(['', '', '', '']);
    const [isVerifying, setIsVerifying] = useState(false);
    const [resendTimer, setResendTimer] = useState(0);
    const inputRefs = useRef([]);

    useEffect(() => {
      if (resendTimer > 0) {
        const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
        return () => clearTimeout(timer);
      }
    }, [resendTimer]);

    const handleOtpChange = (text, index) => {
      const newOtp = [...otp];
      newOtp[index] = text;
      setOtp(newOtp);

      // Auto-focus next input
      if (text && index < 3) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyPress = (e, index) => {
      if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    };

    const handleVerifyOTP = async () => {
      const otpString = otp.join('');
      
      if (otpString.length !== 4) {
        Alert.alert('Error', 'Please enter the complete 4-digit OTP');
        return;
      }

      setIsVerifying(true);

      try {
        // Verify OTP with Firebase
        const result = await confirmCode(confirmation, otpString);
        
        if (result.success) {
          // Create user document in Firestore
          const userData = {
            name: 'Phone User',
            phone: phone.trim().startsWith('+') ? phone.trim() : '+91' + phone.trim(),
            userType: 'customer',
            loginMethod: 'phone'
          };
          
          const userId = result.user.uid || 'user_' + Date.now();
          await createUserDocument(userId, userData);
          
          onLogin({ ...userData, id: userId });
        } else {
          Alert.alert('Error', 'Invalid OTP. Please try again.');
        }
      } catch (error) {
        console.error('OTP verification error:', error);
        Alert.alert('Error', 'Failed to verify OTP. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    const handleResendOTP = async () => {
      setIsVerifying(true);
      
      try {
        // Resend OTP
        const formattedPhone = phone.trim().startsWith('+') ? phone.trim() : '+91' + phone.trim();
        const result = await signInWithPhoneNumber(formattedPhone);
        
        if (result.success) {
          setConfirmation(result.confirmation);
          setResendTimer(30);
          Alert.alert('Success', 'OTP resent to your phone number');
        } else {
          Alert.alert('Error', 'Failed to resend OTP. Please try again.');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to resend OTP. Please try again.');
      } finally {
        setIsVerifying(false);
      }
    };

    return (
      <View style={styles.otpContainer}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={() => setShowOTP(false)}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={styles.title}>Verify OTP</Text>
          <Text style={styles.subtitle}>
            Enter the 4-digit code sent to {phone.trim().startsWith('+') ? phone.trim() : '+91' + phone.trim()}
          </Text>
        </View>

        <View style={styles.otpInputContainer}>
          <Text style={styles.otpLabel}>Enter OTP:</Text>
          <View style={styles.otpInputs}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={styles.otpInput}
                value={digit}
                onChangeText={(text) => handleOtpChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                placeholder="•"
                placeholderTextColor={colors.textSecondary}
                textAlign="center"
              />
            ))}
          </View>
        </View>

        <TouchableOpacity
          style={[styles.verifyButton, isVerifying && styles.disabledButton]}
          onPress={handleVerifyOTP}
          disabled={isVerifying}
        >
          <Text style={styles.verifyButtonText}>
            {isVerifying ? 'Verifying...' : 'Verify OTP'}
          </Text>
        </TouchableOpacity>

        <View style={styles.resendContainer}>
          <Text style={styles.resendText}>Didn't receive the code? </Text>
          {resendTimer > 0 ? (
            <Text style={styles.timerText}>Resend in {resendTimer}s</Text>
          ) : (
            <TouchableOpacity onPress={handleResendOTP} disabled={isVerifying}>
              <Text style={styles.resendLink}>Resend OTP</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  if (showOTP) {
    return (
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <OTPVerification />
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>
            Connect with skilled workers or find work opportunities
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={[styles.input, phoneError && styles.inputError]}
              placeholder="Phone Number"
              value={phone}
              onChangeText={(text) => {
                setPhone(text);
                if (phoneError) setPhoneError('');
              }}
              keyboardType="phone-pad"
              placeholderTextColor={colors.textSecondary}
            />
            {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
          </View>

          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.disabledButton]}
            onPress={handlePhoneLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Sending OTP...' : 'Send OTP'}
            </Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>OR</Text>
            <View style={styles.dividerLine} />
          </View>

          <TouchableOpacity
            style={[styles.googleButton, isLoading && styles.disabledButton]}
            onPress={handleGoogleLogin}
            disabled={isLoading}
          >
            <Text style={styles.googleButtonText}>Sign In with Google</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Don't have an account? </Text>
            <TouchableOpacity onPress={onSwitchToSignup}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.textPrimary,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    color: colors.textPrimary,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.error,
    borderWidth: 2,
  },
  errorText: {
    color: colors.error,
    fontSize: 12,
    marginTop: 5,
    marginLeft: 5,
  },
  loginButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.border,
  },
  dividerText: {
    marginHorizontal: 16,
    color: colors.textSecondary,
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 20,
  },
  googleButtonText: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  signupText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  signupLink: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  // OTP Verification Styles
  otpContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    padding: 10,
  },
  backButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  otpInputContainer: {
    marginBottom: 30,
  },
  otpLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 15,
    textAlign: 'center',
  },
  otpInputs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  otpInput: {
    width: 60,
    height: 60,
    backgroundColor: colors.surface,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.textPrimary,
  },
  verifyButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 15,
    alignItems: 'center',
    marginBottom: 20,
  },
  verifyButtonText: {
    color: colors.textLight,
    fontSize: 16,
    fontWeight: 'bold',
  },
  resendContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 30,
  },
  resendText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
  resendLink: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  timerText: {
    color: colors.textSecondary,
    fontSize: 16,
  },
});

export default LoginScreen;
