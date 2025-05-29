# Database Troubleshooting Guide

## Issue

Scores are not appearing in the Supabase table editor after implementing the score saving functionality.

## Potential Causes & Solutions

### 1. Missing Database Table

**Problem**: The `user_scores` table might not exist in your Supabase database.

**Solution**:

1. Go to your Supabase dashboard at https://app.supabase.com
2. Open the SQL Editor
3. Run the SQL script in `setup_database.sql` to create the table and set up proper permissions

### 2. Row Level Security (RLS) Issues

**Problem**: Even if the table exists, RLS policies might be preventing data from being inserted or viewed.

**Solution**:

- The SQL script includes proper RLS policies
- Make sure you're signed in as the same user when viewing the table editor
- Try disabling RLS temporarily to test: `ALTER TABLE user_scores DISABLE ROW LEVEL SECURITY;`

### 3. Authentication Issues

**Problem**: The user might not be properly authenticated when trying to save scores.

**Solution**:

- Check the browser console for authentication errors
- Use the admin page at `/admin` to verify authentication status (admin access required)
- Ensure the user is signed in (not a guest)

### 4. Environment Variables

**Problem**: Supabase connection details might be missing or incorrect.

**Solution**:

- Verify `.env.local` contains correct `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Check the admin page to confirm environment variables are loaded (admin access required)
- Restart the development server after adding environment variables

## Testing Steps

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Open the admin page**: http://localhost:3000/admin (requires admin email access)

3. **Check authentication status** - ensure you're signed in with an admin email

4. **Test database connection** - click "Test Database Connection"

5. **Test score saving** - try saving a test score

6. **Check Supabase dashboard**:
   - Go to Table Editor
   - Look for the `user_scores` table
   - Check if your score appears (remember RLS might filter results)

## Common Console Errors

- `relation "user_scores" does not exist` → Run the setup SQL script
- `there is no unique or exclusion constraint matching the ON CONFLICT specification` → Table exists but missing unique constraint on user_id
- `permission denied for table user_scores` → Check RLS policies
- `Failed to create Supabase client` → Check environment variables
- `Missing Supabase environment variables` → Add `.env.local` file

### Specific Fix for "ON CONFLICT" Error

If you get the error "there is no unique or exclusion constraint matching the ON CONFLICT specification":

1. The table exists but doesn't have a unique constraint on `user_id`
2. Run this SQL in your Supabase SQL Editor:
   ```sql
   ALTER TABLE user_scores ADD CONSTRAINT user_scores_user_id_unique UNIQUE (user_id);
   ```
3. Or drop and recreate the table using the full `setup_database.sql` script

## Debugging Tips

1. Open browser developer tools (F12) and check the Console tab
2. Look for detailed error messages when saving scores
3. Check the Network tab for failed requests to Supabase
4. Use the admin page to isolate issues (requires admin access)
5. Verify table structure in Supabase dashboard matches expected schema
