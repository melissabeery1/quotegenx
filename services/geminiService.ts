import { GoogleGenAI, Modality, Type } from "@google/genai";
import { QuoteOptions, ImageOptions, JourneyItem, JourneyType } from '../types';

const API_KEY = process.env.API_KEY;
if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}
const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-2.5-flash';
const imageGenModel = 'gemini-2.5-flash-image';
const imageEditModel = 'gemini-2.5-flash-image';

export const generateQuote = async (options: QuoteOptions): Promise<string> => {
  let prompt: string;
  let useJsonSchema = false;

  const selectedSources: { type: string, name: string }[] = [];
  if (options.usePhilosopher) selectedSources.push({ type: 'philosopher', name: options.philosopher });
  if (options.useModernThinker) selectedSources.push({ type: 'modern thinker', name: options.modernThinker });
  if (options.useLuminary) selectedSources.push({ type: 'luminary', name: options.luminary });
  if (options.useRebel) selectedSources.push({ type: 'rebel', name: options.rebel });
  if (options.useMystic) selectedSources.push({ type: 'mystic and manifestor', name: options.mystic });
  if (options.useStrategicMind) selectedSources.push({ type: 'strategic mind', name: options.strategicMind });
  if (options.useAuthor) selectedSources.push({ type: 'author and storyteller', name: options.author });

  const moodLine = options.mood !== 'I Feel Lucky' ? `The quote should fit the mood: "${options.mood}".` : '';

  if (selectedSources.length === 1) {
    const source = selectedSources[0];
    prompt = `Your task is to provide a single, real, verifiable quote from the ${source.type} named "${source.name}".

**CRITICAL RULES:**
1.  **AUTHENTICITY IS PARAMOUNT:** The quote MUST be a real, widely-known, and attributable quote from "${source.name}". Do not provide a quote that is merely 'in the style of' them or misattributed from another thinker.
2.  **NO GENERATION FOR KNOWN FIGURES:** You are FORBIDDEN from generating a new quote for a well-known figure like "${source.name}".
3.  **BREVITY:** The quote must be concise, ideally under 25 words.
4.  **MOOD:** ${moodLine}

**OUTPUT FORMAT:**
Your response MUST be a JSON object with this exact structure:
{
  "quote": "The verbatim quote text here, without any quotation marks around it in the string value.",
  "found": boolean (true if a real quote was found, false if not)
}

If you cannot find a real, verifiable quote that fits the criteria, you MUST set "found" to false and "quote" to an empty string. DO NOT invent a quote.`;
    useJsonSchema = true;

  } else if (selectedSources.length > 1) {
    const sourceList = selectedSources.map((s, i) => `Style ${i + 1} is inspired by the ideas of the ${s.type}: "${s.name}".`).join('\n');
    prompt = `Generate a short, impactful, and brand-new quote that merges multiple distinct styles. This new quote should not be a real quote from any of the thinkers.
${moodLine}
${sourceList}
Blend these styles to create a unique and thought-provoking quote.
The quote should be no more than 25 words.
Return only the new quote text itself, without any quotation marks or attributions.`;

  } else {
    prompt = `Generate a short, impactful quote with an inspirational mood. The quote should be no more than 25 words. Return only the quote text itself.`;
  }

  const request: any = {
    model: textModel,
    contents: prompt,
  };

  if (useJsonSchema) {
    request.config = {
      responseMimeType: "application/json",
      responseSchema: {
          type: Type.OBJECT,
          properties: {
              quote: {
                  type: Type.STRING,
                  description: "The quote text, or an empty string if not found."
              },
              found: {
                  type: Type.BOOLEAN,
                  description: "True if a real quote was found, false if not."
              }
          },
          required: ["quote", "found"]
      }
    };
  }

  const response = await ai.models.generateContent(request);
  
  if (!response.text || response.text.trim() === '') {
      console.error("AI returned an empty response for prompt:", prompt);
      throw new Error("Sorry, I couldn't generate a quote right now. The AI returned an empty response.");
  }

  if (useJsonSchema) {
    try {
        const result = JSON.parse(response.text);

        if (!result || typeof result.found !== 'boolean') {
             throw new Error("The AI returned an unexpected format. Please try again.");
        }

        if (result.found && result.quote && typeof result.quote === 'string' && result.quote.trim() !== '') {
            const source = selectedSources[0];
            return `${result.quote.trim()} - ${source.name}`;
        } else {
            const sourceName = selectedSources.length > 0 ? selectedSources[0].name : 'the selected thinker';
            const moodClause = options.mood !== 'I Feel Lucky' ? ` for the mood "${options.mood}"` : '';
            throw new Error(`Could not find a verifiable quote for ${sourceName}${moodClause}. Please try a different mood or thinker.`);
        }
    } catch (e) {
        if (e instanceof Error) {
            if (e.message.startsWith('Could not find') || e.message.startsWith('The AI returned an unexpected format')) {
                throw e;
            }
        }
        console.error("Failed to parse JSON for quote or handle the response. Error:", e, "Raw response:", response.text);
        throw new Error("The AI's response could not be processed. Please try again.");
    }
  } else {
      const quoteText = response.text.trim();
      if (!quoteText) {
          console.warn("AI returned an empty or whitespace-only quote. Raw response:", response.text);
          return "Sorry, I couldn't generate a quote right now. Please try again.";
      }
      return quoteText;
  }
};


