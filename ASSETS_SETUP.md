# 🎨 Assets Setup Guide for KaamBuddy

## 📁 Required Assets

You need to add these files to the `kaambuddy/assets/` directory:

### 1. Logo Image
**File**: `kaambuddy/assets/logo.png`
- **Format**: PNG with transparent background
- **Size**: 512x512px (recommended)
- **Usage**: Appears in splash screen, login, and signup screens

### 2. Splash Background Image
**File**: `kaambuddy/assets/splashimage.jpg`
- **Format**: JPG/JPEG
- **Size**: 1920x1080px (recommended)
- **Usage**: Background for splash screen

**Note**: The import path uses `splashimage.jpg` (not `spashscreen.jpg`)

## 🚀 Quick Setup Steps

### Step 1: Add Your Assets
1. Copy your logo file to: `kaambuddy/assets/logo.png`
2. Copy your splash image to: `kaambuddy/assets/splashimage.jpg`

### Step 2: Verify File Structure
Your assets folder should look like this:
```
kaambuddy/assets/
├── logo.png          ← Your logo here
├── splashimage.jpg   ← Your splash background here
└── README.md
```

### Step 3: Restart Metro Bundler
```bash
npm start
```

## 🎯 Current Implementation

### ✅ What's Already Done:
- **Import statements** are set up in all components
- **Image components** are configured to use your assets
- **Button colors** are all set to #77cc00 (green theme)
- **Splash screen** uses splashimage.jpg as background
- **Logo** appears in splash, login, and signup screens

### 📱 Components Using Assets:

#### SplashScreen.jsx
```javascript
import logo from '../../assets/logo.png';
import splashImage from '../../assets/splashimage.jpg';

// Uses splashImage as background
<ImageBackground source={splashImage} ...>

// Uses logo in the center
<Image source={logo} style={styles.logoImage} ...>
```

#### LoginScreen.jsx
```javascript
import logo from '../../assets/logo.png';

// Uses logo at the top
<Image source={logo} style={styles.logoImage} ...>
```

#### SignupScreen.jsx
```javascript
import logo from '../../assets/logo.png';

// Uses logo at the top
<Image source={logo} style={styles.logoImage} ...>
```

## 🎨 Design Specifications

### Color Scheme:
- **Primary Green**: #77cc00
- **Background**: #f4f5f7 (light gray)
- **Text**: #333 (dark), #666 (medium)

### Logo Display:
- **Splash Screen**: 80x80px in white circle
- **Login/Signup**: 80x80px at top of screen
- **Background**: Semi-transparent green overlay on splash image

## ⚠️ Troubleshooting

### If images don't load:
1. **Check file names** - must be exactly `logo.png` and `splashimage.jpg`
2. **Check file location** - must be in `kaambuddy/assets/` directory
3. **Restart Metro bundler** - `npm start`
4. **Clear cache** - `npx react-native start --reset-cache`

### If you get import errors:
- Make sure files exist before running the app
- Check file extensions (.png, .jpg)
- Verify file paths in import statements

## 🎉 Ready to Go!

Once you add your assets:
1. **Splash screen** will show your splash image with logo overlay
2. **Login screen** will display your logo at the top
3. **Signup screen** will display your logo at the top
4. **All buttons** will have the green #77cc00 background

Your KaamBuddy app will be fully branded and ready to use! 🚀
