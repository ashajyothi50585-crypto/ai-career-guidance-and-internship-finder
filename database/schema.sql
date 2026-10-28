-- AI Career Guidance and Internship Finder
-- Run this script in Supabase SQL Editor.
-- This MVP schema stores internship listings and student career profiles.
-- Do not put the Supabase service-role key in browser code.

create extension if not exists pgcrypto;

create table if not exists public.internships (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) between 1 and 160),
  company text not null check (char_length(company) between 1 and 120),
  domain text not null,
  description text not null,
  eligibility text not null default '',
  skills text[] not null default '{}',
  pay_type text not null default 'Not specified'
    check (pay_type in ('Paid', 'Unpaid', 'Not specified')),
  work_mode text not null default 'Remote'
    check (work_mode in ('Remote', 'Hybrid', 'On-site')),
  duration text not null default '',
  application_url text,
  created_at timestamptz not null default now()
);

create table if not exists public.student_profiles (
  id uuid primary key default gen_random_uuid(),
  full_name text not null check (char_length(full_name) between 1 and 80),
  email text not null unique,
  degree text not null default '',
  study_year text not null default '',
  interests text[] not null default '{}',
  skills text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.saved_internships (
  id uuid primary key default gen_random_uuid(),
  student_profile_id uuid not null references public.student_profiles(id) on delete cascade,
  internship_id uuid not null references public.internships(id) on delete cascade,
  application_status text not null default 'Saved'
    check (application_status in ('Saved', 'Planning to apply', 'Applied', 'Interviewing', 'Rejected', 'Accepted')),
  created_at timestamptz not null default now(),
  unique(student_profile_id, internship_id)
);

-- Row Level Security is enabled. The starter Express backend uses its server-only
-- service role key, so never expose that key to frontend JavaScript or GitHub.
-- Before enabling public signup or deploying, implement real authentication and
-- authorization policies. These deny direct anonymous browser access by default.
alter table public.internships enable row level security;
alter table public.student_profiles enable row level security;
alter table public.saved_internships enable row level security;

-- Optional demo listings (clearly labelled as examples, not real vacancies).
insert into public.internships
  (title, company, domain, description, eligibility, skills, pay_type, work_mode, duration, application_url)
values
  ('AI / Machine Learning Intern', 'DemoTech Labs (Sample)', 'AI & Data',
   'Sample listing for testing the internship finder UI.', 'Students learning Python and basic statistics.',
   array['Python', 'Data basics'], 'Paid', 'Remote', '8 weeks', null),
  ('Frontend Web Developer Intern', 'BrightWeb Studio (Sample)', 'Web Development',
   'Sample listing for practicing HTML, CSS, and JavaScript.', 'Beginner students with a small practice project.',
   array['HTML', 'CSS', 'JavaScript'], 'Unpaid', 'Hybrid', '6 weeks', null)
on conflict do nothing;
