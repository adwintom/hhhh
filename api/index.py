import os
from flask import Flask, render_template, request, jsonify
from pymongo import MongoClient
from datetime import datetime

# Clean routing back to your templates folder
app = Flask(__name__, template_folder='../templates')

MONGO_URI = os.environ.get("MONGO_URI")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)

db = client.portfolio_db
collection = db.feedbacks

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit():
    data = request.get_json()
    name = data.get('name')
    message = data.get('message')
    
    if name and message:
        try:
            collection.insert_one({
                "name": name,
                "message": message,
                "date": datetime.now().strftime("%Y-%m-%d %H:%M")
            })
            return jsonify({"status": "success"}), 200
        except Exception as e:
            print(f"Insert Error: {e}")
            return jsonify({"status": "error", "message": str(e)}), 500
            
    return jsonify({"status": "bad request"}), 400

if __name__ == "__main__":
    app.run()