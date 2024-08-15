import json
import time
import requests
from datetime import datetime, timedelta
import threading

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

def load_stored_weeks():
    try:
        with open('storedweeks.json', 'r') as f:
            return json.load(f)
    except (FileNotFoundError, json.JSONDecodeError):
        return {}

def save_stored_weeks(stored_weeks):
    with open('storedweeks.json', 'w') as f:
        json.dump(stored_weeks, f, indent=4)

def get_week_lunch(start_date):
    end_date = start_date + timedelta(days=4)
    week_lunch = []
    current_date = start_date

    while current_date <= end_date:
        day_lunch = fetch_lunch(current_date.month, current_date.day, current_date.year)
        if day_lunch:
            week_lunch.append({
                "day": current_date.strftime("%A"),
                "lunch": day_lunch,
                "weekStart": start_date.strftime("%Y-%m-%d")
            })
        else:
            week_lunch.append({
                "day": current_date.strftime("%A"),
                "lunch": "empty",
                "weekStart": start_date.strftime("%Y-%m-%d")
            })
        current_date += timedelta(days=1)

    return week_lunch

def update_lunch_data():
    while True:
        try:
            stored_weeks = load_stored_weeks()
            
            today = datetime.now()
            current_week_start = today - timedelta(days=today.weekday())
            
            for i in range(21):
                week_start = current_week_start + timedelta(weeks=10) - timedelta(weeks=i)
                week_start_str = week_start.strftime("%Y-%m-%d")
                
                if week_start_str not in stored_weeks:
                    week_lunch = get_week_lunch(week_start)
                    stored_weeks[week_start_str] = week_lunch
                    print(f"Updated data for week starting {week_start_str}")
            
            cutoff_date = (current_week_start - timedelta(weeks=11)).strftime("%Y-%m-%d")
            stored_weeks = {k: v for k, v in stored_weeks.items() if k >= cutoff_date}
            
            save_stored_weeks(stored_weeks)
            print("Finished updating lunch data")
            
            time.sleep(3600)
        except Exception as e:
            print(f"An error occurred: {str(e)}")
            time.sleep(300)

if __name__ == "__main__":
    print("Starting lunch data updater...")
    update_thread = threading.Thread(target=update_lunch_data)
    update_thread.start()
    
    while True:
        time.sleep(3600)