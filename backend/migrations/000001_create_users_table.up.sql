CREATE EXTENSION IF NOT EXISTS citext;

CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_type text NOT NULL,
    email citext NOT NULL UNIQUE,
    hashed_password bytea NOT NULL,
    username text NOT NULL,
    name text,
    surname text,
    version integer NOT NULL DEFAULT 0,
    last_login timestamp(0) with time zone,
    created_at timestamp(0) with time zone NOT NULL DEFAULT now(),  
    updated_at timestamp(0) with time zone NOT NULL DEFAULT now()
)