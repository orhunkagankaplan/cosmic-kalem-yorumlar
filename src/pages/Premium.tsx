import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

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
  const [localAstroData, setLocalAstroData] = useState<any>(null);

  // Kendi astroloji motorumuz
  const generateLocalAstrologyData = (birthDate: string) => {
    const [year, month, day] = birthDate.split('-').map(Number);
    const monthDay = month * 100 + day;
    
    let zodiacSign = '';
    let zodiacSignTurkish = '';
    
    if (monthDay >= 321 && monthDay <= 419) {
      zodiacSign = 'aries';
      zodiacSignTurkish = 'Koç';
    } else if (monthDay >= 420 && monthDay <= 520) {
      zodiacSign = 'taurus'; 
      zodiacSignTurkish = 'Boğa';
    } else if (monthDay >= 521 && monthDay <= 620) {
      zodiacSign = 'gemini';
      zodiacSignTurkish = 'İkizler';
    } else if (monthDay >= 621 && monthDay <= 722) {
      zodiacSign = 'cancer';
      zodiacSignTurkish = 'Yengeç';
    } else if (monthDay >= 723 && monthDay <= 822) {
      zodiacSign = 'leo';
      zodiacSignTurkish = 'Aslan';
    } else if (monthDay >= 823 && monthDay <= 922) {
      zodiacSign = 'virgo';
      zodiacSignTurkish = 'Başak';
    } else if (monthDay >= 923 && monthDay <= 1022) {
      zodiacSign = 'libra';
      zodiacSignTurkish = 'Terazi';
    } else if (monthDay >= 1023 && monthDay <= 1121) {
      zodiacSign = 'scorpio';
      zodiacSignTurkish = 'Akrep';
    } else if (monthDay >= 1122 && monthDay <= 1221) {
      zodiacSign = 'sagittarius';
      zodiacSignTurkish = 'Yay';
    } else if (monthDay >= 1222 || monthDay <= 119) {
      zodiacSign = 'capricorn';
      zodiacSignTurkish = 'Oğlak';
    } else if (monthDay >= 120 && monthDay <= 218) {
      zodiacSign = 'aquarius';
      zodiacSignTurkish = 'Kova';
    } else if (monthDay >= 219 && monthDay <= 320) {
      zodiacSign = 'pisces';
      zodiacSignTurkish = 'Balık';
    }

    // Günün sayısına göre şanslı sayı ve renk
    const luckyNumbers = ['7', '13', '21', '33', '42', '55', '66', '77', '88', '99'];
    const luckyColors = ['Altın', 'Gümüş', 'Mavi', 'Yeşil', 'Kırmızı', 'Mor', 'Turuncu', 'Pembe'];
    const moods = ['Enerjik', 'Sakin', 'Yaratıcı', 'Odaklı', 'İlham Verici', 'Cesur', 'Romantik', 'Kararlı'];
    
    const dayOfYear = Math.floor((new Date().getTime() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    
    return {
      sunSign: zodiacSignTurkish,
      horoscope: `${zodiacSignTurkish} burcu için bugün harika bir gün! Pozitif enerji seni sararken, yeni fırsatlar kapında bekliyor.`,
      luckyNumber: luckyNumbers[dayOfYear % luckyNumbers.length],
      luckyColor: luckyColors[dayOfYear % luckyColors.length],
      mood: moods[dayOfYear % moods.length],
      compatibility: zodiacSignTurkish === 'Koç' ? 'Aslan, Yay' : zodiacSignTurkish === 'Boğa' ? 'Başak, Oğlak' : 'Tüm burçlarla uyumlu',
      date_range: ''
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Premium form submitted with data:', formData);
    setIsLoading(true);
    setError('');
    setResult('');
    
    try {
      console.log('Generating local astrology data...');
      
      // Kendi astroloji verilerimizi oluştur
      const localData = generateLocalAstrologyData(formData.dogum_tarihi);
      setLocalAstroData(localData);
      
      console.log('Local astrology data generated:', localData);
      
      // AI ile detaylı analiz yap (sosyal medya verisi ile birlikte)
      console.log('Calling AI for detailed analysis...');
      
      const { data: aiResult, error: supabaseError } = await supabase.functions.invoke('generate-astrology-reading', {
        body: {
          birthData: {
            fullName: formData.ad,
            birthDate: formData.dogum_tarihi,
            birthTime: formData.saat,
            birthCity: formData.yer,
            birthCountry: 'Türkiye',
            socialMedia: formData.sosyal_medya // Sosyal medya verisini Mistral AI'a gönder
          }
        }
      });
      
      console.log('Supabase AI function response:', aiResult);
      console.log('Supabase AI function error:', supabaseError);
      
      if (supabaseError) {
        console.error('Supabase AI function error:', supabaseError);
        throw new Error('AI analiz servisi şu anda kullanılamıyor. Lütfen daha sonra tekrar deneyin.');
      }
      
      if (aiResult && !aiResult.success) {
        console.error('AI function returned error:', aiResult.error);
        throw new Error(aiResult.error || 'AI analiz yapılamadı.');
      }
      
      if (aiResult && aiResult.success && aiResult.reading) {
        console.log('AI reading received:', aiResult.reading);
        
        // Enhanced reading with AI analysis
        const enhancedReading = `🌟 ${formData.ad} için Özel AI Astroloji Rehberin:

${aiResult.reading}

⚡ AstroMind AI Premium Sonuç:
Mistral AI tarafından hazırlanmış özel rehberin tamamlandı! ✨`;

        setResult(enhancedReading);
      } else {
        console.error('Invalid AI response:', aiResult);
        throw new Error('AI analiz verisi alınamadı. Lütfen bilgilerinizi kontrol edip tekrar deneyin.');
      }
    } catch (error: any) {
      console.error('Error in Premium:', error);
      const errorMessage = error.message || 'Bilinmeyen bir hata oluştu. Lütfen tekrar deneyin.';
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
              ⭐ Premium AI Astroloji Rehberi
            </h1>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-purple-200 mb-2">
                  🔮 AstroMind AI Premium Analiz
                </h2>
                <p className="text-gray-400">
                  Kendi astroloji motorumuz + AI ile kişisel rehberin
                </p>
                <div className="mt-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full inline-block">
                  <span className="text-purple-300 text-sm">🤖 AI Analiz + 🌟 AstroMind Engine</span>
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
                    {isLoading ? '🔮 AI Premium Astroloji Analizi Hazırlanıyor...' : '🌌 Premium AI Astroloji Rehberimi Al'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* Local Astro Data Display */}
          {localAstroData && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-purple-200 mb-4 text-center">
                    🔮 AstroMind Astroloji Verilerin
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-center">
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-yellow-300 font-medium mb-2">☀️ Güneş Burcu</h4>
                      <p className="text-white">{localAstroData.sunSign}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-green-300 font-medium mb-2">🍀 Şanslı Sayı</h4>
                      <p className="text-white">{localAstroData.luckyNumber}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-pink-300 font-medium mb-2">🎨 Şanslı Renk</h4>
                      <p className="text-white">{localAstroData.luckyColor}</p>
                    </div>
                    <div className="p-4 bg-slate-700/30 rounded-lg">
                      <h4 className="text-blue-300 font-medium mb-2">😊 Ruh Hali</h4>
                      <p className="text-white">{localAstroData.mood}</p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                    <h5 className="text-purple-200 font-medium mb-2">✨ AstroMind Engine</h5>
                    <p className="text-gray-300 text-sm">
                      Bu veriler AstroMind'ın kendi astroloji motorundan üretilmiştir.
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
                      🔮 Premium AI Astroloji Rehberin
                    </h3>
                    <div className="mt-2 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full inline-block">
                      <span className="text-green-300 text-sm">🤖 AI Premium + 🌟 AstroMind Engine</span>
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
