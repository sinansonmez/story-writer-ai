"use client";
import { Button, ButtonGroup, Textarea } from '@chakra-ui/react';
import { Configuration, OpenAIApi } from 'openai';
import { useState } from 'react'

export default function Home() {
  const [prompt, setPrompt] = useState<string>("");
  const [quoteError, setQuoteError] = useState<string>("");
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
    const defaultInitialPrompt = "You are a tale writer for kids with age between 4-7. Tell me a story which is around 1000 words about this prompt: "
    const response = await openai.createCompletion({
      model: params.model || "text-curie-001",
      prompt: (params.initialPrompt || defaultInitialPrompt) + prompt,
      temperature: 0.5,
      max_tokens: 1500,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
    });
    return response.data.choices[0].text;
  };

  const createImage = async (prompt = "create an image for a tale about animals and one small girl and one small boy") => {
    const shortenedPrompt = await generatePrompts({ prompt, initialPrompt: "Shorten this prompt for dall-e api: " }) || "";
    const response = await openai.createImage({
      prompt: "Create an image for a children tale: " + shortenedPrompt,
      n: 1,
      size: "512x512",
    });
    setImageUrl(response.data.data[0].url || "");
  }

  const handleSubmit = async () => {
    setLoading(true);
    setImageUrl("");
    setApiResponse("");

    try {
      const result = await generatePrompts({ prompt, model: "text-davinci-002" });
      await createImage(result);
      setApiResponse(result || "");
    } catch (e: any) {
      if (e.message == "Request failed with status code 429") {
        setQuoteError("Monthly quota exceeded, please try again next month.")
      }
      setApiResponse('Something went wrong, please try again.');
    }

    setLoading(false);
  };

  const renderImage = () => {
    return image_url ? (
      <div className="flex flex-col items-center justify-center">
        <img alt="image for tale" className='rounded-md mt-8' src={image_url} />
      </div>
    ) : null;
  }

  const renderTale = () => {
    return apiResponse ? (
      <div className="flex flex-col items-center justify-center mt-8">
        {apiResponse}
      </div>
    ) : null;
  }

  const renderSpinner = () => {
    return loading ? (
      <div role="status">
        <svg aria-hidden="true" className="w-20 h-20 mt-20 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-red-500" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor" />
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill" />
        </svg>
        <span className="sr-only">Loading...</span>
      </div>
    ) : null;
  }

  if (quoteError) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-between p-24">
        <div className="flex flex-col items-center justify-center w-full h-full my-auto text-center">
          <h1 className="text-xl font-bold mb-4 text-gray-500">{quoteError}</h1>
          <h1 className="text-3xl font-bold mb-4 text-gray-500">Or support me using the links below to increase the monthly quota</h1>
          <ButtonGroup>
            <Button
              backgroundColor="#FFDD00"
              className='hover:bg-yellow-500 text-black font-bold py-2 px-4 rounded w-64'
              onClick={() => window.open('https://www.buymeacoffee.com/sinans')}
            >
              Buy me a coffee
            </Button>
          </ButtonGroup>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="flex flex-col items-center justify-center w-full">
        <h1 className="text-4xl font-bold mb-4 text-gray-500">Write a short story using AI</h1>
        <p className="text-xl mb-4 text-gray-500">Enter a brief info about the story</p>
        <div className="flex flex-col items-center justify-center w-full">
          <Textarea maxLength={500} className="border border-gray-400 rounded-lg p-2 mb-4 w-full" placeholder='use your imagination...' value={prompt} onChange={(e) => setPrompt(e.target.value)} />
          <Button
            className='bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded w-28'
            onClick={() => handleSubmit()}
            colorScheme='pink'
          >
            Generate
          </Button>
        </div>
        {renderSpinner()}
        {renderImage()}
        {renderTale()}
        <h1 className="text-sm mb-4 text-gray-500 mt-16">Disclaimer: I want to make it clear that I do not take any responsibility for the content generated. Therefore, before reading the content to your children, please read it yourself and decide whether it is appropriate to share with them.</h1>
      </div>
    </main>
  )
}
