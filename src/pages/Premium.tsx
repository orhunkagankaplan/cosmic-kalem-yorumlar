
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getAztroAstrologyData } from '@/utils/aztroService';
import { translateAndAnalyzeAztroData } from '@/utils/aztroTranslationService';

const Premium = () => {
  const [formData, setFormData] = useState({
    ad: '',
    dogum_tarihi: '',
    saat: '',
    yer: '',
    sosyal_medya: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [aztroData, setAztroData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Premium form submitted with data:', formData);
    setIsLoading(true);
    setError('');
    setResult('');
    
    try {
      console.log('Fetching Aztro astrology data...');
      const aztroResult = await getAztroAstrologyData(
        formData.ad,
        formData.dogum_tarihi,
        formData.saat,
        formData.yer
      );
      
      if (aztroResult) {
        console.log('Aztro data received:', aztroResult);
        setAztroData(aztroResult);
        
        console.log('Creating Turkish analysis...');
        const analysisResult = await translateAndAnalyzeAztroData(
          aztroResult,
          {
            fullName: formData.ad,
            birthDate: formData.dogum_tarihi,
            birthTime: formData.saat,
            birthCity: formData.yer
          }
        );
        
        // Enhanced reading with social media analysis if provided
        const enhancedReading = `${analysisResult}

${formData.sosyal_medya ? `💬 Sosyal Medya Enerji Analizi:
Paylaşımlarından yansıyan enerji: ${formData.sosyal_medya.length > 100 ? 'Yoğun düşünce akışı ve derinlemesine introspeksiyon' : formData.sosyal_medya.includes('mutlu') || formData.sosyal_medya.includes('güzel') ? 'Pozitif ve iyimser bir ruh hali' : 'Sakin ve düşünceli bir dönem'}

` : ''}🌟 Aztro API Kozmik Sonuç:
Ücretsiz ve güvenilir astroloji verilerine dayalı analizin tamamlandı! ✨`;

        setResult(enhancedReading);
      } else {
        setError('Astroloji verisi alınamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
      }
    } catch (error: any) {
      console.error('Error in Premium:', error);
      const errorMessage = error.message || 'Bilinmeyen bir hata oluştu.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      console.log('Premium form submission completed');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(`Premium field ${field} changed to:`, e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          {/* Header */}
          <div className="flex items-center mb-6">
            <Link to="/" className="mr-4">
              <Button variant="ghost" className="text-purple-200 hover:text-white">
                <ArrowLeft className="w-5 h-5 mr-2" />
                Ana Sayfa
              </Button>
            </Link>
                  <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-purple-300 to-blue-300">
              ⭐ Premium Aztro Ücretsiz Astroloji
            </h1>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-purple-200 mb-2">
                  🔮 Aztro Ücretsiz Astroloji + AI Yorumlama
                </h2>
                <p className="text-gray-400">
                  Ücretsiz astroloji verilerini AI ile yorumlayarak kişisel rehberin
                </p>
                <div className="mt-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full inline-block">
                  <span className="text-purple-300 text-sm">🤖 AI Analiz + 🔮 Aztro API</span>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mb-6 p-4 bg-red-900/20 border border-red-500/30 rounded-lg flex items-start">
                  <AlertCircle className="w-5 h-5 text-red-400 mr-3 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="text-red-300 font-medium mb-1">Hata</h4>
                    <p className="text-red-200 text-sm">{error}</p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="ad" className="text-purple-200 font-medium">
                    ✨ Adın
                  </Label>
                  <Input
                    id="ad"
                    value={formData.ad}
                    onChange={handleChange('ad')}
                    placeholder="Adın"
                    className="bg-slate-700/50 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="dogum_tarihi" className="text-purple-200 font-medium">
                      🗓️ Doğum Tarihi
                    </Label>
                    <Input
                      id="dogum_tarihi"
                      type="date"
                      value={formData.dogum_tarihi}
                      onChange={handleChange('dogum_tarihi')}
                      className="bg-slate-700/50 border-purple-400/30 text-white focus:border-purple-400"
                      required
                      disabled={isLoading}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="saat" className="text-purple-200 font-medium">
                      🕐 Doğum Saati
                    </Label>
                    <Input
                      id="saat"
                      type="time"
                      value={formData.saat}
                      onChange={handleChange('saat')}
                      className="bg-slate-700/50 border-purple-400/30 text-white focus:border-purple-400"
                      required
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yer" className="text-purple-200 font-medium">
                    🌍 Doğum Yeri
                  </Label>
                  <Input
                    id="yer"
                    value={formData.yer}
                    onChange={handleChange('yer')}
                    placeholder="İstanbul, Türkiye"
                    className="bg-slate-700/50 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sosyal_medya" className="text-purple-200 font-medium">
                    📱 Son Sosyal Medya Paylaşımların (İsteğe Bağlı)
                  </Label>
                  <textarea
                    id="sosyal_medya"
                    value={formData.sosyal_medya}
                    onChange={handleChange('sosyal_medya')}
                    placeholder="Son sosyal medya paylaşımlarını buraya yazabilirsin..."
                    className="w-full bg-slate-700/50 border-purple-400/30 text-white placeholder-gray-400 focus:border-purple-400 rounded-md p-3 min-h-[100px] resize-none"
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500">
                    Bu bilgi ruh halini daha iyi anlamamı sağlar ve daha kişisel tavsiyeler vermemi sağlar.
                  </p>
                </div>

                <motion.div
                  whileHover={{ scale: isLoading ? 1 : 1.02 }}
                  whileTap={{ scale: isLoading ? 1 : 0.98 }}
                >
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-semibold py-3 text-lg shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? '🔮 Aztro Ücretsiz Astroloji + AI Analiz Hazırlanıyor...' : '🌌 Ücretsiz Astroloji Rehberimi Al'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Aztro Data Display */}
          {aztroData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-purple-200 mb-4 text-center">
                    🔮 Aztro Ücretsiz Astroloji Verilerin
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-yellow-300 font-medium mb-2">☀️ Güneş Burcu</h4>
                      <p className="text-white">{aztroData.sunSign}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-green-300 font-medium mb-2">🍀 Şanslı Sayı</h4>
                      <p className="text-white">{aztroData.luckyNumber}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-pink-300 font-medium mb-2">🎨 Şanslı Renk</h4>
                      <p className="text-white">{aztroData.luckyColor}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-blue-300 font-medium mb-2">😊 Ruh Hali</h4>
                      <p className="text-white">{aztroData.mood}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                    <h5 className="text-purple-200 font-medium mb-2">✨ Aztro API Verified</h5>
                    <p className="text-gray-300 text-sm">
                      Bu veriler ücretsiz Aztro API'den alınan günlük astroloji bilgileridir.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardContent className="p-8">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-semibold text-purple-200 mb-2">
                      🔮 Aztro Ücretsiz Astroloji Rehberin
                    </h3>
                    <div className="mt-2 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full inline-block">
                      <span className="text-green-300 text-sm">🤖 AI Analiz + 🔮 Aztro Free API</span>
                    </div>
                  </div>
                  <div className="text-gray-200 leading-relaxed whitespace-pre-line">
                    {result}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Premium;
