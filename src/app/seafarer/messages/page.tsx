"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { MessageSquare, Send } from "lucide-react";

interface ConversationRow {
  id: string;
  employer_id: string;
  job_id: string | null;
  jobs?: { title: string } | null;
  profiles?: { full_name: string } | null;
}

interface MessageRow {
  id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export default function SeafarerMessagesPage() {
  const supabase = createClient();
  const [userId, setUserId] = useState<string | null>(null);
  const [conversations, setConversations] = useState<ConversationRow[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [messages, setMessages] = useState<MessageRow[]>([]);
  const [draft, setDraft] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;
      setUserId(user.id);
      const { data } = await supabase
        .from("conversations")
        .select("*, jobs(title), profiles:employer_id(full_name)")
        .eq("seafarer_id", user.id)
        .order("created_at", { ascending: false });
      if (data) setConversations(data as unknown as ConversationRow[]);
      setLoading(false);
    })();
  }, []);

  useEffect(() => {
    if (!activeId) return;
    (async () => {
      const { data } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", activeId)
        .order("created_at", { ascending: true });
      if (data) setMessages(data);
    })();
  }, [activeId]);

  async function handleSend() {
    if (!activeId || !draft.trim() || !userId) return;
    const { data } = await supabase
      .from("messages")
      .insert({ conversation_id: activeId, sender_id: userId, content: draft })
      .select()
      .single();
    if (data) setMessages([...messages, data]);
    setDraft("");
  }

  const activeConv = conversations.find((c) => c.id === activeId);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-850 to-slate-900 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-3xl p-6 border border-cyan-500/30 shadow-2xl flex items-center justify-between">
          <div>
            <span className="bg-cyan-500/20 text-cyan-300 text-xs font-bold px-3 py-1 rounded-full border border-cyan-500/30">
              💬 Messaging Portal
            </span>
            <h1 className="text-2xl font-extrabold text-white mt-2">
              Pesan & Komunikasi
            </h1>
            <p className="text-xs text-slate-300 mt-1">
              Hubungi langsung perusahaan pelayaran terkait status lamaran dan
              panggilan interview.
            </p>
          </div>
        </div>

        {/* Layout Chat Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Daftar Percakapan (Daftar Kontak) */}
          <div className="col-span-1 bg-slate-800/80 backdrop-blur-md rounded-2xl border border-slate-700 p-4 shadow-xl space-y-3 h-[550px] overflow-y-auto">
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 px-1">
              Percakapan Aktif
            </h2>

            {loading && (
              <p className="text-xs text-slate-400 p-2">
                ⏳ Memuat percakapan...
              </p>
            )}

            {!loading && conversations.length === 0 && (
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50 text-center">
                <p className="text-xs text-slate-400 leading-relaxed">
                  Belum ada percakapan. Percakapan dimulai otomatis saat
                  employer menghubungi kamu terkait lamaran.
                </p>
              </div>
            )}

            {conversations.map((c) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left transition-all ${
                  activeId === c.id
                    ? "border-cyan-400 bg-cyan-950/60 shadow-md shadow-cyan-500/10"
                    : "border-slate-700 bg-slate-900/60 hover:bg-slate-800"
                }`}
              >
                <div className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-cyan-400 mt-0.5">
                  <MessageSquare className="h-4 w-4" />
                </div>
                <div className="flex-1 overflow-hidden">
                  <p className="font-bold text-white text-sm truncate">
                    {c.profiles?.full_name || "Perusahaan Pelayaran"}
                  </p>
                  <p className="text-xs text-cyan-300/80 font-medium truncate mt-0.5">
                    {c.jobs?.title || "Lowongan Kapal"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Area Isi Pesan & Input */}
          <div className="col-span-1 md:col-span-2 flex h-[550px] flex-col rounded-2xl border border-slate-700 bg-slate-800/90 shadow-2xl overflow-hidden">
            {!activeId ? (
              <div className="flex flex-1 flex-col items-center justify-center text-slate-400 p-6 text-center">
                <span className="text-4xl mb-2">⚓</span>
                <p className="text-sm font-medium">
                  Pilih salah satu percakapan di sebelah kiri untuk melihat
                  pesan.
                </p>
              </div>
            ) : (
              <>
                {/* Header Chat Aktif */}
                <div className="p-4 bg-slate-900/90 border-b border-slate-700 flex items-center justify-between">
                  <div>
                    <h3 className="font-bold text-white text-sm">
                      {activeConv?.profiles?.full_name ||
                        "Perusahaan Pelayaran"}
                    </h3>
                    <p className="text-xs text-cyan-400 font-medium">
                      Posisi: {activeConv?.jobs?.title || "Lowongan Kapal"}
                    </p>
                  </div>
                  <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full">
                    Terhubung
                  </span>
                </div>

                {/* List Balasan Pesan */}
                <div className="flex-1 space-y-3 overflow-y-auto p-4 bg-slate-950/40">
                  {messages.map((m) => {
                    const isMe = m.sender_id === userId;
                    return (
                      <div
                        key={m.id}
                        className={`flex ${
                          isMe ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 text-xs shadow-sm ${
                            isMe
                              ? "bg-cyan-500 text-slate-950 font-medium rounded-br-none"
                              : "bg-slate-800 text-slate-200 border border-slate-700 rounded-bl-none"
                          }`}
                        >
                          <p className="leading-relaxed">{m.content}</p>
                          <span
                            className={`block text-[9px] mt-1 text-right ${
                              isMe ? "text-slate-900/70" : "text-slate-400"
                            }`}
                          >
                            {new Date(m.created_at).toLocaleTimeString(
                              "id-ID",
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form Input Balas Pesan */}
                <div className="flex items-center gap-2 border-t border-slate-700 p-3 bg-slate-900">
                  <input
                    className="flex-1 rounded-xl bg-slate-800 border border-slate-700 px-4 py-2.5 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-cyan-400"
                    placeholder="Tulis pesan balasan..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  />
                  <button
                    onClick={handleSend}
                    className="rounded-xl bg-cyan-500 hover:bg-cyan-400 p-2.5 text-slate-950 font-bold transition-all shadow-md shadow-cyan-500/20 active:scale-95"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
