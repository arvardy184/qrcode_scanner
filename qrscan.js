document.addEventListener('DOMContentLoaded', () => {
    const qrReader = new Html5QrcodeScanner('qr-reader', {
      qrbox: {
        width: 250,
        height: 250,
      },
      fps: 30,
    });
  
    qrReader.render(onScanSuccess, onScanError);
  
    let scannedData = null;
  
    function onScanSuccess(decodedText, decodedResult) {
      console.log(`Scan result: ${decodedText}`, decodedResult);
      scannedData = decodedText;
      displayScanResult(decodedText);
    }
  
    function onScanError(errorMessage) {
      console.error('Error when scanning QR Code:', errorMessage);
    }
  
    function displayScanResult(decodedText) {
      const resultContainer = document.getElementById('qr-reader-results');
      const lastResult = resultContainer.innerText;
      const newResult = decodedText;
  
      if (newResult !== lastResult) {
        resultContainer.innerText = newResult;
      }
    }
  
    const saveAttendanceBtn = document.getElementById('save-atd-btn');
    saveAttendanceBtn.addEventListener('click', () => {
      if (scannedData) {
        const dataToSend = { ticket_uuid: scannedData };

        if (!isValidDataToSend(dataToSend)) {
          alert('Data tidak valid. Silakan pindai ulang QR Code.');
          return;
        }

        fetch('/presensi', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSend),
        })
        .then(response => {
          if (!response.ok) {
            throw new Error('Terjadi kesalahan saat menyimpan absensi.');
          }
          return response.json();
        })
        .then(data => {
          console.log('Respon dari backend:', data);
          alert('Absensi berhasil disimpan!');
        })
        .catch(error => {
          console.error('Terjadi kesalahan:', error);
          alert('Terjadi kesalahan saat menyimpan absensi.');
        });
      } else {
        alert('Scan QR Code terlebih dahulu sebelum menyimpan absensi.');
      }
    });


    function isValidDataToSend(data){
      return data.ticker_uuid !== undefined && data.ticker_uuid.trim() !== '';
    }
    
  });