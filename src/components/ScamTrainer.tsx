import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShieldAlert, CheckCircle2, XCircle, RefreshCw, AlertTriangle, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { generateScamScenario } from '@/services/geminiService';
import ReactMarkdown from 'react-markdown';
import { toast } from 'sonner';

interface Scenario {
  title: string;
  message: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation: string;
  }[];
  redFlags: string[];
}

export default function ScamTrainer() {
  const [scenario, setScenario] = useState<Scenario | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);

  const startNewScenario = async () => {
    setIsLoading(true);
    setSelectedOption(null);
    setShowResult(false);
    try {
      const newScenario = await generateScamScenario();
      setScenario(newScenario);
    } catch (error) {
      console.error('Error generating scenario:', error);
      toast.error("Couldn't load a new scenario. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOptionSelect = (index: number) => {
    if (showResult) return;
    setSelectedOption(index);
    setShowResult(true);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {!scenario && !isLoading && (
        <Card className="text-center py-12 border-2 border-dashed border-primary/30">
          <CardHeader>
            <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4">
              <ShieldAlert className="w-16 h-16 text-primary" />
            </div>
            <CardTitle className="text-3xl">Scam Awareness Trainer</CardTitle>
            <CardDescription className="text-xl max-w-md mx-auto">
              Learn how to spot and avoid common digital scams in a safe environment.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={startNewScenario} className="text-xl h-16 px-10 rounded-full shadow-lg">
              Start Training
            </Button>
          </CardContent>
        </Card>
      )}

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 space-y-4">
          <RefreshCw className="w-12 h-12 animate-spin text-primary" />
          <p className="text-2xl font-medium">Preparing a new scenario for you...</p>
        </div>
      )}

      {scenario && !isLoading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <Card className="border-2 shadow-xl overflow-hidden">
            <CardHeader className="bg-destructive/10 border-b-2 border-destructive/20">
              <div className="flex justify-between items-center">
                <Badge variant="destructive" className="text-lg px-4 py-1">
                  PRACTICE SCENARIO
                </Badge>
                <ShieldAlert className="text-destructive w-8 h-8" />
              </div>
              <CardTitle className="text-2xl mt-4">{scenario.title}</CardTitle>
            </CardHeader>
            
            <CardContent className="p-8">
              <div className="bg-muted p-6 rounded-xl border-2 border-muted-foreground/20 mb-8 font-mono text-lg whitespace-pre-wrap">
                <ReactMarkdown>{scenario.message}</ReactMarkdown>
              </div>

              <div className="space-y-4">
                <p className="text-xl font-bold mb-4">What should you do?</p>
                {scenario.options.map((option, index) => (
                  <Button
                    key={index}
                    variant={selectedOption === index ? (option.isCorrect ? "default" : "destructive") : "outline"}
                    className={`w-full justify-start text-left h-auto py-6 px-6 text-lg rounded-xl border-2 transition-all ${
                      showResult && option.isCorrect ? "border-green-500 bg-green-50 text-green-900 hover:bg-green-100" : ""
                    }`}
                    onClick={() => handleOptionSelect(index)}
                    disabled={showResult}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0">
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="flex-1">{option.text}</span>
                      {showResult && option.isCorrect && <CheckCircle2 className="text-green-600 w-8 h-8" />}
                      {showResult && selectedOption === index && !option.isCorrect && <XCircle className="text-destructive w-8 h-8" />}
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>

            <AnimatePresence>
              {showResult && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="border-t-2"
                >
                  <CardFooter className="flex flex-col p-8 bg-muted/30">
                    <div className={`w-full p-6 rounded-xl mb-6 border-2 ${
                      scenario.options[selectedOption!].isCorrect ? "bg-green-100 border-green-200" : "bg-red-100 border-red-200"
                    }`}>
                      <h4 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        {scenario.options[selectedOption!].isCorrect ? (
                          <><CheckCircle2 className="text-green-600" /> Correct!</>
                        ) : (
                          <><XCircle className="text-destructive" /> Not quite safe...</>
                        )}
                      </h4>
                      <div className="text-xl">
                        <ReactMarkdown>{scenario.options[selectedOption!].explanation}</ReactMarkdown>
                      </div>
                    </div>

                    <div className="w-full space-y-4">
                      <h4 className="text-xl font-bold flex items-center gap-2">
                        <AlertTriangle className="text-amber-500" /> Red Flags to Watch For:
                      </h4>
                      <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {scenario.redFlags.map((flag, i) => (
                          <li key={i} className="flex items-start gap-2 bg-white p-3 rounded-lg shadow-sm border">
                            <ArrowRight className="w-5 h-5 mt-1 text-primary shrink-0" />
                            <span className="text-lg">{flag}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <Button 
                      onClick={startNewScenario} 
                      className="mt-8 text-xl h-14 px-8 rounded-full shadow-md"
                    >
                      Try Another Scenario
                    </Button>
                  </CardFooter>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
