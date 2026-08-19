"use client";

import { useState } from "react";

// Interface untuk Data Lowongan
interface Job {
  id: string;
  title: string;
  company: string;
  vesselType: string;
  location: string;
  salaryMin: number;
  salaryMax: number;
  contractDuration: string;
  postedAt: string;
}

const INITIAL_JOBS: Job[] = [
  {
    id: "1",
    title: "Master / Nahkoda (ANT I)",
    company: "PT Pelayaran Nusantara Line",
    vesselType: "Container Ship",
    location: "Jakarta - Surabaya",
    salaryMin: 35000000,
    salaryMax: 45000000,
    contractDuration: "6 Bulan",
    postedAt: "2 hari lalu",
  },
  {
    id: "2",
    title: "Chief Engineer (ATT I)",
    company: "PT Maritime Global Energy",
    vesselType: "Oil Tanker",
    location: "Batam - Singapore",
    salaryMin: 40000000,
    salaryMax: 50000000,
    contractDuration: "4 Bulan",
    postedAt: "1 hari lalu",
  },
  {
    id: "3",
    title: "Second Officer (ANT II)",
    company: "PT Samudera Bahari Logistik",
    vesselType: "Bulk Carrier",
    location: "Tanjung Priok",
    salaryMin: 18000000,
    salaryMax: 25000000,
    contractDuration: "8 Bulan",
    postedAt: "Baru saja",
  },
];

