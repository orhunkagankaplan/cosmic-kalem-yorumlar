
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

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
  const [demoMode, setDemoMode] = useState(true);

  const getDemoResponse = (name: string) => {
    return `✨ ${name} için Haftalık Astro Rehber:

☀️ Güneş Burcu: İkizler
🌙 Ay Burcu: Aslan  
⬆️ Yükselen Burcu: Terazi

🔮 Genel Enerji:
Bu hafta yaratıcı enerjiler ön planda! İkizler burcunun iletişim yeteneği ve Aslan ayının cesaretiyle birleşen enerjin, seni yeni projelere yönlendirecek. Terazi yükselenin sayesinde ilişkilerinde denge arayışı içinde olacaksın. Pazartesi ve salı günleri özellikle verimli geçecek.

${formData.sosyal_medya ? `💬 Sosyal Medya Ruh Hali:
Son paylaşımlarından pozitif ve yaratıcı bir enerji yansıyor. İçsel motivasyonun yüksek görünüyor ve kendini ifade etme konusunda cesaretlisin.

` : ''}🧭 Tavsiyeler:
- Yaratıcı projelerine zaman ayır, ilham perilerim seninle
- İletişimde samimi ol, kalbin konuşsun
- Hafta sonu dinlenmeyi ihmal etme

🌌 Mesajın:
Evren sana bu hafta yeni kapılar açıyor, cesaretle adım at! ✨`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted with data:', formData);
    setIsLoading(true);
    
    try {
      if (demoMode) {
        // Demo mode - simulate loading and show demo response
        console.log('Demo mode active, generating demo response...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        const demoResult = getDemoResponse(formData.ad);
        console.log('Demo result generated:', demoResult);
        setResult(demoResult);
      } else {
        console.log('Real API mode, calling OpenAI...');
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${import.meta.env.VITE_OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: 'gpt-4o',
            messages: [{
              role: 'user',
              content: `Sen AstroMind adında bir astroloji uzmanı yapay zekâsısın. Kullanıcının adı, doğum tarihi, saati ve yeriyle birlikte ona haftalık detaylı astro rehberlik sunuyorsun.

Bilgiler:
Ad: ${formData.ad}
Doğum tarihi: ${formData.dogum_tarihi}
Saat: ${formData.saat}
Yer: ${formData.yer}
Sosyal medya paylaşımları: ${formData.sosyal_medya || 'Belirtilmedi'}

Yanıtta:
- Güneş, Ay ve Yükselen burçlarını tahmin et (tahmini yaz, tam astro harita olmasa da)
- Haftalık enerjilerden bahset
- Eğer sosyal medya yazısı varsa, yazılardan duygusal ton ve ruh halini çıkar
- Kullanıcıya tavsiyeler ver
- Duygusal ve ilham verici bir dil kullan
- En fazla 250 kelime yaz
- Türkçe yaz

Yanıt formatı:

✨ ${formData.ad} için Haftalık Astro Rehber:

☀️ Güneş Burcu: [tahmin]
🌙 Ay Burcu: [tahmin]
⬆️ Yükselen Burcu: [tahmin]

🔮 Genel Enerji:
[Kişisel haftalık yorum]

${formData.sosyal_medya ? '💬 Sosyal Medya Ruh Hali:\n[Sosyal medya analizi]\n\n' : ''}🧭 Tavsiyeler:
- [madde 1]
- [madde 2]

🌌 Mesajın:
[Kısa kapanış cümlesi]`
            }],
            max_tokens: 500,
            temperature: 0.7
          })
        });

        const data = await response.json();
        console.log('OpenAI response:', data);
        setResult(data.choices[0].message.content);
      }
    } catch (error) {
      console.error('Error:', error);
      if (demoMode) {
        const fallbackResult = getDemoResponse(formData.ad);
        console.log('Using fallback demo result:', fallbackResult);
        setResult(fallbackResult);
      } else {
        setResult('Bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } finally {
      setIsLoading(false);
      console.log('Form submission completed');
    }
  };

  const handleChange = (field: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    console.log(`Field ${field} changed to:`, e.target.value);
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const toggleDemoMode = () => {
    console.log('Demo mode toggle clicked, current state:', demoMode);
    setDemoMode(prev => {
      const newValue = !prev;
      console.log('Demo mode changed to:', newValue);
      return newValue;
    });
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
              ⭐ Premium
            </h1>
          </div>

          {/* Demo Mode Toggle */}
          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl mb-6">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-purple-200">Demo Modu</h3>
                  <p className="text-sm text-gray-400">AI API anahtarı olmadan örnek yanıt göster</p>
                </div>
                <Button
                  onClick={toggleDemoMode}
                  variant={demoMode ? "default" : "outline"}
                  className={demoMode ? "bg-green-600 hover:bg-green-700" : "border-purple-400 text-purple-200 hover:bg-purple-400/10"}
                >
                  {demoMode ? "Demo Aktif" : "Demo Kapalı"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-purple-200 mb-2">
                  🌟 Haftalık Astro Rehber
                </h2>
                <p className="text-gray-400">
                  Detaylı haftalık astroloji yorumun için bilgilerini gir
                </p>
                {demoMode && (
                  <div className="mt-2 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full inline-block">
                    <span className="text-green-300 text-sm">🎭 Demo Modu Aktif</span>
                  </div>
                )}
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
                    {isLoading ? (demoMode ? '🎭 Demo Rehber Hazırlanıyor...' : '🔮 Haftalık Rehber Hazırlanıyor...') : '⭐ Haftalık Rehberimi Al'}
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
                      🌟 Haftalık Astro Rehberin
                    </h3>
                    {demoMode && (
                      <div className="mt-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full inline-block">
                        <span className="text-blue-300 text-sm">🎭 Bu bir demo yanıttır</span>
                      </div>
                    )}
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
