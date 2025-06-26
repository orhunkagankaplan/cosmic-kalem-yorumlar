
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateAIAstrologyReading, type AIReading } from '@/utils/aiAstrologyService';
import type { BirthData } from '@/pages/Index';

interface AIAstrologyReadingProps {
  birthData: BirthData;
  onReset: () => void;
}

const AIAstrologyReading = ({ birthData, onReset }: AIAstrologyReadingProps) => {
  const [reading, setReading] = useState<AIReading | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReading = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('Fetching AI reading for:', birthData);
        
        const aiReading = await generateAIAstrologyReading(birthData);
        setReading(aiReading);
        
      } catch (err) {
        console.error('Error fetching AI reading:', err);
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReading();
  }, [birthData]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="inline-block text-6xl mb-6"
        >
          🔮
        </motion.div>
        <h2 className="text-2xl text-purple-200 mb-4">
          Yıldızlar senin için özel bir analiz hazırlıyor...
        </h2>
        <p className="text-gray-400">
          AI astrologumuz senin için kişisel yorumunu oluşturuyor
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <div className="text-6xl mb-6">❌</div>
        <h2 className="text-2xl text-red-400 mb-4">
          Üzgünüm, bir hata oluştu
        </h2>
        <p className="text-gray-400 mb-6">{error}</p>
        <Button onClick={onReset} variant="outline" className="border-purple-400 text-purple-200">
          🔄 Tekrar Dene
        </Button>
      </div>
    );
  }

  if (!reading) return null;

  const firstName = birthData.fullName.split(' ')[0];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8 }}
      className="max-w-4xl mx-auto"
    >
      <div className="text-center mb-8">
        <motion.h1
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-purple-300 mb-4"
        >
          ✨ {firstName} için AI Astroloji Analizi
        </motion.h1>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-purple-200 text-lg"
        >
          {new Date().toLocaleDateString('tr-TR', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-slate-800/60 backdrop-blur-sm border-purple-500/30 h-full">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">☀️</div>
              <h3 className="text-purple-200 font-semibold mb-2">Güneş Burcu</h3>
              <div className="text-2xl font-bold text-yellow-400 mb-2">{reading.sunSign}</div>
              <p className="text-gray-300 text-sm">Ana kişilik, ego</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-slate-800/60 backdrop-blur-sm border-purple-500/30 h-full">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">🌙</div>
              <h3 className="text-purple-200 font-semibold mb-2">Ay Burcu</h3>
              <div className="text-2xl font-bold text-yellow-400 mb-2">{reading.moonSign}</div>
              <p className="text-gray-300 text-sm">Duygusal doğa, içsel dünya</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card className="bg-slate-800/60 backdrop-blur-sm border-purple-500/30 h-full">
            <CardContent className="p-6 text-center">
              <div className="text-3xl mb-3">⬆️</div>
              <h3 className="text-purple-200 font-semibold mb-2">Yükselen Burcu</h3>
              <div className="text-2xl font-bold text-yellow-400 mb-2">{reading.risingSign}</div>
              <p className="text-gray-300 text-sm">Dış görünüş, ilk izlenim</p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-6"
      >
        <Card className="bg-gradient-to-br from-slate-800/80 to-purple-900/40 backdrop-blur-sm border-purple-500/30">
          <CardContent className="p-8">
            <h3 className="text-2xl font-bold text-purple-200 mb-6 flex items-center">
              🔮 Bugünün AI Astroloji Analizi
            </h3>
            <div className="prose prose-invert max-w-none">
              <p className="text-gray-200 leading-relaxed text-lg whitespace-pre-line">
                {reading.analysis}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-800/60 to-blue-800/60 backdrop-blur-sm border-yellow-400/30">
          <CardContent className="p-6">
            <h3 className="text-xl font-bold text-yellow-300 mb-4 flex items-center">
              🪐 Evrenin Sana Mesajı
            </h3>
            <p className="text-yellow-100 text-lg font-medium italic">
              "{reading.cosmicMessage}"
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="text-center mt-8"
      >
        <Button
          onClick={onReset}
          variant="outline"
          className="border-purple-400 text-purple-200 hover:bg-purple-800/30"
        >
          🌟 Yeni AI Analizi Yap
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AIAstrologyReading;
