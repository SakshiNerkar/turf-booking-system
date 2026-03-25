import Link from "next/link";
import { Mail, Instagram, Twitter, Facebook, ArrowUpRight } from "lucide-react";

const NAV_LINKS = [
  { label: "Browse Turfs", href: "/turfs" },
  { label: "Login",        href: "/login" },
  { label: "Register",     href: "/register" },
];

const ROLE_LINKS = [
  { label: "Customer Dashboard", href: "/dashboard/customer" },
  { label: "Owner Dashboard",    href: "/dashboard/owner" },
  { label: "Admin Dashboard",    href: "/dashboard/admin" },
];

const SPORTS = ["Football", "Cricket", "Badminton", "Tennis"];

export function Footer() {
  return (
    <footer className="bg-white dark:bg-[#0B0F0C] border-t border-border py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">

          {/* Brand & Socials */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white font-black text-lg italic skew-x-3 group-hover:skew-x-0 transition-transform shadow-lg shadow-primary/20">
                T
              </div>
              <span className="text-xl font-black tracking-tighter text-gray-900 dark:text-gray-100 uppercase italic">Turff</span>
            </Link>
            <p className="text-xs text-gray-500 font-bold leading-relaxed max-w-xs uppercase tracking-tight">
              The world's most advanced turf booking ecosystem. Clean, fast, and engineered for elite performance.
            </p>
            <div className="flex items-center gap-3">
              <SocialIcon icon={<Instagram className="w-4 h-4" />} />
              <SocialIcon icon={<Twitter className="w-4 h-4" />} />
              <SocialIcon icon={<Facebook className="w-4 h-4" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-black text-gray-500 hover:text-primary transition-all underline-slide inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
              Platform
            </h4>
            <ul className="space-y-3">
              {ROLE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-xs font-black text-gray-500 hover:text-primary transition-all underline-slide inline-block"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div className="col-span-1">
            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-6">
              Newsletter
            </h4>
            <div className="space-y-4">
               <div className="relative group">
                  <input 
                    type="email" 
                    placeholder="Enter email..."
                    className="w-full px-4 py-3 rounded-full border border-border bg-gray-50 dark:bg-white/5 text-xs font-bold outline-none ring-primary/20 focus:ring-4 focus:border-primary transition-all"
                  />
                  <button className="absolute right-1.5 top-1.5 w-9 h-9 rounded-full bg-primary text-white flex items-center justify-center hover:scale-110 active:scale-90 transition-transform shadow-lg shadow-primary/20">
                    <Mail className="w-4 h-4" />
                  </button>
               </div>
               <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                  Join 5,000+ athletes for weekly turf drops and elite discounts.
               </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">
            © {new Date().getFullYear()} TURFF ARENA TECHNOLOGIES. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-6">
            <Link href="#" className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors underline-slide uppercase tracking-widest">Privacy</Link>
            <Link href="#" className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors underline-slide uppercase tracking-widest">Terms</Link>
            <Link href="#" className="text-[10px] font-black text-gray-500 hover:text-primary transition-colors underline-slide uppercase tracking-widest">Security</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

function SocialIcon({ icon }: { icon: React.ReactNode }) {
  return (
    <button className="p-2.5 rounded-xl bg-gray-100 dark:bg-white/5 text-gray-500 hover:text-primary hover:bg-primary/10 transition-all duration-300">
      {icon}
    </button>
  );
}
