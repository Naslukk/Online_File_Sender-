import React, { useState } from "react";

const Form = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileLink, setFileLink] = useState(null);
  const [code,setCode] = useState(null);
  const [codeIn, setCodeIn] = useState(null);
  const [downUrl, setDownUrl] = useState(null);

  const onFileSelected = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const hadleCodeIn = async (e) =>{
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:3000/file/${codeIn}`,{ method : "POST" });

      if(response.ok){
        const result = await response.json();
        setDownUrl(result.fileUrl)
      }else{
        alert("something went wrong");
      }
    } catch (error) {
      alert("something went wrong");
    }
  }


  const handleCopyClick = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Text copied to clipboard!');
    } catch (err) {
      console.error('Unable to copy to clipboard.', err);
    }
  };


  const uploadFile = async () => {
    if (!selectedFile) {
      alert("Please select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setCode(result.code)
        setFileLink(result.fileLink);
      } else {
        console.error("File upload failed.");
      }
    } catch (error) {
      console.error("Error during file upload:", error);
    }
  };

  return (
    <div className="form-container">
      <h1>Online File Sharing</h1>
      <div>
        <h3>Send File</h3>
        <form
          action="/upload"
          method="post"
          encType="multipart/form-data"
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <label htmlFor="file" style={{ display: "grid" }}>
            {selectedFile ? (
              <div style={{ display: "grid", placeItems: "center" }}>
                <span class="material-symbols-outlined">draft</span>
                <span className="file-name">{selectedFile.name}</span>
              </div>
            ) : (
              <div style={{ display: "grid" }}>
                <span class="material-symbols-outlined">add_circle</span>
                <span> Choose a file </span>
              </div>
            )}
          </label>
          <input
            type="file"
            id="file"
            name="file"
            onChange={onFileSelected}
            required
          />
          <button
            type="button"
            onClick={uploadFile}
            style={{ gridColumn: "span 2" }}
          >
            Send
          </button>
        </form>
      </div>
      {fileLink && (
        <div style={{ marginTop: "20px" }} className="url-container">
          <p> Your file is uploaded to : </p>
          <a href={fileLink}>{fileLink}</a>
          <span
            class="material-symbols-outlined"
            onClick={() => handleCopyClick(fileLink)}
          >
            content_copy
          </span>
          <p>
            Your File Code : {code}
            <span
            class="material-symbols-outlined"
            onClick={() => handleCopyClick(code)}
          >
            content_copy
          </span>
          </p>
        </div>
      )}
      <div>
        <h3>Receive File</h3>
        <form
          style={{
            display: "flex",
            flexDirection: "column",
            maxWidth: "500px",
            margin: "0 auto",
          }}
        >
          <label htmlFor="code">Enter File Code</label>
          <input
            type="text"
            id="code"
            name="code"
            value={codeIn}
            placeholder="Enter File Code"
            onChange={(e) => setCodeIn(e.target.value)}
            required
          />
          <button
            type="submit"
            onClick={hadleCodeIn}
            style={{ gridColumn: "span 2" }}
          >
            Receive
          </button>
        </form>
        {downUrl && (
          <div style={{ marginTop: "10px" }}>
            <a href={downUrl} style={{ display: "grid" }}>
              Download Now
              <span class="material-symbols-outlined">download</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Form;
