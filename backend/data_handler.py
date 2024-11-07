import os
import json
from jsonschema import validate, ValidationError

# Define the JSON schema for questions
QUESTION_SCHEMA = {
    "type": "object",
    "properties": {
        "questions": {"type": "array"}
    },
    "required": ["questions"]
}

def load_questions():
    """Load survey questions from a JSON file."""
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, '..', 'Questions', 'Qs.json')
        with open(json_file_path, 'r') as json_file:
            data = json.load(json_file)
            validate(instance=data, schema=QUESTION_SCHEMA)  # Validate JSON structure
            return data
    except ValidationError as e:
        print(f"Question format error: {e}")
        return None
    except Exception as e:
        print(f"Error loading questions: {e}")
        return None

def save_responses(user_data):
    """Save user responses to a JSON file."""
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        responses_path = os.path.join(base_dir, 'responses.json')
        with open(responses_path, 'a') as json_file:
            json.dump(user_data, json_file)
            json_file.write('\n')  # Write each response as a new line
        return True
    except Exception as e:
        print(f"Error saving responses: {e}")
        return False
