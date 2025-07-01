from flask import Flask, request, send_file, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from PIL import Image
import torch
import io

app = Flask(__name__)
CORS(app)

# Load model once
model = YOLO('yolov8_model/best.pt')  # Your trained YOLOv8 segmentation model

@app.route('/predict', methods=['POST'])
def predict():
    if 'image' not in request.files:
        return jsonify({'error': 'No image file provided'}), 400

    file = request.files['image']
    image_bytes = file.read()

    # Convert bytes to PIL Image
    image = Image.open(io.BytesIO(image_bytes)).convert('RGB')

    # Run prediction without saving
    results = model.predict(image, save=False, imgsz=640)

    if not results or not results[0].masks:
        return jsonify({'error': 'No predictions made'}), 200

    # Plot the result on the image
    result_img = results[0].plot()  # numpy array with masks drawn

    # Convert numpy to BytesIO image
    pil_img = Image.fromarray(result_img)
    img_io = io.BytesIO()
    pil_img.save(img_io, 'JPEG')
    img_io.seek(0)

    return send_file(img_io, mimetype='image/jpeg')

if __name__ == '__main__':
    app.run(debug=True)
