export interface Voice {
  id: string;
  name: string;
  description: string;
  gender: 'male' | 'female' | 'neutral';
  accent?: string;
}

export const voices: Voice[] = [
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
