import os
import json

def load_questions():
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, '..', '..', 'Questions', 'Qs.json')
        with open(json_file_path, 'r') as json_file:
            return json.load(json_file)
    except Exception as e:
        print(f"Error loading questions: {e}")
        return None

def save_questions(data):
    try:
        base_dir = os.path.dirname(os.path.abspath(__file__))
        json_file_path = os.path.join(base_dir, '..', '..', 'Questions', 'Qs.json')
        with open(json_file_path, 'w') as json_file:
            json.dump(data, json_file, indent=2)
        return True
    except Exception as e:
        print(f"Error saving questions: {e}")
        return False
