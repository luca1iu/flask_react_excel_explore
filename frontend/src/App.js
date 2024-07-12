import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [file, setFile] = useState(null);
  const [filename, setFilename] = useState(null);
  const [analysis, setAnalysis] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    console.log("File selected:", e.target.files[0]);
  };

  const handleUpload = () => {
    if (!file) {
      console.error("No file selected!");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    console.log("Uploading file...");

    axios.post('http://127.0.0.1:5000/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(response => {
      console.log("Response received:", response);
      if (response.data.filename) {
        setFilename(response.data.filename);
        console.log("File set", response.data.filename);
        alert("File uploaded successfully!");
      } else {
        console.log('Response is null or has no data!');
      }
    })
    .catch(error => {
      console.error('There was an error uploading the file!', error);
    });
  };

  const handleAnalyze = () => {
    if (!filename) {
      console.error("No file uploaded!");
      return;
    }

    console.log("Analyzing file with filename:", filename);

    axios.post('http://127.0.0.1:5000/analyze', { filename })
    .then(response => {
      console.log("Analysis received:", response.data);
      setAnalysis(response.data);
    })
    .catch(error => {
      console.error('There was an error analyzing the file!', error);
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1 className="text-3xl font-bold underline">Excel Data Analysis</h1>
        <input type="file" onChange={handleFileChange} />
        <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
          <button className="mt-10" onClick={handleUpload}>Upload</button>
        </div>
        <button onClick={handleAnalyze}>Explore Excel</button>
        {analysis && (
          <div>
            <h3>Excel Data Analysis:</h3>
            <pre>Shape: {JSON.stringify(analysis.shape)}</pre>
            <pre>Null Info: {JSON.stringify(analysis.null_info, null, 2)}</pre>
            <pre>Distinct Values: {JSON.stringify(analysis.distinct_values, null, 2)}</pre>
            <pre>Description: {JSON.stringify(analysis.description, null, 2)}</pre>
          </div>
        )}
      </header>
    </div>
  );
}

export default App;
