/* --- INTRO HYPERSPACE --- */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Ambil elemen
    const canvas = document.getElementById("hyperspace-canvas");
    
    // JIKA KANVAS TIDAK ADA, BARU BERHENTI
    if (!canvas) return; 

    const ctx = canvas.getContext("2d");
    const contentWrapper = document.getElementById("content-wrapper"); // Dibiarkan jika tidak ketemu

    // 2. Set ukuran kanvas fullscreen
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // 3. Konfigurasi Bintang (Cahaya)
    const stars = [];
    const numStars = 400; // Jumlah garis cahaya (makin banyak makin ramai)
    let speed = 2; // Kecepatan awal (pelan, lalu dipercepat)
    const maxSpeed = 35; // Kecepatan maksimum saat jump
    let animationActive = true;

    // Inisialisasi posisi bintang acak dari tengah
    for (let i = 0; i < numStars; i++) {
        stars.push({
            x: Math.random() * canvas.width - canvas.width / 2,
            y: Math.random() * canvas.height - canvas.height / 2,
            z: Math.random() * canvas.width,
            pz: Math.random() * canvas.width // Previous Z for trail
        });
    }

    // Fungsi pembantu untuk memetakan koordinat 3D ke 2D screen
    function map(value, istart, istop, ostart, ostop) {
        return ostart + (ostop - ostart) * ((value - istart) / (istop - istart));
    }

    // 4. Fungsi Utama Animasi
    function animate() {
        if (!animationActive) return;

        // Efek jejak cahaya (trails)
        ctx.fillStyle = "rgba(0, 0, 0, 0.1)"; // Background hitam transparan
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.translate(canvas.width / 2, canvas.height / 2); // Pindahkan origin ke tengah

        // Percepat seiring waktu (efek jump)
        if (speed < maxSpeed) speed += 0.2;

        stars.forEach(star => {
            star.z -= speed; // Dekatkan bintang ke layar

            // Jika bintang melewati layar, reset ke belakang
            if (star.z < 1) {
                star.z = canvas.width;
                star.x = Math.random() * canvas.width - canvas.width / 2;
                star.y = Math.random() * canvas.height - canvas.height / 2;
                star.pz = star.z; // Reset previous Z
            }

            // Hitung posisi 2D (X,Y) berdasarkan depth (Z)
            let sx = map(star.x / star.z, 0, 1, 0, canvas.width);
            let sy = map(star.y / star.z, 0, 1, 0, canvas.height);

            // Hitung posisi 2D sebelumnya (untuk membuat garis/trail)
            let px = map(star.x / star.pz, 0, 1, 0, canvas.width);
            let py = map(star.y / star.pz, 0, 1, 0, canvas.height);

            star.pz = star.z; // Update previous Z

            // Gambar garis cahaya
            ctx.beginPath();
            ctx.moveTo(px, py);
            ctx.lineTo(sx, sy);
            // Warna putih memudar berdasarkan jarak (makin dekat makin jelas)
            ctx.strokeStyle = `rgba(255, 255, 255, ${map(star.z, 0, canvas.width, 1, 0.1)})`; 
            // Garis makin tebal di depan
            ctx.lineWidth = map(star.z, 0, canvas.width, 3, 0.5); 
            ctx.stroke();
        });

        ctx.translate(-canvas.width / 2, -canvas.height / 2); // Reset origin
        requestAnimationFrame(animate);
    }

    // 5. Mulai Animasi
    requestAnimationFrame(animate);

    // 6. --- LOGIKA PENGHENTIAN (TIMER) ---
    setTimeout(() => {
        // 1. Matikan loop animasi canvas
        animationActive = false;

        // 2. Pudarkan kanvas intro
        canvas.style.opacity = "0";
        canvas.style.visibility = "hidden";
        canvas.style.transition = "opacity 1.5s ease, visibility 1.5s ease";

       // --- Sinkronisasi Pemunculan Portofolio ---
        const mainNav = document.getElementById("main-nav");
        const contentWrapper = document.getElementById("content-wrapper");

        // GANTI BAGIAN INI:
        if (contentWrapper) {
            contentWrapper.classList.add("masuk-smooth-active"); 
        }

        if (mainNav) {
            mainNav.classList.add("nav-drop-active"); 
        }

        // Hancurkan kanvas dari sistem setelah semua transisi fade selesai
        setTimeout(() => {
            canvas.remove();
        }, 1500); // Sesuaikan dengan durasi transisi canvas

    }, 2800); // Tampilkan efek hyperspace selama 2.8 detik sebelum transisi
});

/* --- SLIDING NAVBAR INDICATOR (MAGIC PILL) --- */
const navLinksUl = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links li');
const indicator = document.querySelector('.nav-indicator');

if (navItems.length > 0 && indicator) {
    navItems.forEach(item => {
        item.addEventListener('mouseenter', (e) => {
            // Mengambil lebar dan posisi elemen menu yang sedang di-hover
            const width = item.offsetWidth;
            const left = item.offsetLeft;

            // Memindahkan blok warna dan menyamakan lebarnya
            indicator.style.width = `${width}px`;
            indicator.style.left = `${left}px`;
            indicator.style.opacity = '1'; // Memunculkan blok warna
        });
    });

    // Saat kursor keluar dari area navbar, sembunyikan blok warnanya
    navLinksUl.addEventListener('mouseleave', () => {
        indicator.style.opacity = '0';
    });
}

