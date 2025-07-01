
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

  // Çok daha detaylı ve profesyonel analiz
  const detailedAnalyses = {
    "Koç": `${birthData.fullName}, sen doğuştan bir lider ve öncüsün! ${birthData.birthCity}'deki doğumun sana güçlü bir enerji vermiş. Bu hafta Mars enerjisi seninle - cesaret ve kararlılık zamanı. Özellikle ${new Date().toLocaleDateString('tr-TR', { weekday: 'long' })} günü senin için dönüm noktası olabilir.

🔥 Enerji Analizi: Ateş elementinin gücü bu dönemde seninle. İçindeki yaratıcı ateş yanıyor ve yeni projelere başlamak için mükemmel bir zaman.

💫 Kişisel Gelişim: Sabırsızlığın bazen seni zorlasa da, bu hafta bunu avantaja çevirebilirsin. Liderlik özelliklerinin ön plana çıkacağı durumlarla karşılaşacaksın.

🌟 İlişkiler: Sosyal çevren senin enerjinden etkilenecek. Çevrendeki insanları motive etme gücün bu dönemde artıyor.`,

    "Boğa": `${birthData.fullName}, senin sakinliğin ve kararlılığın bu dönemde büyük güç! ${birthData.birthCity}'nin toprak enerjisi seninle uyum halinde. Venüs'ün etkisi altında güzellik ve harmoniye odaklanacağın bir dönemdesin.

🌱 Toprak Elementi: Pratik zekân ve sabırın bu hafta sana büyük avantajlar sağlayacak. Uzun vadeli planların için mükemmel bir zaman.

💚 Bolluk Enerjisi: Maddi konularda pozitif gelişmeler seni bekliyor. Sabırla beklediğin fırsatlar kapını çalmaya başlayacak.

🎨 Yaratıcılık: Sanatsal yeteneklerin ve estetik anlayışın bu dönemde parlayacak. El becerin ve yaratıcılığın dikkat çekecek.`,

    "İkizler": `${birthData.fullName}, zihnin bu hafta tam bir fırtına! ${birthData.birthCity}'deki doğumun sana hızlı düşünme yetisi kazandırmış. Merkür'ün etkisiyle iletişim becerilerin zirveye çıkacak.

🌪️ Hava Elementi: Düşüncelerinin hızı ve çok yönlülüğün bu dönemde seni öne çıkaracak. Birden fazla projeyi aynı anda yürütebilirsin.

📡 İletişim Gücü: Sosyal medya ve iletişim kanallarında etkili olacağın bir dönem. Fikirlerini paylaşmaktan çekinme.

🎭 Adaptasyon: Değişen şartlara hızla uyum sağlama yeteneğin bu hafta sana büyük avantaj sağlayacak.`,

    "Yengeç": `${birthData.fullName}, duygusal derinliğin bu dönemde büyük bir hazine! ${birthData.birthCity}'deki doğumun sana güçlü sezgiler vermiş. Ay'ın etkisiyle içsel bilgeliğin artıyor.

🌊 Su Elementi: Empatin ve sezgilerin bu hafta seni doğru yönlendiriecek. İçsel sesin daima haklı çıkacak.

🏠 Aile Bağları: Yakın çevren ve ailen bu dönemde sana destek olacak. Ev ve aile konularında olumlu gelişmeler yaşayacaksın.

💖 Duygusal Zeka: Başkalarının duygularını anlama yeteneğin bu hafta seni çok değerli kılacak. İnsanlar sana güvenmeye devam edecek.`,

    "Aslan": `${birthData.fullName}, kraliyet havasın bu hafta tüm görkemiyle ortaya çıkacak! ${birthData.birthCity}'deki doğumun sana doğal bir liderlik vermiş. Güneş'in enerjisi seninle tam uyumda.

☀️ Güneş Enerjisi: Işıltın ve karizma bu dönemde herkesi etkileyecek. Sahne senin, gözler üzerinde olacak.

👑 Liderlik: Doğal liderlik özelliklerinin bu hafta fark edilecek. Önemli sorumluluklar sana verilmek istenebilir.

🎪 Yaratıcılık: Sanatsal yeteneklerin ve performans gücün bu dönemde parlayacak. Kendini ifade etme konusunda cesur ol.`,

    "Başak": `${birthData.fullName}, mükemmeliyetçiliğin bu hafta sana büyük başarılar getirecek! ${birthData.birthCity}'deki doğumun sana titizlik ve analitik düşünce vermiş.

🔍 Detaycılık: Herkesin gözden kaçırdığı ayrıntıları sen fark edeceksin. Bu hafta hatalarını düzeltme zamanı.

📊 Organizasyon: Planlama ve organize etme becerin bu dönemde çok değerli olacak. Etrafındakiler senden tavsiye isteyecek.

🌱 Gelişim: Kendini geliştirme konusundaki çaban bu hafta meyvelerini vermeye başlayacak.`,

    "Terazi": `${birthData.fullName}, dengeni buluşun ve zarafetinle bu hafta herkesi büyüleyeceksin! ${birthData.birthCity}'deki doğumun sana doğal bir diplomasi yeteneği vermiş.

⚖️ Denge Sanatı: Zıt kutupları bir araya getirme yeteneğin bu hafta çok işine yarayacak. Çatışmaları çözme konusunda başvurulacak kişi sen olacaksın.

💫 Sosyal Çekim: Güzellik anlayışın ve sosyal becerin bu dönemde dikkat çekecek. Yeni dostluklar ve bağlantılar kurabilirsin.

🎨 Estetik Anlayış: Sanat ve güzellik konularında verceğin kararlar takdir görecek.`,

    "Akrep": `${birthData.fullName}, derin sezgilerin ve güçlü iraden bu hafta sırrını açacak! ${birthData.birthCity}'deki doğumun sana mistik bir güç vermiş.

🦂 Dönüşüm Gücü: Bu hafta büyük bir değişim ve dönüşüm geçirebilirsin. Eski halinden çok daha güçlü çıkacaksın.

🔮 Sezgisel Güç: İçsel sesini dinlediğinde doğru kararları verme konusunda şaşırtıcı başarılar elde edeceksin.

💎 Gizli Yetenekler: Şimdiye kadar keşfetmediğin yeteneklerin bu dönemde ortaya çıkmaya başlayabilir.`,

    "Yay": `${birthData.fullName}, macera ruhu ve özgürlük aşkınla bu hafta yeni ufuklara yelken açacaksın! ${birthData.birthCity}'deki doğumun sana keşfetme arzusu vermiş.

🏹 Hedef Odaklılık: Belirlediğin hedeflere ulaşma konusunda bu hafta büyük ilerlemeler kaydedeceksin.

🌍 Genişlik: Ufkunu genişletecek fırsatlarla karşılaşacaksın. Yeni yerler, yeni insanlar, yeni fikirler...

📚 Öğrenme: Bilgi arayışın bu dönemde seni çok ilginç keşiflere götürecek.`,

    "Oğlak": `${birthData.fullName}, kararlılığın ve sebatınla bu hafta dağları bile aşabilirsin! ${birthData.birthCity}'deki doğumun sana çelik gibi bir irade vermiş.

⛰️ Zirve Yolculuğu: Uzun süredir üzerinde çalıştığın projeler bu hafta sonuç vermeye başlayacak.

👔 Otorite: Profesyonel alanda saygınlığın artacak. Söz sahibi olmaya başlayacağın konular olabilir.

🏗️ Yapıcılık: Somut ve kalıcı işler yaratma konusundaki yeteneğin bu dönemde fark edilecek.`,

    "Kova": `${birthData.fullName}, özgün düşüncelerin ve yenilikçi yaklaşımınla bu hafta çevrendeki herkesi şaşırtacaksın! ${birthData.birthCity}'deki doğumun sana farklı bakış açısı vermiş.

⚡ Yenilik Enerjisi: Teknoloji ve yeniliklere olan ilgin bu hafta sana avantajlar sağlayacak.

🌐 Toplumsal Farkındalık: İnsanlığa faydalı olacak fikirler geliştirme konusunda ilham alacaksın.

🔬 Bilimsel Merak: Araştırma ve keşfetme konusundaki merakın seni yeni bilgilere götürecek.`,

    "Balık": `${birthData.fullName}, sonsuz hayal gücün ve duygusal derinliğinle bu hafta adeta büyü yaratacaksın! ${birthData.birthCity}'deki doğumun sana mistik bir bağlantı vermiş.

🐠 Akış Halinde: Hayatın akışına uyum sağlama yeteneğin bu hafta seni doğru yerlere götürecek.

🎨 Sanatsal Ruh: Yaratıcı projelerinp bu dönemde büyük ilgi görecek. İlham perilerin seninle.

💫 Ruhsal Bağlantı: Manevi konulara olan ilgin artacak ve bu alanda derin tecrübeler yaşayabilirsin.`
  };

  const analysis = detailedAnalyses[sunSign as keyof typeof detailedAnalyses] || detailedAnalyses["Koç"];

  return {
    sunSign: sunSign,
    moonSign: "Aslan", // Örnek
    risingSign: "Terazi", // Örnek
    analysis,
    cosmicMessage: "Evren sana bu hafta özel bir mesaj gönderiyor: İçindeki gücü keşfetme zamanı geldi! ✨"
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
      console.log('Falling back to enhanced demo reading due to API error');
      return generateFallbackReading(birthData);
    }

    if (!data.success) {
      console.log('API call unsuccessful, using enhanced fallback reading');
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
    console.log('Using enhanced fallback reading due to exception');
    return generateFallbackReading(birthData);
  }
};
