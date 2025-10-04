export default async function handler(request, response) {
  // Only allow POST requests
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Get the user's prompt from the request body
  const userPayload = request.body;

  if (!userPayload) {
    return response.status(400).json({ message: 'Bad Request: Missing body' });
  }

  try {
    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPayload), // Forward the user's payload
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error('Gemini API Error:', errorText);
      return response.status(geminiResponse.status).json({ message: `Gemini API Error: ${errorText}` });
    }

    const data = await geminiResponse.json();
    // Send the response from Gemini back to the frontend
    return response.status(200).json(data);

  } catch (error) {
    console.error('Server error:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}
