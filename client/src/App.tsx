import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from "@/components/ErrorBoundary";
import { ThemeProvider } from "@/contexts/ThemeContext";
import Home from "@/pages/Home";
import NotFound from "@/pages/NotFound";
import { lazy, Suspense } from "react";
import { Route, Router as WouterRouter, Switch } from "wouter";

const Video = lazy(() => import("@/pages/Video"));

function Router() { return <Switch><Route path="/" component={Home} /><Route path="/video">{() => <Suspense fallback={<main className="min-h-screen bg-black" aria-label="Loading video experience" />}><Video /></Suspense>}</Route><Route path="/404" component={NotFound} /><Route component={NotFound} /></Switch>; }
export default function App() { return <ErrorBoundary><ThemeProvider defaultTheme="dark"><TooltipProvider><Toaster /><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><Router /></WouterRouter></TooltipProvider></ThemeProvider></ErrorBoundary>; }
