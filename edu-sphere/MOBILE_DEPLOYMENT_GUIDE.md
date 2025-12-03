# EduSphere Mobile App Development & Deployment Guide

## Overview

This comprehensive guide covers the complete process of developing and deploying the EduSphere mobile application for both Android and iOS platforms.

## Table of Contents

1. [Technology Stack](#technology-stack)
2. [Progressive Web App (PWA) Setup](#pwa-setup)
3. [React Native Setup (Alternative)](#react-native-setup)
4. [Mobile Features](#mobile-features)
5. [Android Build & Deployment](#android-deployment)
6. [iOS Build & Deployment](#ios-deployment)
7. [App Store Submission](#app-store-submission)

---

## Technology Stack

### Option 1: Progressive Web App (PWA) - Recommended
**Advantages:**
- Single codebase for web and mobile
- Instant updates without app store approval
- Works offline with service workers
- Can be installed on both Android and iOS
- Lower maintenance cost
- Already have Next.js web app ready

**Limitations:**
- Limited access to native device features
- iOS support is basic (no push notifications)
- Cannot be published to app stores as native apps

### Option 2: React Native with Expo
**Advantages:**
- Full native app experience
- Access to all device features
- Can be published to Play Store & App Store
- Better performance for complex animations
- Native UI components

**Limitations:**
- Separate codebase from web
- Requires more development time
- App store review process needed for updates

---

## PWA Setup (Recommended Quick Start)

### Step 1: Install PWA Dependencies

```bash
cd /Users/battulga/git/battulga-l/edu-sphere/apps/web
npm install next-pwa@5.6.0
```

### Step 2: Create next.config.js with PWA Support

```javascript
// apps/web/next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https?.*/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'offlineCache',
        expiration: {
          maxEntries: 200,
        },
      },
    },
  ],
});

module.exports = withPWA({
  reactStrictMode: true,
  swcMinify: true,
});
```

### Step 3: Create Web Manifest

```json
// apps/web/public/manifest.json
{
  "name": "EduSphere - Educational Management System",
  "short_name": "EduSphere",
  "description": "Modern educational management system for schools and universities",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### Step 4: Update Root Layout for PWA

```typescript
// apps/web/src/app/layout.tsx
export const metadata = {
  // ... existing metadata
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'EduSphere',
  },
  formatDetection: {
    telephone: false,
  },
};
```

### Step 5: Create Icons

Use an online tool like [PWA Asset Generator](https://www.pwabuilder.com/) or create manually:

```bash
# Create icons directory
mkdir -p apps/web/public/icons

# Use ImageMagick to generate all sizes (if you have a logo.png)
convert logo.png -resize 72x72 apps/web/public/icons/icon-72x72.png
convert logo.png -resize 96x96 apps/web/public/icons/icon-96x96.png
convert logo.png -resize 128x128 apps/web/public/icons/icon-128x128.png
convert logo.png -resize 144x144 apps/web/public/icons/icon-144x144.png
convert logo.png -resize 152x152 apps/web/public/icons/icon-152x152.png
convert logo.png -resize 192x192 apps/web/public/icons/icon-192x192.png
convert logo.png -resize 384x384 apps/web/public/icons/icon-384x384.png
convert logo.png -resize 512x512 apps/web/public/icons/icon-512x512.png
```

### Step 6: Test PWA Locally

```bash
npm run build
npm run start
# Open Chrome DevTools > Application > Manifest
```

### Step 7: Deploy PWA

Deploy to Vercel/Netlify/Your hosting:

```bash
# Vercel
vercel --prod

# Or push to main branch if connected to Vercel
git push origin main
```

---

## React Native Setup (Full Native App)

### Step 1: Initialize React Native with Expo

```bash
cd /Users/battulga/git/battulga-l/edu-sphere
npx create-expo-app@latest apps/mobile --template blank-typescript
cd apps/mobile
```

### Step 2: Install Dependencies

```bash
# Navigation
npm install @react-navigation/native @react-navigation/native-stack @react-navigation/bottom-tabs
npm install react-native-screens react-native-safe-area-context

# UI Components
npm install react-native-paper react-native-vector-icons
npm install react-native-gesture-handler react-native-reanimated

# API & State Management
npm install axios @tanstack/react-query zustand
npm install @react-native-async-storage/async-storage

# Forms
npm install react-hook-form @hookform/resolvers zod
```

### Step 3: Project Structure

```
apps/mobile/
├── src/
│   ├── components/         # Reusable components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   └── Loading.tsx
│   ├── screens/            # Screen components
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   └── RegisterScreen.tsx
│   │   ├── dashboard/
│   │   │   └── DashboardScreen.tsx
│   │   ├── courses/
│   │   │   ├── CoursesListScreen.tsx
│   │   │   └── CourseDetailScreen.tsx
│   │   └── profile/
│   │       └── ProfileScreen.tsx
│   ├── navigation/         # Navigation setup
│   │   ├── AppNavigator.tsx
│   │   └── AuthNavigator.tsx
│   ├── services/          # API services
│   │   ├── api.ts
│   │   ├── auth.service.ts
│   │   └── courses.service.ts
│   ├── stores/            # Zustand stores
│   │   └── authStore.ts
│   ├── types/             # TypeScript types
│   │   └── index.ts
│   └── utils/             # Utility functions
│       ├── storage.ts
│       └── validators.ts
├── App.tsx
├── app.json
└── package.json
```

### Step 4: Core Files Setup

#### API Service (src/services/api.ts)

```typescript
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = 'https://your-api-url.com'; // Replace with your API URL

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for handling errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await AsyncStorage.removeItem('token');
      // Navigate to login screen
    }
    return Promise.reject(error);
  }
);

export default api;
```

#### Authentication Store (src/stores/authStore.ts)

```typescript
import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,

  login: async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      
      await AsyncStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
    } catch (error) {
      throw error;
    }
  },

  logout: async () => {
    await AsyncStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  },

  loadUser: async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        const response = await api.get('/auth/me');
        set({ user: response.data, token, isAuthenticated: true, isLoading: false });
      } else {
        set({ isLoading: false });
      }
    } catch (error) {
      set({ isLoading: false });
    }
  },
}));
```

#### Login Screen (src/screens/auth/LoginScreen.tsx)

```typescript
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { TextInput, Button, Text, useTheme } from 'react-native-paper';
import { useAuthStore } from '../../stores/authStore';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const login = useAuthStore((state) => state.login);
  const theme = useTheme();

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      await login(email, password);
      // Navigation will happen automatically via AuthNavigator
    } catch (err) {
      setError('Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineLarge" style={styles.title}>
        EduSphere
      </Text>
      
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        mode="outlined"
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        mode="outlined"
        secureTextEntry
        style={styles.input}
      />
      
      {error ? <Text style={styles.error}>{error}</Text> : null}
      
      <Button
        mode="contained"
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 40,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    marginTop: 16,
  },
  error: {
    color: 'red',
    textAlign: 'center',
    marginTop: 8,
  },
});
```

---

## Mobile Features

### Features to Implement

1. **Authentication**
   - Login/Logout
   - Token management
   - Role-based navigation

2. **Dashboard**
   - Role-specific dashboards (Admin, Teacher, Student)
   - Statistics cards
   - Quick actions

3. **Courses**
   - Course list with search
   - Course details
   - Lessons viewer

4. **Classes**
   - Class schedule
   - Enrolled classes
   - Class materials

5. **Attendance**
   - Mark attendance (Teacher)
   - View attendance (Student)

6. **Grades**
   - View grades
   - Grade breakdown

7. **Profile**
   - View/Edit profile
   - Change password
   - Settings

---

## Android Deployment

### Step 1: Build APK/AAB

#### For Expo:

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Configure project
eas build:configure

# Build APK (for testing)
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production
```

