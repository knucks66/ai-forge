export interface StylePreset {
  id: string;
  name: string;
  category: StyleCategory;
  promptPrefix: string;
  promptSuffix: string;
  negativePrompt?: string;
  suggestedCfg?: number;
  color: string;
}

export type StyleCategory = 'none' | 'photography' | 'digital-art' | 'anime' | 'artistic' | 'fantasy' | 'abstract' | 'vintage' | '3d' | 'cinematic';

export const styleCategories: { id: StyleCategory; name: string }[] = [
  { id: 'none', name: 'None' },
  { id: 'photography', name: 'Photography' },
  { id: 'digital-art', name: 'Digital Art' },
  { id: 'anime', name: 'Anime & Manga' },
  { id: 'artistic', name: 'Artistic' },
  { id: 'fantasy', name: 'Fantasy' },
  { id: 'abstract', name: 'Abstract' },
  { id: 'vintage', name: 'Vintage' },
  { id: '3d', name: '3D Render' },
  { id: 'cinematic', name: 'Cinematic' },
];

export const stylePresets: StylePreset[] = [
  // None
  { id: 'none', name: 'No Style', category: 'none', promptPrefix: '', promptSuffix: '', color: '#6b7280' },

  // Photography (10)
  { id: 'photo-realistic', name: 'Photorealistic', category: 'photography', promptPrefix: 'photorealistic photograph of', promptSuffix: ', ultra-detailed, 8k, sharp focus, professional photography', negativePrompt: 'cartoon, illustration, painting, drawing', suggestedCfg: 7, color: '#3b82f6' },
  { id: 'portrait-photo', name: 'Portrait', category: 'photography', promptPrefix: 'professional portrait photograph of', promptSuffix: ', studio lighting, shallow depth of field, bokeh, 85mm lens', negativePrompt: 'cartoon, distorted, ugly', suggestedCfg: 7, color: '#2563eb' },
  { id: 'landscape-photo', name: 'Landscape', category: 'photography', promptPrefix: 'stunning landscape photograph of', promptSuffix: ', golden hour, dramatic lighting, wide angle, National Geographic style', negativePrompt: 'people, text, watermark', suggestedCfg: 7, color: '#1d4ed8' },
  { id: 'street-photo', name: 'Street', category: 'photography', promptPrefix: 'street photography of', promptSuffix: ', candid, urban, dynamic composition, Leica style', color: '#1e40af' },
  { id: 'macro-photo', name: 'Macro', category: 'photography', promptPrefix: 'macro photograph of', promptSuffix: ', extreme close-up, detailed texture, shallow depth of field, professional macro lens', color: '#1e3a8a' },
  { id: 'aerial-photo', name: 'Aerial/Drone', category: 'photography', promptPrefix: 'aerial drone photograph of', promptSuffix: ', birds eye view, stunning perspective, high resolution', color: '#60a5fa' },
  { id: 'bw-photo', name: 'Black & White', category: 'photography', promptPrefix: 'black and white photograph of', promptSuffix: ', high contrast, dramatic shadows, film grain, Ansel Adams style', color: '#4b5563' },
  { id: 'food-photo', name: 'Food', category: 'photography', promptPrefix: 'professional food photography of', promptSuffix: ', appetizing, styled, soft lighting, shallow depth of field', color: '#f59e0b' },
  { id: 'fashion-photo', name: 'Fashion', category: 'photography', promptPrefix: 'high fashion editorial photograph of', promptSuffix: ', Vogue style, dramatic lighting, glamorous', color: '#ec4899' },
  { id: 'wildlife-photo', name: 'Wildlife', category: 'photography', promptPrefix: 'wildlife photograph of', promptSuffix: ', natural habitat, telephoto lens, National Geographic, sharp detail', color: '#22c55e' },

  // Digital Art (8)
  { id: 'digital-art', name: 'Digital Art', category: 'digital-art', promptPrefix: 'digital art of', promptSuffix: ', vibrant colors, detailed, trending on ArtStation', negativePrompt: 'photo, realistic', suggestedCfg: 8, color: '#8b5cf6' },
  { id: 'concept-art', name: 'Concept Art', category: 'digital-art', promptPrefix: 'concept art of', promptSuffix: ', professional, matte painting, cinematic, trending on ArtStation', suggestedCfg: 8, color: '#7c3aed' },
  { id: 'pixel-art', name: 'Pixel Art', category: 'digital-art', promptPrefix: 'pixel art of', promptSuffix: ', 16-bit, retro game style, detailed sprites, nostalgic', suggestedCfg: 9, color: '#6d28d9' },
  { id: 'vector-art', name: 'Vector Art', category: 'digital-art', promptPrefix: 'vector illustration of', promptSuffix: ', clean lines, flat design, modern, scalable', color: '#5b21b6' },
  { id: 'lowpoly', name: 'Low Poly', category: 'digital-art', promptPrefix: 'low poly art of', promptSuffix: ', geometric, minimalist, colorful facets, 3D render', color: '#4c1d95' },
  { id: 'isometric', name: 'Isometric', category: 'digital-art', promptPrefix: 'isometric illustration of', promptSuffix: ', detailed, colorful, game asset style, clean', color: '#a78bfa' },
  { id: 'comic-book', name: 'Comic Book', category: 'digital-art', promptPrefix: 'comic book art of', promptSuffix: ', bold lines, dynamic action, halftone dots, Marvel style', color: '#c084fc' },
  { id: 'sticker', name: 'Sticker', category: 'digital-art', promptPrefix: 'sticker design of', promptSuffix: ', die-cut, white border, kawaii, cute, simple background', color: '#e879f9' },

  // Anime (8)
  { id: 'anime', name: 'Anime', category: 'anime', promptPrefix: 'anime style illustration of', promptSuffix: ', highly detailed, vibrant, beautiful lighting, anime key visual', negativePrompt: 'photo, realistic, 3d', suggestedCfg: 8, color: '#f43f5e' },
  { id: 'manga', name: 'Manga', category: 'anime', promptPrefix: 'manga panel of', promptSuffix: ', black and white, detailed linework, screentone, dramatic', color: '#e11d48' },
  { id: 'chibi', name: 'Chibi', category: 'anime', promptPrefix: 'chibi style illustration of', promptSuffix: ', cute, big eyes, small body, kawaii, pastel colors', color: '#be185d' },
  { id: 'ghibli', name: 'Studio Ghibli', category: 'anime', promptPrefix: 'Studio Ghibli style art of', promptSuffix: ', Hayao Miyazaki, whimsical, warm colors, detailed background', color: '#9d174d' },
  { id: 'shonen', name: 'Shonen', category: 'anime', promptPrefix: 'shonen anime style of', promptSuffix: ', dynamic action pose, energy effects, intense, dramatic', color: '#831843' },
  { id: 'watercolor-anime', name: 'Watercolor Anime', category: 'anime', promptPrefix: 'watercolor anime illustration of', promptSuffix: ', soft colors, flowing, ethereal, beautiful, delicate', color: '#fb7185' },
  { id: 'retro-anime', name: 'Retro Anime', category: 'anime', promptPrefix: '90s retro anime style of', promptSuffix: ', cel shading, VHS aesthetic, classic anime, nostalgic', color: '#fda4af' },
  { id: 'cyberpunk-anime', name: 'Cyberpunk Anime', category: 'anime', promptPrefix: 'cyberpunk anime illustration of', promptSuffix: ', neon lights, futuristic city, Ghost in the Shell style, detailed', color: '#fecdd3' },

  // Artistic (8)
  { id: 'oil-painting', name: 'Oil Painting', category: 'artistic', promptPrefix: 'oil painting of', promptSuffix: ', rich colors, textured brushstrokes, classical technique, museum quality', suggestedCfg: 7, color: '#d97706' },
  { id: 'watercolor', name: 'Watercolor', category: 'artistic', promptPrefix: 'watercolor painting of', promptSuffix: ', soft washes, fluid, delicate, transparent layers, artistic', color: '#b45309' },
  { id: 'impressionist', name: 'Impressionist', category: 'artistic', promptPrefix: 'impressionist painting of', promptSuffix: ', in the style of Monet, visible brushstrokes, light and color, plein air', color: '#92400e' },
  { id: 'pop-art', name: 'Pop Art', category: 'artistic', promptPrefix: 'pop art of', promptSuffix: ', bold colors, Andy Warhol style, screen print, graphic, iconic', color: '#78350f' },
  { id: 'art-nouveau', name: 'Art Nouveau', category: 'artistic', promptPrefix: 'art nouveau illustration of', promptSuffix: ', organic flowing lines, Alphonse Mucha style, decorative, ornate', color: '#fbbf24' },
  { id: 'sketch', name: 'Pencil Sketch', category: 'artistic', promptPrefix: 'detailed pencil sketch of', promptSuffix: ', graphite, shading, realistic drawing, fine lines, on paper', color: '#fcd34d' },
  { id: 'charcoal', name: 'Charcoal', category: 'artistic', promptPrefix: 'charcoal drawing of', promptSuffix: ', dramatic, expressive, bold strokes, textured paper', color: '#fde68a' },
  { id: 'surrealism', name: 'Surrealism', category: 'artistic', promptPrefix: 'surrealist painting of', promptSuffix: ', Salvador Dali style, dreamlike, impossible, melting, strange, thought-provoking', color: '#fef3c7' },

  // Fantasy (7)
  { id: 'fantasy-art', name: 'Epic Fantasy', category: 'fantasy', promptPrefix: 'epic fantasy art of', promptSuffix: ', magical, grand scale, detailed, dramatic lighting, D&D style', suggestedCfg: 8, color: '#059669' },
  { id: 'dark-fantasy', name: 'Dark Fantasy', category: 'fantasy', promptPrefix: 'dark fantasy art of', promptSuffix: ', gothic, ominous, moody atmosphere, detailed, Berserk style', color: '#047857' },
  { id: 'fairy-tale', name: 'Fairy Tale', category: 'fantasy', promptPrefix: 'fairy tale illustration of', promptSuffix: ', enchanted, whimsical, magical forest, storybook style, dreamy', color: '#065f46' },
  { id: 'steampunk', name: 'Steampunk', category: 'fantasy', promptPrefix: 'steampunk art of', promptSuffix: ', Victorian era, brass gears, clockwork, steam-powered, intricate machinery', color: '#064e3b' },
  { id: 'mythological', name: 'Mythological', category: 'fantasy', promptPrefix: 'mythological artwork of', promptSuffix: ', ancient legends, divine, majestic, classical composition', color: '#34d399' },
  { id: 'sci-fi', name: 'Sci-Fi', category: 'fantasy', promptPrefix: 'science fiction art of', promptSuffix: ', futuristic, space, advanced technology, cinematic, detailed', color: '#6ee7b7' },
  { id: 'post-apocalyptic', name: 'Post-Apocalyptic', category: 'fantasy', promptPrefix: 'post-apocalyptic art of', promptSuffix: ', ruins, overgrown, survival, atmospheric, gritty, detailed', color: '#a7f3d0' },

  // Abstract (6)
  { id: 'abstract', name: 'Abstract', category: 'abstract', promptPrefix: 'abstract art of', promptSuffix: ', non-representational, colors and shapes, expressive, modern art', suggestedCfg: 10, color: '#06b6d4' },
  { id: 'geometric-abstract', name: 'Geometric', category: 'abstract', promptPrefix: 'geometric abstract art of', promptSuffix: ', precise shapes, mathematical patterns, Kandinsky style, colorful', color: '#0891b2' },
  { id: 'fluid-art', name: 'Fluid Art', category: 'abstract', promptPrefix: 'fluid art of', promptSuffix: ', acrylic pour, marble effect, swirling colors, organic patterns', color: '#0e7490' },
  { id: 'fractal', name: 'Fractal', category: 'abstract', promptPrefix: 'fractal art of', promptSuffix: ', mathematical beauty, infinite detail, psychedelic, mesmerizing patterns', color: '#155e75' },
  { id: 'minimal-abstract', name: 'Minimalist', category: 'abstract', promptPrefix: 'minimalist abstract art of', promptSuffix: ', simple, clean, negative space, limited palette, elegant', color: '#164e63' },
  { id: 'psychedelic', name: 'Psychedelic', category: 'abstract', promptPrefix: 'psychedelic art of', promptSuffix: ', trippy, vivid neon colors, swirling patterns, 1960s style, mind-bending', color: '#22d3ee' },

  // Vintage (5)
  { id: 'vintage-photo', name: 'Vintage Photo', category: 'vintage', promptPrefix: 'vintage photograph of', promptSuffix: ', aged, sepia tone, film grain, nostalgic, old camera, faded', suggestedCfg: 7, color: '#a16207' },
  { id: 'retro-50s', name: '1950s Retro', category: 'vintage', promptPrefix: '1950s retro style illustration of', promptSuffix: ', mid-century modern, atomic age, pastel colors, vintage advertisement', color: '#854d0e' },
  { id: 'art-deco', name: 'Art Deco', category: 'vintage', promptPrefix: 'art deco illustration of', promptSuffix: ', 1920s style, geometric, gold and black, elegant, glamorous', color: '#713f12' },
  { id: 'victorian', name: 'Victorian', category: 'vintage', promptPrefix: 'Victorian era illustration of', promptSuffix: ', engraving style, detailed, ornate border, antique, sepia', color: '#78716c' },
  { id: 'polaroid', name: 'Polaroid', category: 'vintage', promptPrefix: 'polaroid photograph of', promptSuffix: ', instant film, washed out colors, white border, casual, nostalgic', color: '#57534e' },

  // 3D (5)
  { id: '3d-render', name: '3D Render', category: '3d', promptPrefix: '3D render of', promptSuffix: ', octane render, high quality, photorealistic lighting, detailed textures, 4k', suggestedCfg: 7, color: '#0ea5e9' },
  { id: 'clay-render', name: 'Clay Render', category: '3d', promptPrefix: 'clay render of', promptSuffix: ', soft material, matte, studio lighting, minimalist, 3D art', color: '#0284c7' },
  { id: 'voxel', name: 'Voxel Art', category: '3d', promptPrefix: 'voxel art of', promptSuffix: ', 3D pixel art, Minecraft style, colorful blocks, cute, detailed', color: '#0369a1' },
  { id: 'unreal-engine', name: 'Unreal Engine', category: '3d', promptPrefix: 'Unreal Engine 5 render of', promptSuffix: ', photorealistic, nanite, lumen global illumination, ray tracing, AAA quality', color: '#075985' },
  { id: 'blender', name: 'Blender Style', category: '3d', promptPrefix: 'Blender 3D render of', promptSuffix: ', cycles renderer, volumetric lighting, detailed materials, professional', color: '#0c4a6e' },

  // Cinematic (6)
  { id: 'cinematic', name: 'Cinematic', category: 'cinematic', promptPrefix: 'cinematic shot of', promptSuffix: ', anamorphic lens, dramatic lighting, film grain, movie still, atmospheric', suggestedCfg: 7, color: '#dc2626' },
  { id: 'noir', name: 'Film Noir', category: 'cinematic', promptPrefix: 'film noir shot of', promptSuffix: ', black and white, high contrast, dramatic shadows, 1940s detective style, moody', color: '#b91c1c' },
  { id: 'horror', name: 'Horror', category: 'cinematic', promptPrefix: 'horror movie shot of', promptSuffix: ', dark, eerie, unsettling atmosphere, fog, dramatic lighting, creepy', color: '#991b1b' },
  { id: 'scifi-movie', name: 'Sci-Fi Movie', category: 'cinematic', promptPrefix: 'sci-fi movie still of', promptSuffix: ', futuristic set design, blue and orange color grading, Blade Runner style, atmospheric', color: '#7f1d1d' },
  { id: 'documentary', name: 'Documentary', category: 'cinematic', promptPrefix: 'documentary still of', promptSuffix: ', natural lighting, authentic, raw, journalistic, compelling storytelling', color: '#ef4444' },
  { id: 'music-video', name: 'Music Video', category: 'cinematic', promptPrefix: 'music video still of', promptSuffix: ', stylized, colored lighting, artistic, creative direction, visually striking', color: '#f87171' },
];
