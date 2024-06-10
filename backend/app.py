from flask import Flask, jsonify, send_from_directory, request
from flask_cors import CORS
import pandas as pd

app = Flask(__name__, static_folder='../frontend/build', static_url_path='/')
CORS(app)

@app.route('/upload',methods=['POST'])
def upload():
    if 'file' not in request.files:
        return jsonify({"error": "No file part"})

    file = request.files['file']

    if file.filename == '':
        return jsonify({"error": "No selected file"})

    if file and file.filename.endswith('.xlsx'):
        df = pd.read_excel(file)
        description = df.describe().to_json()
        return description

    return jsonify({"error": "Invalid file format"})


if __name__ == '__main__':
    app.run(debug=True)
