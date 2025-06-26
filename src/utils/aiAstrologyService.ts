
import { supabase } from "@/integrations/supabase/client";
import type { BirthData } from '@/pages/Index';

export interface AIReading {
  sunSign: string;
  moonSign: string;
  risingSign: string;
  analysis: string;
  cosmicMessage: string;
}

export const generateAIAstrologyReading = async (birthData: BirthData): Promise<AIReading> => {
  console.log('Calling AI astrology reading function...');
  
  try {
    const { data, error } = await supabase.functions.invoke('generate-astrology-reading', {
      body: { birthData }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`API Error: ${error.message}`);
    }

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate reading');
    }

    console.log('AI reading received:', data.reading);

    // Parse the AI response to extract different sections
    const reading = data.reading;
    
    // Extract sun sign
    const sunSignMatch = reading.match(/\*\*Güneş Burcu\*\*:\s*(.+?)(?:\n|\*\*)/);
    const sunSign = sunSignMatch ? sunSignMatch[1].trim() : 'Bilinmiyor';
    
    // Extract moon sign
    const moonSignMatch = reading.match(/\*\*Ay Burcu\*\*:\s*(.+?)(?:\n|\*\*)/);
    const moonSign = moonSignMatch ? moonSignMatch[1].trim() : 'Bilinmiyor';
    
    // Extract rising sign
    const risingSignMatch = reading.match(/\*\*Yükselen Burcu\*\*:\s*(.+?)(?:\n|\*\*)/);
    const risingSign = risingSignMatch ? risingSignMatch[1].trim() : 'Bilinmiyor';
    
    // Extract analysis (everything between daily analysis and cosmic message)
    const analysisMatch = reading.match(/\*\*Bugünün Astrolojik Analizi\*\*:\s*([\s\S]*?)\*\*Evrenin Sana Mesajı\*\*/);
    const analysis = analysisMatch ? analysisMatch[1].trim() : reading;
    
    // Extract cosmic message
    const cosmicMatch = reading.match(/\*\*Evrenin Sana Mesajı\*\*:\s*([\s\S]*?)$/);
    const cosmicMessage = cosmicMatch ? cosmicMatch[1].trim() : 'Yıldızlar sana her zaman rehberlik eder.';

    return {
      sunSign,
      moonSign,
      risingSign,
      analysis,
      cosmicMessage
    };

  } catch (error) {
    console.error('Error generating AI reading:', error);
    throw error;
  }
};
