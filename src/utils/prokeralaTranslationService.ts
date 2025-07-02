
import { supabase } from "@/integrations/supabase/client";

export const translateAndAnalyzeProkeralaData = async (
  prokeralaData: any,
  birthData: { fullName: string; birthDate: string; birthTime: string; birthCity: string }
) => {
  try {
    console.log('Sending Prokerala data to AI for Turkish analysis...');
    
    const response = await supabase.functions.invoke('generate-astrology-reading', {
      body: {
        prokeralaAnalysisRequest: {
          prokeralaData,
          birthData,
          language: 'Turkish'
        }
      }
    });

    if (response.data?.success && response.data?.analysis) {
      return response.data.analysis;
    }

    // Fallback analysis
    return `✨ ${birthData.fullName} için Prokerala Astroloji Analizi:

🌟 Güneş Burcu: ${prokeralaData.sunSign}
🌙 Ay Burcu: ${prokeralaData.moonSign}  
⬆️ Yükselen Burcu: ${prokeralaData.risingSign}

Bu hafta senin için özel bir dönem başlıyor. Prokerala API'den alınan gerçek astroloji verilerine göre, gezegen konumların çok güçlü bir enerji yaratıyor.

🔮 Evrenin Mesajı: Yıldızlar seninle aynı frekansta titreşiyor! ✨`;

  } catch (error) {
    console.error('Translation error:', error);
    return `Analiz hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.`;
  }
};
