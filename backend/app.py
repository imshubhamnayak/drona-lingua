from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # Allow requests from Vercel

# Simple in-memory storage (for now). Later we can move to database.
users = {}
progress_data = {}

@app.route('/')
def home():
    return jsonify({"message": "Drona Lingua Backend is running!"})

# Register user
@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    username = data.get('username')
    if not username:
        return jsonify({"error": "Username required"}), 400
    
    if username in users:
        return jsonify({"error": "User already exists"}), 400
    
    users[username] = {"password": data.get('password', '1234')}
    progress_data[username] = {"s_sh_completed": 0, "z_g_completed": 0, "total_score": 0}
    return jsonify({"message": "User registered successfully", "username": username})

# Login
@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    if username in users:
        return jsonify({"message": "Login successful", "username": username})
    return jsonify({"error": "User not found"}), 404

# Save progress
@app.route('/save-progress', methods=['POST'])
def save_progress():
    data = request.get_json()
    username = data.get('username')
    if not username or username not in progress_data:
        return jsonify({"error": "User not found"}), 404

    progress_data[username].update(data.get('progress', {}))
    return jsonify({"message": "Progress saved", "progress": progress_data[username]})

# Get progress
@app.route('/get-progress/<username>', methods=['GET'])
def get_progress(username):
    if username in progress_data:
        return jsonify(progress_data[username])
    return jsonify({"error": "No progress found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
