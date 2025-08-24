# KaamBuddy Setup Guide

## 🎨 New Features Implemented

### ✅ Completed Features
- **New Theme Colors**: Updated to green theme (#77cc00, #f4f5f7)
- **Splash Screen**: Animated splash screen with new colors
- **Login Screen**: Phone number and Google authentication
- **Signup Screen**: Full name, phone number, and Google signup
- **Authentication Flow**: Seamless navigation between login/signup/main app
- **Modern UI**: Clean, professional design with new theme

### 📱 App Flow
1. **Splash Screen** (3 seconds) → 
2. **Login Screen** (default) → 
3. **Signup Screen** (optional) → 
4. **Main App** (after authentication)

## 🖼️ Adding Your Assets

### 1. Logo Setup
```bash
# Add your logo to the assets folder
cp your-logo.png kaambuddy/assets/logo.png
```

**Logo Requirements:**
- **Size**: 512x512px (recommended)
- **Format**: PNG with transparent background
- **Usage**: App icon and splash screen

### 2. Splash Screen Image/Video
```bash
# For image splash screen
cp your-splash-image.png kaambuddy/assets/splash-image.png

# For video splash screen (optional)
cp your-splash-video.mp4 kaambuddy/assets/splash-video.mp4
```

### 3. Update Splash Screen Component
Edit `src/components/SplashScreen.jsx`:
```javascript
// Replace the text logo with your image
<Image 
  source={require('../../assets/logo.png')} 
  style={styles.logoImage}
  resizeMode="contain"
/>
```

## 🔐 Google Authentication Setup

### 1. Install Dependencies
```bash
cd kaambuddy
npm install @react-native-google-signin/google-signin
```

### 2. Android Configuration
Add to `android/app/build.gradle`:
```gradle
dependencies {
    implementation 'com.google.android.gms:play-services-auth:20.7.0'
}
```

### 3. iOS Configuration
Add to `ios/Podfile`:
```ruby
pod 'GoogleSignIn'
```

### 4. Google Cloud Console Setup
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google Sign-In API
4. Create OAuth 2.0 credentials
5. Add your app's package name and SHA-1 fingerprint

### 5. Update Login/Signup Components
Replace the simulated Google login with real implementation:
```javascript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

// Initialize Google Sign-In
GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID',
});

// Real Google login implementation
const handleGoogleLogin = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
    onLogin();
  } catch (error) {
    console.error(error);
  }
};
```

## 📱 App Icon Setup

### Android
Replace files in these directories:
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png`
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png`

### iOS
Replace files in:
- `ios/kaambuddy/Images.xcassets/AppIcon.appiconset/`

## 🎥 Video Splash Screen (Optional)

### 1. Install Video Dependencies
```bash
npm install react-native-video
```

### 2. Use VideoSplashScreen Component
Update `App.jsx`:
```javascript
import VideoSplashScreen from './src/components/VideoSplashScreen.jsx';

// Use video splash screen
<VideoSplashScreen onFinish={handleSplashFinish} useVideo={true} />
```

## 🚀 Running the App

### 1. Install Dependencies
```bash
cd kaambuddy
npm install
```

### 2. Start Metro Bundler
```bash
npm start
```

### 3. Run on Android
```bash
npm run android
```

### 4. Run on iOS
```bash
npm run ios
```

## 📋 Current Features

### Authentication
- ✅ Phone number login/signup
- ✅ Google authentication (simulated)
- ✅ Form validation
- ✅ Loading states
- ✅ Error handling

### UI/UX
- ✅ Modern green theme (#77cc00, #f4f5f7)
- ✅ Animated splash screen
- ✅ Responsive design
- ✅ Keyboard handling
- ✅ Loading indicators

### Navigation
- ✅ Splash → Login → Main App
- ✅ Login ↔ Signup switching
- ✅ Authentication state management

## 🔧 Customization

### Theme Colors
Update colors in all components:
- **Primary**: #77cc00 (Green)
- **Background**: #f4f5f7 (Light Gray)
- **Text**: #333 (Dark Gray)
- **Secondary Text**: #666 (Medium Gray)

### Splash Screen Duration
Edit `src/components/SplashScreen.jsx`:
```javascript
// Change from 3000ms to your preferred duration
setTimeout(() => {
  // ...
}, 5000); // 5 seconds
```

## 📞 Phone Authentication Setup

For real phone authentication, you'll need:
1. **Firebase** or similar service
2. **SMS verification** setup
3. **OTP verification** screen

## 🎯 Next Steps

1. **Add your logo and assets**
2. **Set up Google Cloud Console**
3. **Configure Firebase for phone auth**
4. **Add real API endpoints**
5. **Test on physical devices**

Your KaamBuddy app is now ready with a beautiful green theme, authentication flow, and modern UI! 🎉
