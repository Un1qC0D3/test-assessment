document.addEventListener("DOMContentLoaded", () => {
  const sozelInput = document.getElementById("sozel-file");
  const sayisalInput = document.getElementById("sayisal-file");
  const cevapInput = document.getElementById("cevap-file");
  const uploadBtn = document.getElementById("upload-btn");

  function checkFilesSelected() {
    const isSozel = sozelInput.files.length > 0;
    const isSayisal = sayisalInput.files.length > 0;
    const isCevap = cevapInput.files.length > 0;
    uploadBtn.disabled = !(isSozel && isSayisal && isCevap);
  }

  sozelInput.addEventListener("change", checkFilesSelected);
  sayisalInput.addEventListener("change", checkFilesSelected);
  cevapInput.addEventListener("change", checkFilesSelected);
});

function uploadPDFs() {
  const sozel = document.getElementById("sozel-file").files[0];
  const sayisal = document.getElementById("sayisal-file").files[0];
  const cevapAnahtari = document.getElementById("cevap-file").files[0];

  const messageBox = document.getElementById("message");
  const overlay = document.getElementById("overlay");
  const button = document.getElementById("upload-btn");

  if (!sozel || !sayisal || !cevapAnahtari) {
    messageBox.innerHTML = "❗ Lütfen tüm dosyaları seçin.";
    return;
  }

  overlay.classList.add("show");

  const formData = new FormData();
  formData.append("sozel", sozel);
  formData.append("sayisal", sayisal);
  formData.append("cevap", cevapAnahtari);

  fetch("https://ogrenci.ardahasanardali.com.tr/pdf_upload.php", {
    method: "POST",
    body: formData,
  })
    .then((res) => res.json())
    .then((data) => {
      overlay.classList.remove("show");
      button.style.display = "none";

      messageBox.innerHTML = `
        <div class="alert alert-success">
          <pre>${Object.values(data).join("\n")}</pre>
          ✅ Dosyalar başarıyla yüklendi. Ana sayfaya yönlendiriliyorsunuz...
        </div>`;

      setTimeout(() => {
        window.location.href = "https://ogretmen.ardahasanardali.com.tr/";
      }, 3000);
    })
    .catch((err) => {
      overlay.classList.remove("show");
      console.error(err);
      messageBox.innerHTML = `
        <div class="alert alert-danger">❌ Bir hata oluştu. Lütfen tekrar deneyin.</div>`;
    });
}
