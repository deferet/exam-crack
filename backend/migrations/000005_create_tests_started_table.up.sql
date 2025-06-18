CREATE TABLE IF NOT EXISTS tests_started (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    test_id uuid NOT NULL REFERENCES tests(id) ON DELETE CASCADE,
    progress integer NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, test_id)
);
