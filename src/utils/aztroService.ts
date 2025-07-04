
export interface AztroAstrologyData {
  sunSign: string;
  horoscope: string;
  luckyNumber: string;
  luckyColor: string;
  mood: string;
  compatibility: string;
  date_range: string;
}

const getZodiacSign = (birthDate: string): string => {
  const [year, month, day] = birthDate.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  const monthDay = month * 100 + day;
  
  if (monthDay >= 321 && monthDay <= 419) return 'aries';
  if (monthDay >= 420 && monthDay <= 520) return 'taurus';
  if (monthDay >= 521 && monthDay <= 620) return 'gemini';
  if (monthDay >= 621 && monthDay <= 722) return 'cancer';
  if (monthDay >= 723 && monthDay <= 822) return 'leo';
  if (monthDay >= 823 && monthDay <= 922) return 'virgo';
  if (monthDay >= 923 && monthDay <= 1022) return 'libra';
  if (monthDay >= 1023 && monthDay <= 1121) return 'scorpio';
  if (monthDay >= 1122 && monthDay <= 1221) return 'sagittarius';
  if (monthDay >= 1222 || monthDay <= 119) return 'capricorn';
  if (monthDay >= 120 && monthDay <= 218) return 'aquarius';
  if (monthDay >= 219 && monthDay <= 320) return 'pisces';
  
  return 'aries'; // fallback
};

const translateZodiacToTurkish = (sign: string): string => {
  const translations: { [key: string]: string } = {
    'aries': 'Koç',
    'taurus': 'Boğa', 
    'gemini': 'İkizler',
    'cancer': 'Yengeç',
    'leo': 'Aslan',
    'virgo': 'Başak',
    'libra': 'Terazi',
    'scorpio': 'Akrep',
    'sagittarius': 'Yay',
    'capricorn': 'Oğlak',
    'aquarius': 'Kova',
    'pisces': 'Balık'
  };
  return translations[sign] || sign;
};

export const getAztroAstrologyData = async (
  name: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string
): Promise<AztroAstrologyData | null> => {
  try {
    console.log('Calling Aztro API for astrology data...');
    
    const zodiacSign = getZodiacSign(birthDate);
    
    const response = await fetch(`https://aztro.sameerkumar.website/?sign=${zodiacSign}&day=today`, {
      method: 'POST'
    });

    if (!response.ok) {
      throw new Error(`Aztro API hatası: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data) {
      throw new Error('Aztro API\'den veri alınamadı');
    }

    return {
      sunSign: translateZodiacToTurkish(zodiacSign),
      horoscope: data.description || 'Bugün için burç yorumunuz hazırlanamadı.',
      luckyNumber: data.lucky_number?.toString() || 'Bilinmiyor',
      luckyColor: data.color || 'Bilinmiyor',
      mood: data.mood || 'Olumlu',
      compatibility: data.compatibility || 'Tüm burçlarla uyumlu',
      date_range: data.date_range || ''
    };

  } catch (error) {
    console.error('Error fetching Aztro data:', error);
    
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Astroloji API\'sine bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    }
    
    throw new Error('Astroloji verisi alınırken bir hata oluştu.');
  }
};
