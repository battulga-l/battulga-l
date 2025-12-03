# Mobile App Development Guide (React Native)

EduSphere-ийн мобайл апп хөгжүүлэх болон App Store, Play Store дээр гаргах иж бүрэн заавар.

## 📱 Технологийн стек

### Core
- **Framework**: React Native 0.73+
- **Language**: TypeScript
- **Navigation**: React Navigation 6.x
- **State Management**: Zustand / Redux Toolkit
- **API Client**: React Query + Axios

### UI/UX
- **UI Library**: React Native Paper / NativeBase
- **Icons**: React Native Vector Icons
- **Animations**: React Native Reanimated 3
- **Gestures**: React Native Gesture Handler

### Backend Integration
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **Storage**: Supabase Storage
- **Real-time**: Supabase Realtime
- **Push Notifications**: Firebase Cloud Messaging

### Development Tools
- **Build**: Expo (EAS Build) эсвэл bare React Native
- **Testing**: Jest + React Native Testing Library
- **Code Quality**: ESLint, Prettier, TypeScript

## 🏗️ Project Setup

### Option 1: Expo (Recommended for beginners)

Expo нь хялбар setup, хурдан development, OTA updates зэрэг давуу талтай.

```bash
# Create new Expo project
npx create-expo-app@latest edu-sphere-mobile --template

# Navigate to project
cd edu-sphere-mobile

# Install dependencies
npm install

# Start development server
npx expo start
```

**Dependencies install:**

```bash
# Navigation
npm install @react-navigation/native @react-navigation/stack @react-navigation/bottom-tabs
npx expo install react-native-screens react-native-safe-area-context

# Supabase
npm install @supabase/supabase-js
npx expo install @react-native-async-storage/async-storage

# UI Components
npm install react-native-paper
npm install react-native-vector-icons

# State Management
npm install zustand

# API & Data
npm install @tanstack/react-query axios

# Forms
npm install react-hook-form @hookform/resolvers zod

# Push Notifications
npx expo install expo-notifications
npm install firebase

# Other utilities
npx expo install expo-image-picker expo-document-picker
npx expo install expo-file-system expo-secure-store
```

### Option 2: Bare React Native

Илүү их native code control хэрэгтэй бол.

```bash
# Create new React Native project
npx react-native@latest init EduSphereMobile --template react-native-template-typescript

cd EduSphereMobile

# Install dependencies
npm install

# iOS setup (Mac only)
cd ios && pod install && cd ..

# Start Metro bundler
npm start

# Run on iOS
npm run ios

# Run on Android
npm run android
```

## 📁 Project Structure

```
edu-sphere-mobile/
├── src/
│   ├── api/                  # API clients & endpoints
│   │   ├── supabase.ts      # Supabase client setup
│   │   ├── auth.ts          # Authentication API
│   │   ├── courses.ts       # Courses API
│   │   └── users.ts         # Users API
│   ├── components/           # Reusable components
│   │   ├── common/          # Button, Card, Input, etc.
│   │   ├── courses/         # CourseCard, CourseList
│   │   ├── lessons/         # LessonCard, VideoPlayer
│   │   └── navigation/      # TabBar, Header
│   ├── screens/              # App screens
│   │   ├── auth/
│   │   │   ├── LoginScreen.tsx
│   │   │   ├── RegisterScreen.tsx
│   │   │   └── ForgotPasswordScreen.tsx
│   │   ├── home/
│   │   │   ├── HomeScreen.tsx
│   │   │   └── DashboardScreen.tsx
│   │   ├── courses/
│   │   │   ├── CoursesScreen.tsx
│   │   │   ├── CourseDetailScreen.tsx
│   │   │   └── LessonScreen.tsx
│   │   ├── profile/
│   │   │   ├── ProfileScreen.tsx
│   │   │   └── SettingsScreen.tsx
│   │   └── notifications/
│   │       └── NotificationsScreen.tsx
│   ├── navigation/           # Navigation configuration
│   │   ├── AppNavigator.tsx
│   │   ├── AuthNavigator.tsx
│   │   └── MainNavigator.tsx
│   ├── store/                # State management
│   │   ├── authStore.ts
│   │   ├── coursesStore.ts
│   │   └── userStore.ts
│   ├── hooks/                # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useCourses.ts
│   │   └── useNotifications.ts
│   ├── utils/                # Utility functions
│   │   ├── validation.ts
│   │   ├── formatting.ts
│   │   └── storage.ts
│   ├── constants/            # Constants & config
│   │   ├── colors.ts
│   │   ├── fonts.ts
│   │   └── config.ts
│   ├── types/                # TypeScript types
│   │   ├── api.ts
│   │   ├── navigation.ts
│   │   └── models.ts
│   └── assets/               # Images, fonts, etc.
│       ├── images/
│       ├── fonts/
│       └── icons/
├── app.json                  # Expo config (if using Expo)
├── eas.json                  # EAS Build config
├── package.json
├── tsconfig.json
└── .env                      # Environment variables
```

