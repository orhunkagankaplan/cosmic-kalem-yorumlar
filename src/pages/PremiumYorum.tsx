
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

const PremiumYorum = () => {
  const [formData, setFormData] = useState({
    ad: '',
    dogum_tarihi: '',
    saat: '',
    yer: '',
    sosyal_medya: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('PremiumYorum form submitted with data:', formData);
    setIsLoading(true);
    
    try {
      console.log('Fetching NASA APOD...');
      const nasaResponse = await fetch('https://api.nasa.gov/planetary/apod?api_key=cPQ26NgOmbQZh5Tk1uZh3DDqVd7n6iVivZH9mhGy');
      const nasaData = await nasaResponse.json();
      console.log('NASA data received:', nasaData);
      
      console.log('Calling OpenRouter Mixtral-8x7b with NASA data...');
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_OPENROUTER_API_KEY}`,
          'HTTP-Referer': window.location.origin,
          'X-Title': 'AstroMind Premium'
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [{
            role: 'user',
            content: `Sen AstroMind adında bir yapay zekâlı astrologsun. Kullanıcının doğum bilgileriyle birlikte NASA'nın bugünkü gökyüzü görselini ve varsa sosyal medya yazılarını da analiz ederek ona özel bir haftalık astroloji rehberi hazırlıyorsun.

Kullanıcı bilgileri:
- Ad: ${formData.ad}
- Doğum Tarihi: ${formData.dogum_tarihi}
- Saat: ${formData.saat}
- Yer: ${formData.yer}

Bugünkü yıldız görseli: ${nasaData.title}
NASA açıklaması: ${nasaData.explanation}

Kullanıcının sosyal medya yazıları (isteğe bağlı): ${formData.sosyal_medya || 'Belirtilmedi'}

Görevin:
1. Güneş, Ay ve Yükselen burçlarını yaklaşık tahmin et  
2. NASA görselinden sembolik bir çıkarım yap (örneğin: galaksi genişliyorsa → içsel büyüme teması)  
3. Yükselen burca özel karakter analizi ve bu haftaya etkisi  
4. Eğer kullanıcı sosyal medya yazısı girdiyse:
   - Yazılardan duygusal ton, zihinsel odak ve ruh halini çıkar
   - Astrolojik tavsiyeleri bu kişisel veriye göre uyarla
5. 3 maddelik tavsiye ver  
6. Kısa pozitif kapanış mesajı yaz

Türkçe, pozitif ve sezgisel bir ton kullan. 250 kelimeyi geçmesin.

Yanıt formatı:

✨ ${formData.ad} için Haftalık Astro Rehber:

☀️ Güneş Burcu: [tahmin]  
🌙 Ay Burcu: [tahmin]  
⬆️ Yükselen Burcu: [tahmin]

🔭 Bugünkü Gökyüzü Enerjisi:  
${nasaData.title} → [sembolik anlam]

🌟 Yükselen Burç Etkisi:  
[Yükselen burca özel kişilik + haftalık etkisi]

💬 Sosyal Medya Ruh Hali (varsa):  
[Eğer sosyal medya yazısı varsa analiz yap]

🔮 Genel Enerji:  
[Kişisel haftalık yorum]

🧭 Tavsiyeler:  
- [1]  
- [2]  
- [3]

🌌 Mesajın:  
[Kısa pozitif kapanış]`
          }],
          max_tokens: 800,
          temperature: 0.7
        })
      });

      const data = await response.json();
      console.log('Mixtral-8x7b response received:', data);
      setResult(data.choices[0].message.content);
    } catch (error) {
      console.error('Error in PremiumYorum:', error);
      setResult('Bir hata oluştu. Lütfen tekrar deneyin.');
    } finally {
      setIsLoading(false);
      console.log('PremiumYorum form submission completed');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(`PremiumYorum field ${field} changed to:`, e.target.value);
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
              ⭐ Premium Yorum
            </h1>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-purple-200 mb-2">
                  🔭 NASA Entegreli Haftalık Astro Rehber
                </h2>
                <p className="text-gray-400">
                  Bugünkü gökyüzü enerjisiyle birleşen kişisel astroloji yorumun
                </p>
                <div className="mt-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full inline-block">
                  <span className="text-purple-300 text-sm">🤖 Mixtral-8x7b AI ile Güçlendirildi</span>
                </div>
              </div>

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
                    {isLoading ? '🤖 Mixtral AI ile NASA & Astro Rehber Hazırlanıyor...' : '🌌 Kozmik Astro Rehberimi Al'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

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
                      🔭 NASA Entegreli Astro Rehberin
                    </h3>
                    <div className="mt-2 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full inline-block">
                      <span className="text-green-300 text-sm">🤖 Mixtral-8x7b AI Yanıtı</span>
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

export default PremiumYorum;
