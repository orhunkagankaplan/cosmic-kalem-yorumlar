
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('Edge function called with method:', req.method);
    const requestBody = await req.json();
    console.log('Request body received:', JSON.stringify(requestBody, null, 2));
    
    // Handle Aztro API requests
    if (requestBody.aztroRequest) {
      const { name, birthDate, birthTime, birthPlace } = requestBody.aztroRequest;
      
      console.log('Processing Aztro API request...');

      try {
        // Get zodiac sign from birth date
        const getZodiacSign = (birthDate: string): string => {
          const [year, month, day] = birthDate.split('-').map(Number);
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

        const zodiacSign = getZodiacSign(birthDate);
        
        console.log(`Calling Aztro API for ${zodiacSign} sign...`);

        // Call Aztro API
        const aztroResponse = await fetch(`https://aztro.sameerkumar.website/?sign=${zodiacSign}&day=today`, {
          method: 'POST'
        });

        console.log('Aztro API response status:', aztroResponse.status);

        if (!aztroResponse.ok) {
          const errorText = await aztroResponse.text();
          console.error('Aztro API error response:', errorText);
          throw new Error(`Aztro API hatası: ${aztroResponse.status} - ${errorText}`);
        }

        const aztroData = await aztroResponse.json();
        console.log('Aztro data received:', aztroData);

        // Check if response has data
        if (!aztroData) {
          console.error('Aztro API response is empty');
          throw new Error('Aztro API\'den geçersiz yanıt alındı');
        }

        // Format Aztro data
        const formattedData = {
          sunSign: translateZodiacToTurkish(zodiacSign),
          horoscope: aztroData.description || 'Bugün için burç yorumunuz hazırlanamadı.',
          luckyNumber: aztroData.lucky_number?.toString() || 'Bilinmiyor',
          luckyColor: aztroData.color || 'Bilinmiyor',
          mood: aztroData.mood || 'Olumlu',
          compatibility: aztroData.compatibility || 'Tüm burçlarla uyumlu',
          date_range: aztroData.date_range || ''
        };

        return new Response(JSON.stringify({ 
          success: true,
          aztroData: formattedData,
          timestamp: new Date().toISOString()
        }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

      } catch (error) {
        console.error('Aztro API request failed:', error);
        return new Response(JSON.stringify({ 
          success: false,
          error: `Aztro API hatası: ${error.message}`,
          timestamp: new Date().toISOString()
        }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    }

    // Handle translation requests
    if (requestBody.translateRequest) {
      const { title, explanation } = requestBody.translateRequest;
      
      console.log('Processing translation request...');

      const translationPrompt = `Lütfen aşağıdaki NASA metinlerini Türkçe'ye çevir. Bilimsel ve astronomik terimleri doğru şekilde çevir:

Başlık: "${title}"

Açıklama: "${explanation}"

Lütfen şu formatta yanıt ver:
BAŞLIK: [Türkçe başlık]
AÇIKLAMA: [Türkçe açıklama]`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://astromind.lovable.app',
          'X-Title': 'AstroMind NASA Translation'
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'Sen NASA metinlerini Türkçe\'ye çeviren uzman bir çevirmensin. Bilimsel terimleri doğru şekilde çevirirsin.'
            },
            {
              role: 'user',
              content: translationPrompt
            }
          ],
          temperature: 0.3,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Translation API error: ${response.status}`);
      }

      const data = await response.json();
      const translatedText = data.choices[0].message.content;
      
      // Parse the translated response
      const titleMatch = translatedText.match(/BAŞLIK:\s*(.+?)(?:\n|AÇIKLAMA)/);
      const explanationMatch = translatedText.match(/AÇIKLAMA:\s*([\s\S]+?)$/);
      
      const translatedTitle = titleMatch ? titleMatch[1].trim() : title;
      const translatedExplanation = explanationMatch ? explanationMatch[1].trim() : explanation;

      console.log('Translation completed successfully');

      return new Response(JSON.stringify({ 
        success: true,
        translation: {
          title: translatedTitle,
          explanation: translatedExplanation
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle astrology reading requests (existing functionality)
    const { birthData } = requestBody;
    
    console.log('Received birth data:', birthData);

    if (!birthData || !birthData.fullName || !birthData.birthDate) {
      throw new Error('Birth data is incomplete');
    }

    // Çok daha detaylı ve profesyonel astroloji analizi için gelişmiş prompt
    const prompt = `Sen Türkiye'nin en yetenekli ve ünlü astroloğusun. Senin analizlerin çok detaylı, kişisel ve profesyonel. Aşağıdaki kişi için çok özel, detaylı ve bugün için personalize edilmiş bir astroloji analizi hazırla:

İsim: ${birthData.fullName}
Doğum Tarihi: ${birthData.birthDate}
Doğum Saati: ${birthData.birthTime}
Doğum Yeri: ${birthData.birthCity}, ${birthData.birthCountry}

ÖNEMLI: Çok detaylı, profesyonel ve kişisel bir analiz yap. En az 400 kelime olmalı.

Lütfen şu formatta yanıt ver:

**Güneş Burcu**: [Burç adı - doğum tarihinden hesapla]
**Ay Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre]
**Yükselen Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre]

**Bugünün Astrolojik Analizi**:
[Çok uzun, detaylı ve kişisel günlük astroloji yorumu. Kişinin adını sık kullan, ${new Date().toLocaleDateString('tr-TR')} tarihini vurgula, gezegen hareketlerinden bahset, doğum yerinin enerjisini dahil et, doğum saatinin önemini belirt, bu haftaki özel öneriler ver, kişisel gelişim tavsiyeleri ekle, ilişkiler hakkında yorumlar yap, kariyer ve para konularında rehberlik ver. En az 400 kelime olmalı.]

**Evrenin Sana Mesajı**:
[Çok ilham verici, kişisel ve akılda kalıcı bir mesaj - 2-3 cümle, kişinin adını kullan]

Tüm metin Türkçe olmalı, çok kişisel ve sıcak bir ton kullan. Profesyonel ama samimi ol. Bugünün tarihi ${new Date().toLocaleDateString('tr-TR')} - bunu sürekli vurgula.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://astromind.lovable.app',
        'X-Title': 'AstroMind AI Astrology Premium'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'Sen Türkiye\'nin en yetenekli ve ünlü astroloğusun. Analizlerin çok detaylı, kişisel, profesyonel ve doğru. Her zaman Türkçe yanıt verirsin ve çok samimi, sıcak bir dil kullanırsın. İnsanları adlarıyla çağırır, onlara özel hissettirirsin.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiReading = data.choices[0].message.content;

    console.log('Enhanced AI Reading generated successfully with Mixtral-8x7b-instruct');

    return new Response(JSON.stringify({ 
      success: true,
      reading: aiReading,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in generate-astrology-reading function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
