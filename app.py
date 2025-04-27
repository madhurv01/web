from flask import Flask, request, redirect, url_for, send_file, jsonify
import sqlite3
import bcrypt
import os
import random
import string
import time
import logging

app = Flask(__name__)

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Function to create and initialize the database with retry logic
def init_db():
    retries = 5
    for attempt in range(retries):
        try:
            with sqlite3.connect('usercredentials.db', timeout=10) as conn:
                cursor = conn.cursor()
                # Users table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        username TEXT NOT NULL UNIQUE,
                        password TEXT NOT NULL
                    )
                ''')
                # Complaints table
                cursor.execute('''
                    CREATE TABLE IF NOT EXISTS complaints (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        address TEXT NOT NULL,
                        phone TEXT NOT NULL,
                        issue TEXT NOT NULL,
                        details TEXT NOT NULL,
                        date TEXT NOT NULL,
                        code TEXT NOT NULL UNIQUE,
                        status TEXT NOT NULL
                    )
                ''')
                # Enable WAL mode for better concurrency
                cursor.execute('PRAGMA journal_mode=WAL;')
                conn.commit()
            logging.info("usercredentials.db initialized successfully")
            break
        except sqlite3.OperationalError as e:
            if "database is locked" in str(e) and attempt < retries - 1:
                logging.warning(f"usercredentials.db locked, retrying {attempt + 1}/{retries}...")
                time.sleep(2)
            else:
                logging.error(f"Failed to initialize usercredentials.db: {str(e)}")
                raise

# Generate a unique 6-digit alphanumeric code
def generate_unique_code():
    characters = string.ascii_uppercase + string.digits
    while True:
        code = ''.join(random.choice(characters) for _ in range(6))
        with sqlite3.connect('usercredentials.db', timeout=10) as conn:
            cursor = conn.cursor()
            cursor.execute('SELECT code FROM complaints WHERE code = ?', (code,))
            if not cursor.fetchone():
                return code

# Initialize the database at startup
init_db()

@app.route('/')
def index():
    return send_file('index.html')

@app.route('/login')
def login():
    return send_file('User_login.html')

@app.route('/gov_login')
def gov_login():
    return send_file('gov_login.html')

@app.route('/register', methods=['POST'])
def register():
    try:
        name = request.form['name']
        username = request.form['username']
        password = request.form['password']
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())
        with sqlite3.connect('usercredentials.db', timeout=10) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO users (name, username, password) VALUES (?, ?, ?)',
                           (name, username, hashed_password))
            conn.commit()
        return redirect(url_for('dashboard'))
    except sqlite3.IntegrityError:
        return "Username already exists.", 400
    except sqlite3.OperationalError as e:
        return f"Database error: {str(e)}", 500
    except Exception as e:
        return f"An error occurred: {str(e)}", 500

@app.route('/dashboard')
def dashboard():
    return send_file('user_dashboard.html')

@app.route('/gov_dashboard')
def gov_dashboard():
    return send_file('gov_dashboard.html')

@app.route('/complaint')
def complaint():
    return send_file('complaint.html')

@app.route('/track_complaint')
def track_complaint():
    return send_file('track_complaint.html')

@app.route('/submit_complaint', methods=['POST'])
def submit_complaint():
    try:
        name = request.form['name']
        address = request.form['address']
        phone = request.form['phone']
        issue = request.form['issue']
        details = request.form['details']
        date = request.form['date']
        code = generate_unique_code()
        status = "Active"

        with sqlite3.connect('usercredentials.db', timeout=10) as conn:
            cursor = conn.cursor()
            cursor.execute('INSERT INTO complaints (name, address, phone, issue, details, date, code, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                           (name, address, phone, issue, details, date, code, status))
            conn.commit()

        return redirect(url_for('view_complaint', code=code))

    except sqlite3.OperationalError as e:
        return f"Database error: {str(e)}", 500
    except Exception as e:
        return f"An error occurred: {str(e)}", 500

@app.route('/view_complaint/<code>')
def view_complaint(code):
    return send_file('view_complaint.html')

@app.route('/view_complaints')
def view_complaints():
    return send_file('view_complaints.html')

@app.route('/report_emergency')
def report_emergency():
    return send_file('report_emergency.html')

@app.route('/about')
def about():
    return send_file('about.html')

@app.route('/get_complaint/<code>')
def get_complaint(code):
    try:
        with sqlite3.connect('usercredentials.db', timeout=10) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM complaints WHERE code = ?', (code,))
            complaint = cursor.fetchone()
        if complaint:
            return jsonify({
                'name': complaint['name'],
                'address': complaint['address'],
                'phone': complaint['phone'],
                'issue': complaint['issue'],
                'details': complaint['details'],
                'date': complaint['date'],
                'code': complaint['code'],
                'status': complaint['status']
            })
        return jsonify({'error': 'Complaint not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/track_complaint/<code>')
def track_complaint_by_code(code):
    try:
        with sqlite3.connect('usercredentials.db', timeout=10) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM complaints WHERE code = ?', (code,))
            complaint = cursor.fetchone()
        if complaint:
            return jsonify({
                'code': complaint['code'],
                'name': complaint['name'],
                'address': complaint['address'],
                'phone': complaint['phone'],
                'issue': complaint['issue'],
                'details': complaint['details'],
                'date': complaint['date'],
                'status': complaint['status']
            })
        return jsonify({'error': 'Complaint not found'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/get_complaints')
def get_complaints():
    try:
        with sqlite3.connect('usercredentials.db', timeout=10) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM complaints')
            complaints = cursor.fetchall()
            return jsonify([dict(complaint) for complaint in complaints])
    except sqlite3.OperationalError as e:
        logging.error(f"Database error in get_complaints: {str(e)}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        logging.error(f"Unexpected error in get_complaints: {str(e)}")
        return jsonify({'error': str(e)}), 500

# Updated route to get emergency complaints (No Water Supply)
@app.route('/get_emergency_complaints')
def get_emergency_complaints():
    try:
        with sqlite3.connect('usercredentials.db', timeout=10) as conn:
            conn.row_factory = sqlite3.Row
            cursor = conn.cursor()
            cursor.execute('SELECT * FROM complaints WHERE issue = ?', ("No Water Supply",))
            complaints = cursor.fetchall()
            return jsonify([dict(complaint) for complaint in complaints])
    except sqlite3.OperationalError as e:
        logging.error(f"Database error in get_emergency_complaints: {str(e)}")
        return jsonify({'error': 'Database error'}), 500
    except Exception as e:
        logging.error(f"Unexpected error in get_emergency_complaints: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    # Run in single-threaded mode to avoid SQLite locking issues
    app.run(debug=True, threaded=False)