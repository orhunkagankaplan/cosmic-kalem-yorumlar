

import type { BirthData } from '../pages/Index';

interface ZodiacSign {
  name: string;
  element: string;
  quality: string;
  startDate: [number, number]; // [month, day]
  endDate: [number, number];
}

const zodiacSigns: ZodiacSign[] = [
  { name: "Koç", element: "Ateş", quality: "Öncü", startDate: [3, 21], endDate: [4, 19] },
  { name: "Boğa", element: "Toprak", quality: "Sabit", startDate: [4, 20], endDate: [5, 20] },
  { name: "İkizler", element: "Hava", quality: "Değişken", startDate: [5, 21], endDate: [6, 20] },
  { name: "Yengeç", element: "Su", quality: "Öncü", startDate: [6, 21], endDate: [7, 22] },
  { name: "Aslan", element: "Ateş", quality: "Sabit", startDate: [7, 23], endDate: [8, 22] },
  { name: "Başak", element: "Toprak", quality: "Değişken", startDate: [8, 23], endDate: [9, 22] },
  { name: "Terazi", element: "Hava", quality: "Öncü", startDate: [9, 23], endDate: [10, 22] },
  { name: "Akrep", element: "Su", quality: "Sabit", startDate: [10, 23], endDate: [11, 21] },
  { name: "Yay", element: "Ateş", quality: "Değişken", startDate: [11, 22], endDate: [12, 21] },
  { name: "Oğlak", element: "Toprak", quality: "Öncü", startDate: [12, 22], endDate: [1, 19] },
  { name: "Kova", element: "Hava", quality: "Sabit", startDate: [1, 20], endDate: [2, 18] },
  { name: "Balık", element: "Su", quality: "Değişken", startDate: [2, 19], endDate: [3, 20] },
];

const getZodiacSign = (date: Date): ZodiacSign => {
  console.log('getZodiacSign called with date:', date);
  
  // Check if date is valid
  if (!date || isNaN(date.getTime())) {
    console.error('Invalid date provided to getZodiacSign:', date);
    return zodiacSigns[0]; // Return Aries as fallback
  }
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  
  console.log(`Checking date: month=${month}, day=${day}`);
  
  for (const sign of zodiacSigns) {
    const [startMonth, startDay] = sign.startDate;
    const [endMonth, endDay] = sign.endDate;
    
    // Handle signs that don't cross year boundary
    if (startMonth <= endMonth) {
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay) ||
        (month > startMonth && month < endMonth)
      ) {
        console.log(`Found zodiac sign: ${sign.name}`);
        return sign;
      }
    } else {
      // Handle signs that cross year boundary (like Capricorn: Dec 22 - Jan 19)
      if (
        (month === startMonth && day >= startDay) ||
        (month === endMonth && day <= endDay)
      ) {
        console.log(`Found zodiac sign (year boundary): ${sign.name}`);
        return sign;
      }
    }
  }
  
  // Fallback to Aries if no sign found (should never happen with correct logic)
  console.log(`No zodiac sign found for date: ${month}/${day}, defaulting to Aries`);
  return zodiacSigns[0];
};

