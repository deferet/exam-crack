CREATE TABLE IF NOT EXISTS tests (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    creator_id uuid REFERENCES users ON DELETE SET NULL,
    name text NOT NULL,
    description text,
    categories text[] NOT NULL,
    times_started int NOT NULL DEFAULT 0,
    times_completed int NOT NULL DEFAULT 0,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
)