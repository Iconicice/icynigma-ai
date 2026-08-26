import { useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import { Check, ChevronLeft, Disc3, LogIn, Sparkles } from "lucide-react";
import { avatarCatalog, avatarCategories, getAvatarByKey, getCurrentAvatarSet, getDefaultAvatarForQuarter, type AvatarKey } from "@/lib/avatarCatalog";
import { useAuth } from "@/_core/hooks/useAuth";
import { startLogin } from "@/const";
import { trpc } from "@/lib/trpc";

const LOCAL_AVATAR_KEY = "ime-avatar-key";

export default function Avatars() {
  const { isAuthenticated, loading } = useAuth();
  const profile = trpc.profile.avatar.useQuery(undefined, { enabled: isAuthenticated });
  const saveAvatar = trpc.profile.setAvatar.useMutation();
  const [category, setCategory] = useState("all");
  const [selectedKey, setSelectedKey] = useState<AvatarKey>(() => (localStorage.getItem(LOCAL_AVATAR_KEY) as AvatarKey | null) ?? getDefaultAvatarForQuarter().key);
  const selected = getAvatarByKey(selectedKey);
  const filtered = useMemo(() => category === "all" ? avatarCatalog : avatarCatalog.filter((avatar) => avatar.category === category), [category]);
  const quarter = getCurrentAvatarSet();

  useEffect(() => {
    if (profile.data?.avatarKey) setSelectedKey(profile.data.avatarKey as AvatarKey);
  }, [profile.data?.avatarKey]);

  const choose = (key: AvatarKey) => {
    setSelectedKey(key);
    localStorage.setItem(LOCAL_AVATAR_KEY, key);
    if (isAuthenticated) saveAvatar.mutate({ avatarKey: key });
  };

  return <main className="min-h-screen bg-[#07090d] text-white px-5 py-8 md:px-10 md:py-12">
    <div className="mx-auto max-w-6xl">
      <div className="flex items-center justify-between gap-4 mb-12">
        <Link href="/" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-primary transition-colors"><ChevronLeft size={16} /> Back to Iconic Media Entertainment</Link>
        <div className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-primary"><Disc3 size={15} /> I.M.E. Identity</div>
      </div>
      <header className="grid gap-8 lg:grid-cols-[1fr_320px] items-end mb-12">
        <div><p className="text-xs uppercase tracking-[0.35em] text-primary mb-4">Your signal in the studio</p><h1 className="font-heading text-5xl md:text-7xl tracking-tight leading-[0.9]">Choose your<br /><span className="text-white/45">Iconic avatar.</span></h1><p className="mt-6 max-w-xl text-white/55 leading-relaxed">Pick a visual identity for your I.M.E. profile. The collection refreshes every three months, while your saved choice stays yours until you select another.</p></div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"><div className="flex items-center gap-2 text-primary text-xs uppercase tracking-[0.2em] mb-4"><Sparkles size={14} /> Current drop</div><p className="text-2xl font-heading">{quarter.quarter}</p><p className="text-sm text-white/45 mt-2">Eight original avatars across four worlds. Credited to Inolofatseng Mokgoko.</p></div>
      </header>
      <div className="flex flex-wrap gap-2 mb-8" role="tablist" aria-label="Avatar categories"><button onClick={() => setCategory("all")} className={`rounded-full px-4 py-2 text-sm transition-colors ${category === "all" ? "bg-primary text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>All avatars</button>{avatarCategories.map((item) => <button key={item.key} onClick={() => setCategory(item.key)} className={`rounded-full px-4 py-2 text-sm transition-colors ${category === item.key ? "bg-primary text-black" : "bg-white/5 text-white/60 hover:bg-white/10"}`}>{item.label}</button>)}</div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{filtered.map((avatar) => { const active = avatar.key === selectedKey; return <button key={avatar.key} onClick={() => choose(avatar.key)} aria-pressed={active} className={`group relative overflow-hidden rounded-2xl border text-left transition-all duration-200 hover:-translate-y-1 ${active ? "border-primary shadow-[0_0_28px_rgba(0,212,255,0.2)]" : "border-white/10 hover:border-white/30"}`}><img src={avatar.imageUrl} alt={`${avatar.label} ${avatar.category.replace("-", " ")} avatar`} className="aspect-square w-full object-cover bg-black" loading="lazy" /><div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black via-black/75 to-transparent p-4 pt-12"><p className="font-semibold">{avatar.label}</p><p className="text-xs text-white/50 mt-1">{avatarCategories.find((item) => item.key === avatar.category)?.label}</p></div>{active && <span className="absolute right-3 top-3 inline-flex h-8 w-8 items-center justify-center rounded-full bg-primary text-black"><Check size={16} /></span>}</button>; })}</div>
      <div className="mt-12 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 md:flex-row md:items-center md:justify-between"><div className="flex items-center gap-4"><img src={selected.imageUrl} alt="Selected avatar" className="h-14 w-14 rounded-full object-cover ring-2 ring-primary/60" /><div><p className="text-sm text-white/50">Selected identity</p><p className="font-semibold">{selected.label}</p></div></div>{loading ? <span className="text-sm text-white/40">Checking profile…</span> : isAuthenticated ? <span className="text-sm text-primary">{saveAvatar.isPending ? "Saving…" : "Saved to your profile"}</span> : <button onClick={startLogin} className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-5 py-2.5 font-semibold text-black hover:bg-primary/90"><LogIn size={16} /> Log in to save</button>}</div>
    </div>
  </main>;
}
