
import { supabase } from "@/integrations/supabase/client";

export const translateNasaContent = async (title: string, explanation: string) => {
  try {
    console.log('Translating NASA content to Turkish...');
    
    const response = await supabase.functions.invoke('generate-astrology-reading', {
      body: {
        translateRequest: {
          title,
          explanation,
          targetLanguage: 'Turkish'
        }
      }
    });

    if (response.data?.success && response.data?.translation) {
      return response.data.translation;
    }

    // Fallback: return original content if translation fails
    return { title, explanation };
  } catch (error) {
    console.error('Translation error:', error);
    return { title, explanation };
  }
};
