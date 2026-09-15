CREATE TABLE google_login_log (
  google_sub text PRIMARY KEY NOT NULL,
  email text NOT NULL,
  name text,
  first_login_at text NOT NULL,
  last_login_at text NOT NULL,
  login_count integer NOT NULL DEFAULT 1
);
CREATE INDEX google_login_log_last_login_at ON google_login_log(last_login_at DESC);
