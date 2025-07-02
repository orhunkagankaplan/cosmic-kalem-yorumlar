
export interface ProkeralaAstrologyData {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  planetaryPositions: any;
  nakshatraDetails: any;
  basicAstroDetails: any;
}

export const getProkeralaAstrologyData = async (
  name: string,
  birthDate: string,
  birthTime: string,
  birthPlace: string
): Promise<ProkeralaAstrologyData | null> => {
  try {
    console.log('Fetching Prokerala astrology data...');
    
    // API key kontrolü
    const apiKey = import.meta.env.VITE_PROKERALA_API_KEY;
    if (!apiKey || apiKey === 'demo-key') {
      console.error('Prokerala API key not found or is demo key');
      throw new Error('Prokerala API key gerekli. Lütfen API key\'inizi ayarlayın.');
    }
    
    // Convert birth data to required format
    const [year, month, day] = birthDate.split('-');
    const [hours, minutes] = birthTime.split(':');
    
    const requestBody = {
      ayanamsa: 1,
      coordinates: {
        latitude: 41.0082, // Istanbul coordinates as default
        longitude: 28.9784
      },
      datetime: `${year}-${month}-${day}T${hours}:${minutes}:00+03:00`,
      name: name.trim()
    };

    console.log('Prokerala API request:', requestBody);

    // Basic astro details API call
    const basicDetailsResponse = await fetch('https://api.prokerala.com/v2/astrology/basic-astro-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('Prokerala API response status:', basicDetailsResponse.status);

    if (!basicDetailsResponse.ok) {
      const errorText = await basicDetailsResponse.text();
      console.error('Prokerala API error response:', errorText);
      throw new Error(`Prokerala API hatası: ${basicDetailsResponse.status} - ${errorText}`);
    }

    const basicData = await basicDetailsResponse.json();
    console.log('Prokerala basic data received:', basicData);

    // Check if response has data
    if (!basicData.data) {
      console.error('Prokerala API response missing data field');
      throw new Error('Prokerala API\'den geçersiz yanıt alındı');
    }

    // Extract astrology information
    const data = basicData.data;
    
    return {
      sunSign: data.sun_sign || 'Bilinmiyor',
      moonSign: data.moon_sign || 'Bilinmiyor', 
      risingSign: data.ascendant || 'Bilinmiyor',
      planetaryPositions: data.planets || {},
      nakshatraDetails: data.nakshatra || {},
      basicAstroDetails: data
    };

  } catch (error) {
    console.error('Error fetching Prokerala data:', error);
    
    // Daha anlaşılır hata mesajları
    if (error.message.includes('Failed to fetch')) {
      throw new Error('Prokerala API\'sine bağlanılamadı. İnternet bağlantınızı kontrol edin.');
    } else if (error.message.includes('401') || error.message.includes('403')) {
      throw new Error('Prokerala API key geçersiz. Lütfen doğru API key\'inizi girin.');
    } else if (error.message.includes('429')) {
      throw new Error('Prokerala API limit aşıldı. Lütfen daha sonra tekrar deneyin.');
    }
    
    throw error;
  }
};
