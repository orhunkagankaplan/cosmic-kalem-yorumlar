
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import BirthDataForm from '../components/BirthDataForm';
import AIAstrologyReading from '../components/AIAstrologyReading';

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

  const handleFormSubmit = async (data: BirthData) => {
    console.log('Received form data in Index:', data);
    
    try {
      setBirthData(data);
      setShowReading(true);
    } catch (error) {
      console.error('Error in handleFormSubmit:', error);
    }
  };

  const handleReset = () => {
    console.log('Resetting form');
    setBirthData(null);
    setShowReading(false);
  };

  const handlePremiumClick = () => {
    window.open('https://google.com', '_blank');
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
            {/* title and description */}
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
                ✨ AI Destekli Kişisel Astroloji Rehberin ✨
              </div>
              <p className="text-gray-300 text-lg mb-8 leading-relaxed">
                Yapay zeka ile güçlendirilmiş astroloji analizin! Doğum verilerinle AI astrologumuzun 
                sana bugün için hazırladığı özel mesajı keşfet.
              </p>
            </motion.div>

            <BirthDataForm onSubmit={handleFormSubmit} />

            {/* Premium content section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="mt-12 p-6 bg-gradient-to-r from-purple-800/30 to-blue-800/30 backdrop-blur-sm rounded-lg border border-purple-500/30"
            >
              <div className="text-center space-y-4">
                <div className="text-purple-200 text-lg leading-relaxed">
                  🔓 Bu yorum kişisel Güneş burcuna göre hazırlandı.<br />
                  💫 Ay burcun, yükselenin ve haftalık astro rehberin seni bekliyor!<br />
                  ✨ Daha fazla içgörü için Premium Astro Rehber'i deneyebilirsin.
                </div>
                
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    onClick={handlePremiumClick}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold px-8 py-3 text-lg shadow-lg transition-all duration-300"
                  >
                    ⭐ Premium Yorum Al
                  </Button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          <AIAstrologyReading birthData={birthData!} onReset={handleReset} />
        )}
      </div>
    </div>
  );
};

export default Index;
