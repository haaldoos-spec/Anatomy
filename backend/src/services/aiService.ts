import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResponse = async (messages: any[], language: string = 'en') => {
  const systemPrompt = language === 'sv' 
    ? 'Du är en hjälpsam och kunnig anatomi-tutor. Förklara svåra koncept på ett enkelt språk.' 
    : 'You are a helpful and knowledgeable human anatomy tutor. Explain difficult concepts in plain, easy-to-understand language.';

  try {
    if (!process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY === 'your_openai_api_key') {
      console.log('Using mock AI response');
      return language === 'sv' 
        ? 'Detta är ett exempelsvar från din AI-handledare. För att få riktiga svar, vänligen konfigurera en giltig OpenAI API-nyckel.' 
        : 'This is a mock response from your AI Tutor. To get real responses, please configure a valid OpenAI API key.';
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo', // or gpt-4
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error('Error calling OpenAI:', error);
    throw new Error('Failed to generate AI response');
  }
};
