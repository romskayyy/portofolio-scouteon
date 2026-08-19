"use client";

import { useState } from "react";
import Link from "next/link";

// Data dummy lowongan pelaut dalam IDR
const INITIAL_JOBS = [
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

  return (
    <div className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="max-w-7xl mx-auto mb-8 bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-8 text-white shadow-xl border-b-4 border-cyan-500">
        <h1 className="text-3xl font-bold tracking-tight">
          ⚓ Cari Lowongan Pelaut (Seafarer Jobs)
        </h1>
        <p className="mt-2 text-slate-300 text-sm sm:text-base">
          Temukan karir maritim terbaik di perusahaan pelayaran terpercaya
          seluruh Indonesia.
        </p>

        {/* Filter & Search Bar */}
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <input
            type="text"
            placeholder="Cari posisi atau nama perusahaan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="sm:col-span-2 px-4 py-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm"
          />
          <select
            value={selectedVessel}
            onChange={(e) => setSelectedVessel(e.target.value)}
            className="px-4 py-3 rounded-lg text-slate-900 focus:ring-2 focus:ring-cyan-500 focus:outline-none shadow-sm bg-white"
          >
            <option value="All">Semua Jenis Kapal</option>
            <option value="Container Ship">Container Ship</option>
            <option value="Oil Tanker">Oil Tanker</option>
            <option value="Bulk Carrier">Bulk Carrier</option>
          </select>
        </div>
      </div>

      {/* Job Cards Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <div
              key={job.id}
              className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all duration-200 p-6 flex flex-col justify-between hover:border-blue-400"
            >
              <div>
                <div className="flex justify-between items-start mb-3">
                  <span className="inline-block bg-blue-50 text-blue-700 text-xs font-semibold px-2.5 py-1 rounded-full border border-blue-200">
                    🚢 {job.vesselType}
                  </span>
                  <span className="text-xs text-slate-400">{job.postedAt}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 leading-snug">
                  {job.title}
                </h3>
                <p className="text-sm font-medium text-slate-600 mt-1">
                  {job.company}
                </p>
                <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
                  📍 {job.location} • Kontrak: {job.contractDuration}
                </p>

                {/* Salary Box dalam IDR */}
                <div className="mt-4 p-3 bg-slate-50 rounded-lg border border-slate-100">
                  <span className="text-xs text-slate-500 block">
                    Estimasi Gaji / Bulan
                  </span>
                  <span className="text-sm font-bold text-emerald-600">
                    {formatIDR(job.salaryMin)} - {formatIDR(job.salaryMax)}
                  </span>
                </div>
              </div>

              <button className="mt-5 w-full bg-slate-900 text-white hover:bg-blue-600 text-sm font-medium py-2.5 px-4 rounded-lg transition-colors duration-150 shadow-sm">
                Lamar Posisi Ini
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500">
              Tidak ada lowongan yang sesuai dengan pencarianmu.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