const generatePersonalizedReading = (birthData: BirthData, sunSign: ZodiacSign): string => {
  console.log('generatePersonalizedReading called with sunSign:', sunSign);
  
  if (!sunSign || !sunSign.name) {
    console.error('Invalid sunSign provided to generatePersonalizedReading:', sunSign);
    return "Bugün yıldızlar senin için özel bir enerji hazırlamış! İçsel gücünü keşfetme zamanı.";
  }
  
  const firstName = birthData.fullName.split(' ')[0];
  const today = new Date();
  const dayOfWeek = today.toLocaleDateString('tr-TR', { weekday: 'long' });
  
  const readings: Record<string, string> = {
    "Koç": `${firstName}, bugün ateşli enerjin doruk noktasında! ${dayOfWeek} günü senin için yeni başlangıçların habercisi. İçindeki cesur savaşçı, hayallerini gerçeğe dönüştürme zamanının geldiğini fısıldıyor. Bugün aldığın kararlar, gelecek ayların seyrini değiştirebilir.

Mars'ın etkisiyle kararlılığın had safhada. Ama sabırlı ol sevgili Koç, acele etme dürtün seni yanıltmasın. Özellikle öğleden sonra saatlerinde, sezgilerin seni doğru yöne yönlendirecek. Aşk hayatında beklenmedik bir gelişme kapıda.`,

    "Boğa": `${firstName}, Venüs'ün büyülü etkisi altında bugün! Güzellik ve uyum arayışın seni sanatsal bir keşfe sürükleyecek. ${dayOfWeek} günü, maddi konularda dikkatli adımlar atman gereken bir gün. Sabır ve kararlılığın, bu gün en büyük silahların.

Doğan'ın etkisiyle, çevrendekilere karşı daha anlayışlı olacaksın. İlişkilerinde derinlik arayışı içinde olabilirsin. Akşam saatlerinde, sevdiklerinle geçireceğin kaliteli zaman ruhunu dinlendirecek.`,

    "İkizler": `Meraklı ${firstName}, bugün zihnin bir fikir fırtınası yaşayacak! ${dayOfWeek} günü, iletişim becerilerin öne çıkıyor. Merkür'ün etkisiyle, sözcükler senin büyülü değneğin olacak. Yeni bilgiler, yeni insanlar, yeni perspektifler... Hepsini kucaklamaya hazır ol.

Çift karakterin bugün avantajına olacak. Hem mantıklı hem de yaratıcı yanın dengeleyerek, iş hayatında önemli bir ilerleme kaydedebilirsin. Ama dağınıklık tuzağına düşme, odaklanmaya çalış.`,

    "Yengeç": `Hassas kalpli ${firstName}, bugün duygusal derinliklerin seni büyüleyecek! Ay'ın etkisi altında, sezgilerin hiç olmadığı kadar keskin. ${dayOfWeek} günü, geçmişten gelen bir mesaj ya da anı, bugünkü kararlarına ışık tutacak.

Aile ve ev hayatın odak noktanda. Sevdiklerinle kurduğun duygusal bağ, bugün daha da güçlenecek. Akşam saatlerinde, içsel yolculuğuna zaman ayır. Ruhundaki o kadim bilgelik, sana yol gösterecek.`,

    "Aslan": `Görkemli ${firstName}, bugün sahnenin tam merkezindesin! Güneş'in çocuğu olarak, ${dayOfWeek} günü senin parladığın gün. Yaratıcı enerjin zirve yapıyor, sanatsal projeler için mükemmel bir zaman. Özgüveninle herkesi büyüleyeceksin.

Liderlik vasfın bugün öne çıkıyor. Etrafındakiler sana güveniyor ve rehberlik bekliyor. Ama ego tuzağına düşme, alçakgönüllülük senin en büyük gücün olacak. Kalbin için önemli birisi bugün hayatına girebilir.`,

    "Başak": `Mükemmeliyetçi ${firstName}, bugün detaylar seni zaferle buluşturacak! ${dayOfWeek} günü, Merkür'ün etkisiyle analitik zekân dorukta. Çevrendekilerin göremediği incelikleri sen fark edecek, pratik çözümlerle herkesi şaşırtacaksın.

Sağlık ve beslenme konularında yeni bir dönem başlayabilir. Vücudun sana önemli sinyaller veriyor, onları dinle. İş hayatında titizliğin takdir görecek, uzun zamandır beklediğin fırsat kapını çalabilir.`,

    "Terazi": `Dengeli ${firstName}, bugün uyum ve güzellik senin rehberin! Venüs'ün etkisiyle estetik duygun zirvede. ${dayOfWeek} günü, ilişkilerinde adalet ve denge arayışın seni doğru kararlara götürecek. Diplomasi yeteneğin bugün en büyük avantajın.

Ortaklıklar ve iş birlikleri için uygun bir gün. Çevrendekilerin farklı bakış açılarını dinleyerek, kendi vizyonunu genişletebilirsin. Aşk hayatında romantik sürprizler seni bekliyor olabilir.`,

    "Akrep": `Gizemli ${firstName}, bugün dönüşümün gücü seninle! ${dayOfWeek} günü, Pluto'nun derin etkisiyle içsel bir metamorfoz yaşayabilirsin. Geçmişten hesaplaşmalar kapanırken, yeni bir sen doğuyor. Sezgilerin seni asla yanıltmayacak.

Gizli kalmış gerçekler gün yüzüne çıkabilir. Bu durum seni şaşırtmasın, her şey senin yararına gelişiyor. Derin duygusal bağlar kurma konusunda bugün özel bir yeteneğe sahipsin. Hayatındaki önemli kişilerle samimi sohbetler yaşayabilirsin.`,

    "Yay": `Özgür ruhlu ${firstName}, bugün ufuklar senin için genişliyor! Jüpiter'in etkisiyle ${dayOfWeek} günü, felsefik düşünceler ve uzak yolculuklar zihnini meşgul edecek. Öğrenme aşkın seni yeni keşiflere götürecek.

Yabancı kültürlerle ilgili projeler öne çıkabilir. İnanç sistemin ve değerlerin yeniden şekilleniyor olabilir. Bu normal, büyüme sürecinin bir parçası. Akşam saatlerinde, doğayla baş başa kalmak ruhunu besleyecek.`,

    "Oğlak": `Azimli ${firstName}, bugün zirveye tırmanışın devam ediyor! ${dayOfWeek} günü, Satürn'ün etkisiyle disiplin ve sorumluluk duygularınla hedeflerine yaklaşıyorsun. Sabırla inşa ettiğin temeller bugün meyvesini verecek.

Kariyer hayatında önemli adımlar atabilirsin. Deneyimin ve bilgeliğin, genç ruhları yönlendirmede önemli rol oynayacak. Geleneksel değerlere sahip çıkarken, yeniliklere de açık olmayı unutma.`,

    "Kova": `Vizyoner ${firstName}, bugün gelecek seni çağırıyor! Uranüs'ün devrimci etkisiyle ${dayOfWeek} günü, teknoloji ve yenilik alanında parlayacaksın. Toplumsal konulara duyarlılığın seni önemli projelerin merkezine yerleştirebilir.

Arkadaşlıkların bugün odak noktanda. Sosyal çevren genişleyebilir, benzer idealları paylaştığın kişilerle tanışabilirsin. Sıra dışı fikirlerini paylaşmaktan çekinme, seni dinleyenler olacak.`,

    "Balık": `Sezgisel ${firstName}, bugün ruhsal dalgalar seni taşıyor! ${dayOfWeek} günü, Neptün'ün büyülü etkisiyle hayal gücün sınırsız. Sanatsal yaratıcılığın dorukta, ilham anları seni bekliyor. Empatin bugün en büyük süper gücün olacak.

Rüyaların ve semboller önemli mesajlar taşıyor, onları not almayı unutma. Şifa verici enerjin çevrendekileri etkileyecek. Su kenarında geçireceğin zaman, içsel huzurunu artıracak.`
  };

  console.log('Available readings keys:', Object.keys(readings));
  console.log('Looking for key:', sunSign.name);
  
  const reading = readings[sunSign.name];
  
  if (!reading) {
    console.error(`No reading found for sign: ${sunSign.name}`);
    return `${firstName}, bugün yıldızlar senin için özel bir enerji hazırlamış! ${dayOfWeek} günü, içsel gücünü keşfetme zamanı.`;
  }
  
  return reading;
};

