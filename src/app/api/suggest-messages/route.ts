    const prompt = ["Generate three open-ended and engaging questions for an anonymous social platform, separated by '||'.  Ensure the questions are diverse in topic and encourage thoughtful, creative responses.  Avoid questions that are too similar to each other.  The questions should be suitable for a diverse audience and promote positive interaction and related to human beings.Make sure this result is different from previous result","Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What’s a hobby you’ve recently started?||If you could have dinner with any historical figure, who would it be?||What’s a simple thing that makes you happy?'. Ensure the questions are intriguing, foster curiosity, and contribute to a positive and welcoming conversational environment and this is joke type.Make sure this result is different from previous result","Generate three open-ended and engaging questions for an anonymous social platform, separated by '||'.  Ensure the questions are diverse in topic and encourage thoughtful, creative responses.  Avoid questions that are too similar to each other.  The questions should be suitable for a diverse audience and promote positive interaction.Make sure this result is different from previous result"];
//     
import { createGoogleGenerativeAI} from '@ai-sdk/google';
import { generateText } from 'ai';
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY || "";

const googleAI = createGoogleGenerativeAI({
  apiKey: GOOGLE_API_KEY, 
});

export async function POST() {
  try {
    
    const { text } = await generateText({
      model: googleAI('gemini-1.5-pro-latest'), 
      prompt: prompt[Math.floor(Math.random() * prompt.length)],
      temperature: 1.0,
      maxTokens: 100,
      topP : 1.0,
      topK : 40
    });
    return new Response(JSON.stringify({messages: text }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    });

  } catch (error) {
    console.error("An unexpected error occurred ", error);

    if (error instanceof Error && error.message.includes("AI_LoadAPIKeyError")) {
      return new Response(JSON.stringify({ error: "Google Generative AI API key is missing or invalid.  Please check your environment variables and configuration." }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ error: "Failed to generate recipe." }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}