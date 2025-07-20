/*
  # Create events table with proper RLS policies

  1. New Tables
    - `events`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `date` (timestamptz, required)
      - `location` (text, required)
      - `description` (text, optional)
      - `user_id` (uuid, foreign key to auth.users)
      - `created_at` (timestamptz, default now)
      - `updated_at` (timestamptz, default now)

  2. Security
    - Enable RLS on `events` table
    - Add policy for authenticated users to read all events
    - Add policy for authenticated users to insert their own events
    - Add policy for authenticated users to update their own events
    - Add policy for authenticated users to delete their own events

  3. Changes
    - Creates the events table if it doesn't exist
    - Sets up proper RLS policies for CRUD operations
    - Adds user_id column to track event ownership
*/

-- Create events table if it doesn't exist
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  date timestamptz NOT NULL,
  location text NOT NULL,
  description text DEFAULT '',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can read all events" ON events;
DROP POLICY IF EXISTS "Users can insert their own events" ON events;
DROP POLICY IF EXISTS "Users can update their own events" ON events;
DROP POLICY IF EXISTS "Users can delete their own events" ON events;

-- Policy for reading events (all authenticated users can read all events)
CREATE POLICY "Users can read all events"
  ON events
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for inserting events (users can only insert events for themselves)
CREATE POLICY "Users can insert their own events"
  ON events
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating events (users can only update their own events)
CREATE POLICY "Users can update their own events"
  ON events
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting events (users can only delete their own events)
CREATE POLICY "Users can delete their own events"
  ON events
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create an index on user_id for better performance
CREATE INDEX IF NOT EXISTS events_user_id_idx ON events(user_id);

-- Create an index on date for better performance when ordering by date
CREATE INDEX IF NOT EXISTS events_date_idx ON events(date);