document.addEventListener('DOMContentLoaded', async () => {
    const guruForm = document.getElementById('guruForm');
    const guruSelects = document.querySelectorAll('.guru-select');

    // Fungsi untuk mengisi dropdown guru dari API
    async function populateGuruDropdowns() {
        try {
            // Panggil API untuk mendapatkan daftar guru
            const response = await fetch('http://localhost:3000/api/teachers');
            if (!response.ok) {
                throw new Error(`Gagal mengambil daftar guru. Status: ${response.status}`);
            }
            const teachers = await response.json();

            guruSelects.forEach(selectElement => {
                selectElement.innerHTML = '<option value="">-- Pilih Guru --</option>'; 
                
                // Masukkan setiap guru sebagai option
                teachers.forEach(teacher => {
                    const option = document.createElement('option');
                    option.value = teacher.nama;
                    option.textContent = `${teacher.nama} (${teacher.mapel})`;
                    selectElement.appendChild(option);
                });
            });

        } catch (error) {
            console.error("Error memuat daftar guru:", error);
            guruSelects.forEach(selectElement => {
                selectElement.innerHTML = '<option value="">-- Gagal memuat guru --</option>';
            });
            Swal.fire({
                icon: 'error',
                title: 'Gagal Memuat Guru',
                text: 'Tidak dapat mengambil daftar guru dari server. Pastikan server berjalan.'
            });
        }
    }

    // Panggil fungsi untuk mengisi dropdown saat halaman dimuat
    await populateGuruDropdowns();

    // Event listener untuk submit form
    guruForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const namaSiswa = document.getElementById('namaSiswa').value.trim() || "Siswa Anonim";
        const pilihanGuru = [];
        let formValid = true;

        // Daftar kategori dan ID elemen yang harus di-submit
        const categories = {
            guruTerbaik: "Guru Terbaik",
            guruTerapih: "Guru Terapih",
            guruTerheboh: "Guru Terheboh",
            guruTerasik: "Guru Terasik",
            guruTergokil: "Guru Tergokil",
            guruTerajin: "Guru Terajin"
        };

        for (const [id, kategoriLabel] of Object.entries(categories)) {
            const selectElement = document.getElementById(id);
            if (selectElement && selectElement.value) {
                pilihanGuru.push({
                    kategori: kategoriLabel,
                    guru: selectElement.value // Nilai adalah nama guru
                });
            } else {
                formValid = false;
                break;
            }
        }

        if (!formValid) {
            Swal.fire({
                icon: 'warning',
                title: 'Pilihan Belum Lengkap',
                text: 'Mohon lengkapi semua pilihan guru untuk setiap kategori.'
            });
            return;
        }

        try {
            // Kirim data pilihan ke API POST di server.js
            const response = await fetch('http://localhost:3000/api/choices', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ namaSiswa, pilihanGuru })
            });

            if (!response.ok) {
                throw new Error(`Gagal menyimpan pilihan. Status: ${response.status}`);
            }

            // Notifikasi sukses dan halaman terima kasih
            Swal.fire({
                icon: 'success',
                title: 'Terima Kasih!',
                html: `Pilihan Anda untuk <strong>${namaSiswa}</strong> berhasil terekam!<br>
                       <small>Data telah disimpan ke database.</small>`,
                confirmButtonText: 'Oke'
            }).then(() => {
                // Reset form
                guruForm.reset();
                populateGuruDropdowns(); // Isi ulang dropdown
            });

        } catch (error) {
            console.error("Error saat mengirim form:", error);
            Swal.fire({
                icon: 'error',
                title: 'Gagal Mengirim Pilihan',
                text: `Terjadi kesalahan saat menyimpan pilihan Anda: ${error.message}. Pastikan server berjalan.`
            });
        }
    });
});