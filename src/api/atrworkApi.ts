// src/api/artworkApi.ts
import axios from 'axios';

export interface Artwork {
  code: string;
  name: string;
  category: string;
}

export const fetchArtworks = async (page: number, size: number): Promise<Artwork[]> => {
  const res = await axios.get(`https://api.artic.edu/api/v1/artworks?page=${page}&limit=${size}`);
  return res.data.data.map((item: any) => ({
    code: item.id,
    name: item.title,
    category: item.category_titles[0] || 'Uncategorized',
  }));
};
