
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
    console.log('Fetching Prokerala astrology data...');
    
    // Convert birth data to required format
    const [year, month, day] = birthDate.split('-');
    const [hours, minutes] = birthTime.split(':');
    
    // Basic astro details API call
    const basicDetailsResponse = await fetch('https://api.prokerala.com/v2/astrology/basic-astro-details', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${import.meta.env.VITE_PROKERALA_API_KEY || 'demo-key'}`
      },
      body: JSON.stringify({
        ayanamsa: 1,
        coordinates: {
          latitude: 41.0082, // Istanbul coordinates as default
          longitude: 28.9784
        },
        datetime: `${year}-${month}-${day}T${hours}:${minutes}:00+03:00`,
        name: name
      })
    });

    if (!basicDetailsResponse.ok) {
      console.error('Prokerala API error:', basicDetailsResponse.status);
      return null;
    }

    const basicData = await basicDetailsResponse.json();
    console.log('Prokerala basic data received:', basicData);

    // Extract astrology information
    const data = basicData.data;
    
    return {
      sunSign: data.sun_sign || 'Bilinmiyor',
      moonSign: data.moon_sign || 'Bilinmiyor', 
      risingSign: data.ascendant || 'Bilinmiyor',
      planetaryPositions: data.planets || {},
      nakshatraDetails: data.nakshatra || {},
      basicAstroDetails: data
    };

  } catch (error) {
    console.error('Error fetching Prokerala data:', error);
    return null;
  }
};
