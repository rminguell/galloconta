import os
import time
from flask import Flask, request, render_template, send_from_directory, jsonify
from inference import predict, load_model
from flask_cors import CORS
from ftpretty import ftpretty
from functools import wraps
import config

def clear_folder(folder_path):
    for filename in os.listdir(folder_path):
        file_path = os.path.join(folder_path, filename)
        try:
            if os.path.isfile(file_path):
                os.remove(file_path)
        except Exception as e:
            print(config.FTP_UPLOAD_ERROR.format(file_path, e))

def authenticate(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        auth = request.authorization
        if not auth or auth.username !=  os.getenv('BASIC_AUTH_USER') or auth.password !=  os.getenv('BASIC_AUTH_PASS'):
            return jsonify({"message": "Authentication required"}), 401
        return f(*args, **kwargs)
    return decorated_function

app = Flask(__name__, template_folder='app')

CORS(app, origins=config.CORS_ORIGINS)

os.makedirs(config.INPUT_FOLDER, exist_ok=True)
os.makedirs(config.OUTPUT_FOLDER, exist_ok=True)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/<path:filename>')
def front_static(filename):
    return send_from_directory('app', filename)

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return config.UPLOAD_ERROR, 400
    file = request.files['file']
    if file.filename == '':
        return config.NO_FILE_SELECTED, 400

    param_1 = request.form.get('param_1', type=float, default=100*(1-config.DEFAULT_CONF))
    param_2 = request.form.get('param_2', type=float, default=100*(1-config.DEFAULT_IOU))

    conf = 1 - param_1/100
    iou = 1 - param_2/100
    
    clear_folder(config.INPUT_FOLDER)
    clear_folder(config.OUTPUT_FOLDER)

    epoch_time = str(int(time.time()))
    file_extension = os.path.splitext(file.filename)[1]
    unique_filename = f"{epoch_time}{file_extension}"

    file_path = os.path.join(config.INPUT_FOLDER, unique_filename)
    file.save(file_path)

    result_image_path, object_count = predict(file_path, conf, iou)

    return jsonify({
        'input_image': file_path,
        'result_image': result_image_path,
        'object_count' : object_count,
    })

def upload_file_to_ftp(file_path, file_name):
    try:
        ftp_host = os.getenv('FTP_HOST')
        ftp_user = os.getenv('FTP_USER')
        ftp_pass = os.getenv('FTP_PASS')
        ftp = ftpretty(ftp_host, ftp_user, ftp_pass)
        ftp.put(file_path, file_name)
        ftp.close()
        return f"{config.FTP_UPLOAD_SUCCESS} {file_name}"
    except Exception as e:
        print(f"{config.FTP_UPLOAD_ERROR} {file_name} - {e}")
        return None

@app.route('/feedback', methods=['POST'])
def feedback():
    data = request.get_json()
    if not data or 'like' not in data or 'fileName' not in data:
        return config.INVALID_DATA, 400

    like = data['like']
    file_name = data['fileName']
    source_path = os.path.join(config.INPUT_FOLDER, file_name)

    if not like and os.path.exists(source_path):
        ftp_result = upload_file_to_ftp(source_path, file_name)
        if ftp_result:
            print(ftp_result)
            return jsonify({"message": config.FEEDBACK_SUCCESS_FTP})
        else:
            return jsonify({"message": config.FEEDBACK_ERROR_FTP}), 500

    return jsonify({"message": config.FEEDBACK_SUCCESS})

@app.route('/input/<filename>')
def uploaded_file(filename):
    return send_from_directory(config.INPUT_FOLDER, filename)

@app.route('/output/<filename>')
def output_file(filename):
    return send_from_directory(config.OUTPUT_FOLDER, filename)

@app.route('/update', methods=['GET'])
@authenticate
def update_model():
    load_model(update=True)
    return jsonify({"message": "Model updated successfully"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)
