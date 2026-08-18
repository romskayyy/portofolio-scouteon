-- =========================================================
-- SCOUTEON DATABASE SCHEMA
-- Jalankan file ini di Supabase SQL Editor
-- =========================================================

-- Extension untuk UUID
create extension if not exists "uuid-ossp";

-- ---------------------------------------------------------
-- 1. PROFILES (extends Supabase auth.users)
-- ---------------------------------------------------------
create type user_role as enum ('seafarer', 'employer', 'admin');

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'seafarer',
  full_name text,
  email text,
  phone text,
  avatar_url text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 2. SEAFARER PROFILE
-- ---------------------------------------------------------
create table seafarer_profiles (
  id uuid primary key references profiles(id) on delete cascade,
  date_of_birth date,
  nationality text,
  address text,
  rank text,                     -- e.g. Master, Chief Engineer, AB, OS
  desired_rank text,
  desired_vessel_type text,
  desired_salary numeric,
  available_from date,
  years_of_experience numeric,
  bio text,
  cv_url text,                   -- generated/uploaded CV file
  updated_at timestamptz default now()
);

-- Sea service / career history (multiple entries per seafarer)
create table sea_service_history (
  id uuid primary key default uuid_generate_v4(),
  seafarer_id uuid references seafarer_profiles(id) on delete cascade,
  vessel_name text,
  vessel_type text,
  rank text,
  company_name text,
  sign_on_date date,
  sign_off_date date,
  description text,
  created_at timestamptz default now()
);

