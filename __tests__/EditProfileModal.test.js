/**
 * @format
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import { Modal } from 'react-native';
import ProfileTab from '../src/components/dashboard/tabs/ProfileTab';

// Mock the EditProfileScreen component
jest.mock('../src/components/EditProfileScreen', () => {
  return function MockEditProfileScreen({ userData, onSave, onCancel }) {
    return (
      <div testID="edit-profile-screen">
        <button testID="save-button" onPress={() => onSave({ ...userData, name: 'Updated Name' })}>
          Save
        </button>
        <button testID="cancel-button" onPress={onCancel}>
          Cancel
        </button>
      </div>
    );
  };
});

// Mock Firebase functions
jest.mock('../src/config/firebase', () => ({
  submitKYC: jest.fn(),
  getKYCStatus: jest.fn(),
}));

describe('EditProfile Modal', () => {
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

  test('should open EditProfile modal when Edit Profile is pressed', () => {
    const { getByText, getByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Find and press the Edit Profile button
    const editProfileButton = getByText('Edit Profile');
    fireEvent.press(editProfileButton);

    // Check if the EditProfileScreen is rendered (modal is open)
    expect(getByTestId('edit-profile-screen')).toBeTruthy();
  });

  test('should close modal when Cancel is pressed', async () => {
    const { getByText, getByTestId, queryByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Open the modal
    const editProfileButton = getByText('Edit Profile');
    fireEvent.press(editProfileButton);

    // Verify modal is open
    expect(getByTestId('edit-profile-screen')).toBeTruthy();

    // Press Cancel button
    const cancelButton = getByTestId('cancel-button');
    fireEvent.press(cancelButton);

    // Verify modal is closed
    await waitFor(() => {
      expect(queryByTestId('edit-profile-screen')).toBeNull();
    });
  });

  test('should update user data when Save is pressed', async () => {
    const { getByText, getByTestId } = render(
      <ProfileTab onLogout={mockOnLogout} userData={mockUserData} />
    );

    // Open the modal
    const editProfileButton = getByText('Edit Profile');
    fireEvent.press(editProfileButton);

    // Press Save button
    const saveButton = getByTestId('save-button');
    fireEvent.press(saveButton);

    // Verify the updated name is displayed
    await waitFor(() => {
      expect(getByText('Updated Name')).toBeTruthy();
    });
  });

  test('should handle SSO user email field correctly', () => {
    const ssoUserData = {
      ...mockUserData,
      loginMethod: 'google',
      email: 'google.user@gmail.com'
    };

    const { getByText } = render(
      <ProfileTab onLogout={mockOnLogout} userData={ssoUserData} />
    );

    // Check if email is displayed correctly for SSO user
    expect(getByText('google.user@gmail.com')).toBeTruthy();
  });

  test('should handle phone user email field correctly', () => {
    const phoneUserData = {
      ...mockUserData,
      loginMethod: 'phone',
      email: 'phone.user@example.com'
    };

    const { getByText } = render(
      <ProfileTab onLogout={mockOnLogout} userData={phoneUserData} />
    );

    // Check if email is displayed correctly for phone user
    expect(getByText('phone.user@example.com')).toBeTruthy();
  });
});
