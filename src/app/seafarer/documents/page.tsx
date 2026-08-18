"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { DocumentRecord } from "@/lib/types";
import { Upload, Trash2, FileText } from "lucide-react";

const DOC_TYPES = ["Paspor", "Buku Pelaut", "STCW", "Medical Certificate", "Lainnya"];

export default function DocumentsPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [docs, setDocs] = useState<DocumentRecord[]>([]);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    document_type: DOC_TYPES[0],
    document_name: "",
    expiry_date: "",
  });
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("documents")
        .select("*")
        .eq("seafarer_id", user.id)
        .order("expiry_date", { ascending: true });
      if (data) setDocs(data);
    })();
  }, []);

  async function handleUpload() {
    if (!userId || !file || !form.document_name) return;
    setUploading(true);

    const path = `${userId}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage
      .from("documents")
      .upload(path, file);

    if (uploadError) {
      alert("Gagal upload: " + uploadError.message);
      setUploading(false);
      return;
    }

    const { data: publicUrl } = supabase.storage.from("documents").getPublicUrl(path);

    const { data, error } = await supabase
      .from("documents")
      .insert({
        seafarer_id: userId,
        document_type: form.document_type,
        document_name: form.document_name,
        file_url: publicUrl.publicUrl,
        expiry_date: form.expiry_date || null,
        status: "valid",
      })
      .select()
      .single();

    if (data) setDocs([data, ...docs]);
    setForm({ document_type: DOC_TYPES[0], document_name: "", expiry_date: "" });
    setFile(null);
    setUploading(false);
  }

  async function handleDelete(id: string) {
    await supabase.from("documents").delete().eq("id", id);
    setDocs((d) => d.filter((x) => x.id !== id));
  }

  function isExpiringSoon(expiry: string | null) {
    if (!expiry) return false;
    const days = (new Date(expiry).getTime() - Date.now()) / 86400000;
    return days >= 0 && days <= 30;
  }
  function isExpired(expiry: string | null) {
    if (!expiry) return false;
    return new Date(expiry).getTime() < Date.now();
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold text-navy-700">Dokumen & Sertifikat</h1>
      <p className="mt-1 text-slate-500">
        Upload sertifikat dan dokumen wajib. Kamu akan mendapat notifikasi sebelum kedaluwarsa.
      </p>

      <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="font-semibold text-navy-700">Upload Dokumen Baru</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-sm font-medium text-slate-700">Jenis Dokumen</label>
            <select
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.document_type}
              onChange={(e) => setForm({ ...form, document_type: e.target.value })}
            >
              {DOC_TYPES.map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Nama Dokumen</label>
            <input
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.document_name}
              onChange={(e) => setForm({ ...form, document_name: e.target.value })}
              placeholder="e.g. STCW Basic Safety Training"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">Tanggal Kedaluwarsa</label>
            <input
              type="date"
              className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
              value={form.expiry_date}
              onChange={(e) => setForm({ ...form, expiry_date: e.target.value })}
            />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-700">File</label>
            <input
              type="file"
              className="mt-1 w-full text-sm"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
          </div>
        </div>
        <button
          onClick={handleUpload}
          disabled={uploading}
          className="mt-4 flex items-center gap-2 rounded-lg bg-navy-600 px-4 py-2 text-sm font-semibold text-white hover:bg-navy-700 disabled:opacity-60"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "Mengunggah..." : "Upload"}
        </button>
      </section>

      <section className="mt-6 space-y-3">
        {docs.map((d) => (
          <div
            key={d.id}
            className={`flex items-center justify-between rounded-xl border p-4 ${
              isExpired(d.expiry_date)
                ? "border-red-300 bg-red-50"
                : isExpiringSoon(d.expiry_date)
                ? "border-amber-300 bg-amber-50"
                : "border-slate-200 bg-white"
            }`}
          >
            <div className="flex items-center gap-3">
              <FileText className="h-5 w-5 text-navy-600" />
              <div>
                <a
                  href={d.file_url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-medium text-navy-700 hover:underline"
                >
                  {d.document_name}
                </a>
                <p className="text-xs text-slate-500">
                  {d.document_type}
                  {d.expiry_date && ` • Kedaluwarsa: ${d.expiry_date}`}
                  {isExpired(d.expiry_date) && " • EXPIRED"}
                  {isExpiringSoon(d.expiry_date) && " • Segera Expire"}
                </p>
              </div>
            </div>
            <button onClick={() => handleDelete(d.id)} className="text-red-500 hover:underline">
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
        {docs.length === 0 && (
          <p className="text-sm text-slate-400">Belum ada dokumen diupload.</p>
        )}
      </section>
    </div>
  );
}
