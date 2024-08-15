from flask import Flask, jsonify
import requests
import json
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

BASE_URL = "https://bell.dev.harker.org/api/lunchmenu"
HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded"
}

# Function to fetch lunch data from api endpoint
def fetch_lunch(month, day, year):
    params = {
        "month": month,
        "day": day,
        "year": year
    }

    response = requests.get(BASE_URL, headers=HEADERS, params=params)
    if response.status_code == 200:
        return response.json()
    else:
        return None

# Get the lunch for a specific day
@app.route('/day/<int:month>/<int:day>/<int:year>', methods=['GET'])
def get_day_lunch(month, day, year):
    data = fetch_lunch(month, day, year)
    
    if data:
        return jsonify(data), 200
    else:
        return jsonify({"error": "Failed to retrieve data"}), 500

# JSON I/O for stored weeks caching
def load_stored_weeks():
    try:
        with open('storedweeks.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_stored_weeks(stored_weeks):
    with open('storedweeks.json', 'w') as f:
        json.dump(stored_weeks, f)

# Get the lunch for a specific week
@app.route('/week/<int:month>/<int:day>/<int:year>', methods=['GET'])
def get_week_lunch(month, day, year):
    # Get week dates
    target_date = datetime(year, month, day)

    if target_date.weekday() == 5:  # Saturday
        start_date = target_date - timedelta(days=5)
    elif target_date.weekday() == 6:  # Sunday
        start_date = target_date + timedelta(days=1)
    else:
        start_date = target_date - timedelta(days=target_date.weekday())

    start_date_str = start_date.strftime("%Y-%m-%d")

    stored_weeks = load_stored_weeks()

    # Check if week is cached
    if start_date_str in stored_weeks:
        return jsonify(stored_weeks[start_date_str]), 200

    # If not cached, created data manually and cache
    end_date = start_date + timedelta(days=4)
    week_lunch = []
    current_date = start_date

    while current_date <= end_date:
        day_lunch = fetch_lunch(current_date.month, current_date.day, current_date.year)
        if day_lunch:
            week_lunch.append({
                "day": current_date.strftime("%A"),
                "lunch": day_lunch,
                "weekStart": start_date_str
            })
        else:
            week_lunch.append({
                "day": current_date.strftime("%A"),
                "lunch": "empty",
                "weekStart": start_date_str
            })
        current_date += timedelta(days=1)

    stored_weeks[start_date_str] = week_lunch
    save_stored_weeks(stored_weeks)

    return jsonify(week_lunch), 200

if __name__ == "__main__":
    app.run(debug=True)