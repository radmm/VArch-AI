/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import { Bot, ShieldAlert, BookOpen, Home } from 'lucide-react';
import Dashboard from '@/components/Dashboard';
import TechCompanion from '@/components/TechCompanion';
import ScamTrainer from '@/components/ScamTrainer';
import JargonBuster from '@/components/JargonBuster';

export default function App() {
  const [activeTab, setActiveTab] = useState('home');

  return (
    <div className="min-h-screen bg-background font-sans selection:bg-primary/10">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto flex h-20 items-center justify-between px-4">
          <div 
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => setActiveTab('home')}
          >
            <div className="bg-primary p-2 rounded-xl group-hover:scale-110 transition-transform">
              <Bot className="text-primary-foreground w-8 h-8" />
            </div>
            <span className="text-2xl font-bold tracking-tight">VArch AI</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button 
              onClick={() => setActiveTab('home')}
              className={`text-lg font-medium transition-colors hover:text-primary ${activeTab === 'home' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Home
            </button>
            <button 
              onClick={() => setActiveTab('companion')}
              className={`text-lg font-medium transition-colors hover:text-primary ${activeTab === 'companion' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Tech Companion
            </button>
            <button 
              onClick={() => setActiveTab('scams')}
              className={`text-lg font-medium transition-colors hover:text-primary ${activeTab === 'scams' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Scam Trainer
            </button>
            <button 
              onClick={() => setActiveTab('jargon')}
              className={`text-lg font-medium transition-colors hover:text-primary ${activeTab === 'jargon' ? 'text-primary' : 'text-muted-foreground'}`}
            >
              Jargon Buster
            </button>
          </nav>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 md:hidden h-16 mb-8">
            <TabsTrigger value="home" className="text-xs flex flex-col gap-1">
              <Home size={20} /> Home
            </TabsTrigger>
            <TabsTrigger value="companion" className="text-xs flex flex-col gap-1">
              <Bot size={20} /> Help
            </TabsTrigger>
            <TabsTrigger value="scams" className="text-xs flex flex-col gap-1">
              <ShieldAlert size={20} /> Scams
            </TabsTrigger>
            <TabsTrigger value="jargon" className="text-xs flex flex-col gap-1">
              <BookOpen size={20} /> Words
            </TabsTrigger>
          </TabsList>

          <TabsContent value="home" className="mt-0 outline-none">
            <Dashboard onNavigate={setActiveTab} />
          </TabsContent>
          
          <TabsContent value="companion" className="mt-0 outline-none">
            <TechCompanion />
          </TabsContent>
          
          <TabsContent value="scams" className="mt-0 outline-none">
            <ScamTrainer />
          </TabsContent>
          
          <TabsContent value="jargon" className="mt-0 outline-none">
            <JargonBuster />
          </TabsContent>
        </Tabs>
      </main>

      <footer className="border-t py-12 bg-muted/30">
        <div className="container mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <Bot className="text-primary w-6 h-6" />
            <span className="text-xl font-bold">VArch AI</span>
          </div>
          <p className="text-muted-foreground text-lg">
            Empowering senior citizens through technology literacy and AI.
          </p>
          <div className="flex justify-center gap-8 pt-4">
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
            <a href="#" className="text-muted-foreground hover:text-primary transition-colors">Contact Support</a>
          </div>
          <p className="text-sm text-muted-foreground pt-8">
            © 2026 VArch AI. Built for GenLink Hacks by Dev Vishwas.
          </p>
        </div>
      </footer>
      <Toaster position="top-center" />
    </div>
  );
}
