import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

// Firebase is automatically initialized when the app starts
// The google-services.json file contains the configuration

export { auth, firestore };

// Helper functions for authentication
export const signInWithPhoneNumber = async (phoneNumber) => {
  try {
    const confirmation = await auth().signInWithPhoneNumber(phoneNumber);
    return { success: true, confirmation };
  } catch (error) {
    console.error('Phone auth error:', error);
    return { success: false, error: error.message };
  }
};

export const confirmCode = async (confirmation, code) => {
  try {
    const result = await confirmation.confirm(code);
    return { success: true, user: result.user };
  } catch (error) {
    console.error('Code confirmation error:', error);
    return { success: false, error: error.message };
  }
};

export const signOut = async () => {
  try {
    await auth().signOut();
    return { success: true };
  } catch (error) {
    console.error('Sign out error:', error);
    return { success: false, error: error.message };
  }
};

// Helper functions for Firestore
export const createUserDocument = async (userId, userData) => {
  try {
    await firestore().collection('users').doc(userId).set({
      ...userData,
      createdAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Create user document error:', error);
    return { success: false, error: error.message };
  }
};

export const updateUserDocument = async (userId, userData) => {
  try {
    await firestore().collection('users').doc(userId).update({
      ...userData,
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Update user document error:', error);
    return { success: false, error: error.message };
  }
};

export const getUserDocument = async (userId) => {
  try {
    const doc = await firestore().collection('users').doc(userId).get();
    if (doc.exists) {
      return { success: true, data: doc.data() };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    console.error('Get user document error:', error);
    return { success: false, error: error.message };
  }
};

// KYC related functions
export const submitKYC = async (userId, kycData) => {
  try {
    await firestore().collection('kyc').doc(userId).set({
      ...kycData,
      status: 'pending',
      submittedAt: firestore.FieldValue.serverTimestamp(),
      updatedAt: firestore.FieldValue.serverTimestamp(),
    });
    return { success: true };
  } catch (error) {
    console.error('Submit KYC error:', error);
    return { success: false, error: error.message };
  }
};

export const getKYCStatus = async (userId) => {
  try {
    const doc = await firestore().collection('kyc').doc(userId).get();
    if (doc.exists) {
      return { success: true, data: doc.data() };
    } else {
      return { success: true, data: { status: 'not_started' } };
    }
  } catch (error) {
    console.error('Get KYC status error:', error);
    return { success: false, error: error.message };
  }
};
