# Harker Lunch Menu

This is a modern UI application built with Next.js and Tailwind CSS that interactively displays the Harker lunch menu. The app is responsive and provides easy navigation, allowing users on any device to navigate through the current or past lunch schedule(s) with ease.

## Features

- **Responsive Design**: The app adjusts between single-view and multi-view layouts based on the screen width.
- **Calendar Navigation**: Users can select specific dates using a built-in calendar component.
- **Dynamic Height Adjustment**: The app ensures consistent height across schedule entries, matching the height of the largest entry.
- **Parallax Tilt**: Schedule entries have a subtle parallax tilt effect for an engaging user experience.

## File Structure

- **/backend**: Contains `main.py` for backend operations.
- **/web**: The Next.js frontend application.
- **reloadweeks.py**: Script to update the cached JSON data.
- **storedweeks.json**: Cached JSON data for the lunch schedule.

## Setup Instructions

### Prerequisites

Ensure you have the following installed:

- Node.js and npm
- Python (for backend operations)

### Installation

1. **Clone the repository:**

   `git clone https://github.com/yourusername/harker-lunch-menu.git`

   `cd harker-lunch-menu`

2. **Install dependencies for the frontend:**

   `cd web`

   `npm install`

3. **Install dependencies for the backend (new terminal):**

   `cd backend`

   `pip install -r requirements.txt`

### Running the Application

1. **Start the backend server (new terminal):**

   `cd backend`

   `python main.py`

2. **Start the frontend development server (new terminal):**

   `cd web`

   `npm run dev`

The application should now be running at `http://localhost:3000` (frontend) and `http://localhost:5000` (backend).

## Updating Cached Data

To update the cached data in `storedweeks.json`, run this in it's own terminal:

   `python reloadweeks.py`

## License
This project is licensed under the MIT License.