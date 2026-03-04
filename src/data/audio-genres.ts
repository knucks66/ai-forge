export interface GenreTag {
  id: string;
  label: string;
  category: 'genre' | 'mood';
}

export const genreTags: GenreTag[] = [
  { id: 'pop', label: 'Pop', category: 'genre' },
  { id: 'rock', label: 'Rock', category: 'genre' },
  { id: 'electronic', label: 'Electronic', category: 'genre' },
  { id: 'jazz', label: 'Jazz', category: 'genre' },
  { id: 'classical', label: 'Classical', category: 'genre' },
  { id: 'hip-hop', label: 'Hip-Hop', category: 'genre' },
  { id: 'ambient', label: 'Ambient', category: 'genre' },
  { id: 'cinematic', label: 'Cinematic', category: 'genre' },
  { id: 'lo-fi', label: 'Lo-Fi', category: 'genre' },
  { id: 'folk', label: 'Folk', category: 'genre' },
  { id: 'r-and-b', label: 'R&B', category: 'genre' },
  { id: 'metal', label: 'Metal', category: 'genre' },
  { id: 'country', label: 'Country', category: 'genre' },
  { id: 'reggae', label: 'Reggae', category: 'genre' },
  { id: 'funk', label: 'Funk', category: 'genre' },
];

export const moodTags: GenreTag[] = [
  { id: 'energetic', label: 'Energetic', category: 'mood' },
  { id: 'chill', label: 'Chill', category: 'mood' },
  { id: 'dark', label: 'Dark', category: 'mood' },
  { id: 'uplifting', label: 'Uplifting', category: 'mood' },
  { id: 'melancholy', label: 'Melancholy', category: 'mood' },
  { id: 'dreamy', label: 'Dreamy', category: 'mood' },
];