export const generateImage = async (options: ImageOptions, quoteText?: string): Promise<string> => {
    let thematicInspiration = '';

    if (quoteText) {
        const keywordPrompt = `You are an AI assistant for an image generator. Your task is to distill the visual essence and mood of a quote into a short list of keywords. These keywords will be used to create a background image.
        - The keywords should be purely descriptive and visual (e.g., "serene mountain vista, golden sunrise, misty valley, sense of peace").
        - DO NOT include the quote itself or any words from it.
        - Provide 5-10 keywords separated by commas.
        
        Quote: "${quoteText}"
        
        Keywords:`;

        const keywordResponse = await ai.models.generateContent({
            model: textModel,
            contents: keywordPrompt,
        });
        
        thematicInspiration = keywordResponse.text.trim();
    }

    let finalPrompt = `Generate a visually stunning, artistic, high-resolution background image with a ${options.aspectRatio} aspect ratio. The image should be beautiful and captivating, suitable for placing text over.\n`;
    
    const aestheticParts = [];
    if (options.backdrop !== 'None') {
        aestheticParts.push(`Style: ${options.backdrop}`);
    }

    if (options.colorScheme !== 'None') aestheticParts.push(`Color Palette: ${options.colorScheme}`);
    if (aestheticParts.length > 0) {
        finalPrompt += `Aesthetic guidance: ${aestheticParts.join(', ')}.\n`;
    }

    if (options.prompt) {
        finalPrompt += `User's direct description: "${options.prompt}".\n`;
    }
    
    if (thematicInspiration) {
        finalPrompt += `Thematic inspiration (do not write these words, use them for visual ideas): ${thematicInspiration}.\n`;
    }

    finalPrompt += `\nCRITICAL INSTRUCTIONS: The final image must NOT contain any text, words, letters, numbers, or typography. It must be a clean, beautiful background. Avoid generating any characters or text.`;



 const response = await ai.models.generateContent({
  model: imageGenModel,
  contents: [{ role: "user", parts: [{ text: finalPrompt }] }],
  config: { responseModalities: [Modality.IMAGE] },
});

const base64ImageBytes: string =
  response.candidates[0].content.parts[0].inlineData.data;

return `data:image/jpeg;base64,${base64ImageBytes}`;
};


export const editImage = async (file: File, options: ImageOptions): Promise<string> => {
    const fileToGenerativePart = async (file: File) => {
        const base64EncodedData = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
          reader.readAsDataURL(file);
        });
        return {
          inlineData: { data: base64EncodedData, mimeType: file.type },
        };
    };
    
    const imagePart = await fileToGenerativePart(file);
    
    const edits = [];
    if (options.colorScheme !== 'None') edits.push(`Color Scheme: ${options.colorScheme}.`);
    if (options.backdrop !== 'None') edits.push(`Aesthetic Style: ${options.backdrop}.`);
    
    if (options.prompt) {
        const sanitizationPrompt = `You are an AI assistant for an image editor. A user has provided instructions to edit an image. Rephrase these instructions into purely visual descriptions, removing any direct quotes or commands to write text.
        
        Original instructions: "${options.prompt}"
        
        Rephrased visual description:`;
        
        const sanitizedResponse = await ai.models.generateContent({
            model: textModel,
            contents: sanitizationPrompt,
        });
        const userPromptForEdit = sanitizedResponse.text.trim();
        edits.push(`Additional visual details to add or change: ${userPromptForEdit}.`);
    }
    
    if (edits.length === 0) {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });
    }

    const textPrompt = `You are an expert photo editor. Your task is to apply a new aesthetic to the provided image based on specific instructions.
CRITICAL RULE: NEVER add any text, words, letters, or typography to the image. Your output must be a clean image with no writing on it.

Instructions for editing the image:
${edits.join('\n')}

Remember the CRITICAL RULE: Modify the image visually but add NO text.`;

    const response = await ai.models.generateContent({
        model: imageEditModel,
        contents: {
          parts: [ imagePart, { text: textPrompt } ],
        },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            const base64ImageBytes: string = part.inlineData.data;
            return `data:${part.inlineData.mimeType};base64,${base64ImageBytes}`;
        }
    }

    throw new Error("No image was edited or returned.");
};


