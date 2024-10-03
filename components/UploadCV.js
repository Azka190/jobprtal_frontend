import { useState } from 'react';

const UploadCV = () => {
  const [file, setFile] = useState(null);
  const [downloadLink, setDownloadLink] = useState('');

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('cv', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        setDownloadLink(data.url); // Set the download link after successful upload
      } else {
        alert(data.error);
      }
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  return (
    <div>
      <h2>Upload Your CV</h2>
      <form onSubmit={handleUpload}>
        <input type="file"  onChange={handleFileChange} required />
        <button type="submit">Upload</button>
      </form>

      {downloadLink && (
        <div>
          <h3>Download your CV:</h3>
          <a href={downloadLink} download="Your_CV.pdf">
            {console.log(downloadLink)}
            Click here to download
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadCV;

