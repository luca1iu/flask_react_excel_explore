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

@app.route('/upload',methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    if file and file.filename.endswith('.xlsx'):
        file_path = os.path.join(upload_folder, file.filename)
        file.save(file_path)
        df = pd.read_excel(file_path)
        description = df.describe().to_json()
        return description

    return jsonify({"error": "Invalid file format"})


if __name__ == '__main__':
    app.run(debug=True)