## 🔐 Environment Setup

**`.env` file:**

```env
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://ipejkjqvaqbubjfizwdu.supabase.co
EXPO_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_7B6CJMpmId_KoiZloJmkZw_jAmFCQKf

# API
EXPO_PUBLIC_API_URL=https://edusphere.mn/api

# Firebase (for push notifications)
EXPO_PUBLIC_FIREBASE_API_KEY=your-firebase-api-key
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
EXPO_PUBLIC_FIREBASE_APP_ID=your-app-id

# Feature Flags
EXPO_PUBLIC_ENABLE_ANALYTICS=true
EXPO_PUBLIC_ENABLE_CRASH_REPORTING=true
```

## 💻 Core Implementation

### 1. Supabase Client Setup

**`src/api/supabase.ts`:**

```typescript
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const supabaseUrl = Constants.expoConfig?.extra?.supabaseUrl;
const supabaseKey = Constants.expoConfig?.extra?.supabaseKey;

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
```

### 2. Authentication

**`src/hooks/useAuth.ts`:**

```typescript
import { useState, useEffect } from 'react';
import { supabase } from '@/api/supabase';
import { useAuthStore } from '@/store/authStore';

export function useAuth() {
  const [loading, setLoading] = useState(false);
  const { user, setUser, clearUser } = useAuthStore();

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (session?.user) {
          setUser(session.user);
        } else {
          clearUser();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signUp = async (email: string, password: string, profile: any) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: profile,
        },
      });
      
      if (error) throw error;
      return { success: true, user: data.user };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
      clearUser();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setLoading(false);
    }
  };

  return { user, loading, signIn, signUp, signOut };
}
```

### 3. Navigation Setup

**`src/navigation/AppNavigator.tsx`:**

```typescript
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useAuth } from '@/hooks/useAuth';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { ActivityIndicator, View } from 'react-native';

const Stack = createStackNavigator();

export default function AppNavigator() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
```

**`src/navigation/MainNavigator.tsx`:**

```typescript
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import HomeScreen from '@/screens/home/HomeScreen';
import CoursesScreen from '@/screens/courses/CoursesScreen';
import NotificationsScreen from '@/screens/notifications/NotificationsScreen';
import ProfileScreen from '@/screens/profile/ProfileScreen';

const Tab = createBottomTabNavigator();

export default function MainNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Courses') {
            iconName = focused ? 'book' : 'book-outline';
          } else if (route.name === 'Notifications') {
            iconName = focused ? 'notifications' : 'notifications-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Courses" component={CoursesScreen} />
      <Tab.Screen name="Notifications" component={NotificationsScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
```

### 4. Push Notifications

**`src/services/notifications.ts`:**

```typescript
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';
import { supabase } from '@/api/supabase';

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotifications() {
  let token;

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      alert('Failed to get push token for push notification!');
      return;
    }
    
    token = (await Notifications.getExpoPushTokenAsync()).data;
    
    // Save token to Supabase
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      await supabase
        .from('tbl_users')
        .update({ push_token: token })
        .eq('id', user.id);
    }
  } else {
    alert('Must use physical device for Push Notifications');
  }

  return token;
}

export function useNotifications() {
  const [expoPushToken, setExpoPushToken] = React.useState('');
  const [notification, setNotification] = React.useState<Notifications.Notification>();
  const notificationListener = React.useRef<Notifications.Subscription>();
  const responseListener = React.useRef<Notifications.Subscription>();

  React.useEffect(() => {
    registerForPushNotifications().then(token => setExpoPushToken(token ?? ''));

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log('Notification tapped:', response);
    });

    return () => {
      if (notificationListener.current) {
        Notifications.removeNotificationSubscription(notificationListener.current);
      }
      if (responseListener.current) {
        Notifications.removeNotificationSubscription(responseListener.current);
      }
    };
  }, []);

  return { expoPushToken, notification };
}
```

