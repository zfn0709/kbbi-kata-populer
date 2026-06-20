/**
 * Script untuk mengaudit hasil scoring popularitas kata dasar.
 * Memastikan nilai yang diberikan oleh AI konsisten dan logis.
 */
const fs = require('fs');
const path = require('path');

const datasetPath = path.join(__dirname, '../dataset/kbbi_popularitas.json');

if (!fs.existsSync(datasetPath)) {
  console.error('Dataset kbbi_popularitas.json tidak ditemukan. Harap generate terlebih dahulu.');
  process.exit(1);
}

const dataset = JSON.parse(fs.readFileSync(datasetPath, 'utf8'));

console.log('🔍 ANALISIS KUALITAS DATASET POPULARITAS KBBI\n');
console.log('='.repeat(60));
console.log(`Total kosakata terdaftar: ${dataset.length.toLocaleString('id-ID')} kata`);
console.log('='.repeat(60));

// 1. Distribusi Nilai
const distribusi = {};
for (let i = 1; i <= 10; i++) distribusi[i] = 0;

dataset.forEach(w => {
  if (w.nilai >= 1 && w.nilai <= 10) {
    distribusi[w.nilai]++;
  }
});

console.log('\n📊 Distribusi Nilai (1 - 10):');
Object.keys(distribusi).forEach(nilai => {
  const count = distribusi[nilai];
  const persentase = ((count / dataset.length) * 100).toFixed(2);
  const bar = '■'.repeat(Math.round(persentase / 2));
  console.log(`  Skor ${nilai.padStart(2)}: ${count.toString().padStart(6)} kata (${persentase.padStart(5)}%) ${bar}`);
});

// 2. Deteksi Inkonsistensi Kata Ilmiah Berbobot Tinggi
console.log('\n📌 Sampel Kata Ilmiah/Teknis yang Mungkin Terlalu Tinggi (Skor >= 9):');
const sampelIlmiah = dataset.filter(w => 
  w.nilai >= 9 && 
  (w.kata.endsWith('iasis') || w.kata.endsWith('ektomi') || w.kata.endsWith('itis') || w.kata.endsWith('osis'))
).slice(0, 10);

if (sampelIlmiah.length > 0) {
  sampelIlmiah.forEach(w => {
    console.log(`  ⚠️  Skor ${w.nilai} → "${w.kata}" (kelas: ${w.kelas || '-'}, kata dasar: ${w.kata_dasar || '-'})`);
  });
} else {
  console.log('  ✅ Aman! Tidak ditemukan pola akhiran kata ilmiah dengan skor >= 9.');
}

// 3. Deteksi Kata Umum Bernilai Rendah
const kataUmum = ['makan', 'minum', 'tidur', 'jalan', 'rumah', 'mobil', 'orang', 'ikan', 'buku', 'uang'];
console.log('\n📌 Cek Skor Kata-Kata Sangat Umum:');
kataUmum.forEach(k => {
  const match = dataset.find(w => w.kata === k);
  if (match) {
    console.log(`  - "${k}": Skor ${match.nilai} ${match.nilai >= 9 ? '✅' : '⚠️ (Mungkin terlalu rendah)'}`);
  }
});

console.log('\n🎉 Audit selesai!');
