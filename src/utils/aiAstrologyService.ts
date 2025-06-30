
import { supabase } from "@/integrations/supabase/client";
import type { BirthData } from '@/pages/Index';

export interface AIReading {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  analysis: string;
  cosmicMessage: string;
}

const generateFallbackReading = (birthData: BirthData): AIReading => {
  // Doğum tarihinden basit burç hesaplama
  const birthDate = new Date(birthData.birthDate);
  const month = birthDate.getMonth() + 1;
  const day = birthDate.getDate();
  
  let sunSign = "Koç";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) sunSign = "Koç";
  else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) sunSign = "Boğa";
  else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) sunSign = "İkizler";
  else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) sunSign = "Yengeç";
  else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) sunSign = "Aslan";
  else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) sunSign = "Başak";
  else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) sunSign = "Terazi";
  else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) sunSign = "Akrep";
  else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) sunSign = "Yay";
  else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) sunSign = "Oğlak";
  else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) sunSign = "Kova";
  else sunSign = "Balık";

  return {
    sunSign: sunSign,
    moonSign: "Aslan", // Örnek
    risingSign: "Terazi", // Örnek
    analysis: `Merhaba ${birthData.fullName}! ${sunSign} burcunda doğmuş olan sen, bugün özellikle yaratıcı enerjilerinin yüksek olduğu bir dönemdesin. ${birthData.birthCity}'deki doğumun sana güçlü bir temel sağlıyor.

Bu hafta iletişim becerilerin ön planda olacak. Yeni projeler için uygun bir zaman. Özellikle ${sunSign} burcunun karakteristik özelliklerini bu dönemde daha çok hissedeceksin.

Sevdiklerinle geçireceğin zamanın sana huzur vereceği bir dönemdesin. İçsel sesini dinlemeyi unutma.`,
    cosmicMessage: "Yıldızlar sana bu hafta yeni başlangıçlar için yeşil ışık yakıyor. Cesaretle adım at!"
  };
};

export const generateAIAstrologyReading = async (birthData: BirthData): Promise<AIReading> => {
  console.log('Calling AI astrology reading function...');
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-astrology-reading', {
      body: { birthData }
    });

    if (error) {
      console.error('Supabase function error:', error);
      console.log('Falling back to demo reading due to API error');
      return generateFallbackReading(birthData);
    }

    if (!data.success) {
      console.log('API call unsuccessful, using fallback reading');
      return generateFallbackReading(birthData);
    }

    console.log('AI reading received:', data.reading);

    // Parse the AI response to extract different sections
    const reading = data.reading;
    
    // Extract sun sign
    const sunSignMatch = reading.match(/\*\*Güneş Burcu\*\*:\s*(.+?)(?:\n|\*\*)/);
    const sunSign = sunSignMatch ? sunSignMatch[1].trim() : 'Bilinmiyor';
    
    // Extract moon sign
    const moonSignMatch = reading.match(/\*\*Ay Burcu\*\*:\s*(.+?)(?:\n|\*\*)/);
    const moonSign = moonSignMatch ? moonSignMatch[1].trim() : 'Bilinmiyor';
    
    // Extract rising sign
    const risingSignMatch = reading.match(/\*\*Yükselen Burcu\*\*:\s*(.+?)(?:\n|\*\*)/);
    const risingSign = risingSignMatch ? risingSignMatch[1].trim() : 'Bilinmiyor';
    
    // Extract analysis (everything between daily analysis and cosmic message)
    const analysisMatch = reading.match(/\*\*Bugünün Astrolojik Analizi\*\*:\s*([\s\S]*?)\*\*Evrenin Sana Mesajı\*\*/);
    const analysis = analysisMatch ? analysisMatch[1].trim() : reading;
    
    // Extract cosmic message
    const cosmicMatch = reading.match(/\*\*Evrenin Sana Mesajı\*\*:\s*([\s\S]*?)$/);
    const cosmicMessage = cosmicMatch ? cosmicMatch[1].trim() : 'Yıldızlar sana her zaman rehberlik eder.';

    return {
      sunSign,
      moonSign,
      risingSign,
      analysis,
      cosmicMessage
    };

  } catch (error) {
    console.error('Error generating AI reading:', error);
    console.log('Using fallback reading due to exception');
    return generateFallbackReading(birthData);
  }
};
