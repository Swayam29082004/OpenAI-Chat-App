import "dotenv/config";
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Get response from OpenAI API
 * @param {string|Array} input - Either a single user message (string) or full messages array
 */
const getOpenAIAPIResponse = async (input) => {
  try {
    const messages =
      typeof input === "string"
        ? [{ role: "user", content: input }]
        : input; // support both single string & full chat array

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini", // lightweight, cheaper model
      messages,
    });

    return response.choices[0].message.content;
  } catch (err) {
    console.error("❌ OpenAI API Error:", err.message);
    return "Sorry, something went wrong while contacting the AI.";
  }
};

export default getOpenAIAPIResponse;
