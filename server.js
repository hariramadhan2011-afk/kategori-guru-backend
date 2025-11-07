// Baris 1: Import modul yang dibutuhkan (Mongoose untuk koneksi DB, Express untuk server)
const express = require('express');
const mongoose = require('mongoose'); // <-- Solusi ReferenceError: mongoose is not defined
const app = express();
const port = 3000;

// --- KONFIGURASI DATABASE (MongoDB ATLAS CLOUD - FINAL SINKRONISASI) ---

// Pastikan kredensial ini SAMA PERSIS dengan yang berhasil di MongoDB Compass
const username = "adminGuru"; // Contoh: "adminGuru"
const password = "1vvi6v9A2fwGP5uT"; // Contoh: "1vvi6v9A2fWGP5uT"
const clusterId = "cluster0.6wmheug.mongodb.net"; // ID Cluster Anda
const dbName = "db_guru_favorit_v2"; // Nama database Anda

// Gunakan Connection String Non-SRV (atau SRV, jika Anda yakin) untuk menghindari masalah DNS,
// dan pastikan password dienkode jika mengandung karakter khusus.
const uri = `mongodb://${username}:${password}@${clusterId}:27017/${dbName}?authSource=admin&ssl=true`;
// ATAU gunakan SRV Sederhana jika Non-SRV masih rewel:
// const uri = `mongodb+srv://${username}:${password}@${clusterId}.mongodb.net/${dbName}`;


// --- KONEKSI MONGODB DENGAN TIME-OUT DAN SINTAKSIS BENAR ---
mongoose.connect(uri, {
    // Menambahkan time-out 30 detik untuk mengatasi Error Mongoose (timed out after 10000ms)
    serverSelectionTimeoutMS: 30000, 
})
.then(() => {
    console.log("✅ Koneksi ke MongoDB berhasil!");
})
.catch((error) => {
    // Meskipun Compass berhasil, error ini (IP Whitelist) masih mungkin muncul di lokal.
    console.error("❌ Koneksi ke MongoDB gagal:", error);
});


// --- SERVER EXPRESS START ---

app.listen(port, () => {
    console.log(`🚀 Server Backend berjalan di: http://localhost:${port}`);
});

// Catatan: Model Skema Guru dan endpoint Express Anda yang lain harus berada di bawah kode ini.