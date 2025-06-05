// API route for AWS Translate
import { NextResponse } from "next/server";
import { TranslateClient, TranslateTextCommand } from "@aws-sdk/client-translate";

export async function POST(request) {
  try {
    const { text, sourceLanguage, targetLanguage } = await request.json();

    // Get AWS configuration
    const region = process.env.NEXT_PUBLIC_AWS_REGION || "us-east-1";
    const accessKeyId = process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID;
    const secretAccessKey = process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY;

    if (!accessKeyId || !secretAccessKey) {
      return NextResponse.json(
        { error: "AWS credentials not configured" },
        { status: 500 }
      );
    }

    if (!text || !text.trim()) {
      return NextResponse.json(
        { error: "Text is required for translation" },
        { status: 400 }
      );
    }

    // Language code mapping for AWS Translate
    const languageCodes = {
      french: "fr",
      spanish: "es",
      german: "de",
      italian: "it",
      portuguese: "pt",
      russian: "ru",
      chinese: "zh",
      japanese: "ja",
      korean: "ko",
      english: "en",
      arabic: "ar",
      hindi: "hi",
      dutch: "nl",
      polish: "pl",
      turkish: "tr",
      swedish: "sv",
      norwegian: "no",
      danish: "da",
      finnish: "fi",
    };

    const getLanguageCode = (language) => {
      return languageCodes[language?.toLowerCase()] || languageCodes.english;
    };

    // Use the target language that was passed in, defaulting to English if none provided
    const targetCode = targetLanguage
      ? getLanguageCode(targetLanguage)
      : languageCodes.english;
    let sourceCode = null;

    // Set source language code if provided, otherwise AWS will auto-detect
    if (sourceLanguage && sourceLanguage !== "auto") {
      sourceCode = getLanguageCode(sourceLanguage);
    }

    // Log translation direction
    console.log(
      `AWS Translate: from ${sourceLanguage} (${sourceCode || "auto"}) to ${targetLanguage} (${targetCode})`
    );

    // Create AWS Translate client
    const translateClient = new TranslateClient({
      region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    // Prepare translation command
    const command = new TranslateTextCommand({
      Text: text,
      TargetLanguageCode: targetCode,
      ...(sourceCode && { SourceLanguageCode: sourceCode }),
    });

    try {
      // Make request to AWS Translate
      const translationResponse = await translateClient.send(command);

      return NextResponse.json({
        translatedText: translationResponse.TranslatedText,
        sourceLanguageCode: translationResponse.SourceLanguageCode,
        targetLanguageCode: targetCode,
      });
    } catch (awsError) {
      console.error("AWS Translate error:", awsError);
      return NextResponse.json(
        {
          error: `AWS Translate error: ${awsError.message || awsError}`,
        },
        { status: awsError.$metadata?.httpStatusCode || 500 }
      );
    }
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json(
      { error: "Internal server error during translation" },
      { status: 500 }
    );
  }
}
