import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

export const ai = apiKey ? new GoogleGenAI({ apiKey }) : null;

export const getMovieRecommendations = async (userPreferences: string, availableMovies: string) => {
  if (!ai) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a movie recommendation expert for a platform called Supreme. 
      Based on the user's preferred genres or movies: "${userPreferences}", 
      recommend the top 3 movies from this available list: "${availableMovies}".
      Return the answer in JSON format as an array of movie IDs.
      Example: ["1", "4", "5"]`,
      config: {
        responseMimeType: "application/json"
      }
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Gemini Error:", error);
    return [];
  }
};
