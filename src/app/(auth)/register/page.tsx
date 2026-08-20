"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

function RegisterFormContent() {
  const searchParams = useSearchParams();
  const roleParam = searchParams
    ? searchParams.get("role") || "seafarer"
    : "seafarer";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [role, setRole] = useState(roleParam);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const supabase = createClient();

      if (!supabase) {
        throw new Error("Gagal terhubung ke layanan Supabase.");
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: role === "seafarer" ? fullName : companyName,
            role: role,
          },
        },
      });

      if (signUpError) throw signUpError;

      if (data?.user) {
        setSuccess(true);
      }
    } catch (err: any) {
      setError(err.message || "Terjadi kesalahan saat pendaftaran.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-slate-800 border border-slate-700 p-8 rounded-2xl shadow-2xl">
        <div>
          <h2 className="mt-2 text-center text-3xl font-extrabold text-white">
            Buat Akun Baru
          </h2>
          <p className="mt-2 text-center text-sm text-slate-400">
            Atau{" "}
            <Link
              href="/login"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              masuk ke akun yang sudah ada
            </Link>
          </p>
        </div>

        {error && (
          <div className="bg-red-950/80 text-red-200 p-3 rounded-xl text-sm border border-red-500/50">
            {error}
          </div>
        )}

        {success ? (
          <div className="bg-emerald-950/80 text-emerald-200 p-6 rounded-xl text-center border border-emerald-500/50">
            <p className="font-bold text-lg text-emerald-300">
              Pendaftaran Berhasil!
            </p>
            <p className="text-xs mt-2 text-emerald-100">
              Silakan cek email kamu untuk konfirmasi akun sebelum masuk.
            </p>
            <Link
              href="/login"
              className="mt-5 inline-block bg-cyan-500 text-slate-950 font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-cyan-400 transition-colors shadow-md shadow-cyan-500/20"
            >
              Ke Halaman Login
            </Link>
          </div>
        ) : (
          <form className="mt-8 space-y-6" onSubmit={handleRegister}>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Daftar Sebagai
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                >
                  <option value="seafarer">Pelaut (Seafarer)</option>
                  <option value="employer">Perusahaan (Employer)</option>
                </select>
              </div>

              {role === "seafarer" ? (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                    placeholder="Nama Lengkap"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Perusahaan
                  </label>
                  <input
                    type="text"
                    required
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                    placeholder="PT Shipping Line"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:border-cyan-400"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl text-sm font-bold text-slate-950 bg-cyan-500 hover:bg-cyan-400 transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Daftar Akun Baru"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="p-4 text-center text-slate-400">Loading...</div>
      }
    >
      <RegisterFormContent />
    </Suspense>
  );
}
