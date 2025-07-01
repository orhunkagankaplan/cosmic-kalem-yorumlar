import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { translateNasaContent } from '@/utils/translationService';

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
  const [nasaImage, setNasaImage] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Premium form submitted with data:', formData);
    setIsLoading(true);
    
    try {
      console.log('Fetching NASA APOD...');
      const nasaResponse = await fetch('https://api.nasa.gov/planetary/apod?api_key=cPQ26NgOmbQZh5Tk1uZh3DDqVd7n6iVivZH9mhGy');
      const nasaData = await nasaResponse.json();
      console.log('NASA data received:', nasaData);
      
      // Translate NASA content to Turkish
      console.log('Translating NASA content to Turkish...');
      const translatedContent = await translateNasaContent(nasaData.title, nasaData.explanation);
      
      const translatedNasaData = {
        ...nasaData,
        title: translatedContent.title,
        explanation: translatedContent.explanation
      };
      
      setNasaImage(translatedNasaData);
      
      console.log('Calling Supabase edge function with NASA data...');
      const response = await fetch('https://cmqeosfptaxtctbzjulp.supabase.co/functions/v1/generate-astrology-reading', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWVvc2ZwdGF4dGN0YnpqdWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjE1NzEsImV4cCI6MjA2NjQ5NzU3MX0.tilAXTWWhABfVfS5RCMnKYd8gfVR5bCHIBawilEuOMc`,
        },
        body: JSON.stringify({
          birthData: {
            fullName: formData.ad,
            birthDate: formData.dogum_tarihi,
            birthTime: formData.saat,
            birthCity: formData.yer,
            birthCountry: 'Türkiye'
          }
        })
      });

      const data = await response.json();
      console.log('Supabase edge function response received:', data);
      
      if (data.success) {
        // NASA entegreli analizi formatla (now with Turkish content)
        const enhancedReading = `✨ ${formData.ad} için NASA Entegreli Haftalık Astro Rehber:

🌌 Bugünkü Gökyüzü Enerjisi:
"${translatedNasaData.title}" - ${translatedNasaData.explanation.substring(0, 200)}...

${data.reading}

🔭 NASA Kozmik Mesajı:
Bu gökyüzü karesi evrenin sana gönderdiği özel bir işaret. ${translatedNasaData.title.toLowerCase().includes('galaksi') ? 'Galaksinin genişleme enerjisi senin de içsel büyümene rehberlik ediyor.' : 
translatedNasaData.title.toLowerCase().includes('yıldız') ? 'Yıldızların ışığı senin yolunu aydınlatmak için yanıyor.' :
translatedNasaData.title.toLowerCase().includes('gezegen') ? 'Gezegensel hareketler senin yaşam döngünle uyum halinde.' :
'Evrenin bu benzersiz manzarası senin özel yolculuğunu simgeliyor.'} 

${formData.sosyal_medya ? `💬 Sosyal Medya Enerji Analizi:
Paylaşımlarından yansıyan enerji: ${formData.sosyal_medya.length > 100 ? 'Yoğun düşünce akışı ve derinlemesine introspeksiyon' : formData.sosyal_medya.includes('mutlu') || formData.sosyal_medya.includes('güzel') ? 'Pozitif ve iyimser bir ruh hali' : 'Sakin ve düşünceli bir dönem'}

` : ''}🌟 Kozmik Sonuç:
NASA'nın bugünkü keşfi ve senin doğum enerjin birleşerek sana güçlü bir mesaj veriyor: Evren seninle aynı frekansta titreşiyor! ✨`;

        setResult(enhancedReading);
      } else {
        setResult('NASA verisi alınırken bir hata oluştu. Lütfen tekrar deneyin.');
      }
    } catch (error) {
      console.error('Error in Premium:', error);
      setResult('Bir hata oluştu. Lütfen tekrar deneyin.');
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
              ⭐ Premium NASA Entegreli Rehber
            </h1>
          </div>

          <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl mb-6">
            <CardContent className="p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-semibold text-purple-200 mb-2">
                  🔭 NASA Yıldız Haritası + AI Astroloji
                </h2>
                <p className="text-gray-400">
                  Bugünkü gökyüzü görselini analiz ederek haftalık astroloji rehberin
                </p>
                <div className="mt-2 px-3 py-1 bg-purple-600/20 border border-purple-500/30 rounded-full inline-block">
                  <span className="text-purple-300 text-sm">🤖 Mixtral-8x7b AI + 🛸 NASA API</span>
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
                    {isLoading ? '🛸 NASA Yıldız Haritası + AI Analiz Hazırlanıyor...' : '🌌 NASA Entegreli Rehberimi Al'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>

          {/* NASA Image Display */}
          {nasaImage && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-6"
            >
              <Card className="bg-slate-800/50 backdrop-blur-sm border-purple-500/30 shadow-2xl">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-purple-200 mb-4 text-center">
                    🛸 Bugünkü NASA Yıldız Haritası
                  </h3>
                  <div className="text-center">
                    <img 
                      src={nasaImage.url} 
                      alt={nasaImage.title}
                      className="w-full max-w-md mx-auto rounded-lg shadow-lg mb-4"
                      style={{ maxHeight: '300px', objectFit: 'cover' }}
                    />
                    <h4 className="text-lg font-medium text-yellow-300 mb-2">{nasaImage.title}</h4>
                    <p className="text-gray-300 text-sm">{nasaImage.date}</p>
                    <div className="mt-4 p-4 bg-slate-700/30 rounded-lg">
                      <h5 className="text-purple-200 font-medium mb-2">NASA Açıklaması:</h5>
                      <p className="text-gray-300 text-sm leading-relaxed">
                        {nasaImage.explanation.length > 300 
                          ? `${nasaImage.explanation.substring(0, 300)}...` 
                          : nasaImage.explanation}
                      </p>
                    </div>
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
                      🛸 NASA Entegreli Haftalık Rehberin
                    </h3>
                    <div className="mt-2 px-3 py-1 bg-green-600/20 border border-green-500/30 rounded-full inline-block">
                      <span className="text-green-300 text-sm">🤖 Mixtral-8x7b AI + 🛸 NASA Fusion</span>
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
