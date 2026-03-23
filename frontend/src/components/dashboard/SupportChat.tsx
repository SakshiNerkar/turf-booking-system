"use client";

import { useState } from "react";
import { MessageSquare, XCircle, Send, Zap, ShieldCheck, Mail, Target, ArrowRight, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function SupportChat() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const [history, setHistory] = useState([
    { role: 'bot', text: 'TACTICAL SUPPORT INITIALIZED. Sector Alpha status: Operational. How can we assist your match execution?' }
  ]);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    if (!msg) return;
    setHistory(prev => [...prev, { role: 'user', text: msg }]);
    setMsg("");
    setTimeout(() => {
       setHistory(prev => [...prev, { role: 'bot', text: 'INTELLIGENCE RECEIVED. Dispatching query to regional sector leads. Standby for sync.' }]);
    }, 1000);
  };

  return (
    <>
      {/* TRIGGER BUTTON */}
      <button 
        onClick={() => setOpen(true)}
        className="fixed bottom-10 right-10 w-20 h-20 rounded-[1.75rem] bg-gray-900 dark:bg-white text-white dark:text-gray-900 flex items-center justify-center shadow-[0_40px_80px_rgba(0,0,0,0.3)] hover:scale-110 active:scale-95 transition-all z-[100] group overflow-hidden border border-white/10"
      >
         <MessageSquare className="w-8 h-8 group-hover:rotate-12 transition-transform" />
         <div className="absolute top-0 right-0 p-2 opacity-50 group-hover:scale-125 transition-all"><Zap className="w-12 h-12" /></div>
         <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary rounded-full border-4 border-white dark:border-[#0B0F0C] animate-pulse" />
      </button>

      {/* CHAT INTERFACE */}
      <AnimatePresence>
         {open && (
           <motion.div 
             initial={{ opacity: 0, y: 40, scale: 0.9, rotate: 2 }} animate={{ opacity: 1, y: 0, scale: 1, rotate: 0 }} exit={{ opacity: 0, y: 40, scale: 0.9, rotate: 2 }}
             className="fixed bottom-10 right-10 w-[450px] h-[650px] bg-white dark:bg-[#121A14] rounded-[4.5rem] border border-gray-100 dark:border-white/10 shadow-[0_80px_160px_rgba(0,0,0,0.5)] z-[101] overflow-hidden flex flex-col"
           >
              {/* Header */}
              <div className="p-10 bg-gray-900 dark:bg-black text-white flex items-center justify-between relative overflow-hidden">
                 <div className="relative z-10 flex items-center gap-5">
                    <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 shadow-xl"><ShieldCheck className="w-6 h-6 text-primary" /></div>
                    <div>
                       <h3 className="text-xl font-black italic tracking-tighter uppercase leading-none">Sector Support</h3>
                       <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mt-1 italic">Tactical AI Agent Sync-Active</div>
                    </div>
                 </div>
                 <button onClick={() => setOpen(false)} className="p-4 rounded-2xl bg-white/5 text-white/40 hover:text-white hover:bg-white/10 transition-all z-10"><XCircle className="w-6 h-6" /></button>
                 <div className="absolute -top-10 -right-10 opacity-10 pointer-events-none group-hover:scale-110 duration-[3s]"><Target className="w-48 h-48" /></div>
              </div>

              {/* Message Feed */}
              <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar bg-gray-50/50 dark:bg-white/[0.01]">
                 {history.map((h, i) => (
                   <motion.div 
                     initial={{ opacity: 0, x: h.role === 'user' ? 20 : -20 }} animate={{ opacity: 1, x: 0 }}
                     key={i} className={`flex ${h.role === 'user' ? 'justify-end' : 'justify-start'}`}
                   >
                      <div className={`max-w-[85%] p-6 rounded-[2rem] text-[11px] font-black uppercase tracking-widest leading-relaxed shadow-sm ${
                        h.role === 'user' ? 'bg-primary text-white rounded-br-none italic' : 'bg-white dark:bg-black text-gray-900 dark:text-gray-400 rounded-bl-none border border-gray-100 dark:border-white/5'
                      }`}>
                         {h.text}
                      </div>
                   </motion.div>
                 ))}
                 <div className="flex justify-center py-6">
                    <span className="px-6 py-2 bg-gray-100 dark:bg-white/5 rounded-full text-[8px] font-black text-gray-400 uppercase tracking-[0.3em] italic">Encryption Protocol AES-256 Enabled</span>
                 </div>
              </div>

              {/* Input Hub */}
              <form onSubmit={send} className="p-8 border-t border-gray-100 dark:border-white/5 bg-white dark:bg-[#121A14]">
                 <div className="relative group">
                    <input 
                      value={msg} onChange={e => setMsg(e.target.value)}
                      placeholder="Transmit Tactical Query..."
                      className="w-full pl-8 pr-20 py-6 bg-gray-50 dark:bg-white/2 border border-transparent focus:border-primary/20 rounded-[2.5rem] outline-none text-[11px] font-black uppercase tracking-widest transition-all italic placeholder:text-gray-400"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all shadow-xl"><Send className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" /></button>
                 </div>
                 <div className="mt-6 flex items-center justify-between px-4">
                    <div className="flex items-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest italic group cursor-pointer hover:text-primary transition-colors">
                       <Mail className="w-3.5 h-3.5" /> Email Direct Sector
                    </div>
                    <div className="flex items-center gap-3 text-[9px] font-black text-gray-400 uppercase tracking-widest italic group cursor-pointer hover:text-primary transition-colors">
                       <Sparkles className="w-3.5 h-3.5" /> Quick Intelligence
                    </div>
                 </div>
              </form>
           </motion.div>
         )}
      </AnimatePresence>
    </>
  );
}
