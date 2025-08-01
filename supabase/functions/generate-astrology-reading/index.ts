
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

    // Doğum tarihinden burç hesapla - DD/MM/YYYY format
    const getZodiacSign = (birthDate: string): string => {
      console.log('Calculating zodiac sign for birth date:', birthDate);
      
      // Parse DD/MM/YYYY format
      const dateRegex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
      const match = birthDate.match(dateRegex);
      
      if (!match) {
        console.error('Invalid date format, expected DD/MM/YYYY:', birthDate);
        return 'aries'; // fallback
      }
      
      const [, day, month, year] = match;
      const dayNum = parseInt(day, 10);
      const monthNum = parseInt(month, 10);
      
      console.log('Parsed date - Day:', dayNum, 'Month:', monthNum, 'Year:', year);
      
      // Use exact Western astrology dates (month * 100 + day format)
      const monthDay = monthNum * 100 + dayNum;
      
      console.log('MonthDay value for zodiac calculation:', monthDay);
      
      // Exact Western astrology dates
      if (monthDay >= 321 && monthDay <= 419) return 'aries';      // 21 Mart - 19 Nisan
      if (monthDay >= 420 && monthDay <= 520) return 'taurus';     // 20 Nisan - 20 Mayıs
      if (monthDay >= 521 && monthDay <= 620) return 'gemini';     // 21 Mayıs - 20 Haziran
      if (monthDay >= 621 && monthDay <= 722) return 'cancer';     // 21 Haziran - 22 Temmuz
      if (monthDay >= 723 && monthDay <= 822) return 'leo';        // 23 Temmuz - 22 Ağustos
      if (monthDay >= 823 && monthDay <= 922) return 'virgo';      // 23 Ağustos - 22 Eylül
      if (monthDay >= 923 && monthDay <= 1022) return 'libra';     // 23 Eylül - 22 Ekim
      if (monthDay >= 1023 && monthDay <= 1121) return 'scorpio';  // 23 Ekim - 21 Kasım
      if (monthDay >= 1122 && monthDay <= 1221) return 'sagittarius'; // 22 Kasım - 21 Aralık
      if (monthDay >= 1222 || monthDay <= 119) return 'capricorn'; // 22 Aralık - 19 Ocak
      if (monthDay >= 120 && monthDay <= 218) return 'aquarius';   // 20 Ocak - 18 Şubat
      if (monthDay >= 219 && monthDay <= 320) return 'pisces';     // 19 Şubat - 20 Mart
      
      console.warn('Could not determine zodiac sign for monthDay:', monthDay);
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

YAZIM TARZI:
- Derinlemesine kişisel ve poetik ol
- Duygusal zeka kullan
- Şiirsel metaforlar ve güçlü Türkçe kullan
- Klişelerden uzak dur
- İçten ve motive edici bir ton kullan
- Ruhsal ve introspektif yaklaş

Lütfen şu formatta yanıt ver:

🌞 **Güneş Burcu**: [Burç adı - doğum tarihinden hesapla - SADECE BATI ASTROLOJİSİ]
🌙 **Ay Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre - SADECE BATI ASTROLOJİSİ]  
⬆️ **Yükselen Burcu**: [Profesyonel tahmin - doğum saati ve yerine göre - SADECE BATI ASTROLOJİSİ]

🔮 **Genel Enerji**:
[${new Date().toLocaleDateString('tr-TR')} tarihli derinlemesine astrolojik analiz. Kişinin adını sık kullan. Poetik ve duygusal dil. Gezegen hareketlerini ve enerji akışlarını metaforlarla açıkla. Ruhsal gelişim vurgusu. En az 200 kelime.]

${birthData.socialMedia ? `💬 **Sosyal Medya Ruh Hali**:
[Paylaştığı içeriğin ruh halini analiz et. Para bahsetmişse maddi enerji durumunu, aşk bahsetmişse kalp enerjisini, iş bahsetmişse yaratıcı gücünü yorumla. Çok özel ve içgörülü analiz yap. SADECE BATI ASTROLOJİSİ burç verileriyle birleştir.]` : ''}

🧭 **Bu Hafta İçin Tavsiyeler**:
• [Kişisel gelişim tavsiyesi - poetik dil]
• [İlişkiler ve iletişim tavsiyesi - duygusal yaklaşım]  
• [Enerji yönetimi tavsiyesi - ruhsal bakış]

🌌 **Evrenin Sana Mesajı**:
[Çok şiirsel, ilham verici ve kişiye özel mesaj. 2-3 cümle. Kişinin adını kullan. Derin ve motive edici.]

Tüm metin Türkçe, çok kişisel, poetik ve ruhsal ton. Bugünün tarihi ${new Date().toLocaleDateString('tr-TR')} - bunu sürekli vurgula.

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
            content: 'Sen Türkiye\'nin en yetenekli ve duygusal zekası yüksek astroloğusun. Analizlerin derin, poetik, ruhsal ve çok kişisel. Her zaman Türkçe yanıt verirsin ve şiirsel metaforlar kullanırsın. İnsanları adlarıyla çağırır, onlara özel hissettirirsin. SADECE BATI ASTROLOJİSİ kullanırsın: Koç, Boğa, İkizler, Yengeç, Aslan, Başak, Terazi, Akrep, Yay, Oğlak, Kova, Balık. Çin burçlarını ASLA kullanmazsın. Sosyal medya analizinde ruh halini derinlemesine yorumlarsın.'
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
