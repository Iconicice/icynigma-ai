import { About } from "@/components/About";
import { AudioGuide } from "@/components/AudioGuide";
import { Beats } from "@/components/Beats";
import { Connect } from "@/components/Connect";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/Hero";
import { ImeAssistant } from "@/components/ImeAssistant";
import { Navigation } from "@/components/Navigation";
import { Services } from "@/components/Services";

export default function Home() { return <div className="min-h-screen bg-background text-foreground selection:bg-primary/30"><Navigation /><main><Hero /><Services /><Beats /><About /><Connect /></main><Footer /><AudioGuide /><ImeAssistant /></div>; }
