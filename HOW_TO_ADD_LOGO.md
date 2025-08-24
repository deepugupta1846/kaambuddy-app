# How to Add Your Logo to KaamBuddy

## 🎯 Quick Steps

### 1. Add Your Logo File
Place your logo image file in the assets directory:
```
kaambuddy/assets/logo.png
```

**Requirements:**
- **Format**: PNG (with transparent background recommended)
- **Size**: 512x512px (recommended) or any square aspect ratio
- **File name**: Must be exactly `logo.png`

### 2. Update the Components

After adding your logo.png file, update these components:

#### A. SplashScreen.jsx
In `src/components/SplashScreen.jsx`, find this section:
```javascript
<View style={styles.logo}>
  {/* Logo will be displayed when you add logo.png to assets folder */}
  <Text style={styles.logoText}>KB</Text>
  {/* 
  Uncomment this when you add logo.png to assets folder:
  <Image 
    source={require('../../assets/logo.png')} 
    style={styles.logoImage}
    resizeMode="contain"
  />
  And comment out the Text component above
  */}
</View>
```

**Change it to:**
```javascript
<View style={styles.logo}>
  <Image 
    source={require('../../assets/logo.png')} 
    style={styles.logoImage}
    resizeMode="contain"
  />
</View>
```

#### B. LoginScreen.jsx
In `src/components/LoginScreen.jsx`, find:
```javascript
<Text style={styles.logo}>KB</Text>
```

**Change it to:**
```javascript
<Image 
  source={require('../../assets/logo.png')} 
  style={styles.logoImage}
  resizeMode="contain"
/>
```

And add this style to the styles object:
```javascript
logoImage: {
  width: 80,
  height: 80,
},
```

#### C. SignupScreen.jsx
Same changes as LoginScreen.jsx

### 3. Restart Metro Bundler
After making changes:
```bash
npm start
```

## 🔧 Alternative: Use Image URI

If you prefer to use an image from a URL:

```javascript
<Image 
  source={{ uri: 'https://your-domain.com/logo.png' }}
  style={styles.logoImage}
  resizeMode="contain"
/>
```

## 📱 App Icon Update

To update the actual app icon (launcher icon):

### Android
Replace these files with your logo:
- `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` (72x72)
- `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` (48x48)
- `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` (96x96)
- `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` (144x144)
- `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` (192x192)

### iOS
Replace files in:
- `ios/kaambuddy/Images.xcassets/AppIcon.appiconset/`

## 🎨 Current Design

The app uses these colors:
- **Primary Green**: #77cc00
- **Background**: #f4f5f7
- **Text**: #333, #666

Make sure your logo works well with these colors!

## ✅ Verification

After adding your logo, you should see it in:
1. Splash screen (animated, in a white circle)
2. Login screen (above "Welcome Back!")
3. Signup screen (above "Create Account")

Your logo is ready! 🎉


