import React, { useState } from 'react';
import { Search, BookOpen, HelpCircle, Loader2, ArrowRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { explainJargon } from '@/services/geminiService';
import ReactMarkdown from 'react-markdown';

const COMMON_TERMS = [
  "The Cloud", "Bluetooth", "Browser", "Cache", "Cookie", 
  "Encryption", "Firewall", "Malware", "Operating System", "Router"
];

export default function JargonBuster() {
  const [searchTerm, setSearchTerm] = useState('');
  const [explanation, setExplanation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (term: string) => {
    const targetTerm = term || searchTerm;
    if (!targetTerm.trim()) return;

    setIsLoading(true);
    setExplanation(null);
    try {
      const result = await explainJargon(targetTerm);
      setExplanation(result);
      setSearchTerm(targetTerm);
    } catch (error) {
      console.error('Error explaining jargon:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <Card className="border-2 shadow-xl">
        <CardHeader className="bg-primary/5">
          <CardTitle className="text-3xl flex items-center gap-3">
            <BookOpen className="w-10 h-10 text-primary" />
            Jargon Buster
          </CardTitle>
          <CardDescription className="text-xl">
            Translate confusing technology words into plain English.
          </CardDescription>
        </CardHeader>
        <CardContent className="p-8">
          <div className="flex gap-3 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-6 h-6" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter a confusing word (e.g., 'The Cloud')"
                className="h-16 pl-12 text-xl rounded-full border-2 focus-visible:ring-primary"
                onKeyDown={(e) => e.key === 'Enter' && handleSearch('')}
              />
            </div>
            <Button 
              onClick={() => handleSearch('')} 
              className="h-16 px-8 text-xl rounded-full shadow-lg"
              disabled={isLoading || !searchTerm.trim()}
            >
              Explain It
            </Button>
          </div>

          <div className="space-y-4">
            <p className="text-lg font-semibold text-muted-foreground">Common words to learn:</p>
            <div className="flex flex-wrap gap-2">
              {COMMON_TERMS.map((term) => (
                <Button
                  key={term}
                  variant="outline"
                  className="rounded-full text-lg h-10 px-6 border-2 hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => handleSearch(term)}
                >
                  {term}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-2xl font-medium">Simplifying for you...</p>
        </div>
      )}

      {explanation && !isLoading && (
        <Card className="border-2 shadow-2xl bg-primary/5 overflow-hidden">
          <CardHeader className="border-b-2 bg-white">
            <CardTitle className="text-3xl flex items-center gap-3">
              <HelpCircle className="text-primary w-8 h-8" />
              What is "{searchTerm}"?
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 bg-white">
            <div className="prose prose-xl max-w-none">
              <ReactMarkdown>{explanation}</ReactMarkdown>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
