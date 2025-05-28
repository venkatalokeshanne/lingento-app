// API route for DeepL translation to avoid CORS issues
import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();
    
    // Get DeepL API key from environment variables
    const authKey = process.env.NEXT_PUBLIC_DEEPL_API_KEY;
    
    if (!authKey) {
      return NextResponse.json(
        { error: 'DeepL API key not configured' },
        { status: 500 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required for translation' },
        { status: 400 }
      );
    }

    // Language code mapping for DeepL API
    const languageCodes = {
      french: 'FR',
      spanish: 'ES',
      german: 'DE',
      italian: 'IT',
      portuguese: 'PT-PT',
      russian: 'RU',
      chinese: 'ZH',
      japanese: 'JA',
      korean: 'KO',
      english: 'EN-US'
    };

    const getLanguageCode = (language) => {
      return languageCodes[language?.toLowerCase()] || languageCodes.english;
    };

    const targetCode = getLanguageCode(targetLanguage);
    let sourceCode = null;
    
    // DeepL supports auto-detection when sourceLanguage is not specified
    if (sourceLanguage && sourceLanguage !== 'auto') {
      sourceCode = getLanguageCode(sourceLanguage);
    }

    // Prepare form data for DeepL API
    const formData = new URLSearchParams();
    formData.append('text', text);
    formData.append('target_lang', targetCode);
    
    if (sourceCode) {
      formData.append('source_lang', sourceCode);
    }

    // Make request to DeepL API
    const deeplResponse = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${authKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });

    if (!deeplResponse.ok) {
      const errorText = await deeplResponse.text();
      console.error('DeepL API error:', deeplResponse.status, errorText);
      
      return NextResponse.json(
        { error: `DeepL API error: ${deeplResponse.status} ${deeplResponse.statusText}` },
        { status: deeplResponse.status }
      );
    }

    const data = await deeplResponse.json();
    
    if (!data.translations || data.translations.length === 0) {
      return NextResponse.json(
        { error: 'No translation received from DeepL API' },
        { status: 500 }
      );
    }

    const translation = data.translations[0];
    
    return NextResponse.json({
      translatedText: translation.text,
      sourceLanguageCode: translation.detected_source_language || sourceCode,
      targetLanguageCode: targetCode
    });

  } catch (error) {
    console.error('Translation API error:', error);
    return NextResponse.json(
      { error: 'Internal server error during translation' },
      { status: 500 }
    );
  }
}
