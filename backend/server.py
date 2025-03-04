from flask import Flask, jsonify, abort, request
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

def save_questions(data):
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, '..', 'Questions', 'Qs.json')
        with open(json_file_path, 'w') as json_file:
            json.dump(data, json_file, indent=2)
        return True
    except Exception as e:
        print(f"Error saving questions: {e}")
        return False

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

@app.route('/add_question', methods=['POST'])
def add_question():
    if not request.is_json:
        abort(400, description="Request must be JSON")
    data = request.get_json()
    category = data.get('category')
    question = data.get('question')
    options = data.get('options')
    if not category or not question or not options:
        abort(400, description="Missing 'category', 'question', or 'options'")
    if not isinstance(options, list) or not all(isinstance(opt, str) for opt in options):
        abort(400, description="'options' must be a list of strings")
    if category not in questions_data:
        abort(400, description="Category does not exist")
    new_question = {
        "question": question,
        "options": options
    }
    questions_data[category].append(new_question)
    if save_questions(questions_data):
        return jsonify({"message": "Question added successfully"}), 201
    else:
        abort(500, description="Failed to save questions data.")

@app.route('/bulk_upload', methods=['POST'])
def bulk_upload():
    """
    Bulk upload questions.
    Request body (example):
    [
      {
        "category": "Business Method Levels",
        "question": "Bulk question 1?",
        "options": ["Option A", "Option B"]
      },
      {
        "category": "Product/Service Levels",
        "question": "Bulk question 2?",
        "options": ["Option X", "Option Y"]
      }
    ]
    """
    if not request.is_json:
        abort(400, description="Request must be JSON")

    data = request.get_json()
    if not isinstance(data, list):
        abort(400, description="Payload must be a list of question objects")

    for item in data:
        category = item.get('category')
        question = item.get('question')
        options = item.get('options')

        # Validate presence
        if not category or not question or not options:
            abort(400, description="Missing 'category', 'question', or 'options' in one of the items")

        # Validate category existence
        if category not in questions_data:
            # Optionally, automatically create the category
            # Or you can require that the category exist
            questions_data[category] = []

        questions_data[category].append({
            "question": question,
            "options": options
        })

    if save_questions(questions_data):
        return jsonify({"message": "Bulk questions uploaded successfully"}), 201
    else:
        abort(500, description="Failed to save bulk questions.")

# --- New Endpoint to Submit Responses ---
@app.route('/submit_responses', methods=['POST'])
def submit_responses():
    if not request.is_json:
        abort(400, description="Request must be JSON")
    data = request.get_json()

    # Extract email and responses from the request body
    email = data.get('email')
    responses = data.get('responses')

    if not email or not responses:
        abort(400, description="Missing 'email' or 'responses' in request body")

    # Placeholder: Save responses (for now, print them)
    print(f"Received responses from email: {email}")
    print(f"Responses: {responses}")

    # You can extend this to save responses to a database or a file

    return jsonify({"message": "Responses saved successfully"}), 200

@app.route('/delete_question', methods=['DELETE'])
def delete_question():
    """
    Delete a specific question from a category.
    Request body:
    {
      "category": "Business Method Levels",
      "question": "What is the strategy?"
    }
    """
    if not request.is_json:
        abort(400, description="Request must be JSON")

    data = request.get_json()
    category = data.get('category')
    question_text = data.get('question')

    if not category or not question_text:
        abort(400, description="Missing 'category' or 'question' in request body")

    if category not in questions_data:
        abort(400, description="Category does not exist")

    updated_questions = [
        q for q in questions_data[category]
        if q['question'] != question_text
    ]

    if len(updated_questions) == len(questions_data[category]):
        abort(404, description="Question not found")

    questions_data[category] = updated_questions

    if save_questions(questions_data):
        return jsonify({"message": "Question deleted successfully"}), 200
    else:
        abort(500, description="Failed to save updated data.")

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8000)


# Send a POST request to /submit_responses when the quiz is complete.
# Example payload: 
# {
# "email": "user@example.com",
# "responses": [
#  {"category": "Business Method Levels", "score": 1},
#   {"category": "Product/Service Levels", "score": 0}
#  ]
# } 

