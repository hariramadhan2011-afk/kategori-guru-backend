// Baris 1: Import modul yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000; // Gunakan port dari environment (untuk cloud) atau default 3000

// --- PENGGUNAAN ENVIRONMENT VARIABLES ---

// Mengambil Connection String dari Variabel Lingkungan
// Ini akan disuplai oleh platform cloud (seperti Railway)
const uri = process.env.MONGODB_URI; 

// Pastikan URI sudah terisi sebelum mencoba koneksi
if (!uri) {
    console.error("❌ ERROR: MONGODB_URI Environment Variable tidak ditemukan.");
    // Hentikan proses jika URI tidak ada (hanya akan muncul di lokal jika belum disetel)
    process.exit(1); 
}

// --- KONEKSI MONGODB DENGAN TIME-OUT ---
mongoose.connect(uri, {
    // Menambahkan time-out 30 detik untuk mengatasi masalah koneksi lokal (Mongoose)
    serverSelectionTimeoutMS: 30000, 
})
.then(() => {
    // Pesan ini hanya akan muncul jika koneksi berhasil (seharusnya di cloud)
    console.log("✅ Koneksi ke MongoDB berhasil!"); 
})
.catch((error) => {
    // Error ini akan muncul jika ada masalah (di lokal, biasanya IP Whitelist/Firewall)
    console.error("❌ Koneksi ke MongoDB gagal:", error);
});


// --- DEFINISI SKEMA MODEL (Contoh Sederhana) ---
// Anda dapat menempatkan skema dan model Anda di sini
const GuruSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    pelajaran: { type: String, required: true },
    favorit: { type: Number, default: 0 }
});

const Guru = mongoose.model('Guru', GuruSchema);


// --- ENDPOINT EXPRESS (Contoh) ---
app.use(express.json()); // Middleware untuk parsing JSON request body

// Endpoint GET: Mendapatkan daftar semua guru
app.get('/api/guru', async (req, res) => {
    try {
        const daftarGuru = await Guru.find();
        res.status(200).json(daftarGuru);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data guru", error: error.message });
    }
});

// Endpoint POST: Menambah guru baru
app.post('/api/guru', async (req, res) => {
    try {
        const newGuru = new Guru(req.body);
        await newGuru.save();
        res.status(201).json(newGuru);
    } catch (error) {
        res.status(400).json({ message: "Gagal menyimpan guru baru", error: error.message });
    }
});


// --- SERVER EXPRESS START ---

app.listen(port, () => {
    console.log(`🚀 Server Backend berjalan di: http://localhost:${port}`);
});
