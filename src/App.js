import React from 'react';
import './App.css';

const App = () => {
  const [img, setimg] = React.useState('');
  const [load, setload] = React.useState(false);
  const [qrdata, setqrdata] = React.useState('');
  const [qrsize, setqrsize] = React.useState(150);

  function gen_QRCode() {
    setload(true);
    setimg('');
    const size = encodeURIComponent(qrsize);
    const data = encodeURIComponent(qrdata);
    fetch(`https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${data}`)
      .then((response) => response.url)
      .then((url) => {
        setimg(url);
        setload(false);
      })
      .catch(() => {
        setload(false);
      });
  }

  const downloadQRCode = async () => {
    if (!img) return;
    
    try {
      const response = await fetch(img);
      const blob = await response.blob();
      const downloadLink = document.createElement('a');
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = `qrcode-${Date.now()}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (error) {
      console.error('Download failed:', error);
    }
  };

  return (
    <div>
      <h1 style={{textAlign: 'center', display: 'inline', backgroundColor: 'teal', fontFamily: 'cursive'}}>
        QR CODE GENERATOR
      </h1>
      
      {load && <p>Please Wait! Generating.....</p>}
      
      {!load && img && (
        <div className="qr-container">
          <img src={img} className="Qr-Image" alt="QR Code" />
          <button 
            className="download-button"
            onClick={downloadQRCode}
          >
            Download QR Code
          </button>
        </div>
      )}
      
      <label className="input-label">Enter data for QR-Code</label>
      <input 
        type="text" 
        id="datainput" 
        placeholder="Enter data for the QR code"
        onChange={(e) => setqrdata(e.target.value)}
      />
      
      <label className="input-label">Select the size of QR Code (e.g., 150px)</label>
      <input 
        type="text" 
        id="sizeinput" 
        placeholder="Enter size of the QR code"
        onChange={(e) => setqrsize(e.target.value)}
      />
      
      <button 
        className="generate-button" 
        onClick={gen_QRCode}
      >
        Generate QR Code
      </button>
    </div>
  );
};

export default App;