-- Certificates & documents
create table documents (
  id uuid primary key default uuid_generate_v4(),
  seafarer_id uuid references seafarer_profiles(id) on delete cascade,
  document_type text,            -- e.g. 'passport', 'STCW', 'medical', 'seaman_book'
  document_name text,
  file_url text not null,
  issue_date date,
  expiry_date date,
  status text default 'valid',   -- valid, expiring_soon, expired
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 3. EMPLOYER / COMPANY
-- ---------------------------------------------------------
create table companies (
  id uuid primary key default uuid_generate_v4(),
  owner_id uuid references profiles(id) on delete cascade,
  company_name text not null,
  company_type text,             -- manning agency, shipowner, etc
  address text,
  website text,
  logo_url text,
  description text,
  verification_status text default 'pending', -- pending, verified, rejected
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 4. JOB POSTINGS
-- ---------------------------------------------------------
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  company_id uuid references companies(id) on delete cascade,
  title text not null,
  rank_required text,
  vessel_type text,
  vessel_name text,
  contract_duration text,
  salary_range text,
  embarkation_date date,
  location text,
  description text,
  requirements text,
  status text default 'open',    -- open, closed, filled
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 5. JOB APPLICATIONS / RECRUITMENT PIPELINE
-- ---------------------------------------------------------
create type application_stage as enum (
  'applied', 'shortlisted', 'interview', 'offer', 'accepted', 'rejected'
);

create table applications (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references jobs(id) on delete cascade,
  seafarer_id uuid references seafarer_profiles(id) on delete cascade,
  stage application_stage default 'applied',
  cover_note text,
  applied_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (job_id, seafarer_id)
);

-- History log of stage changes (for pipeline tracking / audit)
create table application_stage_log (
  id uuid primary key default uuid_generate_v4(),
  application_id uuid references applications(id) on delete cascade,
  from_stage application_stage,
  to_stage application_stage,
  changed_by uuid references profiles(id),
  note text,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 6. MESSAGING
-- ---------------------------------------------------------
create table conversations (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references jobs(id) on delete set null,
  seafarer_id uuid references profiles(id) on delete cascade,
  employer_id uuid references profiles(id) on delete cascade,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id),
  content text not null,
  read_at timestamptz,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------
-- 7. NOTIFICATIONS (certificate expiry, application updates, etc)
-- ---------------------------------------------------------
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id) on delete cascade,
  type text,                     -- 'cert_expiry', 'application_update', 'message', 'system'
  title text not null,
  body text,
  is_read boolean default false,
  related_id uuid,               -- optional reference to document/application/etc
  created_at timestamptz default now()
);

-- =========================================================
-- ROW LEVEL SECURITY (RLS)
-- =========================================================
alter table profiles enable row level security;
alter table seafarer_profiles enable row level security;
alter table sea_service_history enable row level security;
alter table documents enable row level security;
alter table companies enable row level security;
alter table jobs enable row level security;
alter table applications enable row level security;
alter table application_stage_log enable row level security;
alter table conversations enable row level security;
alter table messages enable row level security;
alter table notifications enable row level security;

-- Profiles: user can read/update own profile, admin can read all
create policy "Users can view own profile" on profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on profiles
  for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles
  for insert with check (auth.uid() = id);

-- Seafarer profiles: owner full access, employers can view (for browsing candidates)
create policy "Seafarer manages own profile" on seafarer_profiles
  for all using (auth.uid() = id);
create policy "Authenticated users can view seafarer profiles" on seafarer_profiles
  for select using (auth.role() = 'authenticated');

-- Sea service history: owner only
create policy "Seafarer manages own service history" on sea_service_history
  for all using (
    exists (select 1 from seafarer_profiles sp where sp.id = seafarer_id and sp.id = auth.uid())
  );

-- Documents: owner only (private documents)
create policy "Seafarer manages own documents" on documents
  for all using (
    exists (select 1 from seafarer_profiles sp where sp.id = seafarer_id and sp.id = auth.uid())
  );

-- Companies: owner manages, everyone can view verified companies
create policy "Employer manages own company" on companies
  for all using (auth.uid() = owner_id);
create policy "Anyone can view verified companies" on companies
  for select using (verification_status = 'verified' or auth.uid() = owner_id);

-- Jobs: employer manages own jobs, everyone can view open jobs
create policy "Employer manages own jobs" on jobs
  for all using (
    exists (select 1 from companies c where c.id = company_id and c.owner_id = auth.uid())
  );
create policy "Anyone can view open jobs" on jobs
  for select using (status = 'open');

-- Applications: seafarer sees own applications, employer sees applications to their jobs
create policy "Seafarer manages own applications" on applications
  for all using (auth.uid() = seafarer_id);
create policy "Employer views applications to own jobs" on applications
  for select using (
    exists (
      select 1 from jobs j join companies c on j.company_id = c.id
      where j.id = job_id and c.owner_id = auth.uid()
    )
  );
create policy "Employer updates application stage" on applications
  for update using (
    exists (
      select 1 from jobs j join companies c on j.company_id = c.id
      where j.id = job_id and c.owner_id = auth.uid()
    )
  );

-- Messages & conversations: only participants
create policy "Participants view conversation" on conversations
  for select using (auth.uid() = seafarer_id or auth.uid() = employer_id);
create policy "Participants create conversation" on conversations
  for insert with check (auth.uid() = seafarer_id or auth.uid() = employer_id);
create policy "Participants view messages" on messages
  for select using (
    exists (
      select 1 from conversations conv where conv.id = conversation_id
      and (conv.seafarer_id = auth.uid() or conv.employer_id = auth.uid())
    )
  );
create policy "Participants send messages" on messages
  for insert with check (
    exists (
      select 1 from conversations conv where conv.id = conversation_id
      and (conv.seafarer_id = auth.uid() or conv.employer_id = auth.uid())
    )
  );

-- Notifications: own only
create policy "Users view own notifications" on notifications
  for select using (auth.uid() = user_id);
create policy "Users update own notifications" on notifications
  for update using (auth.uid() = user_id);

-- =========================================================
-- FUNCTION: Auto-create profile row on signup
-- =========================================================
create function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    coalesce((new.raw_user_meta_data->>'role')::user_role, 'seafarer')
  );
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
