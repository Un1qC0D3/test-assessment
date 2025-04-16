function uploadPDFs() {
  const sozel = document.getElementById("sozel-file").files[0];
  const sayisal = document.getElementById("sayisal-file").files[0];
  const messageBox = document.getElementById("message");
  const overlay = document.getElementById("overlay");
  const button = document.getElementById("upload-btn");

  if (!sozel || !sayisal) {
    messageBox.innerHTML = "❗ Her iki dosyayı da seçmelisiniz.";
    return;
  }

  overlay.classList.add("show");

  const formData = new FormData();
  formData.append("sozel", sozel);
  formData.append("sayisal", sayisal);

  fetch("http://ogrenci.ardahasanardali.com.tr/pdf_upload.php", {
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
        window.location.href = "http://ogretmen.ardahasanardali.com.tr/";
      }, 3000);
    })
    .catch((err) => {
      overlay.classList.remove("show");
      console.error(err);
      messageBox.innerHTML = `
        <div class="alert alert-danger">❌ Bir hata oluştu. Lütfen tekrar deneyin.</div>`;
    });
}
