# Assets Directory

This directory contains all the static assets for the KaamBuddy app.

## ⚠️ IMPORTANT: Add Your Logo

**The app is currently using a fallback text logo ("KB") because the logo.png file is missing.**

### To Add Your Logo:

1. **Place your logo file** in this directory:
   ```
   kaambuddy/assets/logo.png
   ```

2. **Logo Requirements:**
   - **Size**: 512x512px (recommended)
   - **Format**: PNG with transparent background
   - **Usage**: App icon and splash screen

3. **After adding the logo**, the app will automatically use your image instead of the text logo.

## Required Assets

### Logo
- **File**: `logo.png` ⚠️ **MISSING - Add this file**
- **Size**: 512x512px (recommended)
- **Format**: PNG with transparent background
- **Usage**: App icon and splash screen

### Splash Screen Image/Video
- **Image File**: `splash-image.png` (optional)
- **Video File**: `splash-video.mp4` (optional)
- **Size**: Match your app's screen dimensions
- **Format**: PNG for image, MP4 for video

## How to Add Assets

1. **Add your logo**:
   - Place your logo file as `logo.png` in this directory
   - The app will automatically use the image instead of text

2. **Add splash screen image/video**:
   - Place your splash screen assets in this directory
   - Update the SplashScreen component to display your custom assets

3. **Update app icon**:
   - For Android: Replace files in `android/app/src/main/res/mipmap-*`
   - For iOS: Replace files in `ios/kaambuddy/Images.xcassets/AppIcon.appiconset`

## Current Implementation

The app currently uses:
- **Fallback text logo** ("KB") in green color (#77cc00)
- **Green theme colors** (#77cc00, #f4f5f7)
- **Animated splash screen** with fade and scale effects

## Quick Fix

To resolve the logo issue immediately:

1. **Copy your logo file** to this directory:
   ```bash
   cp your-logo.png kaambuddy/assets/logo.png
   ```

2. **Restart the Metro bundler**:
   ```bash
   npm start
   ```

3. **The app will now display your logo** instead of the "KB" text.

Replace the placeholder assets with your actual logo and splash screen materials for a complete branded experience.
