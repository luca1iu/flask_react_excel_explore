from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import pandas as pd
import os

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

upload_folder = 'excelData'
if not os.path.exists(upload_folder):
    os.makedirs(upload_folder)


@app.route('/api/hello', methods=['GET'])
def hello_world():
    return jsonify(message="Hello from Flask!")


@app.route('/')
def serve():
    return send_from_directory(app.static_folder, 'index.html')


@app.route('/upload', methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    if file and file.filename.endswith('.xlsx'):
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)
        print('file_path:', file_path)
        print('file name', file.filename)
        print("message: File uploaded successfully")
        return jsonify({"message": "File uploaded successfully", "filename": file.filename})

    return jsonify({"error": "Invalid file format"})


@app.route('/analyze', methods=['POST'])
def analyze_file():
    data = request.json
    filename = data.get('filename')

    if data is None:
        return jsonify({"error": "data is None"})

    if not filename:
        return jsonify({"error": "Filename not provided"})

    file_path = os.path.join(upload_folder, filename)
    if not os.path.exists(file_path):
        return jsonify({"error": "File not found"})

    df = pd.read_excel(file_path)

    description = df.describe().to_dict()
    shape = "{} rows * {} columns".format(df.shape[0], df.shape[1])
    null_info = df.isnull().sum().to_dict()
    distinct_values = {col: df[col].nunique() for col in df.columns}

    # analysis = {
    #     "description": description,
    #     "shape": shape,
    #     "null_info": null_info,
    #     "distinct_values": distinct_values
    # }
    analysis = {
        'shape': shape,
    }

    return jsonify(analysis)


if __name__ == '__main__':
    app.run(debug=True)
