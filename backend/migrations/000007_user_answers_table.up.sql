CREATE TABLE IF NOT EXISTS user_answers (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES users ON DELETE CASCADE,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);

ALTER TABLE IF EXISTS answers 
    ADD COLUMN IF NOT EXISTS user_answer_id uuid REFERENCES user_answers ON DELETE CASCADE;
    