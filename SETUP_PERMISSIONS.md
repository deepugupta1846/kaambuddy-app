# Permission Setup Instructions

This document provides instructions for setting up location and notification permissions in the KaamBuddy app.

## Prerequisites

1. Install the required npm packages:
```bash
npm install @react-native-community/geolocation
```

2. For iOS, install pods:
```bash
cd ios && pod install && cd ..
```

## Android Setup

The Android permissions have been added to `android/app/src/main/AndroidManifest.xml`:
- `ACCESS_FINE_LOCATION` - For precise location access
- `ACCESS_COARSE_LOCATION` - For approximate location access
- `POST_NOTIFICATIONS` - For notification permission (Android 13+)

No additional setup required for Android.

## iOS Setup

The iOS location permissions have been added to `ios/kaambuddy/Info.plist`:
- `NSLocationWhenInUseUsageDescription` - Description for location permission
- `NSLocationAlwaysAndWhenInUseUsageDescription` - Description for always location permission

No additional setup required for iOS.

## Features

### Location Permission
- Automatically requests location permission when the Dashboard loads
- Shows current location in the TopBar header
- Allows users to refresh location by tapping on the location text
- Falls back gracefully if permission is denied

### Notification Permission
- Automatically requests notification permission (Android 13+)
- iOS notification permissions will be handled when push notification library is added

## Usage

The permissions are automatically requested when:
1. User logs in and Dashboard loads
2. LocationContext initializes

Users can manually refresh location by tapping on the location text in the TopBar.

## Troubleshooting

### Location not showing
1. Check if location permission is granted in device settings
2. Ensure GPS is enabled on the device
3. Check console logs for any errors

### Permission denied
- Users can manually enable permissions in device settings
- The app will show an alert with instructions to open settings if permission is permanently denied