## 📦 Building for Production

### Expo Application Services (EAS)

EAS нь Expo-гийн cloud-based build service.

#### 1. EAS Setup

```bash
# Install EAS CLI globally
npm install -g eas-cli

# Login to Expo account
eas login

# Initialize EAS in your project
eas build:configure
```

#### 2. Configure `eas.json`

```json
{
  "cli": {
    "version": ">= 5.9.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal",
      "ios": {
        "simulator": false,
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "ios": {
        "resourceClass": "m-medium"
      },
      "android": {
        "buildType": "app-bundle"
      }
    }
  },
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "your-asc-app-id",
        "appleTeamId": "your-apple-team-id"
      },
      "android": {
        "serviceAccountKeyPath": "./google-service-account-key.json",
        "track": "production"
      }
    }
  }
}
```

#### 3. Build Commands

```bash
# iOS Development build
eas build --profile development --platform ios

# Android Development build
eas build --profile development --platform android

# iOS Preview build (TestFlight)
eas build --profile preview --platform ios

# Android Preview build (APK)
eas build --profile preview --platform android

# Production build - iOS
eas build --profile production --platform ios

# Production build - Android
eas build --profile production --platform android

# Build for both platforms
eas build --profile production --platform all
```

## 🍎 iOS App Store Submission

### Prerequisites

1. **Apple Developer Account** ($99/year)
   - Бүртгэл: https://developer.apple.com
   - Program enrollment хийх

2. **App Store Connect Account**
   - https://appstoreconnect.apple.com

### Step-by-Step Guide

#### 1. App Store Connect дээр App үүсгэх

```
1. App Store Connect руу нэвтрэх
2. "My Apps" → "+" → "New App" дарах
3. Мэдээлэл оруулах:
   - Platform: iOS
   - Name: EduSphere
   - Primary Language: Mongolian
   - Bundle ID: mn.edusphere.mobile
   - SKU: EDUSPHERE-IOS-001
```

#### 2. App Information оруулах

**App Information Tab:**
- App Name: EduSphere
- Subtitle: Боловсролын Систем
- Category: Education
- Content Rights: Checkbox тэмдэглэх

**Pricing and Availability:**
- Price: Free эсвэл Price tier сонгох
- Availability: Бүх улс орнууд эсвэл Mongolia л

#### 3. App Privacy гэрчилгээ

Apple шаардлагатай privacy information:

```
1. App Store Connect → App Privacy
2. "Get Started" дарах
3. Цуглуулж буй data-г зааж өгөх:
   
   ✅ Contact Info (email, name)
   ✅ User Content (photos, videos, documents)
   ✅ Identifiers (User ID)
   ✅ Usage Data (analytics)
   
4. Data ашиглалтын зорилго:
   - App Functionality
   - Analytics
   - Product Personalization
   
5. Save хийх
```

#### 4. App Version үүсгэх

**Version Information:**
- Version: 1.0.0
- Build: 1
- Copyright: © 2025 EduSphere LLC
- App Review Information:
  - Contact: battulga.edtech@gmail.com
  - Phone: +976-XXXX-XXXX
  - Demo Account: (test account credentials)

**App Screenshots (Required)**

iOS дээр screenshot sizes:
- 6.7" (iPhone 14 Pro Max): 1290 x 2796
- 6.5" (iPhone 11 Pro Max): 1242 x 2688
- 5.5" (iPhone 8 Plus): 1242 x 2208
- 12.9" iPad Pro: 2048 x 2732

Хамгийн багадаа 3-8 screenshots platform бүрт.

**App Preview Video (Optional)**
- Max 30 seconds
- .mov, .m4v, or .mp4 format

#### 5. Build Upload

**Using EAS:**