const getCosmicMessage = (sunSign: ZodiacSign): string => {
  if (!sunSign || !sunSign.name) {
    console.error('Invalid sunSign provided to getCosmicMessage:', sunSign);
    return "Yıldızlar sana her zaman rehberlik eder, sadece dinlemeyi bil.";
  }
  
  const messages: Record<string, string> = {
    "Koç": "Cesaretin seni her zaman hedefe götürür, ama sabır seni zafere ulaştırır.",
    "Boğa": "Güzellik gözlerindedir, ama gerçek zenginlik kalbindeki huzurdur.",
    "İkizler": "Kelimeler köprüdür; onları bilgelikle inşa et.",
    "Yengeç": "Geçmiş bir öğretmendir, gelecek bir öğrencidir, şimdi ise en büyük armağandır.",
    "Aslan": "Işığın sadece kendini aydınlatmak için değil, başkalarına yol göstermek için vardır.",
    "Başak": "Mükemmellik hedeftir, ama yolculuk kendisi de bir mükemmelliktir.",
    "Terazi": "Denge bir hedef değil, sürekli yenilenen bir sanattır.",
    "Akrep": "Dönüşüm acı verir, ama doğurmadığın hiçbir şey senin olamaz.",
    "Yay": "Ufuklar sonsuzluğa uzanır, adımların da öyle olsun.",
    "Oğlak": "Zirve bir hedef değil, yeni başlangıçların kapısıdır.",
    "Kova": "Gelecek bir hayal değil, bugün attığın adımların yankısıdır.",
    "Balık": "Okyanusun derinliği sonsuzluğu içinde barındırır, sen de öyle."
  };

  const message = messages[sunSign.name];
  
  if (!message) {
    console.error(`No cosmic message found for sign: ${sunSign.name}`);
    return "Yıldızlar sana her zaman rehberlik eder, sadece dinlemeyi bil.";
  }
  
  return message;
};

