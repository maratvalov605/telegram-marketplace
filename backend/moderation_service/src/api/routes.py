from flask import Flask, request, jsonify
from services.content_moderator import ContentModerator

app = Flask(__name__)
moderator = ContentModerator()


@app.route('/api/moderate/text', methods=['POST'])
def moderate_text():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({"error": "No text provided"}), 400

    result = moderator.moderate_text(text)
    return jsonify(result)


@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy"})