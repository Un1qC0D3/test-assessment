document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("analyze-button")
    .addEventListener("click", async () => {
      const name = document.getElementById("studentName").value.trim();
      const keyFile = document.getElementById("answerKey").files[0];
      const answerFile = document.getElementById("studentAnswers").files[0];

      if (!name || !keyFile || !answerFile) {
        alert("Lütfen tüm alanları doldurun ve dosyaları seçin.");
        return;
      }

      const keyText = await keyFile.text();
      const answerText = await answerFile.text();

      const keyLines = keyText.trim().split(/\r?\n/);
      const answerLines = answerText.trim().split(/\r?\n/);

      if (keyLines.length !== answerLines.length) {
        alert(
          "Cevap anahtarı ile öğrenci cevapları aynı sayıda satır içermelidir."
        );
        return;
      }

      const results = [];
      for (let i = 0; i < keyLines.length; i += 2) {
        const lesson = keyLines[i]?.trim() || "";
        const key = keyLines[i + 1]?.trim() || "";
        const student = answerLines[i + 1]?.trim() || "";

        let dogru = 0,
          yanlis = 0,
          bos = 0;

        for (let j = 0; j < key.length; j++) {
          const k = key[j];
          const s = student[j] || " ";
          if (s === " ") bos++;
          else if (s === k) dogru++;
          else yanlis++;
        }

        results.push({
          ders: lesson,
          dogru,
          yanlis,
          bos,
          net: (dogru - yanlis * 0.25).toFixed(2),
        });
      }

      // Toplamları hesapla
      const total = results.reduce(
        (acc, r) => {
          acc.dogru += r.dogru;
          acc.yanlis += r.yanlis;
          acc.bos += r.bos;
          acc.net += parseFloat(r.net);
          return acc;
        },
        { dogru: 0, yanlis: 0, bos: 0, net: 0 }
      );

      results.push({
        ders: "TOPLAM",
        dogru: total.dogru,
        yanlis: total.yanlis,
        bos: total.bos,
        net: total.net.toFixed(2),
      });

      // Tabloyu oluştur
      const table = document.createElement("table");
      table.className = "table table-bordered table-striped mt-4";
      table.innerHTML = `
        <thead class="table-success">
          <tr>
            <th>Ders</th>
            <th>Doğru</th>
            <th>Yanlış</th>
            <th>Boş</th>
            <th>Net</th>
          </tr>
        </thead>
        <tbody>
          ${results
            .map(
              (r) => `
            <tr${r.ders === "TOPLAM" ? ' class="table-light fw-bold"' : ""}>
              <td>${r.ders}</td>
              <td>${r.dogru}</td>
              <td>${r.yanlis}</td>
              <td>${r.bos}</td>
              <td>${r.net}</td>
            </tr>`
            )
            .join("")}
        </tbody>
      `;

      // Sonuçları göster
      const resultContainer = document.getElementById("result");
      resultContainer.innerHTML = `<h4 class="mt-4">${name} - Sonuçlar</h4>`;
      resultContainer.appendChild(table);

      // TXT indirme butonu
      const txtBtn = document.createElement("button");
      txtBtn.className = "btn btn-outline-secondary me-2 mt-3";
      txtBtn.textContent = "Sonucu TXT olarak indir";
      txtBtn.onclick = () => downloadAsText(name, results);
      resultContainer.appendChild(txtBtn);

      // Excel indirme butonu
      const excelBtn = document.createElement("button");
      excelBtn.className = "btn btn-success mt-3";
      excelBtn.textContent = "Sonucu Excel olarak indir";
      excelBtn.onclick = () => downloadAsExcel(name, results);
      resultContainer.appendChild(excelBtn);
    });

  function downloadAsText(name, results) {
    let content = `${name} Sonuçları\n\n`;
    results.forEach((r) => {
      content += `${r.ders}\nDoğru: ${r.dogru} | Yanlış: ${r.yanlis} | Boş: ${r.bos} | Net: ${r.net}\n\n`;
    });

    const blob = new Blob([content], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${name.replaceAll(" ", "_")}_sonuc.txt`;
    a.click();
  }

  function downloadAsExcel(name, results) {
    const wsData = [["Ders", "Doğru", "Yanlış", "Boş", "Net"]];
    results.forEach((r) => {
      wsData.push([r.ders, r.dogru, r.yanlis, r.bos, r.net]);
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(wsData);
    XLSX.utils.book_append_sheet(wb, ws, "Sonuçlar");
    XLSX.writeFile(wb, `${name.replaceAll(" ", "_")}_sonuc.xlsx`);
  }
});
