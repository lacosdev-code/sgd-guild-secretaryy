-- Add urgency column to quests table
ALTER TABLE public.quests
ADD COLUMN urgency TEXT DEFAULT 'Routine';

-- Optional: If you want to restrict it to specific values
-- ALTER TABLE public.quests
-- ADD CONSTRAINT quests_urgency_check CHECK (urgency IN ('Routine', 'Priority', 'Emergency', 'Strategic'));
