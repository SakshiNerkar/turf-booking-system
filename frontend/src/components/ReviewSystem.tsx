"use client";

import { useState } from "react";
import { Star, MessageSquare, ThumbsUp, ShieldCheck, Flag, ArrowRight, Zap, Target } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { notify } from "../lib/toast";

type Review = {
  id: string;
  user_name: string;
  rating: number;
  comment: string;
  created_at: string;
  likes: number;
};

const MOCK_REVIEWS: Review[] = [
  { id: "1", user_name: "Rahul S.", rating: 5, comment: "Elite drainage system! Played during monsoon and the grip was still tactical grade.", created_at: "2024-03-20", likes: 12 },
  { id: "2", user_name: "Anita K.", rating: 4, comment: "Parking is a bit tight but the pitch quality is top-tier. Snack bar has decent shakes.", created_at: "2024-03-18", likes: 8 },
];

export function ReviewSystem({ turfId }: { turfId: string }) {
  const [reviews] = useState<Review[]>(MOCK_REVIEWS);
  const [showForm, setShowForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0) return notify.error("Please set a rating protocol.");
    setSubmitting(true);
    // Simulate API call
    await new Promise(r => setTimeout(r, 1000));
    setSubmitting(false);
    notify.success("Intelligence submitted successfully! ✅");
    setShowForm(false);
    setRating(0);
    setComment("");
  };

  return (
    <section className="space-y-12">
      <div className="flex items-end justify-between px-4">
         <div className="space-y-4">
            <h3 className="text-4xl font-black text-gray-900 dark:text-white italic tracking-tighter uppercase leading-none">Intelligence Feed</h3>
            <div className="flex items-center gap-4 text-[10px] font-black text-primary uppercase tracking-[0.4em] italic leading-none">
               CAPTURED MATCH DATA FROM THE FIELD ({reviews.length} LOGS)
            </div>
         </div>
         <button 
           onClick={() => setShowForm(!showForm)}
           className="px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-[10px] font-black rounded-2xl uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all italic flex items-center gap-4 underline underline-offset-4 decoration-2"
         >
            {showForm ? "ABORT LOG" : "SUBMIT INTEL"} <Zap className="w-4 h-4" />
         </button>
      </div>

      <AnimatePresence>
         {showForm && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
               <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-white/2 rounded-[3.5rem] p-12 border border-gray-100 dark:border-white/5 space-y-10 shadow-inner">
                  <div className="flex flex-col md:flex-row md:items-center gap-10">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic block">Rating Intensity</label>
                        <div className="flex gap-3">
                           {[1,2,3,4,5].map(s => (
                             <button type="button" key={s} onClick={() => setRating(s)} className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${rating >= s ? 'bg-primary text-white scale-110 shadow-xl' : 'bg-white dark:bg-black text-gray-300'}`}>
                                <Star className={`w-6 h-6 ${rating >= s ? 'fill-current' : ''}`} />
                             </button>
                           ))}
                        </div>
                     </div>
                     <div className="flex-1 space-y-4">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest italic block">Detailed Log Transmission</label>
                        <textarea 
                          value={comment} onChange={e => setComment(e.target.value)}
                          className="w-full p-6 bg-white dark:bg-black border border-transparent focus:border-primary/20 rounded-3xl outline-none text-sm font-bold placeholder:italic transition-all shadow-sm"
                          placeholder="Describe the pitch quality, lighting, and sector facilities..."
                          rows={3}
                        />
                     </div>
                  </div>
                  <div className="flex justify-end">
                     <button type="submit" disabled={submitting} className="px-12 py-5 bg-primary text-white font-black rounded-[1.5rem] shadow-2xl shadow-green-500/20 hover:scale-110 active:scale-95 transition-all text-[11px] uppercase tracking-widest italic flex items-center gap-6">
                        {submitting ? "UPLOADING..." : <>TRANSMIT LOG <ArrowRight className="w-5 h-5" /></>}
                     </button>
                  </div>
               </form>
            </motion.div>
         )}
      </AnimatePresence>

      <div className="grid md:grid-cols-2 gap-8">
         {reviews.map(r => (
            <div key={r.id} className="group bg-white dark:bg-[#121A14] rounded-[3.5rem] p-10 border border-gray-100 dark:border-white/5 shadow-2xl relative overflow-hidden flex flex-col justify-between">
               <div className="space-y-6 relative z-10">
                  <div className="flex items-center justify-between">
                     <div className="flex gap-1">
                        {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${r.rating >= s ? 'text-amber-500 fill-amber-500' : 'text-gray-100 dark:text-white/5 fill-current'}`} />)}
                     </div>
                     <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest opacity-60">{r.created_at}</span>
                  </div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white italic leading-relaxed uppercase tracking-tighter">"{r.comment}"</p>
               </div>
               
               <div className="flex items-center justify-between mt-10 pt-8 border-t border-gray-100 dark:border-white/5 relative z-10">
                  <div className="flex items-center gap-4">
                     <div className="w-12 h-12 rounded-2xl bg-gray-50 dark:bg-white/5 flex items-center justify-center text-[10px] font-black group-hover:bg-primary/10 group-hover:text-primary transition-all">USER</div>
                     <div>
                        <div className="text-[11px] font-black text-gray-900 dark:text-white uppercase italic tracking-tighter">{r.user_name}</div>
                        <div className="text-[8px] font-black text-primary uppercase tracking-[0.2em] italic">VERIFIED ATHLETE</div>
                     </div>
                  </div>
                  <div className="flex items-center gap-6">
                     <button className="flex items-center gap-2 text-[9px] font-black text-gray-400 hover:text-primary transition-colors uppercase tracking-widest"><ThumbsUp className="w-3.5 h-3.5" /> {r.likes}</button>
                     <button className="text-gray-200 dark:text-white/5 hover:text-red-500 transition-colors"><Flag className="w-4 h-4" /></button>
                  </div>
               </div>
               
               <div className="absolute top-0 right-0 p-10 opacity-[0.02] group-hover:scale-110 group-hover:rotate-12 transition-all duration-[3s] pointer-events-none"><ShieldCheck className="w-48 h-48" /></div>
            </div>
         ))}
      </div>
    </section>
  );
}
