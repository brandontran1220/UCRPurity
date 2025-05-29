-- SQL script to create user_scores table in Supabase
-- Run this in your Supabase SQL Editor if the table doesn't exist

-- Drop the table if it exists (only run this if you want to reset)
-- DROP TABLE IF EXISTS user_scores;

-- Create the user_scores table with proper constraints
CREATE TABLE IF NOT EXISTS user_scores (
    id BIGSERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    score INTEGER NOT NULL CHECK (score >= 0 AND score <= 100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Add unique constraint on user_id (this is crucial for upsert operations)
ALTER TABLE user_scores ADD CONSTRAINT IF NOT EXISTS user_scores_user_id_unique UNIQUE (user_id);

-- Create an index for faster queries (may already exist due to unique constraint)
CREATE INDEX IF NOT EXISTS idx_user_scores_user_id ON user_scores(user_id);

-- Enable Row Level Security (RLS)
ALTER TABLE user_scores ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own scores" ON user_scores;
DROP POLICY IF EXISTS "Users can insert their own scores" ON user_scores;
DROP POLICY IF EXISTS "Users can update their own scores" ON user_scores;

-- Create policies for RLS
-- Users can only see and modify their own scores
CREATE POLICY "Users can view their own scores" ON user_scores
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own scores" ON user_scores
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own scores" ON user_scores
    FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- Create or replace the function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_user_scores_updated_at ON user_scores;

-- Create a trigger to automatically update updated_at
CREATE TRIGGER update_user_scores_updated_at 
    BEFORE UPDATE ON user_scores 
    FOR EACH ROW 
    EXECUTE PROCEDURE update_updated_at_column();
