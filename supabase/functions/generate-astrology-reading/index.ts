
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
    const { birthData } = await req.json();
    
    console.log('Received birth data:', birthData);

    if (!birthData || !birthData.fullName || !birthData.birthDate) {
      throw new Error('Birth data is incomplete');
    }

    // Create a detailed prompt for Turkish astrology reading
    const prompt = `Sen Türkiye'nin en ünlü astroloğusun. Aşağıdaki kişi için detaylı, kişisel ve bugüne özel bir astroloji analizi hazırla:

İsim: ${birthData.fullName}
Doğum Tarihi: ${birthData.birthDate}
Doğum Saati: ${birthData.birthTime}
Doğum Yeri: ${birthData.birthCity}, ${birthData.birthCountry}

Lütfen şu formatta yanıt ver:

**Güneş Burcu**: [Burç adı]
**Ay Burcu**: [Ay burcu tahmini]
**Yükselen Burcu**: [Yükselen burcu tahmini]

**Bugünün Astrolojik Analizi**:
[Uzun ve detaylı günlük astroloji yorumu - en az 200 kelime. Kişinin adını kullan, bugünün tarihini dahil et, gezegen hareketlerinden bahset, özel öneriler ver]

**Evrenin Sana Mesajı**:
[İlham verici ve akılda kalıcı bir mesaj - 1-2 cümle]

Tüm metin Türkçe olmalı ve kişisel, sıcak bir ton kullan. Bugünün tarihi ${new Date().toLocaleDateString('tr-TR')} - bunu analizi yaparken dikkate al.`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterApiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://astromind.lovable.app',
        'X-Title': 'AstroMind AI Astrology'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'Sen Türkiye\'nin en yetenekli astroloğusun. Detaylı, kişisel ve doğru astroloji analizleri yaparsın. Her zaman Türkçe yanıt verirsin ve samimi bir dil kullanırsın.'
          },
          {
            role: 'user',
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 1500,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenRouter API Error:', errorData);
      throw new Error(`OpenRouter API error: ${response.status}`);
    }

    const data = await response.json();
    const aiReading = data.choices[0].message.content;

    console.log('AI Reading generated successfully with Mixtral-8x7b-instruct');

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
