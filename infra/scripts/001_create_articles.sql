-- 001_create_articles.sql

-- 1. Create table
CREATE TABLE IF NOT EXISTS articles (
    id          BIGSERIAL PRIMARY KEY,
    title       VARCHAR(255) NOT NULL,
    content     TEXT NOT NULL,
    photo_url   TEXT,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2. Trigger function to auto-update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 3. Attach trigger to the table
DROP TRIGGER IF EXISTS trigger_set_updated_at ON articles;

CREATE TRIGGER trigger_set_updated_at
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

-- 4. Index on created_at (for ordering by newest)
CREATE INDEX IF NOT EXISTS idx_articles_created_at
    ON articles (created_at DESC);
