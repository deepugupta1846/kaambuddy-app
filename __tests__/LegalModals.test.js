/**
 * @format
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ProfileTab from '../src/components/dashboard/tabs/ProfileTab';

// Mock the modal components
jest.mock('../src/components/PrivacyPolicyModal', () => {
  return function MockPrivacyPolicyModal({ visible, onClose }) {
    if (!visible) return null;
    return (
      <div testID="privacy-policy-modal">
        <button testID="privacy-close-button" onPress={onClose}>
          Close Privacy Policy
        </button>
        <div testID="privacy-content">Privacy Policy Content</div>
      </div>
    );
  };
});

jest.mock('../src/components/TermsOfServiceModal', () => {
  return function MockTermsOfServiceModal({ visible, onClose }) {
    if (!visible) return null;
    return (
      <div testID="terms-of-service-modal">
        <button testID="terms-close-button" onPress={onClose}>
          Close Terms of Service
        </button>
        <div testID="terms-content">Terms of Service Content</div>
      </div>
    );
  };
});

// Mock other components
jest.mock('../src/components/EditProfileScreen', () => {
  return function MockEditProfileScreen() {
    return <div testID="edit-profile-screen" />;
  };
});

// Mock Firebase functions
jest.mock('../src/config/firebase', () => ({
  submitKYC: jest.fn(),
  getKYCStatus: jest.fn(),
}));

describe('Legal Modals', () => {
  const mockUserData = {
    name: 'John Doe',
    phone: '+91 98765 43210',
    email: 'john.doe@example.com',
    userType: 'worker',
    workCategory: 'Plumber',
    experience: '3-5 years',
    loginMethod: 'phone'
  };

  const mockOnLogout = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should open Privacy Policy modal when Privacy Policy is pressed', () => {
    const { getByText, getByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Find and press the Privacy Policy button
    const privacyPolicyButton = getByText('Privacy Policy');
    fireEvent.press(privacyPolicyButton);

    // Check if the Privacy Policy modal is rendered
    expect(getByTestId('privacy-policy-modal')).toBeTruthy();
    expect(getByTestId('privacy-content')).toBeTruthy();
  });

  test('should open Terms of Service modal when Terms of Service is pressed', () => {
    const { getByText, getByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Find and press the Terms of Service button
    const termsOfServiceButton = getByText('Terms of Service');
    fireEvent.press(termsOfServiceButton);

    // Check if the Terms of Service modal is rendered
    expect(getByTestId('terms-of-service-modal')).toBeTruthy();
    expect(getByTestId('terms-content')).toBeTruthy();
  });

  test('should close Privacy Policy modal when close button is pressed', async () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Open the Privacy Policy modal
    const privacyPolicyButton = getByText('Privacy Policy');
    fireEvent.press(privacyPolicyButton);

    // Verify modal is open
    expect(getByTestId('privacy-policy-modal')).toBeTruthy();

    // Press close button
    const closeButton = getByTestId('privacy-close-button');
    fireEvent.press(closeButton);

    // Verify modal is closed
    await waitFor(() => {
      expect(queryByTestId('privacy-policy-modal')).toBeNull();
    });
  });

  test('should close Terms of Service modal when close button is pressed', async () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Open the Terms of Service modal
    const termsOfServiceButton = getByText('Terms of Service');
    fireEvent.press(termsOfServiceButton);

    // Verify modal is open
    expect(getByTestId('terms-of-service-modal')).toBeTruthy();

    // Press close button
    const closeButton = getByTestId('terms-close-button');
    fireEvent.press(closeButton);

    // Verify modal is closed
    await waitFor(() => {
      expect(queryByTestId('terms-of-service-modal')).toBeNull();
    });
  });

  test('should have both legal buttons in settings section', () => {
    const { getByText } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Check if both legal buttons are present
    expect(getByText('Privacy Policy')).toBeTruthy();
    expect(getByText('Terms of Service')).toBeTruthy();
  });

  test('should not show modals by default', () => {
    const { queryByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Check that modals are not visible by default
    expect(queryByTestId('privacy-policy-modal')).toBeNull();
    expect(queryByTestId('terms-of-service-modal')).toBeNull();
  });
});


