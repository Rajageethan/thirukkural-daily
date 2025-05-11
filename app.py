from flask import Flask, jsonify, render_template
import firebase_admin
from firebase_admin import credentials, firestore
from datetime import datetime
import pytz
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)

firebase_info = {
    "type": os.getenv("FIREBASE_TYPE"),
    "project_id": os.getenv("FIREBASE_PROJECT_ID"),
    "private_key_id": os.getenv("FIREBASE_PRIVATE_KEY_ID"),
    "private_key": os.getenv("FIREBASE_PRIVATE_KEY").replace("\\n", "\n"),
    "client_email": os.getenv("FIREBASE_CLIENT_EMAIL"),
    "client_id": os.getenv("FIREBASE_CLIENT_ID"),
    "auth_uri": os.getenv("FIREBASE_AUTH_URI"),
    "token_uri": os.getenv("FIREBASE_TOKEN_URI"),
    "auth_provider_x509_cert_url": os.getenv("FIREBASE_AUTH_PROVIDER_CERT_URL"),
    "client_x509_cert_url": os.getenv("FIREBASE_CLIENT_CERT_URL"),
}

cred = credentials.Certificate(firebase_info)
firebase_admin.initialize_app(cred)
db = firestore.client()

def get_kural_number_for_today():
    # Use IST timezone for consistent date handling
    ist = pytz.timezone('Asia/Kolkata')
    current_date = datetime.now(ist)
    # Use date components to generate a deterministic Kural number
    day_of_year = current_date.timetuple().tm_yday
    # Map the day to a Kural number (1-1330)
    kural_number = ((day_of_year - 1) % 1330) + 1
    return str(kural_number)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/kural-of-the-day")
def get_kural_of_the_day():
    kural_id = get_kural_number_for_today()
    doc = db.collection("kurals").document(kural_id).get()
    if doc.exists:
        return jsonify(doc.to_dict())
    else:
        return jsonify({"error": "Kural not found"}), 404
    
if __name__ == "__main__":
    app.run(debug=True)