from flask import Flask, jsonify, abort
from flask_cors import CORS
import os
import json

app = Flask(__name__)
CORS(app)

def load_questions():
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, '..', 'Questions', 'Qs.json')
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
        return data
    except Exception as e:
        print(f"Error loading questions: {e}")
        return None

questions_data = load_questions()

@app.route('/get_questions', methods=['GET'])
def get_questions():
    if questions_data is not None:
        return jsonify(questions_data)
    else:
        abort(500, description="Failed to load questions data.")

@app.route('/info', methods=['GET'])
def info():
    return jsonify({"message": "This is the backend server for our capstone project."})


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)