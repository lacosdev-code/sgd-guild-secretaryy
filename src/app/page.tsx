import Link from 'next/link'
import { auth } from '@/lib/auth'
import { LogIn, LayoutDashboard, Shield, Trophy, ScrollText, MessagesSquare } from 'lucide-react'

const FEATURES = [
    { icon: ScrollText,      title: 'Quest Management',   desc: 'Buat, assign, dan pantau quest operasional guild secara real-time.' },
    { icon: Trophy,          title: 'Sistem Poin',        desc: 'Adventurer mendapat SGD Points setiap quest disetujui oleh Guild Master.' },
    { icon: MessagesSquare,  title: 'Guild Tavern',       desc: 'Ruang diskusi bersama seluruh anggota guild dalam satu tempat.' },
    { icon: Shield,          title: 'Role-based Access',  desc: 'Guild Master dan Adventurer memiliki akses berbeda sesuai peran.' },
]

export default async function RootPage() {
    const session = await auth()

    return (
        <div
            className="min-h-screen flex flex-col relative overflow-hidden"
            style={{ background: 'linear-gradient(160deg, #0F1B2D 0%, #1B2E52 50%, #0D1520 100%)' }}
        >
            {/* ── Background decorations ──────────────────────────── */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full opacity-[0.06]"
                    style={{ background: 'radial-gradient(circle, #C9A227 0%, transparent 65%)' }} />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full opacity-[0.05]"
                    style={{ background: 'radial-gradient(circle, #C9A227 0%, transparent 65%)' }} />
                {/* Grid pattern */}
                <div className="absolute inset-0 opacity-[0.025]"
                    style={{ backgroundImage: 'linear-gradient(#C9A227 1px, transparent 1px), linear-gradient(90deg, #C9A227 1px, transparent 1px)', backgroundSize: '80px 80px' }} />
            </div>

            {/* ── Navbar ──────────────────────────────────────────── */}
            <nav className="relative z-10 flex items-center justify-between px-6 py-5 max-w-6xl mx-auto w-full">
                {/* Brand */}
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl overflow-hidden border border-[#C9A227]/30 flex items-center justify-center"
                        style={{ background: 'rgba(201,162,39,0.1)' }}>
                        <img
                            src="https://ik.imagekit.io/Sgd/Logo%20Potrait.png?updatedAt=1771273586419"
                            alt="SGD"
                            className="w-6 h-6 object-contain"
                        />
                    </div>
                    <div>
                        <p className="text-xs font-black tracking-[0.2em] text-white leading-none">SGD GUILD</p>
                        <p className="text-[9px] tracking-widest uppercase leading-none mt-0.5" style={{ color: '#C9A227' }}>Secretary</p>
                    </div>
                </div>

                {/* Nav actions */}
                <div className="flex items-center gap-3">
                    {session?.user ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
                            style={{ background: 'linear-gradient(135deg, #C9A227, #E8C84A)', color: '#1B2E52' }}
                        >
                            <LayoutDashboard size={13} />
                            Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-widest transition-all hover:opacity-80"
                            style={{ background: 'linear-gradient(135deg, #C9A227, #E8C84A)', color: '#1B2E52' }}
                        >
                            <LogIn size={13} />
                            Masuk
                        </Link>
                    )}
                </div>
            </nav>

            {/* ── Hero ────────────────────────────────────────────── */}
            <main className="relative z-10 flex-1 flex flex-col items-center justify-center text-center px-6 py-16">

                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-widest mb-8"
                    style={{ border: '1px solid rgba(201,162,39,0.4)', color: '#C9A227', background: 'rgba(201,162,39,0.08)' }}>
                    <Shield size={10} />
                    Sistem Internal Guild
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight max-w-3xl">
                    Pusat Kendali
                    <br />
                    <span style={{ color: '#C9A227' }}>Guild Sunggiardi</span>
                </h1>

                <p className="mt-5 text-base text-white/40 max-w-lg leading-relaxed">
                    Platform manajemen quest, poin, dan komunikasi internal Sunggiardi Care Foundation Guild.
                </p>

                {/* CTA */}
                <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
                    {session?.user ? (
                        <Link
                            href="/dashboard"
                            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #C9A227, #E8C84A)', color: '#1B2E52' }}
                        >
                            <LayoutDashboard size={16} />
                            Ke Dashboard
                        </Link>
                    ) : (
                        <Link
                            href="/login"
                            className="flex items-center gap-2 px-6 py-3.5 rounded-xl text-sm font-bold uppercase tracking-widest shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
                            style={{ background: 'linear-gradient(135deg, #C9A227, #E8C84A)', color: '#1B2E52' }}
                        >
                            <LogIn size={16} />
                            Masuk ke Guild
                        </Link>
                    )}
                </div>

                {/* ── Feature grid ──────────────────────────────────── */}
                <div className="mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl w-full text-left">
                    {FEATURES.map(({ icon: Icon, title, desc }) => (
                        <div
                            key={title}
                            className="p-5 rounded-2xl border transition-all hover:border-[#C9A227]/30 hover:bg-white/5"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                        >
                            <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: 'rgba(201,162,39,0.12)', border: '1px solid rgba(201,162,39,0.2)' }}>
                                <Icon size={16} style={{ color: '#C9A227' }} />
                            </div>
                            <p className="text-sm font-bold text-white mb-1.5">{title}</p>
                            <p className="text-xs text-white/35 leading-relaxed">{desc}</p>
                        </div>
                    ))}
                </div>
            </main>

            {/* ── Footer ──────────────────────────────────────────── */}
            <footer className="relative z-10 text-center py-6 text-[10px] text-white/15 tracking-widest uppercase">
                © 2025 Sunggiardi Care Foundation · Guild Secretary v1.1
            </footer>
        </div>
    )
}
