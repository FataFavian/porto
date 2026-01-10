let curtain = document.querySelector(".curtain");

window.addEventListener("scroll", function () {
  let value = window.scrollY;
  curtain.style.left = value + "px"; //70px
});

// Tunggu hingga semua konten HTML selesai dimuat
document.addEventListener("DOMContentLoaded", function() {

  // 1. Pilih semua elemen yang ingin kita animasikan
  const fadeElements = document.querySelectorAll('.fade-on-scroll');

  // 2. Siapkan opsi untuk Intersection Observer
  const observerOptions = {
    root: null, // 'null' berarti mengamati relatif terhadap viewport
    rootMargin: '0px',
    threshold: 0.1 // Memicu animasi saat 10% elemen terlihat
  };

  // 3. Buat fungsi 'callback' yang akan dijalankan
  const observerCallback = (entries, observer) => {
    entries.forEach(entry => {
      // Cek apakah elemennya 'intersecting' (masuk ke layar)
      if (entry.isIntersecting) {
        
        // Tambahkan kelas '.is-visible' ke elemen
        entry.target.classList.add('is-visible');
        
        // (Opsional tapi sangat disarankan)
        // Berhenti mengamati elemen ini setelah animasinya
        // dipicu agar tidak boros resource.
        observer.unobserve(entry.target);
      }
    });
  };

  // 4. Buat Observer-nya
  const observer = new IntersectionObserver(observerCallback, observerOptions);

  // 5. Minta Observer untuk mengamati setiap elemen
  fadeElements.forEach(el => {
    observer.observe(el);
  });

});