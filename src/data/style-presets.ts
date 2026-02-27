export interface StylePreset {
  id: string;
  name: string;
  category: StyleCategory;
  promptPrefix: string;
  promptSuffix: string;
  negativePrompt?: string;
  suggestedCfg?: number;
  color: string;
  nsfw?: boolean;
}

export type StyleCategory =
  | 'none' | 'photography' | 'digital-art' | 'anime' | 'artistic'
  | 'fantasy' | 'abstract' | 'vintage' | '3d' | 'cinematic'
  | 'illustration' | 'cultural' | 'craft-paper' | 'street-urban' | 'game-art' | 'architecture'
  | 'nsfw';

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
  { id: 'illustration', name: 'Illustration' },
  { id: 'cultural', name: 'Cultural' },
  { id: 'craft-paper', name: 'Craft & Paper' },
  { id: 'street-urban', name: 'Street & Urban' },
  { id: 'game-art', name: 'Game Art' },
  { id: 'architecture', name: 'Architecture' },
  { id: 'nsfw', name: 'NSFW 🔞' },
];

export const stylePresets: StylePreset[] = [
  // None (1)
  { id: 'none', name: 'No Style', category: 'none', promptPrefix: '', promptSuffix: '', color: '#6b7280' },

  // Photography (20)
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
  { id: 'long-exposure', name: 'Long Exposure', category: 'photography', promptPrefix: 'long exposure photograph of', promptSuffix: ', light trails, silky smooth water, motion blur, tripod, ethereal', suggestedCfg: 7, color: '#1e3a8a' },
  { id: 'tilt-shift', name: 'Tilt-Shift', category: 'photography', promptPrefix: 'tilt-shift photograph of', promptSuffix: ', miniature effect, selective focus, toy-like, vivid colors', color: '#3b82f6' },
  { id: 'infrared-photo', name: 'Infrared', category: 'photography', promptPrefix: 'infrared photograph of', promptSuffix: ', false color, white foliage, surreal, dark sky, dreamlike', negativePrompt: 'normal colors, cartoon', color: '#991b1b' },
  { id: 'astrophotography', name: 'Astrophotography', category: 'photography', promptPrefix: 'astrophotography of', promptSuffix: ', Milky Way, star trails, deep sky, long exposure, NASA style', suggestedCfg: 7, color: '#1e1b4b' },
  { id: 'double-exposure', name: 'Double Exposure', category: 'photography', promptPrefix: 'double exposure photograph of', promptSuffix: ', film overlay, merged images, silhouette, creative composite', color: '#6d28d9' },
  { id: 'hdr-photo', name: 'HDR', category: 'photography', promptPrefix: 'HDR photograph of', promptSuffix: ', high dynamic range, vivid colors, enhanced detail, dramatic contrast, tone-mapped', suggestedCfg: 7, color: '#0369a1' },
  { id: 'silhouette-photo', name: 'Silhouette', category: 'photography', promptPrefix: 'silhouette photograph of', promptSuffix: ', backlit, dramatic outline, sunset background, high contrast, minimal', color: '#1c1917' },
  { id: 'analog-film', name: 'Analog Film', category: 'photography', promptPrefix: 'analog film photograph of', promptSuffix: ', faded film, desaturated, 35mm, grainy, vignette, vintage, Kodachrome, Lomography', negativePrompt: 'digital, clean, modern', suggestedCfg: 7, color: '#78716c' },
  { id: 'architectural-photo', name: 'Architectural', category: 'photography', promptPrefix: 'architectural photograph of', promptSuffix: ', leading lines, symmetry, dramatic perspective, professional, magazine quality', color: '#475569' },
  { id: 'sports-photo', name: 'Sports/Action', category: 'photography', promptPrefix: 'sports action photograph of', promptSuffix: ', frozen motion, dynamic, high shutter speed, dramatic moment, sharp focus', suggestedCfg: 7, color: '#dc2626' },

  // Digital Art (16)
  { id: 'digital-art', name: 'Digital Art', category: 'digital-art', promptPrefix: 'digital art of', promptSuffix: ', vibrant colors, detailed, trending on ArtStation', negativePrompt: 'photo, realistic', suggestedCfg: 8, color: '#8b5cf6' },
  { id: 'concept-art', name: 'Concept Art', category: 'digital-art', promptPrefix: 'concept art of', promptSuffix: ', professional, matte painting, cinematic, trending on ArtStation', suggestedCfg: 8, color: '#7c3aed' },
  { id: 'pixel-art', name: 'Pixel Art', category: 'digital-art', promptPrefix: 'pixel art of', promptSuffix: ', 16-bit, retro game style, detailed sprites, nostalgic', suggestedCfg: 9, color: '#6d28d9' },
  { id: 'vector-art', name: 'Vector Art', category: 'digital-art', promptPrefix: 'vector illustration of', promptSuffix: ', clean lines, flat design, modern, scalable', color: '#5b21b6' },
  { id: 'lowpoly', name: 'Low Poly', category: 'digital-art', promptPrefix: 'low poly art of', promptSuffix: ', geometric, minimalist, colorful facets, 3D render', color: '#4c1d95' },
  { id: 'isometric', name: 'Isometric', category: 'digital-art', promptPrefix: 'isometric illustration of', promptSuffix: ', detailed, colorful, game asset style, clean', color: '#a78bfa' },
  { id: 'comic-book', name: 'Comic Book', category: 'digital-art', promptPrefix: 'comic book art of', promptSuffix: ', bold lines, dynamic action, halftone dots, Marvel style', color: '#c084fc' },
  { id: 'sticker', name: 'Sticker', category: 'digital-art', promptPrefix: 'sticker design of', promptSuffix: ', die-cut, white border, kawaii, cute, simple background', color: '#e879f9' },
  { id: 'glitch-art', name: 'Glitch Art', category: 'digital-art', promptPrefix: 'glitch art of', promptSuffix: ', data corruption, pixel sorting, RGB shift, digital artifacts, distorted', suggestedCfg: 9, color: '#dc2626' },
  { id: 'vaporwave', name: 'Vaporwave', category: 'digital-art', promptPrefix: 'vaporwave art of', promptSuffix: ', pastel pink and cyan, retro 90s aesthetic, Greek statues, palm trees, sunset gradient, lo-fi', color: '#ec4899' },
  { id: 'neon-art', name: 'Neon Art', category: 'digital-art', promptPrefix: 'neon art of', promptSuffix: ', glowing neon tubes, vivid fluorescent colors, dark background, electric, light emission', suggestedCfg: 8, color: '#f0abfc' },
  { id: 'line-art', name: 'Line Art', category: 'digital-art', promptPrefix: 'line art drawing of', promptSuffix: ', professional, sleek, modern, minimalist, graphic, vector graphics, clean lines', negativePrompt: 'photorealistic, painting, blurry', color: '#a855f7' },
  { id: 'synthwave', name: 'Synthwave', category: 'digital-art', promptPrefix: 'synthwave art of', promptSuffix: ', retrowave, neon grid, chrome, sunset gradient, outrun, 1980s futurism', suggestedCfg: 8, color: '#7c3aed' },
  { id: 'flat-design', name: 'Flat Design', category: 'digital-art', promptPrefix: 'flat design illustration of', promptSuffix: ', minimal shadows, clean shapes, bold colors, modern UI style, simple geometric', color: '#6366f1' },
  { id: 'neon-punk', name: 'Neon Punk', category: 'digital-art', promptPrefix: 'neonpunk style art of', promptSuffix: ', cyberpunk, vaporwave, vibrant, magenta highlights, dark purple shadows, ultramodern', suggestedCfg: 9, color: '#d946ef' },
  { id: 'hyperrealism', name: 'Hyperrealism', category: 'digital-art', promptPrefix: 'hyperrealistic painting of', promptSuffix: ', indistinguishable from photograph, extreme detail, meticulous brushwork, photorealist school', negativePrompt: 'cartoon, sketch, abstract', suggestedCfg: 7, color: '#4338ca' },

  // Anime & Manga (14)
  { id: 'anime', name: 'Anime', category: 'anime', promptPrefix: 'anime style illustration of', promptSuffix: ', highly detailed, vibrant, beautiful lighting, anime key visual', negativePrompt: 'photo, realistic, 3d', suggestedCfg: 8, color: '#f43f5e' },
  { id: 'manga', name: 'Manga', category: 'anime', promptPrefix: 'manga panel of', promptSuffix: ', black and white, detailed linework, screentone, dramatic', color: '#e11d48' },
  { id: 'chibi', name: 'Chibi', category: 'anime', promptPrefix: 'chibi style illustration of', promptSuffix: ', cute, big eyes, small body, kawaii, pastel colors', color: '#be185d' },
  { id: 'ghibli', name: 'Studio Ghibli', category: 'anime', promptPrefix: 'Studio Ghibli style art of', promptSuffix: ', Hayao Miyazaki, whimsical, warm colors, detailed background', color: '#9d174d' },
  { id: 'shonen', name: 'Shonen', category: 'anime', promptPrefix: 'shonen anime style of', promptSuffix: ', dynamic action pose, energy effects, intense, dramatic', color: '#831843' },
  { id: 'watercolor-anime', name: 'Watercolor Anime', category: 'anime', promptPrefix: 'watercolor anime illustration of', promptSuffix: ', soft colors, flowing, ethereal, beautiful, delicate', color: '#fb7185' },
  { id: 'retro-anime', name: 'Retro Anime', category: 'anime', promptPrefix: '90s retro anime style of', promptSuffix: ', cel shading, VHS aesthetic, classic anime, nostalgic', color: '#fda4af' },
  { id: 'cyberpunk-anime', name: 'Cyberpunk Anime', category: 'anime', promptPrefix: 'cyberpunk anime illustration of', promptSuffix: ', neon lights, futuristic city, Ghost in the Shell style, detailed', color: '#fecdd3' },
  { id: 'disney-2d', name: '2D Disney', category: 'anime', promptPrefix: '2D Disney animation style of', promptSuffix: ', classic Disney character design, expressive eyes, cel shading, warm colors, magical', negativePrompt: '3d, photorealistic', suggestedCfg: 8, color: '#2563eb' },
  { id: 'visual-novel', name: 'Visual Novel', category: 'anime', promptPrefix: 'visual novel CG of', promptSuffix: ', dating sim style, detailed background, beautiful character, soft lighting, anime game art', color: '#db2777' },
  { id: 'manhwa', name: 'Manhwa / Webtoon', category: 'anime', promptPrefix: 'manhwa webtoon style of', promptSuffix: ', Korean comic, vertical scroll style, clean lines, vibrant colors, modern anime', color: '#e11d48' },
  { id: 'magical-girl', name: 'Magical Girl', category: 'anime', promptPrefix: 'magical girl anime of', promptSuffix: ', transformation sequence, sparkles, pastel colors, ribbons, Sailor Moon style, whimsical', suggestedCfg: 8, color: '#f472b6' },
  { id: 'mecha', name: 'Mecha', category: 'anime', promptPrefix: 'mecha anime art of', promptSuffix: ', giant robot, Gundam style, mechanical detail, dynamic pose, metallic, dramatic', suggestedCfg: 8, color: '#6b7280' },
  { id: 'dark-anime', name: 'Dark Anime', category: 'anime', promptPrefix: 'dark anime illustration of', promptSuffix: ', gritty, mature themes, detailed shadows, atmospheric, Berserk style, intense', negativePrompt: 'cute, bright, chibi', suggestedCfg: 8, color: '#1f2937' },

  // Artistic (18)
  { id: 'oil-painting', name: 'Oil Painting', category: 'artistic', promptPrefix: 'oil painting of', promptSuffix: ', rich colors, textured brushstrokes, classical technique, museum quality', suggestedCfg: 7, color: '#d97706' },
  { id: 'watercolor', name: 'Watercolor', category: 'artistic', promptPrefix: 'watercolor painting of', promptSuffix: ', soft washes, fluid, delicate, transparent layers, artistic', color: '#b45309' },
  { id: 'impressionist', name: 'Impressionist', category: 'artistic', promptPrefix: 'impressionist painting of', promptSuffix: ', in the style of Monet, visible brushstrokes, light and color, plein air', color: '#92400e' },
  { id: 'pop-art', name: 'Pop Art', category: 'artistic', promptPrefix: 'pop art of', promptSuffix: ', bold colors, Andy Warhol style, screen print, graphic, iconic', color: '#78350f' },
  { id: 'art-nouveau', name: 'Art Nouveau', category: 'artistic', promptPrefix: 'art nouveau illustration of', promptSuffix: ', organic flowing lines, Alphonse Mucha style, decorative, ornate', color: '#fbbf24' },
  { id: 'sketch', name: 'Pencil Sketch', category: 'artistic', promptPrefix: 'detailed pencil sketch of', promptSuffix: ', graphite, shading, realistic drawing, fine lines, on paper', color: '#fcd34d' },
  { id: 'charcoal', name: 'Charcoal', category: 'artistic', promptPrefix: 'charcoal drawing of', promptSuffix: ', dramatic, expressive, bold strokes, textured paper', color: '#fde68a' },
  { id: 'surrealism', name: 'Surrealism', category: 'artistic', promptPrefix: 'surrealist painting of', promptSuffix: ', Salvador Dali style, dreamlike, impossible, melting, strange, thought-provoking', color: '#fef3c7' },
  { id: 'cubism', name: 'Cubism', category: 'artistic', promptPrefix: 'cubist painting of', promptSuffix: ', Picasso style, geometric fragmentation, multiple perspectives, angular, bold colors', suggestedCfg: 9, color: '#b45309' },
  { id: 'pointillism', name: 'Pointillism', category: 'artistic', promptPrefix: 'pointillist painting of', promptSuffix: ', tiny dots of color, Seurat style, optical mixing, vibrant, Neo-Impressionism', suggestedCfg: 8, color: '#a16207' },
  { id: 'expressionism', name: 'Expressionism', category: 'artistic', promptPrefix: 'expressionist painting of', promptSuffix: ', distorted form, emotional intensity, bold brushstrokes, Munch style, raw, dramatic', color: '#ca8a04' },
  { id: 'baroque', name: 'Baroque', category: 'artistic', promptPrefix: 'baroque painting of', promptSuffix: ', dramatic chiaroscuro, Caravaggio style, rich dark background, theatrical lighting, grandeur', suggestedCfg: 7, color: '#713f12' },
  { id: 'renaissance', name: 'Renaissance', category: 'artistic', promptPrefix: 'Renaissance painting of', promptSuffix: ', da Vinci style, sfumato, anatomical precision, classical composition, golden ratio', suggestedCfg: 7, color: '#854d0e' },
  { id: 'gouache', name: 'Gouache', category: 'artistic', promptPrefix: 'gouache painting of', promptSuffix: ', opaque watercolor, matte finish, flat areas of color, velvety texture, vibrant pigments', color: '#eab308' },
  { id: 'pastels', name: 'Pastels', category: 'artistic', promptPrefix: 'pastel drawing of', promptSuffix: ', soft chalky texture, blended colors, gentle, dreamy, on textured paper, delicate', color: '#fde68a' },
  { id: 'acrylic', name: 'Acrylic', category: 'artistic', promptPrefix: 'acrylic painting of', promptSuffix: ', thick impasto, vibrant pigment, textured canvas, bold, contemporary, gallery quality', suggestedCfg: 8, color: '#d97706' },
  { id: 'fauvism', name: 'Fauvism', category: 'artistic', promptPrefix: 'fauvist painting of', promptSuffix: ', wild bold colors, Henri Matisse style, simplified forms, non-naturalistic color, expressive', suggestedCfg: 9, color: '#f59e0b' },
  { id: 'ink-wash', name: 'Ink Wash', category: 'artistic', promptPrefix: 'ink wash painting of', promptSuffix: ', sumi-e technique, black ink gradients, rice paper, minimalist, flowing brushstrokes, zen', negativePrompt: 'colorful, digital', color: '#292524' },

  // Fantasy (14)
  { id: 'fantasy-art', name: 'Epic Fantasy', category: 'fantasy', promptPrefix: 'epic fantasy art of', promptSuffix: ', magical, grand scale, detailed, dramatic lighting, D&D style', suggestedCfg: 8, color: '#059669' },
  { id: 'dark-fantasy', name: 'Dark Fantasy', category: 'fantasy', promptPrefix: 'dark fantasy art of', promptSuffix: ', gothic, ominous, moody atmosphere, detailed, Berserk style', color: '#047857' },
  { id: 'fairy-tale', name: 'Fairy Tale', category: 'fantasy', promptPrefix: 'fairy tale illustration of', promptSuffix: ', enchanted, whimsical, magical forest, storybook style, dreamy', color: '#065f46' },
  { id: 'steampunk', name: 'Steampunk', category: 'fantasy', promptPrefix: 'steampunk art of', promptSuffix: ', Victorian era, brass gears, clockwork, steam-powered, intricate machinery', color: '#064e3b' },
  { id: 'mythological', name: 'Mythological', category: 'fantasy', promptPrefix: 'mythological artwork of', promptSuffix: ', ancient legends, divine, majestic, classical composition', color: '#34d399' },
  { id: 'sci-fi', name: 'Sci-Fi', category: 'fantasy', promptPrefix: 'science fiction art of', promptSuffix: ', futuristic, space, advanced technology, cinematic, detailed', color: '#6ee7b7' },
  { id: 'post-apocalyptic', name: 'Post-Apocalyptic', category: 'fantasy', promptPrefix: 'post-apocalyptic art of', promptSuffix: ', ruins, overgrown, survival, atmospheric, gritty, detailed', color: '#a7f3d0' },
  { id: 'solarpunk', name: 'Solarpunk', category: 'fantasy', promptPrefix: 'solarpunk art of', promptSuffix: ', lush green cities, solar panels, sustainable future, art nouveau architecture, utopian', color: '#16a34a' },
  { id: 'dieselpunk', name: 'Dieselpunk', category: 'fantasy', promptPrefix: 'dieselpunk art of', promptSuffix: ', 1940s industrial, diesel machinery, noir atmosphere, riveted metal, war-era technology', color: '#78716c' },
  { id: 'cosmic-horror', name: 'Cosmic Horror', category: 'fantasy', promptPrefix: 'cosmic horror art of', promptSuffix: ', Lovecraftian, eldritch, incomprehensible entity, tentacles, non-Euclidean geometry, dread', negativePrompt: 'cute, bright, cheerful', suggestedCfg: 9, color: '#1e1b4b' },
  { id: 'dreamscape', name: 'Dreamscape', category: 'fantasy', promptPrefix: 'dreamscape art of', promptSuffix: ', surreal floating islands, impossible geometry, ethereal light, dreamy atmosphere, fantasy landscape', suggestedCfg: 9, color: '#818cf8' },
  { id: 'dystopian', name: 'Dystopian', category: 'fantasy', promptPrefix: 'dystopian art of', promptSuffix: ', bleak future, industrial decay, oppressive atmosphere, totalitarian, desaturated, Orwellian', suggestedCfg: 8, color: '#374151' },
  { id: 'gothic', name: 'Gothic', category: 'fantasy', promptPrefix: 'gothic art of', promptSuffix: ', dark cathedral, gargoyles, moonlit, ornate, dark romance, medieval darkness, dramatic', suggestedCfg: 8, color: '#1f2937' },
  { id: 'space-opera', name: 'Space Opera', category: 'fantasy', promptPrefix: 'space opera art of', promptSuffix: ', epic galactic scene, massive starships, nebulae, space battles, Star Wars scale, cinematic', suggestedCfg: 8, color: '#312e81' },

  // Abstract (10)
  { id: 'abstract', name: 'Abstract', category: 'abstract', promptPrefix: 'abstract art of', promptSuffix: ', non-representational, colors and shapes, expressive, modern art', suggestedCfg: 10, color: '#06b6d4' },
  { id: 'geometric-abstract', name: 'Geometric', category: 'abstract', promptPrefix: 'geometric abstract art of', promptSuffix: ', precise shapes, mathematical patterns, Kandinsky style, colorful', color: '#0891b2' },
  { id: 'fluid-art', name: 'Fluid Art', category: 'abstract', promptPrefix: 'fluid art of', promptSuffix: ', acrylic pour, marble effect, swirling colors, organic patterns', color: '#0e7490' },
  { id: 'fractal', name: 'Fractal', category: 'abstract', promptPrefix: 'fractal art of', promptSuffix: ', mathematical beauty, infinite detail, psychedelic, mesmerizing patterns', color: '#155e75' },
  { id: 'minimal-abstract', name: 'Minimalist', category: 'abstract', promptPrefix: 'minimalist abstract art of', promptSuffix: ', simple, clean, negative space, limited palette, elegant', color: '#164e63' },
  { id: 'psychedelic', name: 'Psychedelic', category: 'abstract', promptPrefix: 'psychedelic art of', promptSuffix: ', trippy, vivid neon colors, swirling patterns, 1960s style, mind-bending', color: '#22d3ee' },
  { id: 'op-art', name: 'Op Art', category: 'abstract', promptPrefix: 'op art of', promptSuffix: ', optical illusion, Bridget Riley style, geometric, visual vibration, precise lines', suggestedCfg: 10, color: '#083344' },
  { id: 'color-field', name: 'Color Field', category: 'abstract', promptPrefix: 'color field painting of', promptSuffix: ', Rothko style, large blocks of color, soft edges, meditative, emotional depth', suggestedCfg: 10, color: '#0e7490' },
  { id: 'zentangle', name: 'Zentangle', category: 'abstract', promptPrefix: 'zentangle art of', promptSuffix: ', intricate patterns, meditative drawing, black ink on white, repetitive strokes, mandala-like', suggestedCfg: 9, color: '#115e59' },
  { id: 'generative-art', name: 'Generative Art', category: 'abstract', promptPrefix: 'generative art of', promptSuffix: ', algorithmic patterns, code-generated, mathematical beauty, Processing style, emergent complexity', suggestedCfg: 10, color: '#0d9488' },

  // Vintage (12)
  { id: 'vintage-photo', name: 'Vintage Photo', category: 'vintage', promptPrefix: 'vintage photograph of', promptSuffix: ', aged, sepia tone, film grain, nostalgic, old camera, faded', suggestedCfg: 7, color: '#a16207' },
  { id: 'retro-50s', name: '1950s Retro', category: 'vintage', promptPrefix: '1950s retro style illustration of', promptSuffix: ', mid-century modern, atomic age, pastel colors, vintage advertisement', color: '#854d0e' },
  { id: 'art-deco', name: 'Art Deco', category: 'vintage', promptPrefix: 'art deco illustration of', promptSuffix: ', 1920s style, geometric, gold and black, elegant, glamorous', color: '#713f12' },
  { id: 'victorian', name: 'Victorian', category: 'vintage', promptPrefix: 'Victorian era illustration of', promptSuffix: ', engraving style, detailed, ornate border, antique, sepia', color: '#78716c' },
  { id: 'polaroid', name: 'Polaroid', category: 'vintage', promptPrefix: 'polaroid photograph of', promptSuffix: ', instant film, washed out colors, white border, casual, nostalgic', color: '#57534e' },
  { id: 'daguerreotype', name: 'Daguerreotype', category: 'vintage', promptPrefix: 'daguerreotype photograph of', promptSuffix: ', earliest photography, silver plate, mirror-like, 1840s, slightly blurred, ornate frame', negativePrompt: 'modern, color, digital', suggestedCfg: 7, color: '#78716c' },
  { id: '80s-retro', name: '80s Retro', category: 'vintage', promptPrefix: '80s retro style art of', promptSuffix: ', synthwave colors, neon grid, chrome text, sunset gradient, VHS aesthetic, Miami Vice', color: '#e879f9' },
  { id: 'soviet-poster', name: 'Soviet Poster', category: 'vintage', promptPrefix: 'Soviet propaganda poster of', promptSuffix: ', constructivist, bold red and black, geometric, heroic figure, strong diagonal, monumental', suggestedCfg: 9, color: '#dc2626' },
  { id: 'analog-vintage', name: 'Analog Film', category: 'vintage', promptPrefix: 'vintage analog film still of', promptSuffix: ', faded colors, film grain, light leak, 35mm, retro, cinematic, nostalgic', negativePrompt: 'digital, sharp, modern', suggestedCfg: 7, color: '#a8a29e' },
  { id: 'pin-up', name: 'Pin-Up', category: 'vintage', promptPrefix: 'vintage pin-up illustration of', promptSuffix: ', 1950s Americana, glamorous, Gil Elvgren style, bold colors, retro advertising', color: '#f43f5e' },
  { id: 'grunge', name: 'Grunge', category: 'vintage', promptPrefix: 'grunge style art of', promptSuffix: ', dirty textures, distressed, torn paper, gritty, 1990s aesthetic, raw, punk', color: '#57534e' },
  { id: 'medieval-manuscript', name: 'Medieval Manuscript', category: 'vintage', promptPrefix: 'medieval illuminated manuscript of', promptSuffix: ', gold leaf borders, decorated initial letters, parchment, Book of Hours style, calligraphy', suggestedCfg: 8, color: '#92400e' },

  // 3D Render (10)
  { id: '3d-render', name: '3D Render', category: '3d', promptPrefix: '3D render of', promptSuffix: ', octane render, high quality, photorealistic lighting, detailed textures, 4k', suggestedCfg: 7, color: '#0ea5e9' },
  { id: 'clay-render', name: 'Clay Render', category: '3d', promptPrefix: 'clay render of', promptSuffix: ', soft material, matte, studio lighting, minimalist, 3D art', color: '#0284c7' },
  { id: 'voxel', name: 'Voxel Art', category: '3d', promptPrefix: 'voxel art of', promptSuffix: ', 3D pixel art, Minecraft style, colorful blocks, cute, detailed', color: '#0369a1' },
  { id: 'unreal-engine', name: 'Unreal Engine', category: '3d', promptPrefix: 'Unreal Engine 5 render of', promptSuffix: ', photorealistic, nanite, lumen global illumination, ray tracing, AAA quality', color: '#075985' },
  { id: 'blender', name: 'Blender Style', category: '3d', promptPrefix: 'Blender 3D render of', promptSuffix: ', cycles renderer, volumetric lighting, detailed materials, professional', color: '#0c4a6e' },
  { id: 'wireframe', name: 'Wireframe', category: '3d', promptPrefix: 'wireframe 3D render of', promptSuffix: ', polygon mesh, no textures, grid lines, glowing edges, blueprint style, technical', negativePrompt: 'solid, textured, photo', color: '#38bdf8' },
  { id: 'glass-crystal', name: 'Glass / Crystal', category: '3d', promptPrefix: '3D glass sculpture render of', promptSuffix: ', transparent crystal, refractive, caustics, prismatic colors, subsurface scattering', suggestedCfg: 7, color: '#7dd3fc' },
  { id: 'miniature-diorama', name: 'Miniature/Diorama', category: '3d', promptPrefix: 'miniature diorama of', promptSuffix: ', tiny detailed scene, tilt-shift depth, tabletop scale, handcrafted look, museum quality', suggestedCfg: 8, color: '#06b6d4' },
  { id: 'holographic', name: 'Holographic', category: '3d', promptPrefix: 'holographic 3D render of', promptSuffix: ', iridescent, rainbow refraction, chrome, floating, futuristic display, transparent', suggestedCfg: 8, color: '#a78bfa' },
  { id: 'paper-mache-3d', name: 'Paper Mache', category: '3d', promptPrefix: 'paper mache 3D render of', promptSuffix: ', textured paper surface, handmade, colorful, layered strips, craft project, whimsical', suggestedCfg: 8, color: '#fb923c' },

  // Cinematic (12)
  { id: 'cinematic', name: 'Cinematic', category: 'cinematic', promptPrefix: 'cinematic shot of', promptSuffix: ', anamorphic lens, dramatic lighting, film grain, movie still, atmospheric', suggestedCfg: 7, color: '#dc2626' },
  { id: 'noir', name: 'Film Noir', category: 'cinematic', promptPrefix: 'film noir shot of', promptSuffix: ', black and white, high contrast, dramatic shadows, 1940s detective style, moody', color: '#b91c1c' },
  { id: 'horror', name: 'Horror', category: 'cinematic', promptPrefix: 'horror movie shot of', promptSuffix: ', dark, eerie, unsettling atmosphere, fog, dramatic lighting, creepy', color: '#991b1b' },
  { id: 'scifi-movie', name: 'Sci-Fi Movie', category: 'cinematic', promptPrefix: 'sci-fi movie still of', promptSuffix: ', futuristic set design, blue and orange color grading, Blade Runner style, atmospheric', color: '#7f1d1d' },
  { id: 'documentary', name: 'Documentary', category: 'cinematic', promptPrefix: 'documentary still of', promptSuffix: ', natural lighting, authentic, raw, journalistic, compelling storytelling', color: '#ef4444' },
  { id: 'music-video', name: 'Music Video', category: 'cinematic', promptPrefix: 'music video still of', promptSuffix: ', stylized, colored lighting, artistic, creative direction, visually striking', color: '#f87171' },
  { id: 'wes-anderson', name: 'Wes Anderson', category: 'cinematic', promptPrefix: 'Wes Anderson style film still of', promptSuffix: ', perfectly symmetrical, pastel palette, whimsical, meticulous set design, centered framing', suggestedCfg: 8, color: '#fda4af' },
  { id: 'western', name: 'Western', category: 'cinematic', promptPrefix: 'western movie still of', promptSuffix: ', Sergio Leone style, dusty desert, golden hour, dramatic wide shot, rugged, anamorphic', color: '#a16207' },
  { id: 'anime-film', name: 'Anime Film', category: 'cinematic', promptPrefix: 'anime film still of', promptSuffix: ', Makoto Shinkai style, stunning sky, vivid light rays, cinematic, painterly background', suggestedCfg: 8, color: '#fb7185' },
  { id: 'neon-noir', name: 'Neon Noir', category: 'cinematic', promptPrefix: 'neon noir shot of', promptSuffix: ', rain-soaked streets, neon reflections, cyberpunk detective, saturated highlights, dark shadows', suggestedCfg: 8, color: '#7e22ce' },
  { id: 'disco-70s', name: '70s Disco', category: 'cinematic', promptPrefix: '1970s disco era film still of', promptSuffix: ', groovy, warm film tones, bell bottoms, disco lights, Saturday Night Fever, funky', color: '#f59e0b' },
  { id: 'silhouette-cinema', name: 'Silhouette', category: 'cinematic', promptPrefix: 'cinematic silhouette shot of', promptSuffix: ', dramatic backlit outline, golden hour, minimal, powerful composition, shadow art', color: '#0c0a09' },

  // Illustration (10)
  { id: 'book-illustration', name: 'Book Illustration', category: 'illustration', promptPrefix: 'book illustration of', promptSuffix: ', hand-drawn, detailed linework, warm tones, storybook art, narrative composition', negativePrompt: 'photo, 3d render', suggestedCfg: 8, color: '#c2410c' },
  { id: 'editorial-illustration', name: 'Editorial', category: 'illustration', promptPrefix: 'editorial illustration of', promptSuffix: ', conceptual, bold composition, magazine quality, sophisticated, metaphorical imagery', color: '#ea580c' },
  { id: 'childrens-book', name: "Children's Book", category: 'illustration', promptPrefix: "children's book illustration of", promptSuffix: ', whimsical, soft colors, friendly, rounded shapes, gentle, playful, watercolor and ink', negativePrompt: 'scary, dark, violent', suggestedCfg: 8, color: '#f97316' },
  { id: 'ink-pen', name: 'Ink & Pen', category: 'illustration', promptPrefix: 'ink and pen illustration of', promptSuffix: ', black ink on white paper, crosshatching, stipple technique, precise linework', negativePrompt: 'color, digital, blurry', color: '#431407' },
  { id: 'woodcut', name: 'Woodcut / Linocut', category: 'illustration', promptPrefix: 'woodcut print of', promptSuffix: ', relief print style, bold black lines, carved texture, high contrast, folk art', negativePrompt: 'smooth gradient, photorealistic', suggestedCfg: 9, color: '#7c2d12' },
  { id: 'engraving', name: 'Engraving', category: 'illustration', promptPrefix: 'engraved illustration of', promptSuffix: ', fine parallel lines, copper plate etching, classical printmaking, cross-hatching', negativePrompt: 'color, modern', color: '#57534e' },
  { id: 'botanical', name: 'Botanical', category: 'illustration', promptPrefix: 'botanical illustration of', promptSuffix: ', scientific accuracy, delicate watercolor, specimen style, natural history, fine detail', suggestedCfg: 7, color: '#15803d' },
  { id: 'scientific', name: 'Scientific', category: 'illustration', promptPrefix: 'scientific illustration of', promptSuffix: ', anatomical precision, labeled diagram style, medical textbook, technical accuracy, clean', suggestedCfg: 7, color: '#0d9488' },
  { id: 'technical-drawing', name: 'Technical Drawing', category: 'illustration', promptPrefix: 'technical drawing of', promptSuffix: ', blueprint style, precise measurements, engineering diagram, cross-section, orthographic', color: '#0284c7' },
  { id: 'fashion-illustration', name: 'Fashion Illustration', category: 'illustration', promptPrefix: 'fashion illustration of', promptSuffix: ', elongated figure, flowing fabric, haute couture, editorial sketch, Rene Gruau style', color: '#e11d48' },

  // Cultural (10)
  { id: 'ukiyo-e', name: 'Ukiyo-e', category: 'cultural', promptPrefix: 'ukiyo-e woodblock print of', promptSuffix: ', Japanese art, flat color areas, bold outlines, Hokusai style, Edo period', negativePrompt: 'photorealistic, 3d', suggestedCfg: 9, color: '#be123c' },
  { id: 'chinese-ink-wash', name: 'Chinese Ink Wash', category: 'cultural', promptPrefix: 'Chinese ink wash painting of', promptSuffix: ', shanshui style, rice paper, flowing brushstrokes, misty mountains, sumi-e', negativePrompt: 'colorful, digital', suggestedCfg: 8, color: '#4c1d95' },
  { id: 'indian-miniature', name: 'Indian Miniature', category: 'cultural', promptPrefix: 'Indian miniature painting of', promptSuffix: ', Mughal style, rich jewel tones, intricate borders, gold leaf accents, flat perspective', suggestedCfg: 8, color: '#b91c1c' },
  { id: 'celtic-art', name: 'Celtic Art', category: 'cultural', promptPrefix: 'Celtic art illustration of', promptSuffix: ', interlace knotwork, spirals, illuminated manuscript, Book of Kells, gold and green', color: '#166534' },
  { id: 'african-art', name: 'African Art', category: 'cultural', promptPrefix: 'African art of', promptSuffix: ', bold geometric patterns, earth tones, tribal motifs, carved mask style, rhythmic shapes', color: '#92400e' },
  { id: 'byzantine-icon', name: 'Byzantine Icon', category: 'cultural', promptPrefix: 'Byzantine icon painting of', promptSuffix: ', gold leaf background, flat perspective, rich reds and blues, halos, solemn, ornate', suggestedCfg: 8, color: '#854d0e' },
  { id: 'persian-miniature', name: 'Persian Miniature', category: 'cultural', promptPrefix: 'Persian miniature painting of', promptSuffix: ', Isfahan style, lush garden scenes, intricate floral borders, vivid blues and golds', suggestedCfg: 8, color: '#1e3a8a' },
  { id: 'aboriginal-dot', name: 'Aboriginal Dot Art', category: 'cultural', promptPrefix: 'Aboriginal dot painting of', promptSuffix: ', intricate dot patterns, earth tones, Dreamtime story, concentric circles, Australian indigenous', suggestedCfg: 9, color: '#b45309' },
  { id: 'mexican-folk', name: 'Mexican Folk Art', category: 'cultural', promptPrefix: 'Mexican folk art of', promptSuffix: ', alebrije style, vivid colors, fantastical creatures, Oaxacan woodcarving, Day of the Dead', suggestedCfg: 8, color: '#e11d48' },
  { id: 'tibetan-thangka', name: 'Tibetan Thangka', category: 'cultural', promptPrefix: 'Tibetan thangka painting of', promptSuffix: ', sacred Buddhist art, intricate detail, gold accents, symmetrical, mandala, spiritual iconography', suggestedCfg: 8, color: '#7c2d12' },

  // Craft & Paper (12)
  { id: 'origami', name: 'Origami', category: 'craft-paper', promptPrefix: 'origami paper art of', promptSuffix: ', folded paper, geometric creases, clean folds, soft shadows, paper texture, minimalist', negativePrompt: 'flat, digital', suggestedCfg: 8, color: '#dc2626' },
  { id: 'paper-cut', name: 'Paper Cut', category: 'craft-paper', promptPrefix: 'paper cut art of', promptSuffix: ', layered paper, sharp edges, shadow depth, kirigami style, silhouette, intricate cutouts', color: '#e11d48' },
  { id: 'embroidery', name: 'Embroidery', category: 'craft-paper', promptPrefix: 'embroidered artwork of', promptSuffix: ', thread texture, cross-stitch detail, fabric background, colorful stitches, hoop framed', negativePrompt: 'digital, smooth', suggestedCfg: 9, color: '#db2777' },
  { id: 'mosaic', name: 'Mosaic', category: 'craft-paper', promptPrefix: 'mosaic artwork of', promptSuffix: ', small tile pieces, grouted gaps, Roman mosaic style, colorful tesserae, handcrafted', suggestedCfg: 8, color: '#7c3aed' },
  { id: 'stained-glass', name: 'Stained Glass', category: 'craft-paper', promptPrefix: 'stained glass window of', promptSuffix: ', lead came borders, translucent glass, backlit, cathedral style, Gothic tracery, jewel tones', suggestedCfg: 8, color: '#2563eb' },
  { id: 'quilting', name: 'Quilting', category: 'craft-paper', promptPrefix: 'quilted art of', promptSuffix: ', patchwork fabric, stitched seams, textile patterns, cozy, folk art, warm colors', color: '#c026d3' },
  { id: 'felt-art', name: 'Felt Art', category: 'craft-paper', promptPrefix: 'felt art of', promptSuffix: ', soft wool felt texture, layered cutouts, handcrafted, fuzzy edges, needle-felted, charming', negativePrompt: 'glossy, digital', color: '#f43f5e' },
  { id: 'collage', name: 'Collage', category: 'craft-paper', promptPrefix: 'collage art of', promptSuffix: ', mixed media, torn paper edges, magazine cutouts, layered, textured, Dadaist, assemblage', color: '#8b5cf6' },
  { id: 'paper-quilling', name: 'Paper Quilling', category: 'craft-paper', promptPrefix: 'paper quilling art of', promptSuffix: ', rolled paper strips, coiled shapes, intricate filigree, 3D paper craft, delicate', suggestedCfg: 9, color: '#f472b6' },
  { id: 'knitting', name: 'Knitting/Crochet', category: 'craft-paper', promptPrefix: 'knitted art of', promptSuffix: ', yarn texture, knit stitches, cozy, soft, handmade sweater pattern, amigurumi', color: '#fb7185' },
  { id: 'clay-craft', name: 'Clay Craft', category: 'craft-paper', promptPrefix: 'play-doh style art of', promptSuffix: ', sculpted clay, Claymation, centered composition, handmade, colorful, stop-motion', negativePrompt: 'photo, realistic', suggestedCfg: 8, color: '#fb923c' },
  { id: 'papercut-shadowbox', name: 'Shadow Box', category: 'craft-paper', promptPrefix: 'papercut shadow box art of', promptSuffix: ', layered paper, depth and shadow, backlit, multi-layer, intricate silhouette, 3D paper art', suggestedCfg: 8, color: '#a855f7' },

  // Street & Urban (7)
  { id: 'graffiti', name: 'Graffiti', category: 'street-urban', promptPrefix: 'graffiti art of', promptSuffix: ', spray paint, bold letters, urban wall, vibrant colors, street art, dripping paint, Banksy', suggestedCfg: 9, color: '#ef4444' },
  { id: 'street-mural', name: 'Street Mural', category: 'street-urban', promptPrefix: 'street mural painting of', promptSuffix: ', large-scale wall art, community art, vivid colors, public space, urban landscape', color: '#f97316' },
  { id: 'stencil-art', name: 'Stencil Art', category: 'street-urban', promptPrefix: 'stencil art of', promptSuffix: ', spray paint through stencil, sharp edges, layered, political, Banksy style, urban', suggestedCfg: 9, color: '#78716c' },
  { id: 'neon-sign', name: 'Neon Sign', category: 'street-urban', promptPrefix: 'neon sign art of', promptSuffix: ', glowing tube lettering, bar sign, night, buzzing light, retro signage, motel aesthetic', color: '#f0abfc' },
  { id: 'urban-sketch', name: 'Urban Sketch', category: 'street-urban', promptPrefix: 'urban sketch of', promptSuffix: ', on-location drawing, pen and watercolor, loose style, architecture, travel journal, plein air', color: '#a3a3a3' },
  { id: 'wheat-paste', name: 'Wheat Paste', category: 'street-urban', promptPrefix: 'wheat paste poster art of', promptSuffix: ', street poster, layered, torn edges, political art, urban decay, gritty, punk aesthetic', color: '#737373' },
  { id: 'tribal', name: 'Tribal', category: 'street-urban', promptPrefix: 'tribal art of', promptSuffix: ', bold black patterns, polynesian tattoo style, geometric, symmetrical, cultural, powerful', suggestedCfg: 9, color: '#451a03' },

  // Game Art (8)
  { id: 'rpg-fantasy', name: 'RPG Fantasy', category: 'game-art', promptPrefix: 'RPG fantasy game art of', promptSuffix: ', character portrait, stats UI frame, dungeon and dragons, heroic, detailed armor, game splash', suggestedCfg: 8, color: '#15803d' },
  { id: 'retro-arcade', name: 'Retro Arcade', category: 'game-art', promptPrefix: 'retro arcade game art of', promptSuffix: ', 8-bit pixel style, cabinet art, bright colors, nostalgic, coin-op, classic gaming', suggestedCfg: 9, color: '#eab308' },
  { id: 'fighting-game', name: 'Fighting Game', category: 'game-art', promptPrefix: 'fighting game character art of', promptSuffix: ', Street Fighter style, dynamic pose, energy effects, VS screen, bold outlines, intense', suggestedCfg: 8, color: '#dc2626' },
  { id: 'minecraft-style', name: 'Minecraft Style', category: 'game-art', promptPrefix: 'Minecraft voxel art of', promptSuffix: ', blocky, cubic, pixelated textures, 3D blocks, sandbox game, low-res, charming', suggestedCfg: 9, color: '#22c55e' },
  { id: 'pokemon-style', name: 'Pokémon Style', category: 'game-art', promptPrefix: 'Pokémon style creature art of', promptSuffix: ', Ken Sugimori style, cute creature design, clean lines, vibrant, game character, collectible', suggestedCfg: 8, color: '#facc15' },
  { id: 'visual-novel-bg', name: 'Visual Novel BG', category: 'game-art', promptPrefix: 'visual novel background art of', promptSuffix: ', anime game scenery, detailed environment, soft lighting, school hallway, cherry blossoms', color: '#f472b6' },
  { id: 'gta-style', name: 'GTA Style', category: 'game-art', promptPrefix: 'GTA loading screen art of', promptSuffix: ', satirical, bold outlines, urban, edgy, sunglasses, Stephen Bliss illustration style', suggestedCfg: 8, color: '#f97316' },
  { id: 'strategy-game', name: 'Strategy Game', category: 'game-art', promptPrefix: 'strategy game art of', promptSuffix: ', top-down perspective, miniature units, battle map, hex grid, tactical, detailed terrain', color: '#3b82f6' },

  // Architecture (6)
  { id: 'arch-rendering', name: 'Architectural Render', category: 'architecture', promptPrefix: 'architectural rendering of', promptSuffix: ', photorealistic building, modern design, glass and steel, landscaping, golden hour lighting', suggestedCfg: 7, color: '#475569' },
  { id: 'brutalist', name: 'Brutalist', category: 'architecture', promptPrefix: 'brutalist architecture of', promptSuffix: ', raw concrete, monumental, geometric, imposing, Le Corbusier style, dramatic shadows', suggestedCfg: 8, color: '#78716c' },
  { id: 'gothic-arch', name: 'Gothic Architecture', category: 'architecture', promptPrefix: 'gothic architecture of', promptSuffix: ', pointed arches, flying buttresses, rose windows, cathedral, ornate stone, towering spires', suggestedCfg: 8, color: '#1e293b' },
  { id: 'art-nouveau-arch', name: 'Art Nouveau Building', category: 'architecture', promptPrefix: 'art nouveau architecture of', promptSuffix: ', organic curves, decorative facades, ironwork, Gaudí style, ornamental, flowing lines', suggestedCfg: 8, color: '#a16207' },
  { id: 'futuristic-arch', name: 'Futuristic Architecture', category: 'architecture', promptPrefix: 'futuristic architecture of', promptSuffix: ', parametric design, organic forms, Zaha Hadid style, flowing curves, advanced materials', suggestedCfg: 8, color: '#6366f1' },
  { id: 'interior-design', name: 'Interior Design', category: 'architecture', promptPrefix: 'interior design rendering of', promptSuffix: ', modern living space, carefully staged, natural lighting, Architectural Digest, cozy, elegant', suggestedCfg: 7, color: '#d4a276' },

  // NSFW 🔞 (10) — only visible when nsfwEnabled is true
  { id: 'boudoir', name: 'Boudoir', category: 'nsfw', promptPrefix: 'boudoir photograph of', promptSuffix: ', intimate, soft lighting, bedroom setting, sensual pose, silk sheets, professional boudoir', negativePrompt: 'cartoon, ugly', suggestedCfg: 7, color: '#be123c', nsfw: true },
  { id: 'figure-drawing', name: 'Figure Drawing', category: 'nsfw', promptPrefix: 'figure drawing of', promptSuffix: ', nude life model, charcoal on paper, anatomical study, art school, classical pose, tasteful', suggestedCfg: 7, color: '#78716c', nsfw: true },
  { id: 'sensual-art', name: 'Sensual Art', category: 'nsfw', promptPrefix: 'sensual artwork of', promptSuffix: ', intimate, romantic, soft colors, flowing fabric, suggestive, artistic, beautiful lighting', negativePrompt: 'grotesque, ugly', suggestedCfg: 8, color: '#e11d48', nsfw: true },
  { id: 'pin-up-classic', name: 'Classic Pin-Up', category: 'nsfw', promptPrefix: 'classic pin-up art of', promptSuffix: ', 1950s Vargas girl style, glamorous, coy pose, vintage illustration, playful, retro', color: '#f43f5e', nsfw: true },
  { id: 'erotic-anime', name: 'Erotic Anime', category: 'nsfw', promptPrefix: 'ecchi anime illustration of', promptSuffix: ', detailed anime art, suggestive, beautiful character, vibrant colors, anime style', negativePrompt: 'photo, 3d, ugly', suggestedCfg: 8, color: '#fb7185', nsfw: true },
  { id: 'renaissance-nude', name: 'Renaissance Nude', category: 'nsfw', promptPrefix: 'Renaissance nude painting of', promptSuffix: ', Botticelli style, classical beauty, mythological scene, oil painting, museum quality, timeless', suggestedCfg: 7, color: '#854d0e', nsfw: true },
  { id: 'art-nude-photo', name: 'Art Nude Photo', category: 'nsfw', promptPrefix: 'artistic nude photograph of', promptSuffix: ', fine art, studio lighting, sculptural pose, dramatic shadows, gallery quality, body as art', negativePrompt: 'vulgar, ugly', suggestedCfg: 7, color: '#991b1b', nsfw: true },
  { id: 'romantic-fantasy', name: 'Romantic Fantasy', category: 'nsfw', promptPrefix: 'romantic fantasy art of', promptSuffix: ', passionate, enchanted, flowing hair, magical atmosphere, embrace, ethereal, breathtaking', suggestedCfg: 8, color: '#7c3aed', nsfw: true },
  { id: 'provocative-fashion', name: 'Provocative Fashion', category: 'nsfw', promptPrefix: 'provocative high fashion editorial of', promptSuffix: ', daring, avant-garde, sheer fabric, editorial, Alexander McQueen style, bold, striking', color: '#c026d3', nsfw: true },
  { id: 'dark-erotic', name: 'Dark Erotic', category: 'nsfw', promptPrefix: 'dark erotic art of', promptSuffix: ', gothic, moody, candlelight, velvet, mysterious, seductive, dramatic chiaroscuro, oil painting', suggestedCfg: 9, color: '#1c1917', nsfw: true },
];
