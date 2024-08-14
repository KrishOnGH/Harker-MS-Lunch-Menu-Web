from flask import Flask, jsonify
import requests
from datetime import datetime, timedelta
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# Base URL for the API
BASE_URL = "https://bell.dev.harker.org/api/lunchmenu"
HEADERS = {
    "Content-Type": "application/x-www-form-urlencoded"
}

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

def get_week_lunch(start_date):
    end_date = start_date + timedelta(days=4)
    week_lunch = []
    current_date = start_date

    while current_date <= end_date:
        day_lunch = fetch_lunch(current_date.month, current_date.day, current_date.year)
        if day_lunch:
            week_lunch.append({
                "day": current_date.strftime("%A"),
                "lunch": day_lunch
            })
        else:
            week_lunch.append({
                "day": current_date.strftime("%A"),
                "lunch": "empty"
            })
        current_date += timedelta(days=1)

    return week_lunch

# Get the lunch for 21 weeks (10 before, current week, 10 after)
@app.route('/bulkweeks/<int:month>/<int:day>/<int:year>', methods=['GET'])
def get_bulk_weeks_lunch(month, day, year):
    target_date = datetime(year, month, day)

    if target_date.weekday() == 5:  # Saturday
        start_of_week = target_date - timedelta(days=5)
    elif target_date.weekday() == 6:  # Sunday
        start_of_week = target_date + timedelta(days=1)
    else:
        start_of_week = target_date - timedelta(days=target_date.weekday())

    start_date = start_of_week - timedelta(weeks=2)

    bulk_weeks = []
    for i in range(5):
        week_start = start_date + timedelta(weeks=i)
        week_lunch = get_week_lunch(week_start)
        print(f'week {i} fetched')
        bulk_weeks.append({
            "weekStart": week_start.strftime("%Y-%m-%d"),
            "lunch": week_lunch
        })

    return jsonify(bulk_weeks), 200

if __name__ == "__main__":
    app.run(debug=True)
