
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
    console.log('Calling Supabase edge function for Prokerala data...');
    
    // Call edge function which will handle Prokerala API with Client ID and Secret
    const response = await fetch('https://cmqeosfptaxtctbzjulp.supabase.co/functions/v1/generate-astrology-reading', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNtcWVvc2ZwdGF4dGN0YnpqdWxwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA5MjE1NzEsImV4cCI6MjA2NjQ5NzU3MX0.tilAXTWWhABfVfS5RCMnKYd8gfVR5bCHIBawilEuOMc`,
      },
      body: JSON.stringify({
        prokeralaRequest: {
          name: name.trim(),
          birthDate,
          birthTime,
          birthPlace
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Edge function error:', errorText);
      throw new Error(`Prokerala API hatası: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    
    if (!data.success || !data.prokeralaData) {
      throw new Error(data.error || 'Prokerala verisi alınamadı');
    }

    return data.prokeralaData;

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