```bash
# Production build үүсгэх
eas build --profile production --platform ios

# Build дууссаны дараа EAS Dashboard дээр TestFlight руу илгээх
eas submit --platform ios

# Эсвэл automatic submission:
eas build --profile production --platform ios --auto-submit
```

**Using Xcode (alternative):**

```bash
# Archive үүсгэх
cd ios
xcodebuild -workspace EduSphere.xcworkspace \
  -scheme EduSphere \
  -configuration Release \
  -archivePath $PWD/build/EduSphere.xcarchive \
  archive

# Upload to App Store Connect
xcodebuild -exportArchive \
  -archivePath $PWD/build/EduSphere.xcarchive \
  -exportPath $PWD/build \
  -exportOptionsPlist ExportOptions.plist
```

#### 6. TestFlight Testing

Build upload хийсний дараа:

```
1. App Store Connect → TestFlight tab
2. Build processing хүлээх (10-60 min)
3. Export Compliance мэдээлэл оруулах
4. Internal Testing Group үүсгэх
5. Testers нэмэх (email-ээр)
6. "Start Testing" дарах
```

TestFlight link жишээ:
```
https://testflight.apple.com/join/YOUR_CODE
```

#### 7. App Review-д илгээх

**Review Information оруулах:**

```
1. App Review Information:
   - First Name: Battulga
   - Last Name: L
   - Phone: +976-XXXX-XXXX
   - Email: battulga.edtech@gmail.com
   
2. Demo Account (required for login apps):
   Username: demo@edusphere.mn
   Password: Demo123!@#
   
3. Notes:
   "EduSphere нь боловсролын байгууллагуудад зориулсан 
   platform юм. Demo account ашиглан бүх функцүүдийг 
   туршиж үзэх боломжтой."
   
4. Contact information:
   Support URL: https://edusphere.mn/support
   Marketing URL: https://edusphere.mn
   Privacy Policy URL: https://edusphere.mn/privacy
```

**Submit for Review:**

```
1. Бүх мэдээллийг шалгах
2. "Submit for Review" дарах
3. Apple-ийн хариуг хүлээх (usually 24-48 hours)
```

### Common Rejection Reasons & Solutions

#### 1. Guideline 2.1 - App Completeness
**Issue:** Demo account ажиллахгүй байна

**Solution:**
- Working demo account оруулах
- Clear instructions өгөх
- Video demo нэмэх

#### 2. Guideline 4.0 - Design
**Issue:** UI элементүүд Apple HIG (Human Interface Guidelines) дагаагүй

**Solution:**
- Native iOS components ашиглах
- Safe area respect хийх
- Dark mode дэмжлэг нэмэх

#### 3. Guideline 5.1.1 - Data Collection and Storage
**Issue:** Privacy policy хангалтгүй

**Solution:**
- Privacy policy link оруулах
- User consent авах mechanism нэмэх
- Opt-out option өгөх

## 🤖 Android Play Store Submission

### Prerequisites

1. **Google Play Developer Account** ($25 one-time fee)
   - Бүртгэл: https://play.google.com/console

2. **App Signing Key**
   - EAS build автоматаар үүсгэнэ
   - Эсвэл өөрөө үүсгэх

### Step-by-Step Guide

#### 1. Google Play Console дээр App үүсгэх

```
1. Play Console руу нэвтрэх
2. "Create app" дарах
3. Мэдээлэл оруулах:
   - App name: EduSphere
   - Default language: English (US) эсвэл Mongolian
   - App or game: App
   - Free or paid: Free
   - Declarations (checkboxes):
     ✓ Developer program policies
     ✓ US export laws
```

#### 2. Store Listing оруулах

**App details:**
- App name: EduSphere - Боловсролын Систем
- Short description (80 characters):
  ```
  Сургууль, сургалтын төвүүдэд зориулсан орчин үеийн систем
  ```

