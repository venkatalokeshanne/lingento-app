# Firestore Security Rules

## Instructions
1. Go to your Firebase Console
2. Navigate to Firestore Database
3. Click on "Rules" tab
4. Replace your existing rules with the consolidated rules below

## Consolidated Security Rules

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // User vocabulary collection - users can only access their own vocabulary
    match /users/{userId}/vocabulary/{wordId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User preferences collection - users can only access their own preferences
    match /user_preferences/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User flashcards collection (if using subcollection structure)
    match /users/{userId}/flashcards/{cardId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User progress tracking (if needed)
    match /users/{userId}/progress/{progressId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // User sessions/activity logs (if needed)
    match /users/{userId}/sessions/{sessionId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## What these rules do:

1. **user_preferences/{userId}**: Only authenticated users can read/write their own preference documents
2. **Authentication required**: Users must be logged in (`request.auth != null`)
3. **User ownership**: Users can only access documents where the document ID matches their user ID (`request.auth.uid == userId`)
4. **Secure by default**: All other access is denied unless explicitly allowed

## How to apply:

1. Copy the rules above
2. Go to Firebase Console → Firestore Database → Rules
3. Replace the existing rules with these rules (keep any additional rules you need for other collections)
4. Click "Publish" to save the changes

The new structure will store user preferences in documents like:
- `/user_preferences/user123abc` (where user123abc is the user's UID)

This is much simpler than subcollections and easier to secure!
