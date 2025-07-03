
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const prokeralaClientId = '7c564c4a-5f3f-4272-b2eb-c46bfdc004db';
const prokeralaSecret = 'F5EKE8aVeA1BXZWHnR9QkJb7PRit9WeGyzLxO9nD';

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
    const requestBody = await req.json();
    
    // Handle direct Prokerala API requests
    if (requestBody.prokeralaRequest) {
      const { name, birthDate, birthTime, birthPlace } = requestBody.prokeralaRequest;
      
      console.log('Processing direct Prokerala API request...');

      // Convert birth data to required format
      const [year, month, day] = birthDate.split('-');
      const [hours, minutes] = birthTime.split(':');
      
      // Build query parameters for GET request
      const queryParams = new URLSearchParams({
        ayanamsa: '1',
        coordinates: `${41.0082},${28.9784}`, // Istanbul coordinates as default
        datetime: `${year}-${month}-${day}T${hours}:${minutes}:00+03:00`,
        name: name.trim()
      });

      console.log('Calling Prokerala API with credentials...');

      // Basic astro details API call with Client ID and Secret
      const prokeralaResponse = await fetch(`https://api.prokerala.com/v2/astrology/birth-details?${queryParams.toString()}`, {
        method: 'GET',
        headers: {
          'X-API-Key': prokeralaClientId,
          'X-API-Secret': prokeralaSecret
        }
      });

      console.log('Prokerala API response status:', prokeralaResponse.status);

      if (!prokeralaResponse.ok) {
        const errorText = await prokeralaResponse.text();
        console.error('Prokerala API error response:', errorText);
        throw new Error(`Prokerala API hatası: ${prokeralaResponse.status} - ${errorText}`);
      }

      const prokeralaData = await prokeralaResponse.json();
      console.log('Prokerala data received:', prokeralaData);

      // Check if response has data
      if (!prokeralaData.data) {
        console.error('Prokerala API response missing data field');
        throw new Error('Prokerala API\'den geçersiz yanıt alındı');
      }

      // Extract and format astrology information
      const data = prokeralaData.data;
      
      const formattedData = {
        sunSign: data.sun_sign || 'Bilinmiyor',
        moonSign: data.moon_sign || 'Bilinmiyor', 
        risingSign: data.ascendant || 'Bilinmiyor',
        planetaryPositions: data.planets || {},
        nakshatraDetails: data.nakshatra || {},
        basicAstroDetails: data
      };

      return new Response(JSON.stringify({ 
        success: true,
        prokeralaData: formattedData,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle Prokerala analysis requests
    if (requestBody.prokeralaAnalysisRequest) {
      const { prokeralaData, birthData } = requestBody.prokeralaAnalysisRequest;
      
      console.log('Processing Prokerala analysis request...');

      const analysisPrompt = `Sen Türkiye'nin en yetenekli astroloğusun. Aşağıdaki gerçek Prokerala astroloji verilerini kullanarak ${birthData.fullName} için çok detaylı, kişisel ve Türkçe bir astroloji analizi hazırla:

İsim: ${birthData.fullName}
Doğum Tarihi: ${birthData.birthDate}
Doğum Saati: ${birthData.birthTime}
Doğum Yeri: ${birthData.birthCity}

PROKERALA GERçEK ASTROLOJİ VERİLERİ:
- Güneş Burcu: ${prokeralaData.sunSign}
- Ay Burcu: ${prokeralaData.moonSign}
- Yükselen Burcu: ${prokeralaData.risingSign}
- Gezegen Konumları: ${JSON.stringify(prokeralaData.planetaryPositions)}
- Nakshatra Detayları: ${JSON.stringify(prokeralaData.nakshatraDetails)}

Bu gerçek astroloji verilerini kullanarak çok detaylı, profesyonel ve kişisel bir analiz yap. En az 500 kelime olmalı.

Lütfen şu formatta yanıt ver:

**Gerçek Astroloji Verilerine Göre Analiz**:
[Prokerala API'den gelen gerçek verileri kullanarak çok uzun, detaylı ve kişisel astroloji yorumu. Kişinin adını sık kullan, ${new Date().toLocaleDateString('tr-TR')} tarihini vurgula, gerçek gezegen konumlarından bahset, nakshatra etkilerini açıkla, doğum yerinin önemini belirt, bu haftaki özel öneriler ver, kişisel gelişim tavsiyeleri ekle, ilişkiler hakkında yorumlar yap, kariyer ve para konularında rehberlik ver. En az 500 kelime olmalı.]

**Prokerala Verilerine Dayalı Evrenin Mesajı**:
[Çok ilham verici, kişisel ve akılda kalıcı bir mesaj - 2-3 cümle, kişinin adını kullan]

Tüm metin Türkçe olmalı, çok kişisel ve sıcak bir ton kullan. Profesyonel ama samimi ol. Bugünün tarihi ${new Date().toLocaleDateString('tr-TR')} - bunu sürekli vurgula.`;

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openRouterApiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://astromind.lovable.app',
          'X-Title': 'AstroMind Prokerala Analysis'
        },
        body: JSON.stringify({
          model: 'mistralai/mixtral-8x7b-instruct',
          messages: [
            {
              role: 'system',
              content: 'Sen Türkiye\'nin en yetenekli ve ünlü astroloğusun. Gerçek Prokerala astroloji verilerini kullanarak çok detaylı, kişisel, profesyonel analizler yaparsın. Her zaman Türkçe yanıt verirsin ve çok samimi, sıcak bir dil kullanırsın.'
            },
            {
              role: 'user',
              content: analysisPrompt
            }
          ],
          temperature: 0.8,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`Prokerala Analysis API error: ${response.status}`);
      }

      const data = await response.json();
      const aiAnalysis = data.choices[0].message.content;

      console.log('Prokerala AI Analysis generated successfully');

      return new Response(JSON.stringify({ 
        success: true,
        analysis: aiAnalysis,
        timestamp: new Date().toISOString()
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
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
