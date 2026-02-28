const NSFW_KEYWORDS = [
  'nsfw', 'nude', 'naked', 'explicit', 'pornographic', 'hentai',
  'erotic', 'topless', 'bondage', 'lingerie', 'sexual', 'xxx',
  'adult content', 'r-rated', 'r18',
];

export function detectNsfwPrompt(prompt: string): boolean {
  const lower = prompt.toLowerCase();
  return NSFW_KEYWORDS.some((kw) => lower.includes(kw));
}

export function isNsfwPreset(presetId: string, presets: { id: string; nsfw?: boolean }[]): boolean {
  const preset = presets.find((p) => p.id === presetId);
  return preset?.nsfw === true;
}
