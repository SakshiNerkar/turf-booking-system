"use client";

import { useState } from "react";
import { Bell, CheckCircle2, XCircle, Info, Zap, ArrowRight, Trash2, ShieldCheck, Mail } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Notification = {
  id: string;
  type: "success" | "error" | "info" | "promo";
  title: string;
  message: string;
  time: string;
  read: boolean;
};

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", type: "success", title: "Match Confirmed", message: "Sector Alpha-7 access granted for 06:00 PM session.", time: "2m ago", read: false },
  { id: "2", type: "promo", title: "Weekend Surge Discount", message: "Apply 'TURFF20' for 20% off on all Pune arenas.", time: "1h ago", read: false },
  { id: "3", type: "info", title: "Security Protocol Update", message: "Face recognition required for Sector Beta entry.", time: "5h ago", read: true },
];

export function NotificationHub() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="relative">
       {/* THE BELL ICON */}
       <button 
         onClick={() => setOpen(!open)}
         className={`relative p-4 rounded-2xl bg-gray-100 dark:bg-white/5 border border-transparent hover:border-primary/20 hover:text-primary transition-all group ${open ? 'bg-primary/10 text-primary border-primary/20' : ''}`}
       >
          <Bell className={`w-5 h-5 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-4 h-4 bg-primary text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white dark:border-[#0B0F0C] group-hover:scale-125 transition-transform">
               {unreadCount}
            </span>
          )}
       </button>

       {/* THE HUB DROP DOWN */}
       <AnimatePresence>
          {open && (
             <motion.div 
               initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
               className="absolute top-20 right-0 w-96 bg-white dark:bg-[#121A14] rounded-[3.5rem] border border-gray-100 dark:border-white/10 shadow-[0_50px_100px_rgba(0,0,0,0.3)] z-[100] overflow-hidden"
             >
                <div className="p-10 space-y-8 bg-gray-50/50 dark:bg-white/[0.02] border-b border-gray-100 dark:border-white/5">
                   <div className="flex items-center justify-between">
                      <h3 className="text-xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Intelligence Hub</h3>
                      <button onClick={clearAll} className="p-2.5 rounded-xl bg-white dark:bg-black border border-gray-100 dark:border-white/5 text-gray-400 hover:text-red-500 transition-all shadow-sm"><Trash2 className="w-4 h-4" /></button>
                   </div>
                   <div className="flex items-center gap-6">
                      <div className="flex -space-x-4">
                         {[1,2,3].map(i => <div key={i} className="w-10 h-10 rounded-full border-4 border-white dark:border-[#121A14] bg-gray-100 dark:bg-white/10 flex items-center justify-center text-[10px] font-black italic">U</div>)}
                      </div>
                      <div className="text-[9px] font-black text-gray-400 uppercase tracking-widest italic">{unreadCount} UNRESOLVED LOGS</div>
                   </div>
                </div>

                <div className="max-h-[450px] overflow-y-auto no-scrollbar py-6">
                   {notifications.length === 0 ? (
                      <div className="py-20 text-center space-y-4 px-10">
                         <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-white/5 flex items-center justify-center mx-auto text-gray-300 opacity-40"><Mail className="w-8 h-8" /></div>
                         <h4 className="text-lg font-black text-gray-900 dark:text-white italic tracking-tighter uppercase opacity-60">Frequency Clear</h4>
                         <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-loose">No active match protocols detected in your communication grid.</p>
                      </div>
                   ) : (
                      notifications.map(n => (
                        <div key={n.id} className={`px-10 py-8 border-b border-gray-100 dark:border-white/5 last:border-0 hover:bg-gray-50 dark:hover:bg-white/[0.02] transition-all group relative cursor-pointer ${!n.read ? 'before:absolute before:left-4 before:top-1/2 before:-translate-y-1/2 before:w-1.5 before:h-12 before:bg-primary before:rounded-full' : ''}`}>
                           <div className="flex gap-6">
                              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm border border-transparent group-hover:scale-110 transition-transform ${
                                 n.type === 'success' ? 'bg-green-500/10 text-green-500' : 
                                 n.type === 'promo' ? 'bg-amber-500/10 text-amber-500' : 'bg-blue-500/10 text-blue-500'
                              }`}>
                                 {n.type === 'success' ? <CheckCircle2 className="w-6 h-6" /> : n.type === 'promo' ? <Zap className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                              </div>
                              <div className="flex-1 space-y-2">
                                 <div className="flex items-center justify-between">
                                    <h4 className="text-[11px] font-black text-gray-900 dark:text-white uppercase italic tracking-tighter leading-none group-hover:text-primary transition-colors">{n.title}</h4>
                                    <span className="text-[8px] font-black text-gray-400 uppercase tracking-widest opacity-40">{n.time}</span>
                                 </div>
                                 <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest leading-relaxed opacity-80">{n.message}</p>
                              </div>
                           </div>
                        </div>
                      ))
                   )}
                </div>

                <div className="p-8 bg-gray-50/50 dark:bg-white/[0.02] border-t border-gray-100 dark:border-white/5">
                   <button 
                     onClick={markAllRead}
                     className="w-full py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-2xl uppercase tracking-[0.3em] italic shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-4"
                   >
                      ARCHIVE ALL <CheckCircle2 className="w-4 h-4" />
                   </button>
                </div>
                <div className="absolute top-0 right-0 p-10 opacity-[0.02] pointer-events-none group-hover:scale-110 duration-[3s]"><ShieldCheck className="w-56 h-56" /></div>
             </motion.div>
          )}
       </AnimatePresence>
    </div>
  );
}
