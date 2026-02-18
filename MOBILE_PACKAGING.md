# Mobile Packaging Guide

## Overview
This Next.js application can be packaged for mobile using several approaches.

## Option 1: Capacitor (Recommended)
Capacitor wraps the web app in a native container.

### Setup
```bash
npm install @capacitor/core @capacitor/cli
npx cap init "Todo App" com.example.todoapp
npm install @capacitor/ios @capacitor/android
```

### Build & Deploy
```bash
npm run build
npx next export  # Generate static files
npx cap copy      # Copy to native projects
npx cap open ios   # Open in Xcode
npx cap open android  # Open in Android Studio
```

### Considerations
- SQLite: Use `@capacitor-community/sqlite` instead of `better-sqlite3` (native bridge)
- Server Actions: Must be replaced with API routes or local SQLite operations
- File paths: Adjust database path for mobile filesystem

## Option 2: PWA (Progressive Web App)
Add PWA support for installable web app without native wrapper.

### Setup
```bash
npm install next-pwa
```

Add to `next.config.ts`:
```typescript
const withPWA = require('next-pwa')({ dest: 'public' });
module.exports = withPWA(nextConfig);
```

### Benefits
- No app store submission
- Automatic updates
- Works offline with service worker caching

## Option 3: React Native (Rewrite)
For a fully native experience, rewrite UI using React Native with shared business logic.

## Database Considerations
| Platform | SQLite Solution |
|----------|----------------|
| Web | better-sqlite3 (server-side) |
| iOS/Android (Capacitor) | @capacitor-community/sqlite |
| React Native | react-native-sqlite-storage |