export const generateAstrologyReading = (birthData: BirthData) => {
  console.log('=== generateAstrologyReading started ===');
  console.log('Birth data received:', birthData);
  
  // Validate birth data
  if (!birthData) {
    console.error('No birth data provided');
    throw new Error('Birth data is required');
  }
  
  if (!birthData.birthDate) {
    console.error('No birth date provided');
    throw new Error('Birth date is required');
  }
  
  console.log('Creating date from birthDate:', birthData.birthDate);
  const birthDate = new Date(birthData.birthDate);
  console.log('Birth date created:', birthDate);
  console.log('Birth date is valid:', !isNaN(birthDate.getTime()));
  
  if (isNaN(birthDate.getTime())) {
    console.error('Invalid birth date:', birthData.birthDate);
    throw new Error('Invalid birth date format');
  }
  
  const sunSign = getZodiacSign(birthDate);
  console.log('Sun sign determined:', sunSign);
  
  // Ensure we have a valid sun sign
  if (!sunSign || !sunSign.name) {
    console.error('Invalid sun sign returned:', sunSign);
    throw new Error('Could not determine zodiac sign');
  }
  
  // For simplicity, we'll use simplified calculations for Moon and Rising signs
  // Simple hash-based selection for demo purposes
  // Fix the birth time parsing
  let birthHour = 12; // Default to noon
  if (birthData.birthTime) {
    const timeParts = birthData.birthTime.split(':');
    if (timeParts.length >= 1) {
      const hourPart = parseInt(timeParts[0], 10);
      if (!isNaN(hourPart)) {
        birthHour = hourPart;
      }
    }
  }
  
  const nameHash = birthData.fullName.length + birthHour;
  console.log('Name hash calculated:', nameHash);
  console.log('Birth hour used:', birthHour);
  
  const moonIndex = nameHash % zodiacSigns.length;
  const risingIndex = (nameHash + 3) % zodiacSigns.length;
  
  console.log('Moon index:', moonIndex, 'Rising index:', risingIndex);
  
  const moonSign = zodiacSigns[moonIndex];
  const risingSign = zodiacSigns[risingIndex];
  
  console.log('Moon sign:', moonSign);
  console.log('Rising sign:', risingSign);
  
  // Additional safety checks
  if (!moonSign || !moonSign.name) {
    console.error('Invalid moon sign:', moonSign);
    throw new Error('Could not determine moon sign');
  }
  
  if (!risingSign || !risingSign.name) {
    console.error('Invalid rising sign:', risingSign);
    throw new Error('Could not determine rising sign');
  }

  const result = {
    title: `✨ ${birthData.fullName.split(' ')[0]} için bugünün astrolojik analizi`,
    signs: [
      {
        type: "☀️ Güneş Burcu",
        name: sunSign.name,
        emoji: "☀️",
        description: `${sunSign.element} elementi, ${sunSign.quality} kalite`
      },
      {
        type: "🌙 Ay Burcu", 
        name: moonSign.name,
        emoji: "🌙",
        description: `Duygusal doğan, içsel dünya`
      },
      {
        type: "⬆️ Yükselen Burcu",
        name: risingSign.name, 
        emoji: "⬆️",
        description: `Dış görünüş, ilk izlenim`
      }
    ],
    analysis: generatePersonalizedReading(birthData, sunSign),
    cosmicMessage: getCosmicMessage(sunSign)
  };
  
  console.log('=== generateAstrologyReading completed ===');
  console.log('Result:', result);
  
  return result;
};
