import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useAnimationControls } from "framer-motion";
import { Menu, X } from "lucide-react";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { siteAssets } from "@/lib/siteAssets";

type Phase = "dancing" | "center-out" | "at-ime" | "ime-out";

export function Navigation() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, loading: isLoading, isAuthenticated, logout } = useAuth();
  const [phase, setPhase] = useState<Phase>("dancing");
  const [showCenterLogo, setShowCenterLogo] = useState(true);
  const [showImeLogo, setShowImeLogo] = useState(false);
  const [showImeText, setShowImeText] = useState(true);
  const danceControls = useAnimationControls();
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const startDancing = () => {
    danceControls.start({
      y: [0, -16, 0, -10, 0, -20, 4, 0, -8, 0],
      x: [0, 5, -5, 8, -8, 3, -6, 6, 0, 0],
      rotate: [0, 12, -10, 0, 360, 368, 360, -6, 6, 0],
      scale: [1, 1.12, 1, 0.88, 1.18, 1, 1.08, 0.94, 1.04, 1],
      transition: { duration: 7, times: [0, 0.1, 0.22, 0.35, 0.48, 0.58, 0.68, 0.78, 0.88, 1], ease: "easeInOut", repeat: Infinity, repeatType: "loop" },
    });
  };

  useEffect(() => {
    const clear = () => timers.current.forEach(clearTimeout);
    const add = (fn: () => void, ms: number) => { timers.current.push(setTimeout(fn, ms)); };
    const runCycle = () => {
      clear();
      timers.current = [];
      setPhase("dancing"); setShowCenterLogo(true); setShowImeLogo(false); setShowImeText(true); startDancing();
      add(() => { setPhase("center-out"); danceControls.stop(); setShowCenterLogo(false); setShowImeText(false); }, 7000);
      add(() => { setPhase("at-ime"); setShowImeLogo(true); }, 7600);
      add(() => { setPhase("ime-out"); setShowImeLogo(false); setShowImeText(true); }, 9500);
      add(() => { setPhase("dancing"); setShowCenterLogo(true); startDancing(); }, 10000);
    };
    runCycle();
    const interval = setInterval(runCycle, 12000);
    return () => { clear(); clearInterval(interval); };
  }, [danceControls]);

  const navLinks = [
    { name: "Home", href: "#home" }, { name: "Services", href: "#services" }, { name: "Beats", href: "#beats" }, { name: "About", href: "#about" }, { name: "Connect", href: "#contact" },
  ];
  const teleportExit = { opacity: [1, 1, 0], scale: [1, 1.5, 0], filter: ["brightness(1)", "brightness(4) saturate(0)", "brightness(0)"], transition: { duration: 0.45, ease: "easeIn" } };
  const teleportEnter = { initial: { opacity: 0, scale: 0, filter: "brightness(4)" }, animate: { opacity: 1, scale: 1, filter: "brightness(1)" }, transition: { duration: 0.35, ease: "easeOut" as const } };

  return <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-background/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent py-6"}`}>
    <div className="container mx-auto px-6 flex items-center justify-between relative">
      <div className="w-24 h-9 relative flex items-center">
        <AnimatePresence mode="wait">
          {showImeText && !showImeLogo && <motion.a key="ime-text" href="#home" initial={{ opacity: 1 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.25 } }} className="text-2xl font-bold tracking-tighter text-white font-heading whitespace-nowrap">I.M.E<span className="text-primary">.</span></motion.a>}
          {showImeLogo && <motion.div key="ime-logo" {...teleportEnter} exit={teleportExit as never} className="relative"><motion.div initial={{ opacity: 0.8, scale: 0.5 }} animate={{ opacity: 0, scale: 2.5 }} transition={{ duration: 0.6 }} className="absolute inset-0 rounded-full bg-primary/40 blur-md pointer-events-none" /><motion.img src={siteAssets.logo} alt="I.M.E. Logo" animate={{ rotate: [0, 6, -6, 0], y: [0, -4, 0], transition: { duration: 1.2, repeat: Infinity, ease: "easeInOut" as const } }} className="w-10 h-10 object-contain drop-shadow-[0_0_10px_rgba(0,212,255,0.9)]" /></motion.div>}
        </AnimatePresence>
      </div>
      <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center" aria-label={phase}>
        <AnimatePresence mode="wait">{showCenterLogo && <motion.div key="center-logo" initial={{ opacity: 0, scale: 0, filter: "brightness(4)" }} animate={{ opacity: 1, scale: 1, filter: "brightness(1)", transition: { duration: 0.35 } }} exit={teleportExit as never} className="relative cursor-pointer"><motion.div animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.3, 1] }} transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 rounded-full bg-primary/25 blur-xl pointer-events-none" /><motion.img src={siteAssets.logo} alt="I.M.E. Logo" animate={danceControls} className="relative w-16 h-16 object-contain drop-shadow-[0_0_14px_rgba(0,212,255,0.85)]" /></motion.div>}</AnimatePresence>
      </div>
      <div className="hidden md:flex items-center gap-8">{navLinks.map((link) => <a key={link.name} href={link.href} className="text-sm font-medium text-white/70 hover:text-white transition-colors">{link.name}</a>)}<a href="/nova" className="text-sm font-medium text-primary hover:text-white transition-colors">NOVA</a>{!isLoading && (isAuthenticated ? <button onClick={() => logout()} className="text-sm font-medium text-white/70 hover:text-white transition-colors border border-white/20 hover:border-white/50 rounded-full px-4 py-1.5">Log out{user?.name ? ` (${user.name})` : ""}</button> : <button onClick={startLogin} className="text-sm font-semibold text-background bg-primary hover:bg-primary/90 transition-colors rounded-full px-4 py-1.5">Log in</button>)}</div>
      <button aria-label="Toggle navigation menu" className="md:hidden text-white p-2 -mr-2" onClick={() => setMobileMenuOpen((open) => !open)}>{mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}</button>
    </div>
    <AnimatePresence>{mobileMenuOpen && <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="absolute top-full left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-white/5 py-6 px-6 flex flex-col gap-6 md:hidden shadow-2xl">{navLinks.map((link) => <a key={link.name} href={link.href} onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-white/80 hover:text-primary transition-colors">{link.name}</a>)}<a href="/nova" onClick={() => setMobileMenuOpen(false)} className="text-lg font-medium text-primary hover:text-white transition-colors">NOVA</a>{!isLoading && (isAuthenticated ? <button onClick={() => logout()} className="text-lg font-medium text-white/70 hover:text-white transition-colors text-left">Log out{user?.name ? ` (${user.name})` : ""}</button> : <button onClick={startLogin} className="text-lg font-semibold text-background bg-primary hover:bg-primary/90 transition-colors rounded-full px-6 py-2 self-start">Log in</button>)}</motion.div>}</AnimatePresence>
  </nav>;
}