- Full description (4000 characters):
  ```
  EduSphere - Боловсролын Салбарын Cloud Шийдэл
  
  EduSphere нь боловсролын байгууллагуудад зориулсан иж бүрэн 
  платформ бөгөөд сургалтын менежмент, сургуулийн удирдлага, 
  хичээлийн контент зэрэг үйлчилгээг нэгтгэсэн байдаг.
  
  Гол функцүүд:
  ✅ Хичээлийн хөтөлбөр менежмент
  ✅ Даалгавар ба тест үүсгэлт
  ✅ Үнэлгээ ба дүнгийн систем
  ✅ Real-time мэдэгдэл
  ✅ Эцэг эх-багш харилцаа
  ✅ AI дэмжлэг
  ✅ Тайлан ба analytics
  
  Хэрэглэгчид:
  👨‍🎓 Суралцагчид - хичээл үзэх, даалгавар гүйцэтгэх
  👩‍🏫 Багш нар - контент оруулах, үнэлгээ өгөх
  👨‍💼 Админ - систем удирдах, тайлан үзэх
  👪 Эцэг эх - хүүхдийн явцыг хянах
  
  Бүртгэл үнэгүй! Өөрийн сургуулиа холбож ашиглаарай.
  ```

**Graphics:**

Screenshots (required - minimum 2, maximum 8):
- Phone: 16:9 aspect ratio, min 320px
- 7-inch tablet: min 1024px
- 10-inch tablet: min 1024px

```bash
# Screenshot sizes recommended:
Phone: 1080 x 1920 (Portrait) or 1920 x 1080 (Landscape)
Tablet: 1536 x 2048 (Portrait) or 2048 x 1536 (Landscape)
```

Feature Graphic (required):
- Size: 1024 x 500 pixels
- Format: JPEG or 24-bit PNG (no alpha)

App Icon (required):
- Size: 512 x 512 pixels
- Format: 32-bit PNG (with alpha)

**Categorization:**
- App category: Education
- Tags: education, learning, school, LMS, SMS

**Contact details:**
- Email: support@edusphere.mn
- Phone: +976-XXXX-XXXX
- Website: https://edusphere.mn

**Privacy Policy:**
- URL: https://edusphere.mn/privacy

#### 3. App Content оруулах

**Content rating questionnaire:**

```
1. Select category: Education
2. Answer questions:
   - Violence: No
   - Sexual content: No
   - Profanity: No
   - Controlled substances: No
   - Crude humor: No
   - Fear: No
   - Gambling: No
   - Interactive elements: Yes (Users interact, Digital purchases)
3. Calculate rating → Usually results in "Everyone" or "Everyone 10+"
```

**Target audience:**
- Age groups: 5-12, 13-17, 18+
- Designed for children: No

**News app:**
- No

**COVID-19 contact tracing/status:**
- No

**Data safety:**

```
Data collected:
✅ Personal information
  - Name
  - Email address
  - Phone number

✅ Photos and videos
  - Photos
  - Videos
  - Other files

✅ App activity
  - App interactions
  - In-app search history

Data security:
✅ Data is encrypted in transit
✅ Users can request data deletion
✅ Data is not shared with third parties
```

**Government apps:**
- No

**Financial features:**
- In-app purchases: Yes (if applicable)
- Payment info required: Yes (if applicable)

#### 4. Build Upload

**Using EAS:**

```bash
# AAB (Android App Bundle) build үүсгэх
eas build --profile production --platform android

# Google Play Console руу upload
eas submit --platform android

# Эсвэл manual upload:
# 1. EAS dashboard дээрээс .aab file татах
# 2. Play Console → Testing → Internal testing → Create release
# 3. .aab file upload хийх
```

**Manual signing (if not using EAS):**

```bash
# Generate keystore (first time only)
keytool -genkeypair -v \
  -storetype PKCS12 \
  -keystore edu-sphere-release.keystore \
  -alias edu-sphere \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000

# Build signed AAB
cd android
./gradlew bundleRelease

# AAB file location:
# android/app/build/outputs/bundle/release/app-release.aab
```

#### 5. Testing Tracks

Google Play нь олон testing tracks-тай:

**Internal Testing:**
- Max 100 testers
- Instant distribution
- Use for QA team

```
1. Play Console → Testing → Internal testing
2. Create release
3. Upload AAB
4. Add testers (emails)
5. Save and publish
```

**Closed Testing:**
- Up to 100 tracks
- Max 1000 testers per track
- Use for beta testing

**Open Testing:**
- Public beta
- Anyone can join
- Use before production

**Production:**
- Public release
- Full rollout or staged rollout

#### 6. Production Release