export default function JobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedVessel, setSelectedVessel] = useState("All");

  // State Modal Lamaran (Termasuk Nama Lengkap)
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [expectedSalary, setExpectedSalary] = useState("");
  const [experience, setExperience] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [applySuccess, setApplySuccess] = useState(false);

  // State Bot Chat
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessages, setChatMessages] = useState([
    {
      sender: "bot",
      text: "Halo Sailor! ⚓ Ada yang bisa NaviBot bantu terkait lowongan atau syarat pendaftaran?",
    },
  ]);
  const [inputChat, setInputChat] = useState("");

  const formatIDR = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const filteredJobs = INITIAL_JOBS.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVessel =
      selectedVessel === "All" || job.vesselType === selectedVessel;
    return matchesSearch && matchesVessel;
  });

  // Submit Form Lamaran
  const handleApplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      setApplySuccess(true);
      setTimeout(() => {
        setApplySuccess(false);
        setSelectedJob(null);
        setFullName("");
        setPhone("");
        setAddress("");
        setExpectedSalary("");
        setExperience("");
      }, 2500);
    }, 1200);
  };

  // Respon Otomatis Bot Chat
  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputChat.trim()) return;

    const userText = inputChat;
    setChatMessages((prev) => [...prev, { sender: "user", text: userText }]);
    setInputChat("");

    setTimeout(() => {
      let botResponse =
        "Terima kasih! Tim HR kami akan meninjau pertanyaan/lamaran kamu segera. Pastikan dokumen kelautanmu (BST/MCU) masih aktif ya! ⚓";

      const lower = userText.toLowerCase();
      if (lower.includes("gaji") || lower.includes("pay")) {
        botResponse =
          "Gaji ditawarkan dalam standar IDR (Rupiah) sesuai dengan kualifikasi ANT/ATT dan jenis kapal yang dilamar.";
      } else if (lower.includes("syarat") || lower.includes("dokumen")) {
        botResponse =
          "Syarat utama pendaftaran: Buku Pelaut aktif, Sertifikat Keahlian (COC/COP), BST, dan Medical Check Up (MCU) standar perhubungan.";
      }

      setChatMessages((prev) => [
        ...prev,
        { sender: "bot", text: botResponse },
      ]);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-slate-100 py-10 px-4 sm:px-6 lg:px-8 relative">
      {/* Background Banner */}
      <div className="max-w-7xl mx-auto mb-10 bg-slate-800/80 backdrop-blur-md rounded-3xl p-8 border border-cyan-500/30 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10">
          <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider border border-cyan-500/30">
            ⚓ Maritime Career Hub
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold mt-3 text-white tracking-tight">
            Lowongan Kerja Pelaut Terpercaya
          </h1>
          <p className="mt-2 text-slate-300 text-sm sm:text-base max-w-2xl">
            Jelajahi kesempatan berlayar bersama perusahaan pelayaran resmi.
            Temukan posisi terbaik sesuai Sertifikat Keahlianmu.
          </p>

          {/* Search & Filter Bar */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="🔍 Cari posisi atau nama perusahaan..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="sm:col-span-2 px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-inner"
            />
            <select
              value={selectedVessel}
              onChange={(e) => setSelectedVessel(e.target.value)}
              className="px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white focus:ring-2 focus:ring-cyan-400 focus:outline-none shadow-inner"
            >
              <option value="All">🚢 Semua Jenis Kapal</option>
              <option value="Container Ship">Container Ship</option>
              <option value="Oil Tanker">Oil Tanker</option>
              <option value="Bulk Carrier">Bulk Carrier</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid Lowongan Kerja */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-slate-800/90 rounded-2xl border border-slate-700 hover:border-cyan-400/60 p-6 flex flex-col justify-between shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="bg-cyan-950 text-cyan-300 text-xs font-semibold px-3 py-1 rounded-full border border-cyan-800">
                    🚢 {job.vesselType}
                  </span>
                  <span className="text-xs text-slate-400">{job.postedAt}</span>
                </div>
                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-slate-300 mt-1">
                  {job.company}
                </p>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                  📍 {job.location} • Kontrak: {job.contractDuration}
                </p>

                {/* Box Estimasi Gaji */}
                <div className="mt-5 p-3.5 bg-slate-900/80 rounded-xl border border-slate-700/60">
                  <span className="text-xs text-slate-400 block mb-1">
                    Estimasi Gaji / Bulan
                  </span>
                  <span className="text-base font-extrabold text-emerald-400">
                    {formatIDR(job.salaryMin)} - {formatIDR(job.salaryMax)}
                  </span>
                </div>
              </div>

              <button
                onClick={() => setSelectedJob(job)}
                className="mt-6 w-full bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold py-3 px-4 rounded-xl transition-all shadow-md shadow-cyan-500/20 active:scale-95"
              >
                Lamar Posisi Ini
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-16 bg-slate-800/50 rounded-2xl border border-slate-700">
            <p className="text-slate-400">
              Tidak ada lowongan yang cocok dengan kriteria pencarianmu.
            </p>
          </div>
        )}
      </div>

      {/* MODAL POP-UP FORM MELAMAR KERJA */}
      {selectedJob && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setSelectedJob(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white text-xl font-bold"
            >
              ✕
            </button>

            <h2 className="text-2xl font-bold text-white">
              Formulir Lamaran Kerja
            </h2>
            <p className="text-sm text-cyan-400 mt-1 font-medium">
              {selectedJob.title} — {selectedJob.company}
            </p>

            {applySuccess ? (
              <div className="my-8 p-6 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-center">
                <span className="text-4xl block mb-2">🎉</span>
                <h3 className="text-lg font-bold text-emerald-300">
                  Lamaran Berhasil Terkirim!
                </h3>
                <p className="text-xs text-emerald-200 mt-1">
                  Data diri {fullName} dan CV kamu sudah diteruskan ke tim HRD
                  perusahaan.
                </p>
              </div>
            ) : (
              <form onSubmit={handleApplySubmit} className="mt-6 space-y-4">
                {/* Kolom Nama Lengkap */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nama Lengkap Pelamar *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Contoh: Naufal Romi"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Nomor WhatsApp / Telepon *
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Contoh: 081234567890"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Alamat Domisili Lengkap *
                  </label>
                  <textarea
                    required
                    rows={2}
                    placeholder="Alamat tempat tinggal saat ini..."
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Gaji yang Diharapkan (IDR) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 20000000"
                      value={expectedSalary}
                      onChange={(e) => setExpectedSalary(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Pengalaman Layar (Tahun) *
                    </label>
                    <input
                      type="number"
                      required
                      placeholder="Contoh: 3"
                      value={experience}
                      onChange={(e) => setExperience(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Unggah CV / Curriculum Vitae (PDF/Word)
                  </label>
                  <input
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-cyan-300 hover:file:bg-slate-700"
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button
                    type="button"
                    onClick={() => setSelectedJob(null)}
                    className="w-1/3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-sm transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-2/3 py-2.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md shadow-cyan-500/20 disabled:opacity-50"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Lamaran Now"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* WIDGET BOT CHAT OTOMATIS (NaviBot) */}
      <div className="fixed bottom-6 right-6 z-40">
        {isChatOpen ? (
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl w-80 sm:w-96 overflow-hidden flex flex-col h-[400px]">
            <div className="bg-slate-800 p-4 border-b border-slate-700 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-emerald-400 rounded-full animate-pulse"></span>
                <h4 className="text-sm font-bold text-white">
                  NaviBot – Asisten Maritime
                </h4>
              </div>
              <button
                onClick={() => setIsChatOpen(false)}
                className="text-slate-400 hover:text-white text-xs font-bold"
              >
                ✕
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/60">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sender === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] text-xs p-3 rounded-2xl ${
                      msg.sender === "user"
                        ? "bg-cyan-500 text-slate-950 font-medium rounded-br-none"
                        : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            <form
              onSubmit={handleSendChat}
              className="p-3 bg-slate-800 border-t border-slate-700 flex gap-2"
            >
              <input
                type="text"
                placeholder="Tanya syarat, gaji, dll..."
                value={inputChat}
                onChange={(e) => setInputChat(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-400"
              />
              <button
                type="submit"
                className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs rounded-xl"
              >
                Kirim
              </button>
            </form>
          </div>
        ) : (
          <button
            onClick={() => setIsChatOpen(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-slate-950 p-4 rounded-full shadow-2xl shadow-cyan-500/40 font-bold flex items-center gap-2 transition-transform active:scale-90"
          >
            <span>💬</span>
            <span className="text-xs font-extrabold hidden sm:inline">
              NaviBot Support
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
