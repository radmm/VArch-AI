import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, User, Bot, Loader2, Mic, MicOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { getTechAdvice } from '@/services/geminiService';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function TechCompanion() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm VArch AI, your personal tech companion. How can I help you with your device today? You can ask me anything, like 'How do I send a photo?' or 'What is a browser?'",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async (overrideInput?: string) => {
    const messageContent = overrideInput || input;
    if (!messageContent.trim() || isLoading || isListening) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput(''); // Always clear input on send
    setIsLoading(true);

    try {
      const advice = await getTechAdvice(messageContent);
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: advice || "I'm sorry, I couldn't quite understand that. Could you try asking in a different way?",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error getting tech advice:', error);
      toast.error("I'm having trouble connecting right now. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const toggleListening = async () => {
    if (!('webkitSpeechRecognition' in window) && !('speechRecognition' in window)) {
      toast.error('Speech recognition is not supported in your browser. Please try using Chrome or Edge.');
      return;
    }

    if (isListening) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsListening(false);
      return;
    }

    // Explicitly request microphone permission first to force the browser prompt
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // We don't need the stream, just the permission. Stop it immediately.
      stream.getTracks().forEach(track => track.stop());
    } catch (error: any) {
      console.error('Microphone permission denied:', error);
      if (error.name === 'NotAllowedError' || error.message?.includes('not allowed')) {
        toast.error(
          "Microphone access was denied. This often happens in previews. Please try opening the app in a new tab using the button at the top right.",
          { duration: 6000 }
        );
      } else {
        toast.error("Microphone access was denied. Please check your browser permissions.");
      }
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).speechRecognition;
    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      toast.info("Listening...");
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
      // Automatically send the transcript
      if (transcript.trim()) {
        handleSend(transcript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
      if (event.error === 'not-allowed') {
        toast.error("Microphone access was denied. Please check your browser permissions.");
      } else {
        toast.error("Sorry, I couldn't hear you. Please try again.");
      }
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      setIsListening(false);
    }
  };

  return (
    <Card className="flex flex-col h-[70vh] min-h-[500px] max-h-[700px] max-w-2xl mx-auto shadow-xl border-2">
      <CardHeader className="bg-primary text-primary-foreground rounded-t-lg">
        <CardTitle className="text-2xl flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Bot className="w-8 h-8" />
            Tech Companion
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 hidden sm:flex"
            onClick={() => window.open(window.location.href, '_blank')}
          >
            Open in New Tab
          </Button>
        </CardTitle>
        <CardDescription className="text-primary-foreground/80 text-lg">
          Ask me any technology question, and I'll explain it simply.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="flex-1 overflow-hidden p-0 flex flex-col h-0">
        <div 
          className="flex-1 overflow-y-auto p-6 space-y-6" 
          ref={scrollRef}
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] p-4 rounded-2xl shadow-sm border ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground rounded-tr-none'
                      : 'bg-muted text-foreground rounded-tl-none'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2 opacity-70 text-sm font-medium">
                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                    {msg.role === 'user' ? 'You' : 'VArch AI'}
                  </div>
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex justify-start"
            >
              <div className="bg-muted p-4 rounded-2xl rounded-tl-none flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-lg">Thinking...</span>
              </div>
            </motion.div>
          )}
        </div>

        <div className="p-4 border-t-2 bg-muted/30 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex gap-3"
          >
            <Button
              type="button"
              variant={isListening ? "destructive" : "outline"}
              size="icon"
              className="h-14 w-14 rounded-full shadow-md"
              onClick={toggleListening}
            >
              {isListening ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </Button>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your question here..."
              className="flex-1 h-14 text-lg rounded-full px-6 shadow-md border-2 focus-visible:ring-primary"
            />
            <Button 
              type="submit" 
              size="icon" 
              className="h-14 w-14 rounded-full shadow-md"
              disabled={isLoading || !input.trim()}
            >
              <Send className="w-6 h-6" />
            </Button>
          </form>
        </div>
      </CardContent>
    </Card>
  );
}
