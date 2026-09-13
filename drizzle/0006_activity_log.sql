CREATE TABLE activity_log (
  id text PRIMARY KEY NOT NULL,
  visitor_id text NOT NULL,
  action text NOT NULL,
  detail text,
  created_at text NOT NULL
);
CREATE INDEX activity_log_created_at ON activity_log(created_at DESC);
