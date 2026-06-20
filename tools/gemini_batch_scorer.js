/**
 * Contoh Script Scorer Kata menggunakan Gemini API.
 * Menilai popularitas kata dasar Bahasa Indonesia dalam format batch.
 */
const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Pastikan API key terpasang di environment
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error('Harap set GEMINI_API_KEY di environment Anda.');
  process.exit(1);
}

const genAI = new GoogleGenerativeAI(apiKey);

async function scoreBatch(words) {
  const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

  // Mendukung input array of strings, array of objects ({ kata: '...' }), atau format DB ({ keyword: '...' })
  const listKata = words.map(w => {
    if (typeof w === 'string') return w;
    if (w && typeof w === 'object') return w.kata || w.keyword || String(w);
    return String(w);
  });

  const prompt = `
Berikan nilai tingkat familiaritas/popularitas kata berikut dalam skala 1-10.
10 = Kata yang sangat sering digunakan sehari-hari (contoh: makan, tidur, rumah).
1 = Kata yang sangat langka, arkais (kuno), bahasa daerah, atau istilah ilmiah asing (contoh: arkais, sangkil, ektomi).

Kembalikan respon hanya berupa JSON array dengan format:
[
  {"kata": "kata1", "nilai": 8},
  {"kata": "kata2", "nilai": 3}
]

Daftar kata:
${JSON.stringify(listKata)}
`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Ekstrak JSON array dari teks secara aman
    const jsonMatch = text.match(/\[[\s\S]*\]/);
    if (!jsonMatch) {
      throw new Error('Respon dari Gemini tidak mengandung format JSON array');
    }
    
    return JSON.parse(jsonMatch[0]);
  } catch (error) {
    console.error('Error saat scoring batch:', error.message);
    return [];
  }
}

// Cara penggunaan:
// const kataSisa = [{ kata: 'mangkus' }, { kata: 'sarapan' }];
// scoreBatch(kataSisa).then(console.log);