```
1. Play Console → Production → Create release
2. Upload AAB file
3. Release name: "1.0.0 - Initial Release"
4. Release notes:
   ```
   Initial release of EduSphere mobile app!
   
   Features:
   ✅ User authentication
   ✅ Course browsing
   ✅ Lesson viewing
   ✅ Assignment submission
   ✅ Push notifications
   ✅ Profile management
   
   Feedback welcome at support@edusphere.mn
   ```
5. Staged rollout (recommended):
   - Start with 5-10%
   - Monitor crashes/ANRs
   - Gradually increase to 100%
   
6. Review and rollout
```

#### 7. Post-Launch Monitoring

**Play Console metrics to watch:**
- Crashes & ANRs (Android Not Responding)
- User ratings & reviews
- Install/uninstall rates
- User engagement

**Firebase Crashlytics:**

```bash
npm install @react-native-firebase/app @react-native-firebase/crashlytics

# In your app
import crashlytics from '@react-native-firebase/crashlytics';

// Log errors
crashlytics().recordError(error);

// Set user info
crashlytics().setUserId(userId);
```

## 🚀 Release Checklist

### iOS Pre-Release

- [ ] App Store Connect app үүсгэсэн
- [ ] Screenshots (all required sizes) бэлтгэсэн
- [ ] App icon (1024x1024) бэлтгэсэн
- [ ] Privacy policy URL нэмсэн
- [ ] Support URL нэмсэн
- [ ] Demo account credentials оруулсан
- [ ] App review information бөглөсөн
- [ ] TestFlight testing хийгдсэн
- [ ] Build production-ready
- [ ] Version number & build number зөв

### Android Pre-Release

- [ ] Play Console app үүсгэсэн
- [ ] Store listing бүрэн бөглөсөн
- [ ] Screenshots бэлтгэсэн
- [ ] Feature graphic үүсгэсэн
- [ ] App icon (512x512) бэлтгэсэн
- [ ] Privacy policy URL нэмсэн
- [ ] Content rating авсан
- [ ] Data safety form бөглөсөн
- [ ] Internal testing хийгдсэн
- [ ] AAB file signed
- [ ] Version code & name зөв

### Both Platforms

- [ ] Environment variables production-ready
- [ ] API endpoints production URL
- [ ] Analytics configured
- [ ] Crash reporting enabled
- [ ] Push notifications tested
- [ ] Deep linking configured
- [ ] In-app purchases tested (if applicable)
- [ ] Performance optimized
- [ ] Memory leaks fixed
- [ ] Offline functionality tested
- [ ] Dark mode tested
- [ ] Localization complete
- [ ] Terms of Service & Privacy Policy links working
- [ ] Support contact info correct

## 📊 Analytics & Monitoring

### Firebase Analytics

```bash
npm install @react-native-firebase/analytics

# Usage
import analytics from '@react-native-firebase/analytics';

// Log events
await analytics().logEvent('course_viewed', {
  course_id: courseId,
  course_name: courseName,
});

// Set user properties
await analytics().setUserProperty('user_type', 'student');

// Track screens
await analytics().logScreenView({
  screen_name: 'CourseDetail',
  screen_class: 'CourseDetailScreen',
});
```

### Sentry for Error Tracking

```bash
npm install @sentry/react-native

# sentry.config.js
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'your-sentry-dsn',
  enableAutoSessionTracking: true,
  sessionTrackingIntervalMillis: 10000,
  tracesSampleRate: 1.0,
});

export default Sentry;
```

## 🔄 Updates & Maintenance

### Over-The-Air (OTA) Updates (Expo only)

```bash
# Install expo-updates
npx expo install expo-updates

# Configure in app.json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_LOAD",
      "fallbackToCacheTimeout": 0
    }
  }
}

# Publish update
eas update --branch production --message "Bug fixes"
```

### Regular Maintenance

**Weekly:**
- Review crash reports
- Monitor user reviews
- Check analytics

**Monthly:**
- Bug fixes release
- Performance optimization
- Update dependencies

**Quarterly:**
- Major feature releases
- Security audits
- Compliance reviews

## 🆘 Troubleshooting

### iOS Build Issues

**Issue: Provisioning profile error**

Solution:
```bash
# Clean and rebuild
cd ios
rm -rf Pods Podfile.lock
pod install --repo-update
cd ..
npx react-native run-ios
```

