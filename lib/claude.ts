/**
 * Claude AI client — scaffolded for Post-MVP AI Support Chat.
 *
 * The Anthropic SDK must only be used server-side (Supabase Edge Function).
 * This file provides the client-side API call helper that hits your
 * Supabase Edge Function, which in turn calls the Anthropic API.
 */

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

/**
 * Send a message to the AI support chat.
 * Calls a Supabase Edge Function that proxies to Claude.
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  sessionId: string
): Promise<string> {
  const response = await fetch(
    `${process.env.EXPO_PUBLIC_SUPABASE_URL}/functions/v1/ai-chat`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY}`,
      },
      body: JSON.stringify({ messages, sessionId }),
    }
  );
  if (!response.ok) throw new Error('Chat request failed');
  const data = await response.json();
  return data.reply as string;
}
