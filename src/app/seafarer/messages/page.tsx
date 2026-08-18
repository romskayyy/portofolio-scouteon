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

  return (
    <div>
      <h1 className="text-2xl font-bold text-navy-700">Pesan</h1>

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="col-span-1 space-y-2">
          {loading && <p className="text-sm text-slate-400">Memuat...</p>}
          {!loading && conversations.length === 0 && (
            <p className="text-sm text-slate-400">
              Belum ada percakapan. Percakapan dimulai otomatis saat employer
              menghubungi kamu terkait lamaran.
            </p>
          )}
          {conversations.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveId(c.id)}
              className={`flex w-full items-center gap-2 rounded-lg border p-3 text-left text-sm ${
                activeId === c.id
                  ? "border-navy-500 bg-navy-50"
                  : "border-slate-200 bg-white hover:bg-slate-50"
              }`}
            >
              <MessageSquare className="h-4 w-4 text-navy-500" />
              <div>
                <p className="font-medium text-navy-700">
                  {c.profiles?.full_name || "Employer"}
                </p>
                <p className="text-xs text-slate-500">{c.jobs?.title}</p>
              </div>
            </button>
          ))}
        </div>

        <div className="col-span-2 flex h-[500px] flex-col rounded-xl border border-slate-200 bg-white">
          {!activeId ? (
            <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
              Pilih percakapan untuk melihat pesan
            </div>
          ) : (
            <>
              <div className="flex-1 space-y-2 overflow-y-auto p-4">
                {messages.map((m) => (
                  <div
                    key={m.id}
                    className={`max-w-[75%] rounded-lg px-3 py-2 text-sm ${
                      m.sender_id === userId
                        ? "ml-auto bg-navy-600 text-white"
                        : "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {m.content}
                  </div>
                ))}
              </div>
              <div className="flex items-center gap-2 border-t border-slate-200 p-3">
                <input
                  className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                  placeholder="Tulis pesan..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                  onClick={handleSend}
                  className="rounded-lg bg-navy-600 p-2 text-white hover:bg-navy-700"
                >
                  <Send className="h-4 w-4" />
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
