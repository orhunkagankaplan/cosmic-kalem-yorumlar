
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openRouterApiKey = Deno.env.get('OPENROUTER_API_KEY');
const freeAstrologyApiKey = Deno.env.get('FREEASTROLOGYAPI_KEY');

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

    if (!openRouterApiKey || !freeAstrologyApiKey) {
      console.error('API keys not configured - OpenRouter:', !!openRouterApiKey, 'FreeAstrology:', !!freeAstrologyApiKey);
      return new Response(JSON.stringify({ 
        success: false,
        error: 'API keys not configured'
      }), {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Doğum tarihinden burç hesapla
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

    // Free Astrology API'den güncel astrolojik verileri al
    let currentAstrologyData = '';
    try {
      const zodiacSign = getZodiacSign(birthData.birthDate);
      console.log('Fetching current astrology data for sign:', zodiacSign);
      
      const astrologyResponse = await fetch(`https://api.freeastrologyapi.com/horoscope/daily/${zodiacSign}`, {
        method: 'GET',
        headers: {
          'x-api-key': freeAstrologyApiKey,
          'Content-Type': 'application/json',
        },
      });

      if (astrologyResponse.ok) {
        const astrologyData = await astrologyResponse.json();
        currentAstrologyData = `\n\nGÜNCEL ASTROLOJİK VERİLER (${new Date().toLocaleDateString('tr-TR')}):
- Günlük Burç Yorumu: ${astrologyData.prediction || 'Güzel bir gün sizi bekliyor.'}
- Şanslı Renk: ${astrologyData.color || 'Mavi'}
- Şanslı Sayı: ${astrologyData.number || '7'}
- Uyumlu Burç: ${astrologyData.compatibility || 'Tüm burçlar'}

Bu güncel verileri analiz ederken kullan ve kişinin doğum verilerine göre yorumla.`;
        
        console.log('Successfully fetched current astrology data');
      } else {
        console.warn('Failed to fetch astrology data, using AI-only analysis');
      }
    } catch (astrologyError) {
      console.warn('Error fetching astrology data:', astrologyError);
      // API hatası olursa sadece AI analizi kullan
    }

    // Sosyal medya analizi için gelişmiş prompt
    let socialMediaAnalysis = '';
    if (birthData.socialMedia && birthData.socialMedia.trim()) {
      socialMediaAnalysis = `\n\nSosyal Medya Paylaşımları: "${birthData.socialMedia}"

Bu paylaşımları analiz et ve şu konulara göre SPESIFIK yorumla:
- Para/Maddi konular: Eğer para, maaş, borç, alışveriş, maddi zorluk vb. bahsediyorsa → maddi durumunu ve para konusundaki astrolojik rehberliğini detaylı yaz
- Aşk/İlişkiler: Eğer sevgili, aşk, yalnızlık, ilişki, kalp kırıklığı vb. bahsediyorsa → duygusal durumunu ve aşk konusundaki astrolojik rehberliğini detaylı yaz  
- Kariyer/İş: Eğer iş, çalışma, patron, stres, işsizlik, terfi vb. bahsediyorsa → profesyonel durumunu ve kariyer konusundaki astrolojik rehberliğini detaylı yaz
- Sağlık/Enerji: Eğer yorgunluk, hastalık, spor, diyet vb. bahsediyorsa → fiziksel durumunu ve sağlık konusundaki astrolojik rehberliğini detaylı yaz
- Aile/Arkadaş: Eğer aile, arkadaş, sosyal çevre, kavga vb. bahsediyorsa → sosyal durumunu ve ilişkiler konusundaki astrolojik rehberliğini detaylı yaz

ÖNEMLI: Bu analizi kişinin Batı astrolojisi burcunu ve doğum verilerini kullanarak yap. Genel değil, paylaşımın TAM İÇERİĞİNE göre özel yorumlar yap.`;
    }

    // Çok daha detaylı ve profesyonel astroloji analizi için gelişmiş prompt
    const prompt = `Sen Türkiye'nin en yetenekli ve ünlü astroloğusun. Senin analizlerin çok detaylı, kişisel ve profesyonel. Aşağıdaki kişi için çok özel, detaylı ve bugün için personalize edilmiş bir astroloji analizi hazırla:

İsim: ${birthData.fullName}
Doğum Tarihi: ${birthData.birthDate}
Doğum Saati: ${birthData.birthTime}
Doğum Yeri: ${birthData.birthCity}, ${birthData.birthCountry}${socialMediaAnalysis}${currentAstrologyData}

ÇOK ÖNEMLİ KURALLAR:
1. SADECE BATI ASTROLOJİSİ kullan: Koç, Boğa, İkizler, Yengeç, Aslan, Başak, Terazi, Akrep, Yay, Oğlak, Kova, Balık
2. ÇİN BURÇLARINA (Köpek, Ejderha, Fare, vb.) ASLA DEĞINME
3. SADECE 12 BATI BURCU SİSTEMİ kullan
4. Hayvan isimleri kullanma (sadece Batı burçları: Koç, Boğa, Aslan, Yengeç, Akrep hariç - bunlar Batı astrolojisinin parçası)

ÖNEMLI: Çok detaylı, profesyonel ve kişisel bir analiz yap. En az 400 kelime olmalı.

Lütfen şu formatta yanıt ver:

**Güneş Burcu**: [Burç adı - doğum tarihinden hesapla - SADECE BATI ASTROLOJİSİ]
**Ay Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre - SADECE BATI ASTROLOJİSİ]  
**Yükselen Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre - SADECE BATI ASTROLOJİSİ]

**Bugünün Astrolojik Analizi**:
[Çok uzun, detaylı ve kişisel günlük astroloji yorumu. Kişinin adını sık kullan, ${new Date().toLocaleDateString('tr-TR')} tarihini vurgula, gezegen hareketlerinden bahset, doğum yerinin enerjisini dahil et, doğum saatinin önemini belirt, bu haftaki özel öneriler ver, kişisel gelişim tavsiyeleri ekle, ilişkiler hakkında yorumlar yap, kariyer ve para konularında rehberlik ver. En az 400 kelime olmalı. SADECE BATI ASTROLOJİSİ BURÇLARI KULLAN.]

${birthData.socialMedia ? `**Sosyal Medya Enerji Analizi**:
[Paylaştığı içeriğe göre çok spesifik yorumlar yap. Para bahsetmişse maddi durumu, aşk bahsetmişse duygusal durumu, iş bahsetmişse kariyer durumunu yorumla. Genel değil, paylaşımın tam içeriğine göre özel yorumlar yap. Bu analizi SADECE BATI ASTROLOJİSİ burç verileriyle birleştir.]` : ''}

**Evrenin Sana Mesajı**:
[Çok ilham verici, kişisel ve akılda kalıcı bir mesaj - 2-3 cümle, kişinin adını kullan]

Tüm metin Türkçe olmalı, çok kişisel ve sıcak bir ton kullan. Profesyonel ama samimi ol. Bugünün tarihi ${new Date().toLocaleDateString('tr-TR')} - bunu sürekli vurgula.

TEKRAR HATIRLATMA: SADECE BATI ASTROLOJİSİ burçları kullan. Çin burçlarından bahsetme.`;

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
            content: 'Sen Türkiye\'nin en yetenekli ve ünlü astroloğusun. Analizlerin çok detaylı, kişisel, profesyonel ve doğru. Her zaman Türkçe yanıt verirsin ve çok samimi, sıcak bir dil kullanırsın. İnsanları adlarıyla çağırır, onlara özel hissettirirsin. SADECE BATI ASTROLOJİSİ kullanırsın: Koç, Boğa, İkizler, Yengeç, Aslan, Başak, Terazi, Akrep, Yay, Oğlak, Kova, Balık. Çin burçlarını (Köpek, Ejderha, Fare vb.) ASLA kullanmazsın. Sosyal medya paylaşımlarını analiz ederken çok spesifik ve içeriğe uygun yorumlar yaparsın.'
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
