import React, {useState} from 'react';
import axios from 'axios';
import './index.css';
import Icon from './assets/icon.svg'; // 导入本地 SVG 文件

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

        axios.post('http://127.0.0.1:5000/analyze', {filename})
            .then(response => {
                console.log("Analysis received:", response.data);
                setAnalysis(response.data);
            })
            .catch(error => {
                console.error('There was an error analyzing the file!', error);
            });
    };
    const renderObject = (obj) => {
        if (!obj || typeof obj !== 'object') {
            return null;
        }

        return (<div style={{paddingLeft: '20px'}}>
            {Object.entries(obj).map(([key, value]) => (<div key={key}>
                <strong>{key}:</strong> {typeof value === 'object' ? renderObject(value) : value.toString()}
            </div>))}
        </div>);
    };

    const renderAnalysis = () => {
        if (!analysis) {
            return null;
        }

        return (<div className="analysis-box">
            <h3>Excel Data Analysis:</h3>
            <div>
                <strong>Shape:</strong> {analysis.shape}
            </div>
            <div>
                <strong>Null Info:</strong>
                <pre>{JSON.stringify(analysis.null_info, null, 2)}</pre>
            </div>
            <div>
                <strong>Distinct Values:</strong>
                <pre>{JSON.stringify(analysis.distinct_values, null, 2)}</pre>
            </div>
            <div>
                <strong>Description:</strong>
                {renderObject(analysis.description)}
            </div>
        </div>);
    };

    return (
        <div className="App">
            <header className="App-header container max-width: 640px px-50">
                <div className="navbar bg-base-100">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h8m-8 6h16"/>
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li><a>Item 1</a></li>
                                <li>
                                    <a>Parent</a>
                                    <ul className="p-2">
                                        <li><a>Submenu 1</a></li>
                                        <li><a>Submenu 2</a></li>
                                    </ul>
                                </li>
                                <li><a>Item 3</a></li>
                            </ul>
                        </div>
                        <a className="btn btn-ghost text-xl"><img src={Icon} alt="icon"
                                                                  className="h-5 w-5"/>DataFish</a>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li><a>Item 1</a></li>
                            <li>
                                <details>
                                    <summary>Parent</summary>
                                    <ul className="p-2">
                                        <li><a>Submenu 1</a></li>
                                        <li><a>Submenu 2</a></li>
                                    </ul>
                                </details>
                            </li>
                            <li><a>Item 3</a></li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <a className="btn">Button</a>
                    </div>
                </div>
                <h1 className="text-3xl font-bold underline">Excel Data Analysis</h1>
                <input type="file" onChange={handleFileChange}/>
                <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
                    <button className="btn" onClick={handleUpload}>Upload</button>
                </div>
                <button onClick={handleAnalyze} className="btn">Explore Excel</button>
                {renderAnalysis()}
            </header>
        </div>);
}


export default App;
