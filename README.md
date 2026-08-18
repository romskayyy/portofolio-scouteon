# Scouteon — Platform Rekrutmen & Manajemen Pelaut

MVP platform yang menghubungkan pelaut (seafarer) dengan perusahaan pelayaran
(employer), dilengkapi admin panel. Dibangun dengan Next.js 14 (App Router),
TypeScript, Tailwind CSS, dan Supabase (Auth + PostgreSQL + Storage).

## Fitur yang Sudah Tersedia

**Seafarer**
- Registrasi & login
- Profil pribadi + preferensi (rank, jenis kapal, gaji, tanggal tersedia)
- Sea Service History (riwayat pelayaran, CRUD)
- Upload & kelola dokumen/sertifikat, dengan penanda dokumen akan/sudah expire
- Cari & lamar lowongan
- Lihat status lamaran (applied → shortlisted → interview → offer → accepted/rejected)

**Employer**
- Registrasi & login
- Profil perusahaan
- Buat, buka/tutup, dan hapus job posting
- Recruitment Pipeline (kanban) untuk mengelola kandidat per tahap

**Admin**
- Dashboard analytics (total user, perusahaan, lowongan, lamaran)
- Manajemen user
- Approval/rejection verifikasi perusahaan
- Manajemen semua lowongan di platform

**Belum diimplementasikan (next steps yang disebutkan di requirement):**
Messaging real-time, notifikasi otomatis (cron job expiry), CV PDF generator,
OCR & AI CV matching. Struktur database untuk messaging & notifikasi sudah
disiapkan di `supabase/schema.sql` supaya mudah dilanjutkan.

## Struktur Project

```
scouteon/
├── src/
│   ├── app/
│   │   ├── (auth)/login, register     -> halaman auth
│   │   ├── seafarer/                  -> dashboard, profile, documents, applications
│   │   ├── employer/                  -> dashboard, company, jobs, pipeline
│   │   ├── admin/                     -> dashboard, users, employers, jobs
│   │   ├── jobs/                      -> pencarian lowongan publik
│   │   └── page.tsx                   -> landing page
│   ├── components/                    -> Navbar, DashboardShell (sidebar)
│   ├── lib/
│   │   ├── supabase/client.ts         -> Supabase client (browser)
│   │   ├── supabase/server.ts         -> Supabase client (server component)
│   │   └── types.ts                   -> TypeScript types
│   └── middleware.ts                  -> proteksi route per role
└── supabase/
    └── schema.sql                     -> skema database + RLS policies lengkap
```

## Cara Menjalankan di Komputer Kamu

### 1. Install dependencies

```bash
npm install
```

### 2. Buat project Supabase (gratis)

1. Daftar di https://supabase.com dan buat project baru
2. Buka **SQL Editor**, copy seluruh isi file `supabase/schema.sql`, lalu Run.
   Ini akan membuat semua tabel, relasi, dan Row Level Security policies.
3. Buka **Storage**, buat bucket baru bernama `documents` (set sebagai **public**
   bucket agar file sertifikat bisa diakses via URL — bisa diperketat nanti).
4. Buka **Project Settings → API**, salin `Project URL` dan `anon public key`.

### 3. Konfigurasi environment variable

```bash
cp .env.example .env.local
```

Isi `.env.local` dengan URL dan anon key dari Supabase kamu.

### 4. Jalankan development server

```bash
npm run dev
```

Buka http://localhost:3000

### 5. Coba alur lengkap

1. Daftar sebagai **Perusahaan** di `/register` → akan masuk ke `/employer`
2. Lengkapi profil perusahaan di `/employer/company`
3. (Sebagai admin) approve perusahaan tersebut — untuk membuat akun admin
   pertama, daftar biasa lalu ubah kolom `role` user tersebut menjadi `admin`
   langsung dari Supabase Table Editor (tabel `profiles`)
4. Buat lowongan di `/employer/jobs`
5. Daftar sebagai **Pelaut** di akun/browser lain, lengkapi profil, lalu
   lamar lowongan tersebut di `/jobs`
6. Kembali ke akun employer → cek `/employer/pipeline`, geser kandidat antar
   tahap rekrutmen

## Deploy ke Vercel (Gratis)

1. Push project ini ke GitHub
2. Buka https://vercel.com → New Project → import repo GitHub kamu
3. Tambahkan environment variables (`NEXT_PUBLIC_SUPABASE_URL`,
   `NEXT_PUBLIC_SUPABASE_ANON_KEY`) di pengaturan project Vercel
4. Deploy — selesai, dapat URL live untuk portfolio/demo saat melamar kerja

## Kenapa Struktur Ini Relevan untuk Lowongan Scouteon

- **Full-stack**: Next.js App Router (frontend + API via Server Components)
  + PostgreSQL (Supabase) untuk backend/database
- **Role-based access & permission**: middleware + Row Level Security per role
  (seafarer/employer/admin)
- **Auth & account management**: Supabase Auth dengan trigger auto-create profile
- **File upload**: Supabase Storage untuk dokumen/sertifikat
- **Applicant Tracking & Recruitment Pipeline**: kanban board di `/employer/pipeline`
- **AI-assisted development**: seluruh project ini dibangun dengan bantuan Claude —
  kamu bisa ceritakan proses ini di interview sebagai bukti kamu terbiasa
  bekerja dengan AI coding tools, sesuai yang diminta di requirement

## Saran Sebelum Melamar

1. Deploy live demo ke Vercel dan siapkan 1-2 akun contoh (seafarer + employer)
   supaya recruiter bisa langsung coba
2. Push ke GitHub dengan riwayat commit yang rapi (jangan 1 commit besar)
3. Tulis di CV/portfolio: "Membangun MVP platform rekrutmen pelaut (Scouteon)
   full-stack dengan Next.js, TypeScript, PostgreSQL, dan Supabase — mencakup
   auth, role-based dashboard, file upload, dan recruitment pipeline"
4. Siapkan cerita singkat soal bagian mana yang kamu modifikasi/debug manual
   dari hasil AI — ini yang mereka tekankan di requirement ("bukan hanya bisa
   pakai ChatGPT")
