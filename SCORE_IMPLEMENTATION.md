# Database Score Recording Implementation

## Overview

This implementation adds user score recording to the UCRPurity quiz application. When authenticated users complete the quiz, their scores are automatically saved to the Supabase database.

## What Was Added

### 1. Score Saving Utility (`src/utils/saveScore.ts`)

- **Function**: `saveUserScore(userId: string, score: number): Promise<boolean>`
- **Purpose**: Saves or updates a user's quiz score in the database
- **Database Operation**: Uses Supabase `upsert` to insert new scores or update existing ones
- **Error Handling**: Returns `true` on success, `false` on failure with console logging

### 2. Updated Questions Component (`src/components/home/questions.tsx`)

- **Added**: Import for `useAuth` and `saveUserScore`
- **Modified**: `handleSubmit` function now async and saves scores for authenticated users
- **Logic**: Only saves scores for users who are signed in (not guests)
- **Flow**: Score saving happens before redirecting to results page

### 3. Clean AuthContext (`src/contexts/AuthContext.tsx`)

- **Restored**: Clean, simple authentication context without complex database logic
- **Functions**: Basic auth state management with guest mode support
- **No Blocking**: Authentication doesn't block on database operations

### 4. Test Page (`src/app/test/page.tsx`)

- **Purpose**: Test and verify the score saving functionality
- **Features**: Shows auth status, allows manual score testing
- **URL**: `http://localhost:3000/test`

## Database Requirements

The implementation expects a Supabase table named `user_scores` with the following structure:

```sql
CREATE TABLE user_scores (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) UNIQUE,
  score INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

## How It Works

1. **Guest Users**: Can take the quiz, but scores are not saved to database
2. **Authenticated Users**:
   - Take the quiz normally
   - On submit, score is calculated
   - Score is saved to database using `upsert` (creates new record or updates existing)
   - User is redirected to results page
   - Console logs show success/failure of database operation

## Testing

1. Visit `/test` to check authentication status and test score saving
2. Sign in via `/login` if needed
3. Test score saving with different values
4. Take the full quiz at `/` to test the complete flow
5. Check Supabase dashboard to verify scores are being saved

## Key Benefits

- **Simple**: Minimal changes to existing codebase
- **Non-blocking**: Score saving doesn't interfere with user experience
- **Reliable**: Uses Supabase upsert for safe database operations
- **Testable**: Dedicated test page for verification
- **Clean**: No complex authentication logic blocking the UI

## Files Modified

- `src/components/home/questions.tsx` - Added score saving to quiz submission
- `src/contexts/AuthContext.tsx` - Restored to clean, simple version
- `src/utils/saveScore.ts` - New utility for database score operations
- `src/app/test/page.tsx` - New test page for verification
