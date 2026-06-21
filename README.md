# kbbi-popularitas-indonesia

Daftar kata dasar dan turunan KBBI yang dilengkapi dengan skor popularitas/familiaritas (skala 1-10). Dataset ini berguna untuk analisis linguistik, NLP, spell checker, atau penyaringan kata pada aplikasi edukasi interaktif.

## Tentang Dataset

Skor popularitas (1-10) ditentukan menggunakan LLM Gemini 3.5 Flash secara batch, kemudian melalui proses audit mandiri untuk memastikan konsistensinya.

- **Total Kosakata**: 94.901 kata
- **Skala Skor**:
  - **9–10**: Kata sehari-hari (contoh: *makan*, *rumah*, *acara*).
  - **7–8**: Kata formal umum/berita yang dipahami hampir semua orang dewasa (contoh: *abjad*, *abnormal*, *gundah*).
  - **5–6**: Kata sastra/formal ringan, dipahami artinya tapi jarang diucapkan sehari-hari (contoh: *gubah*, *abdomen*).
  - **3–4**: Kata sastra klasik atau istilah teknis spesifik (contoh: *ababil*, *abalone*).
  - **1–2**: Kata arkais (kuno), bahasa daerah sangat lokal, atau istilah ilmiah langka (contoh: *syahdan*, *abaddon*).

## Kriteria Penyaringan (Filters)

Dataset ini disaring secara ketat dari data mentah KBBI (disadur dari repositori [univzy/kbbi](https://github.com/univzy/kbbi)) agar hanya berisi kata dasar/lema yang siap digunakan dengan kriteria filter sebagai berikut:
1. **Hanya Kata Dasar (Stem Words)**: Kolom `kata_dasar` bernilai `NULL` (kata turunan seperti yang berawalan *ber-*, *me-*, *pe-* dilewati agar data tetap bersih dan fokus pada lema utama).
2. **Tidak Mengandung Spasi**: Menghindari frasa atau kata majemuk (contoh: *mata hari* bernilai tidak baku dilewati, yang digunakan adalah lema tunggal baku *matahari*).
3. **Format Karakter Valid**: Hanya terdiri dari huruf alfabet (`a-z`, `A-Z`), tanda titik pemisah suku kata (`.`), dan tanda hubung (`-`) untuk kata ulang (misal: *lauk-pauk*).
4. **Tanpa Angka**: Tidak mengandung karakter angka (`0-9`).
5. **Memiliki Pemenggalan Suku Kata**: Kolom pemenggalan suku kata (`nama`) harus mengandung titik pemisah (contoh: `ma.ta.ha.ri`).
6. **Bukan Singkatan/Akronim Kapital Penuh**: Menyaring singkatan yang ditulis dengan huruf kapital penuh (contoh: `keyword != UPPER(nama)`).

## Struktur File

```text
├── dataset/
│   ├── kbbi_popularitas.json  # Format JSON
│   └── kbbi_popularitas.csv   # Format CSV
├── tools/
│   ├── gemini_batch_scorer.js # Contoh script scoring batch ke Gemini API
│   └── audit_scoring.js       # Script pengecekan kualitas scoring
├── package.json
└── README.md
```

## Penggunaan

### Node.js (JSON)
```javascript
const fs = require('fs');

const dataset = JSON.parse(fs.readFileSync('./dataset/kbbi_popularitas.json', 'utf8'));

// Ambil kata dengan skor >= 8 (kata umum/familiar)
const kataPopuler = dataset.filter(w => w.nilai >= 8);
console.log(kataPopuler);
```

### Python (CSV)
```python
import pandas as pd

df = pd.read_csv('dataset/kbbi_popularitas.csv')

# Filter kata langka/arkais (skor <= 2)
kata_langka = df[df['nilai'] <= 2]
print(kata_langka.head())
```

## Pemilihan Model (Gemini 3.5 Flash)

Model Gemini 3.5 Flash dipilih karena pemrosesan batch berskala besar (~94k kata) berjalan sangat cepat. Berdasarkan pengujian langsung, model ini juga memiliki pemahaman nuansa kosakata Bahasa Indonesia (baik formal maupun slang/kasual) yang lebih akurat dibandingkan model LLM lainnya.

## Lisensi & Atribusi

- **Data Mentah**: Disadur dari repositori [univzy/kbbi](https://github.com/univzy/kbbi) (yang di-reverse engineer dari KBBI Daring).
- **Hak Cipta Konten**: Konten KBBI sepenuhnya milik **Badan Pengembangan dan Pembinaan Bahasa, Kementerian Pendidikan Dasar dan Menengah Republik Indonesia**.
- **Lisensi Proyek**: [MIT License](LICENSE).
