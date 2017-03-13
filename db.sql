CREATE TABLE users (
  idx bigserial primary key,
  id text not null unique default md5(now()::text || '-' || random()::text),
  created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  first_name character varying,
  last_name character varying,
  email character varying NOT NULL UNIQUE,
  password text
);
COMMENT ON COLUMN users.id IS 'Public ID for a USER record';

CREATE TABLE projects (
  idx bigserial primary key,
  id text not null unique default md5(now()::text || '-' || random()::text),
  created_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp without time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  db_schema text not null unique default 's-' || md5(now()::text || '-' || random()::text),
  project_name character varying NOT NULL,
  project_description text,
  user_id integer NOT NULL REFERENCES users,
  url_token character varying NOT NULL UNIQUE,
  api_key character varying NOT NULL UNIQUE
);
COMMENT ON COLUMN projects.url_token IS 'Public ID used to identify the project in URL';
