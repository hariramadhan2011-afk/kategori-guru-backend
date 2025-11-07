// Baris 1: Import modul yang dibutuhkan
const express = require('express');
const mongoose = require('mongoose');
const app = express();

// --- Konfigurasi Port Vercel ---
// Gunakan port dari Environment Variables yang disediakan oleh Vercel
const port = process.env.PORT || 3000; 

// --- PENGGUNAAN ENVIRONMENT VARIABLES ---
const uri = process.env.MONGODB_URI; 

if (!uri) {
    console.error("❌ ERROR: MONGODB_URI Environment Variable tidak ditemukan.");
}

// --- KONEKSI MONGODB DENGAN TIME-OUT ---
mongoose.connect(uri, {
    serverSelectionTimeoutMS: 30000, 
})
.then(() => {
    console.log("✅ Koneksi ke MongoDB berhasil!"); 
})
.catch((error) => {
    console.error("❌ Koneksi ke MongoDB gagal:", error);
});


// --- DEFINISI SKEMA MODEL ---
const GuruSchema = new mongoose.Schema({
    nama: { type: String, required: true },
    pelajaran: { type: String, required: true },
    favorit: { type: Number, default: 0 }
});

const Guru = mongoose.model('Guru', GuruSchema);


// --- ENDPOINT EXPRESS ---
app.use(express.json());

// 1. ENDPOINT UTAMA (Mencegah Error 404 di domain root)
app.get('/', (req, res) => {
    res.status(200).send("Server Backend Guru Favorit Berjalan. Akses /api/guru untuk data.");
});

// 2. Endpoint GET: Mendapatkan daftar semua guru
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
    console.log(`🚀 Server Backend berjalan di port: ${port}`);
});

// --- BARIS WAJIB VERCEL ---
// Baris ini memberitahu Vercel bahwa aplikasi Express adalah yang harus dijalankan.
module.exports = app;