#### For React Native CLI:

```bash
cd android
./gradlew assembleRelease

# APK will be at:
# android/app/build/outputs/apk/release/app-release.apk

# For AAB (Google Play):
./gradlew bundleRelease

# AAB will be at:
# android/app/build/outputs/bundle/release/app-release.aab
```

### Step 2: Sign the App

```bash
# Generate keystore
keytool -genkeypair -v -keystore edu-sphere-release.keystore \
  -alias edu-sphere -keyalg RSA -keysize 2048 -validity 10000

# Add to android/gradle.properties
MYAPP_RELEASE_STORE_FILE=edu-sphere-release.keystore
MYAPP_RELEASE_KEY_ALIAS=edu-sphere
MYAPP_RELEASE_STORE_PASSWORD=****
MYAPP_RELEASE_KEY_PASSWORD=****
```

### Step 3: Google Play Console Setup

1. Go to [Google Play Console](https://play.google.com/console)
2. Create new app
3. Fill in app details:
   - App name: EduSphere
   - Default language: English
   - App category: Education
4. Upload screenshots (phone, tablet, etc.)
5. Write app description
6. Set content rating
7. Upload AAB file
8. Submit for review

### Required Assets:
- App icon: 512x512px
- Feature graphic: 1024x500px
- Screenshots: At least 2 (phone), 1920x1080px recommended
- Privacy policy URL

---

## iOS Deployment

### Step 1: Apple Developer Account

- Enroll in [Apple Developer Program](https://developer.apple.com/programs/) ($99/year)
- Create App ID
- Create provisioning profile

### Step 2: Build IPA

#### For Expo:

```bash
# Build for iOS
eas build --platform ios --profile production

# Submit to App Store
eas submit --platform ios
```

#### For React Native CLI:

```bash
# Open in Xcode
cd ios
open EduSphere.xcworkspace

# In Xcode:
# 1. Select "Any iOS Device" as target
# 2. Product > Archive
# 3. Distribute App > App Store Connect
# 4. Upload
```

### Step 3: App Store Connect Setup

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Create new app
3. Fill in app information:
   - Name: EduSphere
   - Primary language: English
   - Category: Education
4. Upload screenshots
5. Write app description
6. Set pricing (Free or Paid)
7. Submit for review

### Required Assets:
- App icon: 1024x1024px (no alpha channel)
- Screenshots for:
  - iPhone 6.7" (1290x2796px)
  - iPhone 5.5" (1242x2208px)
  - iPad Pro 12.9" (2048x2732px)

---

## App Store Submission Checklist

### Both Platforms:

- [ ] App icon created (multiple sizes)
- [ ] Screenshots captured (5-8 per device type)
- [ ] App description written (compelling, keyword-rich)
- [ ] Privacy policy URL provided
- [ ] App tested on physical devices
- [ ] All permissions explained
- [ ] Crash-free builds
- [ ] Loading states implemented
- [ ] Offline functionality tested
- [ ] Dark mode support
- [ ] Accessibility features
- [ ] Terms of Service agreed

### Android Specific:
- [ ] AAB file signed
- [ ] Content rating completed
- [ ] Target API level 33+ (Android 13)
- [ ] App bundle explorer reviewed
- [ ] Pre-launch report passed

### iOS Specific:
- [ ] App Store Connect agreement signed
- [ ] Tax forms submitted
- [ ] Banking information entered (if paid app)
- [ ] TestFlight beta testing completed
- [ ] App Review Information provided
- [ ] Export compliance information

---

## Testing Strategy

### Before Submission:

1. **Functionality Testing**
   - All features work as expected
   - Forms validate correctly
   - API calls handle errors gracefully

2. **Performance Testing**
   - App loads in < 3 seconds
   - Smooth animations (60fps)
   - Memory usage < 100MB

3. **Compatibility Testing**
   - Android 8.0+ (API 26+)
   - iOS 13.0+
   - Tablets and phones

4. **Security Testing**
   - Secure API communication (HTTPS)
   - Token storage encrypted
   - Sensitive data not logged

---

## Maintenance & Updates

### Regular Updates:
- Bug fixes: As needed
- Feature updates: Monthly
- Security patches: Immediate
- OS compatibility: Every major release

### Monitoring:
- Crash analytics: Firebase/Sentry
- User analytics: Google Analytics/Mixpanel
- Performance monitoring: Firebase Performance

---

## Cost Estimation

### One-time Costs:
- Apple Developer: $99/year
- Google Play Developer: $25 one-time
- App icons/design: $100-500 (if outsourced)

### Recurring Costs:
- Server hosting: Varies
- Push notifications: Free (Firebase)
- Analytics: Free tier available
- App store maintenance: Minimal

---

## Next Steps

1. **Choose Approach**: PWA (quick) or React Native (full native)
2. **If PWA**: Follow PWA setup steps above
3. **If React Native**: Complete React Native setup
4. **Design Icons**: Create app icons and splash screens
5. **Test Thoroughly**: On multiple devices
6. **Submit to Stores**: Follow platform-specific guides
7. **Monitor & Iterate**: Based on user feedback

---

## Resources

- [Next.js PWA Documentation](https://github.com/shadowwalker/next-pwa)
- [Expo Documentation](https://docs.expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [App Store Connect Help](https://developer.apple.com/help/app-store-connect/)
- [PWA Builder](https://www.pwabuilder.com/)

---

**Generated**: November 2025  
**Version**: 1.0
