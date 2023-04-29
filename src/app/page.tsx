"use client";
import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react'
import axios from 'axios'

export default function Home() {
  const [prompt, setPrompt] = useState("Once upon a time");

  const generatePrompts = async (prompt: string) => {
    console.log("Generating prompts")
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: 0,
      max_tokens: 1000,
      top_p: 1.0,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });

    console.log(response.data.choices[0].text);

    return response.data.choices[0].text;
  };


  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center">
        <h1 className="text-4xl font-bold mb-4">OpenAI Playground</h1>
        <p className="text-xl mb-4">Enter a prompt and see what the AI generates!</p>
        <div className="flex flex-col items-center justify-center">
          <textarea className="border border-gray-400 rounded-lg p-2 mb-4" value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => generatePrompts(prompt)}>Generate</button>
        </div>
      </div>
    </main>
  )
}