**Issue: Code signing error**

Solution:
1. Xcode → Preferences → Accounts
2. Add Apple ID
3. Download certificates
4. Project → Signing & Capabilities → Select Team

### Android Build Issues

**Issue: Gradle build failed**

Solution:
```bash
cd android
./gradlew clean
./gradlew bundleRelease --stacktrace
```

**Issue: Keystore not found**

Solution:
```bash
# Verify keystore exists
ls -la ~/.android/debug.keystore

# Regenerate if needed
keytool -genkey -v -keystore debug.keystore \
  -storepass android -alias androiddebugkey \
  -keypass android -keyalg RSA -keysize 2048 -validity 10000
```

## 📚 Resources

### Official Documentation

- [React Native Docs](https://reactnative.dev/docs/getting-started)
- [Expo Docs](https://docs.expo.dev/)
- [Apple Developer](https://developer.apple.com/documentation/)
- [Android Developers](https://developer.android.com/)
- [EAS Build](https://docs.expo.dev/build/introduction/)

### App Store Guidelines

- [iOS App Store Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)
- [Google Play Policy Center](https://play.google.com/about/developer-content-policy/)
- [App Store Connect Help](https://help.apple.com/app-store-connect/)
- [Play Console Help](https://support.google.com/googleplay/android-developer/)

### Useful Tools

- [App Icon Generator](https://www.appicon.co/)
- [Screenshot Generator](https://www.applaunchpad.com/)
- [Feature Graphic Template](https://developer.android.com/distribute/marketing-tools/device-art-generator)
- [ASO Tools](https://www.appannie.com/) (App Store Optimization)

## 💡 Tips & Best Practices

### Development

1. **Start with Expo** - Хялбар, хурдан development
2. **Use TypeScript** - Type safety, better DX
3. **Follow naming conventions** - Consistent codebase
4. **Write tests** - Prevent regressions
5. **Use Prettier & ESLint** - Code quality

### Design

1. **Follow platform guidelines** - iOS HIG, Material Design
2. **Support dark mode** - User preference
3. **Make it accessible** - VoiceOver, TalkBack support
4. **Optimize images** - Reduce app size
5. **Use vector icons** - Scalable, sharp

### Performance

1. **Lazy load screens** - Faster initial load
2. **Optimize images** - Use appropriate resolutions
3. **Cache network requests** - Better offline experience
4. **Profile regularly** - Use Flipper, React DevTools
5. **Monitor memory** - Avoid leaks

### Security

1. **Store secrets securely** - Use SecureStore/Keychain
2. **Validate inputs** - Prevent injection attacks
3. **Use HTTPS** - Encrypt network traffic
4. **Implement biometric auth** - TouchID/FaceID
5. **Obfuscate code** - Protect from reverse engineering

### Testing

1. **Test on real devices** - Emulators aren't enough
2. **Test different OS versions** - Fragmentation
3. **Test slow networks** - 3G simulation
4. **Test interruptions** - Phone calls, notifications
5. **Beta test widely** - Get real user feedback

## 📞 Support & Help

Асуудал эсвэл туслалц хэрэгтэй бол:

- 📧 Email: battulga.edtech@gmail.com
- 💬 Documentation: https://edusphere.mn/docs
- 🎯 GitHub Issues: https://github.com/battulga-l/edu-sphere

**Common Questions:**

1. **Expo эсвэл bare React Native?**
   - Expo: Хялбар, хурдан, OTA updates
   - Bare: Илүү control, custom native modules

2. **iOS эсвэл Android эмнэ эхэлэх вэ?**
   - iOS: Хэрэв Mac байвал
   - Android: Илүү хялбар setup
   - Best: Хоёуланг нь parallel

3. **Apple Developer Account хэзээ авах вэ?**
   - TestFlight testing эхлэх үед
   - Production submission-ийн өмнө
   - 1 сарын өмнө (processing time)

4. **App rejection хийгдвэл яах вэ?**
   - Rejection reason сайтар уншиx
   - Reviewer notes шалгах
   - Fix хийж дахин submit
   - Appeal хийх (хэрэв буруу rejection)

---

**Last Updated**: November 30, 2025
**Version**: 1.0.0
**Author**: Battulga L.
