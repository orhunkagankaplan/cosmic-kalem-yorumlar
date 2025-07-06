
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
    
    let requestBody;
    try {
      requestBody = await req.json();
      console.log('Request body received:', JSON.stringify(requestBody, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request body:', parseError);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Invalid JSON in request body'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Handle translation requests
    if (requestBody.translateRequest) {
      const { title, explanation } = requestBody.translateRequest;
      
      console.log('Processing translation request...');

      if (!openRouterApiKey) {
        console.error('OpenRouter API key not configured');
        return new Response(JSON.stringify({ 
          success: false,
          error: 'OpenRouter API key not configured'
        }), {
          status: 200,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

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

    // Handle astrology reading requests (main functionality)
    const { birthData } = requestBody;
    
    console.log('Received birth data:', birthData);

    if (!birthData || !birthData.fullName || !birthData.birthDate) {
      console.error('Birth data is incomplete:', birthData);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'Birth data is incomplete'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (!openRouterApiKey) {
      console.error('OpenRouter API key not configured');
      return new Response(JSON.stringify({ 
        success: false,
        error: 'OpenRouter API key not configured'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Sosyal medya analizi için gelişmiş prompt
    let socialMediaAnalysis = '';
    if (birthData.socialMedia && birthData.socialMedia.trim()) {
      socialMediaAnalysis = `\n\nSosyal Medya Paylaşımları: "${birthData.socialMedia}"

Bu paylaşımları analiz et ve şu konulara göre yorumla:
- Para/Maddi konular: Eğer para, maaş, borç, alışveriş vb. bahsediyorsa maddi durumu yorumla
- Aşk/İlişkiler: Eğer sevgili, aşk, yalnızlık, ilişki vb. bahsediyorsa duygusal durumu yorumla  
- Kariyer/İş: Eğer iş, çalışma, patron, stres vb. bahsediyorsa profesyonel durumu yorumla
- Sağlık/Enerji: Eğer yorgunluk, hastalık, spor vb. bahsediyorsa fiziksel durumu yorumla
- Aile/Arkadaş: Eğer aile, arkadaş, sosyal çevre bahsediyorsa sosyal durumu yorumla

Bu analizi kişinin burcu ve doğum verileriyle birleştir.`;
    }

    // Çok daha detaylı ve profesyonel astroloji analizi için gelişmiş prompt
    const prompt = `Sen Türkiye'nin en yetenekli ve ünlü astroloğusun. Senin analizlerin çok detaylı, kişisel ve profesyonel. Aşağıdaki kişi için çok özel, detaylı ve bugün için personalize edilmiş bir astroloji analizi hazırla:

İsim: ${birthData.fullName}
Doğum Tarihi: ${birthData.birthDate}
Doğum Saati: ${birthData.birthTime}
Doğum Yeri: ${birthData.birthCity}, ${birthData.birthCountry}${socialMediaAnalysis}

ÖNEMLI: Çok detaylı, profesyonel ve kişisel bir analiz yap. En az 400 kelime olmalı.

Lütfen şu formatta yanıt ver:

**Güneş Burcu**: [Burç adı - doğum tarihinden hesapla]
**Ay Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre]
**Yükselen Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre]

**Bugünün Astrolojik Analizi**:
[Çok uzun, detaylı ve kişisel günlük astroloji yorumu. Kişinin adını sık kullan, ${new Date().toLocaleDateString('tr-TR')} tarihini vurgula, gezegen hareketlerinden bahset, doğum yerinin enerjisini dahil et, doğum saatinin önemini belirt, bu haftaki özel öneriler ver, kişisel gelişim tavsiyeleri ekle, ilişkiler hakkında yorumlar yap, kariyer ve para konularında rehberlik ver. En az 400 kelime olmalı.]

${birthData.socialMedia ? `**Sosyal Medya Enerji Analizi**:
[Paylaştığı içeriğe göre çok spesifik yorumlar yap. Para bahsetmişse maddi durumu, aşk bahsetmişse duygusal durumu, iş bahsetmişse kariyer durumunu yorumla. Genel değil, paylaşımın tam içeriğine göre özel yorumlar yap. Bu analizi astrolojik verilerle birleştir.]` : ''}

**Evrenin Sana Mesajı**:
[Çok ilham verici, kişisel ve akılda kalıcı bir mesaj - 2-3 cümle, kişinin adını kullan]

Tüm metin Türkçe olmalı, çok kişisel ve sıcak bir ton kullan. Profesyonel ama samimi ol. Bugünün tarihi ${new Date().toLocaleDateString('tr-TR')} - bunu sürekli vurgula.`;

    console.log('Calling OpenRouter API for astrology reading...');

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
            content: 'Sen Türkiye\'nin en yetenekli ve ünlü astroloğusun. Analizlerin çok detaylı, kişisel, profesyonel ve doğru. Her zaman Türkçe yanıt verirsin ve çok samimi, sıcak bir dil kullanırsın. İnsanları adlarıyla çağırır, onlara özel hissettirirsin. Sosyal medya paylaşımlarını analiz ederken çok spesifik ve içeriğe uygun yorumlar yaparsın.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 2500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenRouter API Error:', response.status, errorData);
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
      success: false,
      error: error.message || 'Bilinmeyen bir hata oluştu'
    }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