export const generateJourneyVariations = async (baseQuote: string, quoteOptions: QuoteOptions, imageOptions: ImageOptions, journeyType: JourneyType): Promise<Omit<JourneyItem, 'style'>[]> => {
    
    if (journeyType === 'visual') {
        const imagePromises = Array(4).fill(null).map(() => generateImage(imageOptions, baseQuote));
        const newImages = await Promise.all(imagePromises);
        return newImages.map(image => ({
            quote: baseQuote,
            image: image,
        }));
    }
    
    const selectedSources: { type: string, name: string }[] = [];
    if (quoteOptions.usePhilosopher) selectedSources.push({ type: 'philosopher', name: quoteOptions.philosopher });
    if (quoteOptions.useModernThinker) selectedSources.push({ type: 'modern thinker', name: quoteOptions.modernThinker });
    if (quoteOptions.useLuminary) selectedSources.push({ type: 'luminary', name: quoteOptions.luminary });
    if (quoteOptions.useRebel) selectedSources.push({ type: 'rebel', name: quoteOptions.rebel });
    if (quoteOptions.useMystic) selectedSources.push({ type: 'mystic and manifestor', name: quoteOptions.mystic });
    if (quoteOptions.useStrategicMind) selectedSources.push({ type: 'strategic mind', name: quoteOptions.strategicMind });
    if (quoteOptions.useAuthor) selectedSources.push({ type: 'author and storyteller', name: quoteOptions.author });
    
    const moodInstruction = quoteOptions.mood !== 'I Feel Lucky' ? `Mood: "${quoteOptions.mood}"` : '';
    const isSingleSource = selectedSources.length === 1;
    const delimiter = "|||";

    let creativeDirection = '';
    switch(journeyType) {
        case 'poetic':
            creativeDirection = 'The new quotes must be more poetic, lyrical, and metaphorical.';
            break;
        case 'direct':
            creativeDirection = 'The new quotes must be more direct, punchy, and actionable.';
            break;
        case 'wildcard':
        default:
            creativeDirection = 'The new quotes should maintain the original\'s tone but offer fresh perspectives.';
            break;
    }

    let prompt;
    if (isSingleSource) {
        const source = selectedSources[0];
        prompt = `Your task is to generate 4 new, distinct quotes in the style of the ${source.type} named "${source.name}".
Original Quote for thematic context (do not repeat it): "${baseQuote}"
${moodInstruction}
${creativeDirection}
Each quote must be plausible for the thinker but should be a new creation.
Each quote must be no more than 25 words.
Return ONLY the 4 quotes, each separated by "${delimiter}". Do not include numbers, bullet points, or any other formatting.`;
    } else {
        const sourceList = selectedSources.length > 1 
            ? `inspired by the following thinkers: ${selectedSources.map(s => `"${s.name}" (${s.type})`).join(', ')}`
            : 'that explore similar themes';
        prompt = `Based on the provided creative direction, generate 4 new, distinct, BRAND-NEW quotes ${sourceList}.
Original Quote for thematic context (do not repeat it): "${baseQuote}"
${moodInstruction}
${creativeDirection}
The new quotes should not be real quotes from any of the thinkers.
Each quote must be no more than 25 words.
Return ONLY the 4 quotes, each separated by "${delimiter}". Do not include numbers, bullet points, or any other formatting.`;
    }

    const quoteResponse = await ai.models.generateContent({
        model: textModel,
        contents: prompt,
    });

    const responseText = quoteResponse.text.trim();
    if (!responseText) {
        throw new Error("AI did not return any quote variations.");
    }
    
    const rawQuotes = responseText.split(delimiter).map(q => q.trim()).filter(Boolean);
    if (rawQuotes.length === 0) {
        console.warn("AI response for journey was empty or malformed:", responseText);
        throw new Error("Could not generate quote variations in the expected format.");
    }

    const newQuotesForImageGen = rawQuotes.slice(0, 4);
    
    const journeyItems: Omit<JourneyItem, 'style'>[] = newQuotesForImageGen.map(rawQuote => {
        let finalQuote = rawQuote;
        if (isSingleSource) {
            const source = selectedSources[0];
            finalQuote = `${rawQuote} (Inspired by ${source.name})`;
        }
        return { quote: finalQuote, image: '' };
    });

    const imagePromises = newQuotesForImageGen.map(quote => generateImage(imageOptions, quote));
    const newImages = await Promise.all(imagePromises);
    
    journeyItems.forEach((item, index) => {
        if (newImages[index]) {
            item.image = newImages[index];
        }
    });

    return journeyItems;
};