// Memastikan semua konten HTML selesai dimuat sebelum menjalankan script
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Pilih semua elemen target yang ingin dianimasikan
    const fadeElements = document.querySelectorAll('.fade-on-scroll');

    // 2. Atur konfigurasi pengamat (Observer)
    const observerOptions = {
        root: null, // Menggunakan layar utama browser
        rootMargin: '0px', // Margin tambahan, di sini kita set 0
        threshold: 0.15 // Animasi terpicu saat 15% bagian elemen sudah masuk ke layar
    };

    // 3. Buat logika Intersection Observer
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            
            // Jika elemen sudah masuk ke area yang terlihat di layar
            if (entry.isIntersecting) {
                // Tambahkan class 'is-visible' untuk memicu CSS
                entry.target.classList.add('is-visible');
                
                // Hentikan pantauan pada elemen ini agar animasi hanya terjadi satu kali
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 4. Terapkan pengamat ke setiap elemen yang sudah kita pilih di langkah 1
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });
});

/* --- LOGIKA FADE ON SCROLL (INTERSECTION OBSERVER) --- */
document.addEventListener("DOMContentLoaded", () => {
    // 1. Cari semua elemen yang punya class 'fade-on-scroll'
    const fadeElements = document.querySelectorAll(".fade-on-scroll");

    // 2. Pengaturan Observer (Kapan animasi harus dimulai)
    const observerOptions = {
        root: null, 
        rootMargin: "0px 0px 50px 0px", 
        threshold: 0.1
    };

    // 3. Membuat "Mata-mata" (Observer) untuk melihat posisi elemen
    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Jika elemen masuk ke layar, tambahkan class 'is-visible'
                entry.target.classList.add("is-visible");
                
                // Hentikan pantauan agar animasi hanya terjadi satu kali (tidak berkedip saat scroll naik-turun)
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // 4. Perintahkan Observer untuk memantau semua elemen tadi
    fadeElements.forEach(el => {
        observer.observe(el);
    });
});

document.addEventListener('DOMContentLoaded', () => {
    
    // --- Logika Efek Fade On Scroll (Tetap dipertahankan) ---
    const fadeElements = document.querySelectorAll('.fade-on-scroll');
    const observerOptions = { root: null, rootMargin: '0px', threshold: 0.15 };
    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);
    fadeElements.forEach(element => fadeObserver.observe(element));

    // --- Logika Filter & Show More ---
    const filterButtons = document.querySelectorAll('.filter-btn');
    const certCards = document.querySelectorAll('.cert-card');
    const showMoreBtn = document.getElementById('showMoreBtn');
    const extraCerts = document.querySelectorAll('.extra-cert'); // Memilih sertifikat ke-7 dst
    let isShowingMore = false; // Status tracking

    // Event Klik untuk Tombol Filter
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            
            // Atur gaya aktif pada tombol filter
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.getAttribute('data-filter');

            if (filterValue === 'all') {
                // Jika "All" diklik, kembalikan ke kondisi limit Show More
                certCards.forEach(card => {
                    card.classList.remove('hide'); // Bersihkan sisa filter sebelumnya
                    // Sembunyikan extra-cert JIKA mode show more sedang tidak aktif
                    if (card.classList.contains('extra-cert') && !isShowingMore) {
                        card.classList.add('d-none'); 
                    } else {
                        card.classList.remove('d-none');
                    }
                });
                showMoreBtn.style.display = 'inline-block'; // Munculkan tombol Show More
            } else {
                // Jika filter kategori tertentu diklik (misal: "Organisasi")
                certCards.forEach(card => {
                    card.classList.remove('d-none'); // Paksa munculkan semua agar bisa dicek kategorinya
                    
                    if (card.getAttribute('data-category') === filterValue) {
                        card.classList.remove('hide');
                    } else {
                        card.classList.add('hide');
                    }
                });
                showMoreBtn.style.display = 'none'; // Sembunyikan tombol Show More saat filter aktif
            }
        });
    });

    // Event Klik untuk Tombol Show More / Show Less
    showMoreBtn.addEventListener('click', () => {
        isShowingMore = !isShowingMore; // Tukar status (true jadi false, false jadi true)

        extraCerts.forEach(card => {
            if (isShowingMore) {
                card.classList.remove('d-none'); // Munculkan
            } else {
                card.classList.add('d-none'); // Sembunyikan
            }
        });

        // Ganti Teks dan Icon
        if (isShowingMore) {
            showMoreBtn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
        } else {
            showMoreBtn.innerHTML = 'Show More <i class="fas fa-chevron-down"></i>';
        }
    });
});

const menu = document.querySelector('#mobile-menu');
const menuLinks = document.querySelector('.nav-links');

if (menu) {
    menu.addEventListener('click', function() {
        menu.classList.toggle('is-active');
        menuLinks.classList.toggle('active');
    });
}

// Menutup menu otomatis saat salah satu link diklik
document.querySelectorAll('.nav-links a').forEach(n => n.addEventListener('click', () => {
    menu.classList.remove('is-active');
    menuLinks.classList.remove('active');
}));