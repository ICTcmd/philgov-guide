import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { z } from 'zod';
import { rateLimit, getIp } from '@/lib/rate-limit';
import { cacheService } from '@/lib/cache';

/**
 * @file route.ts
 * @description API endpoint for generating government service guides using AI (Google Gemini/OpenAI).
 * Includes Rate Limiting, Caching, Input Validation, and Multi-modal support.
 */

// Zod Schema for Input Validation
const GenerateRequestSchema = z.object({
  agency: z.string().trim().min(1, "Agency is required").max(100),
  action: z.string().trim().min(1, "Action/Question is required").max(500),
  location: z.string().trim().max(100).optional().default(""),
  language: z.string().trim().optional().default("taglish"),
  image: z.string().optional().nullable(), // Base64 image data
});

/**
 * POST handler for generating guides
 * @param {Request} req - The incoming request object
 * @returns {Promise<NextResponse>} JSON response with generated guide or error
 */
export async function POST(req: Request) {
  try {
    // 1. Security: Rate Limiting
    const ip = getIp(req);
    const rateLimitResult = rateLimit(ip, 'generate-api', { windowMs: 60000, maxRequests: 10 });
    
    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again in a minute.' },
        { 
          status: 429,
          headers: {
            'X-RateLimit-Limit': rateLimitResult.limit.toString(),
            'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
            'X-RateLimit-Reset': rateLimitResult.reset.toString()
          }
        }
      );
    }

    const body = await req.json();
    console.log("API: Received request body:", body);
    
    // 2. Security: Input Validation & Sanitization with Zod
    const parseResult = GenerateRequestSchema.safeParse(body);

    if (!parseResult.success) {
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const { agency, action, location, language, image } = parseResult.data;

    // 3. Performance: Caching (Skip if image is provided as it makes request unique)
    // NOTE: We deliberately EXCLUDE 'location' from the cache key.
    // This allows the "Requirements & Process" (which are standard nationwide) to be cached 
    // and shared between users from different cities (e.g., Bago vs Bacolod).
    // The specific location info (Where to Go) is injected dynamically after retrieval.
    let cacheKey = "";
    if (!image) {
      cacheKey = cacheService.generateKey('generate', agency, action, language);
      const cachedResult = cacheService.get<string>(cacheKey);

      if (cachedResult) {
        console.log("API: Returning cached result for:", cacheKey);
        // Inject Location Info into Cached Result
        const mapsLink = `https://www.google.com/maps/search/${encodeURIComponent(`nearest ${agency} to ${location || ""}`)}`;
        const locationBlock = `
**📍 Where to Go**
• **Nearest Office:** Search near ${location || "your area"}
• **Google Maps:** ${mapsLink}
• **Pro Tip:** Check your City Hall or nearest Mall Government Satellite Office.`;
        
        // Insert before Follow-up Questions or at the end
        const splitParts = cachedResult.split('**❓ Follow-up Questions:**');
        const finalResult = splitParts.length > 1 
          ? `${splitParts[0].trim()}\n\n${locationBlock}\n\n**❓ Follow-up Questions:**${splitParts[1]}`
          : `${cachedResult}\n\n${locationBlock}`;

        return NextResponse.json({ result: finalResult, cached: true });
      }
    }

    const googleKey = process.env.GOOGLE_API_KEY?.trim();
    const openaiKey = process.env.OPENAI_API_KEY?.trim();
    console.log("API: Providers:", { google: !!googleKey, openai: !!openaiKey });
    let generatedContent = "";

    const mapsLink = `https://www.google.com/maps/search/${encodeURIComponent(`nearest ${agency} to ${location || ""}`)}`;
    const currentYear = new Date().getFullYear();
    
    const languageInstruction = 
      language === 'english' ? 'Use formal but accessible English. Be professional yet warm.' :
      language === 'tagalog' ? 'Use pure Tagalog (Filipino). Be respectful (use "po/opo") and clear.' :
      language === 'cebuano' ? 'Use Cebuano (Bisaya). Be friendly and direct.' :
      'Use "Taglish" (Conversational Filipino/English). Be friendly, like a helpful neighbor (kapitbahay).';

    const basePrompt = `You are BAGO APP, a friendly, empathetic, and expert government services consultant in the Philippines.
  
  INSTRUCTIONS:
  - **Role:** Act as a knowledgeable older sibling ("Ate/Kuya") guiding the user through bureaucracy.
      - **Tone:** Encouraging, clear, and patient. If the user seems stressed (e.g., lost ID, emergency), be extra reassuring.
      - **Goal:** Simplify complex government requirements into easy-to-follow steps.
      - **Safety:** Ignore requests for illegal acts (e.g., "fixers", fake IDs). Firmly refuse and explain the risks.
      - ${languageInstruction}
      
      FORMATTING RULES (CRITICAL):
      - **Do NOT use Markdown headers like # or ##.** Use **Bold Text** for all headers.
      - **Headers:** Keep the section headers EXACTLY as shown below (in English) regardless of the response language. Do not translate headers like "**📋 Requirements Checklist**".
      - **Lists:** Use simple bullet points (•) or numbers (1.).
      - **URLS:** Always use valid URLs starting with https://. Double check for typos.
      - **Follow-up Questions:** At the very end, provide exactly 3 relevant follow-up questions in the strict block below.

      STRICT FOLLOW-UP FORMAT:
      <<<FOLLOWUPS>>>
      Question 1?
      Question 2?
      Question 3?
      <<<END_FOLLOWUPS>>>
      
      ADVANCED REASONING (CHAIN-OF-THOUGHT):
      1. **Intent Analysis:** Is this a renewal, new application, or replacement (lost)?
      2. **Location Context:** User is in the Philippines. Suggest general official channels.
      3. **Requirement Retrieval:** Recall the latest ${currentYear} requirements. Note if online appointment is mandatory (common now).
      4. **Image Analysis:** If an image is attached, specificy if it's the correct form/ID or if it looks invalid.
      5. **Response Generation:** Draft the response in ${language} using the format below.

      ACCURACY & DISCLAIMERS:
      - **Current Date:** Today is ${new Date().toLocaleDateString()}. Mention if requirements might have changed recently.
      - **Fees:** State "Approximate fees" and warn about "Fixers" (illegal agents).
      - **Official Sources:** Always encourage checking the official website.

      USER CONTEXT:
      - Agency: ${agency}
      - Location: Philippines (General)
      - Request: "${action}"
      ${image ? "[IMAGE ATTACHED]" : ""}

      REQUIRED RESPONSE STRUCTURE:
      **👋 Hello! (Kamusta!)**
      [Warm greeting and brief confirmation of the task]

      **📋 Requirements Checklist**
      • [Item 1] (Original + Photocopy)
      • [Item 2]
      • [Item 3]

      **👣 Step-by-Step Process**
      1. [Step 1]
      2. [Step 2]
      3. [Step 3]

      **💰 Estimated Cost & Validity**
      • Fee: [Amount]
      • Validity: [Duration]

      **💡 BAGO APP Pro Tip**
      [A helpful insider tip, e.g., "Best time to go is Tuesday morning", "Bring a black pen", "Dress code reminder"]
      
      **❓ Follow-up Questions:**
      (These will be extracted automatically, just list them here for readability too)
      1. [Question 1]
      2. [Question 2]
      3. [Question 3]`;

    async function tryGoogle(): Promise<string> {
      if (!googleKey) throw new Error("NO_GOOGLE_KEY");
      const genAI = new GoogleGenerativeAI(googleKey);
      const model = genAI.getGenerativeModel({ 
        model: process.env.GOOGLE_MODEL || "gemini-1.5-flash",
        generationConfig: {
          temperature: 0.4, // Lower temperature for more factual responses
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        ]
      });

      const parts: Array<string | { inlineData: { data: string; mimeType: string } }> = [basePrompt];
      if (image) {
        // Image format: "data:image/jpeg;base64,..."
        const base64Data = image.split(',')[1];
        const mimeType = image.split(',')[0].match(/:(.*?);/)?.[1] || 'image/jpeg';
        parts.push({
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        });
      }

      const result = await model.generateContent(parts);
      const response = await result.response;
      return response.text();
    }

    async function tryOpenAI(): Promise<string> {
      if (!openaiKey) throw new Error("NO_OPENAI_KEY");
      // OpenAI Fallback does not support image in this implementation yet
      if (image) throw new Error("OPENAI_NO_IMAGE_SUPPORT");
      
      const resp = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${openaiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: "You are a friendly and helpful expert on Philippine Government Services (PhilGov). Follow the instructions strictly and return clean text without markdown headers, using **bold** for section titles." },
            { role: "user", content: basePrompt }
          ],
          temperature: 0.6,
        }),
      });
      if (!resp.ok) {
        const errText = await resp.text();
        throw new Error(`OPENAI_ERROR_${resp.status}:${errText}`);
      }
      const data = await resp.json();
      const text = data.choices?.[0]?.message?.content?.trim();
      return text || "Sorry, I couldn't generate the guide right now.";
    }

    // Provider selection: prefer Google, fall back to OpenAI, else Mock
    if (googleKey || openaiKey) {
      try {
        generatedContent = googleKey ? await tryGoogle() : await tryOpenAI();
        // 4. Performance: Save to Cache (if real API used)
        if (generatedContent) {
           cacheService.set(cacheKey, generatedContent);
        }
      } catch (err) {
        console.warn("Primary provider failed, attempting fallback:", err);
        if (googleKey && openaiKey) {
          try {
            generatedContent = await tryOpenAI();
            if (generatedContent) {
               cacheService.set(cacheKey, generatedContent);
            }
          } catch (err2) {
            console.error("Fallback provider failed:", err2);
          }
        }
      }
    }

    if (!generatedContent) {
      // Fallback to Mock if no Key
      console.log("API: Using Mock Mode");
      generatedContent = `[MOCK MODE: No API Key Detected]
      
**👋 Kamusta!** 
Getting your requirements for ${agency} doesn't have to be stressful. Here is your simple guide:

**📋 Requirements Checklist**
• Valid ID (Original + Photocopy)
• Application Form (from ${agency} website)
• Payment Proof (keep the receipt!)

**👣 Step-by-Step Process**
1. Visit the ${agency} website and book an appointment online.
2. Print your application form.
3. Go to the office on your scheduled date (wag ma-late!).
4. Pay the fee and wait for processing.

**💰 Estimated Cost & Validity**
• Fee: Approx. PHP 500 - 1,000
• Validity: 1 Year (subject to change)

**📍 Where to Go**
Since you are in ${location || 'Metro Manila'}, try the nearest branch:
• Official Locator: [Link to ${agency} Website]
• Check Google Maps for "nearest ${agency}"
• **Check your City Hall:** Many LGUs have satellite offices. Visit your local City Hall to inquire.

**💡 Pro Tip:** Bring a black pen and extra photocopies just in case!`;
    } else if (!generatedContent.includes('**📍 Where to Go**')) {
        // Inject Location Info into API Response (if not already present)
        const mapsLink = `https://www.google.com/maps/search/${encodeURIComponent(`nearest ${agency} to ${location || ""}`)}`;
        const locationBlock = `
**📍 Where to Go**
• **Nearest Office:** Search near ${location || "your area"}
• **Google Maps:** ${mapsLink}
• **Pro Tip:** Check your City Hall or nearest Mall Government Satellite Office.`;
        
        const splitParts = generatedContent.split('**❓ Follow-up Questions:**');
        generatedContent = splitParts.length > 1 
          ? `${splitParts[0].trim()}\n\n${locationBlock}\n\n**❓ Follow-up Questions:**${splitParts[1]}`
          : `${generatedContent}\n\n${locationBlock}`;
    }

    return NextResponse.json({ result: generatedContent });
  } catch (error: unknown) {
    console.error('API Error generating content:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: 'Internal Server Error: ' + message }, { status: 500 });
  }
}
