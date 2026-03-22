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
    <footer className="footer-glass border-none">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">

          {/* Brand & Socials */}
          <div className="space-y-6">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 text-lg font-black text-white shadow-lg shadow-green-500/20">
                T
              </div>
              <span className="text-xl font-black tracking-tight text-gray-900 dark:text-white">Turff</span>
            </Link>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed max-w-xs">
              Experience the future of sports booking. Clean, fast, and reliable turf management for players and owners alike.
            </p>
            <div className="flex items-center gap-4">
              <SocialIcon icon={<Instagram className="w-5 h-5" />} />
              <SocialIcon icon={<Twitter className="w-5 h-5" />} />
              <SocialIcon icon={<Facebook className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">
              Navigation
            </h4>
            <ul className="space-y-4">
              {NAV_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
                  >
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Dashboards */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">
              Dashboards
            </h4>
            <ul className="space-y-4">
              {ROLE_LINKS.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm font-bold text-gray-600 dark:text-gray-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center group"
                  >
                    {l.label}
                    <ArrowUpRight className="w-3 h-3 ml-1 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-gray-900 dark:text-white mb-6">
              Newsletter
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Get weekly updates on new turfs and special discounts.
            </p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com"
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-white/10 bg-white dark:bg-white/5 text-sm outline-none focus:border-primary transition-colors"
              />
              <button className="p-2.5 rounded-xl bg-primary text-white hover:bg-primary-hover transition-colors">
                <Mail className="w-5 h-5" />
              </button>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-8 border-t border-gray-200 dark:border-white/10 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
            © {new Date().getFullYear()} Turff Inc. All rights reserved. Built with Next.js 15.
          </p>
          <div className="flex items-center gap-8">
            <Link href="#" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors">Terms</Link>
            <Link href="#" className="text-sm font-bold text-gray-500 hover:text-gray-900 dark:text-gray-500 dark:hover:text-white transition-colors">Support</Link>
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
