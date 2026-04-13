import React from 'react';
import { motion } from 'motion/react';
import { Bot, ShieldAlert, BookOpen, ArrowRight, Smartphone, Laptop, Tablet, Watch } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface DashboardProps {
  onNavigate: (tab: string) => void;
}

export default function Dashboard({ onNavigate }: DashboardProps) {
  const features = [
    {
      id: 'companion',
      title: 'Tech Companion',
      description: 'Ask questions about your phone, tablet, or computer.',
      icon: Bot,
      color: 'bg-blue-500',
      tab: 'companion'
    },
    {
      id: 'scams',
      title: 'Scam Trainer',
      description: 'Practice spotting fake messages and staying safe online.',
      icon: ShieldAlert,
      color: 'bg-red-500',
      tab: 'scams'
    },
    {
      id: 'jargon',
      title: 'Jargon Buster',
      description: 'Translate confusing tech words into simple English.',
      icon: BookOpen,
      color: 'bg-green-500',
      tab: 'jargon'
    }
  ];

  return (
    <div className="space-y-12 py-8">
      <section className="text-center space-y-6">
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-extrabold tracking-tight"
        >
          Welcome to <span className="text-primary">VArch AI</span>
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
        >
          Your patient companion for mastering the digital world. 
          Choose a tool below to get started.
        </motion.p>
      </section>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <motion.div
            key={feature.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * (index + 1) }}
          >
            <Card 
              className="h-full border-2 hover:border-primary transition-all cursor-pointer group shadow-lg hover:shadow-2xl"
              onClick={() => onNavigate(feature.tab)}
            >
              <CardHeader>
                <div className={`${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-white shadow-inner`}>
                  <feature.icon size={32} />
                </div>
                <CardTitle className="text-3xl">{feature.title}</CardTitle>
                <CardDescription className="text-xl mt-2">
                  {feature.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="text-lg group-hover:translate-x-2 transition-transform p-0">
                  Get Started <ArrowRight className="ml-2" />
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <section className="bg-muted/30 rounded-3xl p-10 border-2">
        <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
          <Smartphone className="text-primary" /> Common Tech Help
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Smartphone, label: 'Phone Help' },
            { icon: Tablet, label: 'Tablet Help' },
            { icon: Laptop, label: 'Computer Help' },
            { icon: Watch, label: 'Watch Help' }
          ].map((item) => (
            <Button 
              key={item.label}
              variant="outline" 
              className="h-32 flex flex-col gap-3 rounded-2xl border-2 text-xl hover:bg-white hover:shadow-md transition-all"
              onClick={() => onNavigate('companion')}
            >
              <item.icon size={32} />
              {item.label}
            </Button>
          ))}
        </div>
      </section>
    </div>
  );
}
