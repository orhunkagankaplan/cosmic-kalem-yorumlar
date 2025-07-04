
export const translateAndAnalyzeAztroData = async (
  aztroData: any,
  birthData: { fullName: string; birthDate: string; birthTime: string; birthCity: string }
) => {
  try {
    console.log('Creating Turkish analysis from Aztro data...');
    
    // Aztro API zaten İngilizce veri veriyor, basit bir çeviri ve analiz yapıyoruz
    const analysis = `✨ ${birthData.fullName} için Günlük Astroloji Rehberin:

🌟 Güneş Burcu: ${aztroData.sunSign}
🎯 Bugünün Yorumu: ${aztroData.horoscope}

🍀 Şanslı Sayın: ${aztroData.luckyNumber}
🎨 Şanslı Rengin: ${aztroData.luckyColor}
😊 Bugünkü Ruh Halin: ${aztroData.mood}
💫 Uyumlu Olduğun Burçlar: ${aztroData.compatibility}

📅 Doğum Tarihin: ${birthData.birthDate}
🕐 Doğum Saatin: ${birthData.birthTime} 
🌍 Doğum Yerin: ${birthData.birthCity}

${new Date().toLocaleDateString('tr-TR')} tarihli bu güzel günde, evren senin için özel mesajlar hazırlamış. Şanslı sayın ${aztroData.luckyNumber} ve rengin ${aztroData.luckyColor} bugün seni destekleyecek.

🔮 Evrenin Mesajı: ${birthData.fullName}, bugün senin için harika fırsatlar ve pozitif enerji dolu! ✨`;

    return analysis;

  } catch (error) {
    console.error('Analysis error:', error);
    return `Analiz hazırlanırken bir hata oluştu. Lütfen tekrar deneyin.`;
  }
};
