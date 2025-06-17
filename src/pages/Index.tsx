
import { useState } from 'react';
import { motion } from 'framer-motion';
import BirthDataForm from '../components/BirthDataForm';
import AstrologyReading from '../components/AstrologyReading';

export interface BirthData {
  fullName: string;
  birthDate: string;
  birthTime: string;
  birthCity: string;
  birthCountry: string;
}

const Index = () => {
  const [birthData, setBirthData] = useState<BirthData | null>(null);
  const [showReading, setShowReading] = useState(false);

  const handleFormSubmit = (data: BirthData) => {
    setBirthData(data);
    setShowReading(true);
  };

  const handleReset = () => {
    setBirthData(null);
    setShowReading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-yellow-200 rounded-full opacity-70"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 1, 0.3],
              scale: [0.8, 1.2, 0.8],
            }}
            transition={{
              duration: 2 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {!showReading ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-2xl mx-auto text-center"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{ duration: 1, delay: 0.2 }}
              className="mb-8"
            >
              <h1 className="text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-300 to-blue-300 mb-4">
                AstroMind
              </h1>
              <div className="text-2xl text-purple-200 mb-6">
                ✨ Kişisel Astroloji Rehberin ✨
              </div>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Doğum verilerinle evrenin sana bugün için hazırladığı özel mesajı keşfet. 
                Yıldızların dilinde yazılmış kaderini çöz.
              </p>
            </motion.div>

            <BirthDataForm onSubmit={handleFormSubmit} />
          </motion.div>
        ) : (
          <AstrologyReading birthData={birthData!} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default Index;
