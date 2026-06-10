from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
from datetime import datetime

app = Flask(__name__)
CORS(app)

DATA_FILE = "users_data.json"

def load_data():
    if os.path.exists(DATA_FILE):
        with open(DATA_FILE, "r") as f:
            return json.load(f)
    return {}

def save_data(data):
    with open(DATA_FILE, "w") as f:
        json.dump(data, f, indent=2)

@app.route("/")
def home():
    return "Drona Lingua Backend is running!"

@app.route("/api/register", methods=["POST"])
def register():
    data = request.json
    username = data.get("username")
    if not username:
        return jsonify({"status": "error", "message": "Username required"}), 400

    users = load_data()
    if username not in users:
        users[username] = {
            "xp": 0,
            "level": 1,
            "hearts": 5,
            "completed_modules": [],
            "time_spent": {},
            "last_practiced": None
        }
        save_data(users)
    return jsonify({"status": "success", "username": username})

@app.route("/api/complete_module/<username>", methods=["POST"])
def complete_module(username):
    data = request.json
    module_id = data.get("module_id")
    time_taken = data.get("time_taken", 0)

    users = load_data()
    if username not in users:
        return jsonify({"status": "error"}), 404

    user = users[username]

    if module_id not in user["completed_modules"]:
        user["completed_modules"].append(module_id)
        user["xp"] += 150
        user["level"] = 1 + (user["xp"] // 500)

    user["time_spent"][str(module_id)] = time_taken
    user["last_practiced"] = datetime.now().isoformat()

    save_data(users)
    return jsonify({
        "status": "success",
        "xp": user["xp"],
        "level": user["level"],
        "completed_modules": user["completed_modules"]
    })

@app.route("/api/users", methods=["GET"])
def get_all_users():
    users = load_data()
    result = []
    for username, u in users.items():
        result.append({
            "username": username,
            "level": u.get("level", 1),
            "xp": u.get("xp", 0),
            "hearts": u.get("hearts", 5),
            "completed_modules": u.get("completed_modules", []),
            "time_spent": u.get("time_spent", {}),
            "last_practiced": u.get("last_practiced")
        })
    return jsonify(result)

if __name__ == "__main__":
    app.run(debug=True)
