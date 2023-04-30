"use client";
import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [apiResponse, setApiResponse] = useState<string>("");
  const [image_url, setImageUrl] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const configuration = new Configuration({
    apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  type PromptParams = {
    prompt: string,
    initialPrompt?: string,
    model?: string
  }

  const generatePrompts = async (params: PromptParams) => {
    const defaultInitialPrompt = "You are a tale writer for kids with age between 4-7. Tell me a story which is around 1000 words about this: "
    const response = await openai.createCompletion({
      model: params.model || "text-curie-001",
      prompt: (params.initialPrompt || defaultInitialPrompt) + prompt,
      temperature: 0.5,
      max_tokens: 300,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response.data.choices[0].text;
  };

  const createImage = async (prompt = "create an image for a tale about animals and one small girl and one small boy") => {
    const shortenedPrompt = await generatePrompts({prompt, initialPrompt: "Shorten this prompt for dall-e api: "}) || "";
    const response = await openai.createImage({
      prompt: "Create an image for a children tale: " + shortenedPrompt,
      n: 1,
      size: "512x512",
    });
    setImageUrl(response.data.data[0].url || "");
  }

  const handleSubmit = async () => {
    setLoading(true);

    try {
      const result = await generatePrompts({prompt, model: "text-davinci-002"});
      createImage(result);
      setApiResponse(result || "");
    } catch (e) {
      setApiResponse('Something went wrong, please try again.');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-4xl font-bold mb-4">Loading</h1>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">OpenAI Playground</h1>
        <p className="text-xl mb-4">Enter a prompt and see what the AI generates!</p>
        <div className="flex flex-col items-center justify-center">
          <textarea className="border border-gray-400 rounded-lg p-2 mb-4" placeholder='enter a prompt...' value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleSubmit()}>Generate</button>
        </div>
      </div>
      {image_url && (
        <div className="flex flex-col items-center justify-center">
          <strong>Image:</strong>
          <div>
            <img src={image_url} />
          </div>
        </div>
      )}
      {apiResponse && (
        <div className="flex flex-col items-center justify-center">
          <strong>API response:</strong>
          {/* create a nice div to hold a response which is a story for kids */}
          <div>
            {apiResponse}
          </div>
        </div>
      )}
    </main>
  )
}
