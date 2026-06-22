// app.js
console.log("App.js berhasil dimuat");

// Contoh interaksi sederhana
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("testBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      alert("Tombol berhasil diklik!");
    });
  }
});
