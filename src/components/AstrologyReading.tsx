
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { generateAstrologyReading } from '../utils/astrologyUtils';
import type { BirthData } from '../pages/Index';

interface AstrologyReadingProps {
  birthData: BirthData;
  onReset: () => void;
}

const AstrologyReading = ({ birthData, onReset }: AstrologyReadingProps) => {
  const reading = generateAstrologyReading(birthData);

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
          {reading.title}
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
        {reading.signs.map((sign, index) => (
          <motion.div
            key={sign.type}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Card className="bg-slate-800/60 backdrop-blur-sm border-purple-500/30 h-full">
              <CardContent className="p-6 text-center">
                <div className="text-3xl mb-3">{sign.emoji}</div>
                <h3 className="text-purple-200 font-semibold mb-2">{sign.type}</h3>
                <div className="text-2xl font-bold text-yellow-400 mb-2">{sign.name}</div>
                <p className="text-gray-300 text-sm">{sign.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
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
              🔮 Bugünün Astrolojik Analizi
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
          🌟 Yeni Analiz Yap
        </Button>
      </motion.div>
    </motion.div>
  );
};

export default AstrologyReading;
