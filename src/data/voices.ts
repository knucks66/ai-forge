export interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  accent?: string;
}

export const openaiVoices: Voice[] = [
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced', gender: 'neutral' },
  { id: 'echo', name: 'Echo', description: 'Warm and conversational', gender: 'male' },
  { id: 'fable', name: 'Fable', description: 'Expressive and dynamic', gender: 'neutral' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative', gender: 'male' },
  { id: 'nova', name: 'Nova', description: 'Friendly and upbeat', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer', description: 'Clear and energetic', gender: 'female' },
  { id: 'coral', name: 'Coral', description: 'Calm and soothing', gender: 'female' },
  { id: 'verse', name: 'Verse', description: 'Versatile storyteller', gender: 'neutral' },
  { id: 'ballad', name: 'Ballad', description: 'Melodic and flowing', gender: 'female' },
  { id: 'ash', name: 'Ash', description: 'Crisp and professional', gender: 'male' },
  { id: 'sage', name: 'Sage', description: 'Wise and measured', gender: 'neutral' },
  { id: 'ember', name: 'Ember', description: 'Warm and inviting', gender: 'female' },
  { id: 'vale', name: 'Vale', description: 'Smooth and relaxed', gender: 'male' },
  { id: 'breeze', name: 'Breeze', description: 'Light and airy', gender: 'female' },
  { id: 'cove', name: 'Cove', description: 'Deep and resonant', gender: 'male' },
  { id: 'maple', name: 'Maple', description: 'Sweet and gentle', gender: 'female' },
  { id: 'orbit', name: 'Orbit', description: 'Modern and sleek', gender: 'neutral' },
  { id: 'reef', name: 'Reef', description: 'Rich and textured', gender: 'male' },
  { id: 'spruce', name: 'Spruce', description: 'Clean and direct', gender: 'male' },
  { id: 'lark', name: 'Lark', description: 'Bright and cheerful', gender: 'female' },
];

/** ElevenLabs voices - includes shared voices + exclusive ones */
export const elevenlabsVoices: Voice[] = [
  // Shared with OpenAI
  { id: 'alloy', name: 'Alloy', description: 'Neutral and balanced', gender: 'neutral' },
  { id: 'echo', name: 'Echo', description: 'Warm and conversational', gender: 'male' },
  { id: 'fable', name: 'Fable', description: 'Expressive and dynamic', gender: 'neutral' },
  { id: 'onyx', name: 'Onyx', description: 'Deep and authoritative', gender: 'male' },
  { id: 'nova', name: 'Nova', description: 'Friendly and upbeat', gender: 'female' },
  { id: 'shimmer', name: 'Shimmer', description: 'Clear and energetic', gender: 'female' },
  { id: 'ash', name: 'Ash', description: 'Crisp and professional', gender: 'male' },
  { id: 'ballad', name: 'Ballad', description: 'Melodic and flowing', gender: 'female' },
  { id: 'coral', name: 'Coral', description: 'Calm and soothing', gender: 'female' },
  { id: 'sage', name: 'Sage', description: 'Wise and measured', gender: 'neutral' },
  { id: 'verse', name: 'Verse', description: 'Versatile storyteller', gender: 'neutral' },
  // ElevenLabs exclusive
  { id: 'rachel', name: 'Rachel', description: 'Warm and natural', gender: 'female' },
  { id: 'domi', name: 'Domi', description: 'Strong and confident', gender: 'female' },
  { id: 'bella', name: 'Bella', description: 'Soft and pleasant', gender: 'female' },
  { id: 'elli', name: 'Elli', description: 'Young and articulate', gender: 'female' },
  { id: 'charlotte', name: 'Charlotte', description: 'Elegant and refined', gender: 'female' },
  { id: 'dorothy', name: 'Dorothy', description: 'Warm and friendly', gender: 'female' },
  { id: 'sarah', name: 'Sarah', description: 'Soft and calm', gender: 'female' },
  { id: 'emily', name: 'Emily', description: 'Bright and engaging', gender: 'female' },
  { id: 'lily', name: 'Lily', description: 'Sweet and gentle', gender: 'female' },
  { id: 'matilda', name: 'Matilda', description: 'Clear and warm', gender: 'female' },
  { id: 'adam', name: 'Adam', description: 'Deep and narrating', gender: 'male' },
  { id: 'antoni', name: 'Antoni', description: 'Well-rounded and clear', gender: 'male' },
  { id: 'arnold', name: 'Arnold', description: 'Strong and commanding', gender: 'male' },
  { id: 'josh', name: 'Josh', description: 'Young and energetic', gender: 'male' },
  { id: 'sam', name: 'Sam', description: 'Raspy and engaging', gender: 'male' },
  { id: 'daniel', name: 'Daniel', description: 'Deep and authoritative', gender: 'male' },
  { id: 'charlie', name: 'Charlie', description: 'Casual and natural', gender: 'male' },
  { id: 'james', name: 'James', description: 'Deep and rich', gender: 'male' },
  { id: 'fin', name: 'Fin', description: 'Sharp and precise', gender: 'male' },
  { id: 'callum', name: 'Callum', description: 'Smooth and refined', gender: 'male' },
  { id: 'liam', name: 'Liam', description: 'Friendly and warm', gender: 'male' },
  { id: 'george', name: 'George', description: 'Classic and dignified', gender: 'male' },
  { id: 'brian', name: 'Brian', description: 'Deep and resonant', gender: 'male' },
  { id: 'bill', name: 'Bill', description: 'Strong and clear', gender: 'male' },
];

/** Backward-compatible default export */
export const voices = openaiVoices;

/** Get the voice list for a specific model */
export function getVoicesForModel(modelId: string): Voice[] {
  switch (modelId) {
    case 'elevenlabs':
      return elevenlabsVoices;
    case 'openai-audio':
    default:
      return openaiVoices;
  }
}
