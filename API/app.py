from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import re
import bcrypt

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

def init_db():
    try:
        conn = sqlite3.connect('airplane.db')
        cur = conn.cursor()
        cur.execute('''
            CREATE TABLE IF NOT EXISTS Airplane (
                numSer INTEGER PRIMARY KEY,
                manufacturer VARCHAR(100),
                modelNum VARCHAR(100),
                typeRating VARCHAR(100)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS interCity (
                cityID INTEGER PRIMARY KEY,
                cityName VARCHAR(100),
                cityCountry VARCHAR(100)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS Staff (
                id VARCHAR(100) PRIMARY KEY,
                firstName VARCHAR(100),
                surname VARCHAR(100),
                salary FLOAT
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS Contact (
                id INTEGER PRIMARY KEY,
                staffID VARCHAR(100),
                homeAddress VARCHAR(100),
                workAddress VARCHAR(100),
                homePhoneNum VARCHAR(100),
                workPhoneNum VARCHAR(100),
                FOREIGN KEY(staffID) REFERENCES Staff(id)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS Pilot (
                id VARCHAR(100) PRIMARY KEY,
                typeRating VARCHAR(100),
                FOREIGN KEY(id) REFERENCES Staff(id)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS Flight (
                flightNum INTEGER PRIMARY KEY,
                numSer INTEGER,
                origin VARCHAR(100),
                destination VARCHAR(100),
                arrTime TIME,
                departureTime TIME,
                FOREIGN KEY (numSer) REFERENCES Airplane(numSer)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS flightCrew (
                staffID VARCHAR(100),
                flightNum INTEGER,
                PRIMARY KEY (staffID, flightNum),
                FOREIGN KEY (staffID) REFERENCES Staff(id),
                FOREIGN KEY (flightNum) REFERENCES Flight(flightNum)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS flightPath (
                flightNum INTEGER,
                cityID INTEGER,
                PRIMARY KEY (flightNum, cityID),
                FOREIGN KEY (flightNum) REFERENCES Flight(flightNum),
                FOREIGN KEY (cityID) REFERENCES interCity(cityID)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS Passenger (
                passengerID VARCHAR(100) PRIMARY KEY,
                firstName VARCHAR(100),
                surname VARCHAR(100),
                password BLOB
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS PassengerContact (
                passengerID VARCHAR(100) PRIMARY KEY,
                homeAddress VARCHAR(100),
                workAddress VARCHAR(100),
                homePhoneNumber VARCHAR(100),
                workPhoneNumber VARCHAR(100),
                FOREIGN KEY (passengerID) REFERENCES Passenger(passengerID)
            )
        ''')
        cur.execute('''
            CREATE TABLE IF NOT EXISTS Booking (
                passengerID VARCHAR(100),
                flightNum Integer,
                PRIMARY KEY (passengerID, flightNum),
                FOREIGN KEY (passengerID) REFERENCES Passenger(passengerID),
                FOREIGN KEY (flightNum) REFERENCES Flight(flightNum)
            )
        ''')
        conn.commit()
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

init_db()

@app.route('/api/intercity', methods=['POST'])
def add_city():
    data = request.get_json()
    cityID = data.get('cityID')
    cityName = data.get('cityName')
    cityCountry = data.get('cityCountry')

    if not cityName or not cityCountry:
        return jsonify({'message': 'All fields are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        cur.execute(
            'INSERT INTO interCity (cityID, cityName, cityCountry) VALUES (?, ?, ?)',
            (cityID, cityName, cityCountry)
        )
        conn.commit()
        city_id = cur.lastrowid
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'City added successfully', 'status': 'success', 'id': city_id}), 200

@app.route('/api/airplanes', methods=['POST'])
def add_airplane():
    data = request.get_json()
    serialNum = data.get('serialNumber')
    manufacturer = data.get('manufacturer')
    modelNum = data.get('modelNumber')
    typeRating = data.get('typeRating')

    if not serialNum or not manufacturer or not modelNum or not typeRating:
        return jsonify({'message': 'All fields are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        cur.execute(
            'INSERT INTO Airplane (numSer, manufacturer, modelNum, typeRating) VALUES (?, ?, ?, ?)',
            (serialNum, manufacturer, modelNum, typeRating)
        )
        conn.commit()
    except sqlite3.IntegrityError:
        return jsonify({'message': 'Airplane with this serial number already exists', 'status': 'error'}), 409
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Airplane added successfully', 'status': 'success', 'id': serialNum}), 200


@app.route('/api/staff', methods=['POST'])
def add_staff():
    data = request.get_json()
    firstName = data.get('firstName')
    surname = data.get('surname')
    salary = data.get('salary')
    homeAddress = data.get('homeAddress')
    workAddress = data.get('workAddress')
    homePhoneNum = data.get('homePhoneNum')
    workPhoneNum = data.get('workPhoneNum')

    if not firstName or not surname or not salary or not homeAddress or not workAddress or not homePhoneNum or not workPhoneNum:
        return jsonify({'message': 'All fields are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()

    # Generate initial ID
    base_id = (firstName[0] + surname).lower()
    staff_id = base_id
    id_suffix = 1

    # Check for uniqueness and adjust ID if necessary
    cur.execute('SELECT id FROM Staff WHERE id = ?', (staff_id,))
    while cur.fetchone() is not None:
        staff_id = f"{base_id}{id_suffix}"
        id_suffix += 1
        cur.execute('SELECT id FROM Staff WHERE id = ?', (staff_id,))

    try:
        cur.execute(
            'INSERT INTO Staff (id, firstName, surname, salary) VALUES (?, ?, ?, ?)',
            (staff_id, firstName, surname, salary)
        )
        cur.execute(
            'INSERT INTO Contact (staffID, homeAddress, workAddress, homePhoneNum, workPhoneNum) VALUES (?, ?, ?, ?, ?)',
            (staff_id, homeAddress, workAddress, homePhoneNum, workPhoneNum)
        )
        conn.commit()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Staff and contact added successfully', 'status': 'success', 'id': staff_id}), 200

@app.route('/api/pilot', methods=['POST'])
def add_pilot():
    data = request.get_json()
    staff_id = data.get('staffID')
    type_rating = data.get('typeRating')

    if not staff_id or not type_rating:
        return jsonify({'message': 'All fields are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        # Check if the staff member exists in the Staff table
        cur.execute('SELECT id FROM Staff WHERE id = ?', (staff_id,))
        staff = cur.fetchone()
        if not staff:
            return jsonify({'message': f'Staff ID {staff_id} does not exist', 'status': 'error'}), 404

        # If staff exists, insert into the Pilot table
        cur.execute(
            'INSERT INTO Pilot (id, typeRating) VALUES (?, ?)',
            (staff_id, type_rating)
        )
        conn.commit()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Pilot added successfully', 'status': 'success', 'id': staff_id}), 200


@app.route('/api/flight', methods=['POST'])
def add_flight():
    data = request.get_json()
    flight_num = data.get('flightNum')
    num_ser = data.get('numSer')
    origin = data.get('origin')
    destination = data.get('destination')
    arr_time = data.get('arrTime')
    departure_time = data.get('departureTime')
    pilot_id = data.get('pilotID')

    if not flight_num or not num_ser or not origin or not destination or not arr_time or not departure_time or not pilot_id:
        return jsonify({'message': 'All fields are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        # Check if the pilotID exists in the Pilot table
        cur.execute('SELECT typeRating FROM Pilot WHERE id = ?', (pilot_id,))
        pilot_rating = cur.fetchone()
        if not pilot_rating:
            return jsonify({'message': f'Pilot ID {pilot_id} does not exist', 'status': 'error'}), 400

        # Check if numSer exists in the Airplane table
        cur.execute('SELECT typeRating FROM Airplane WHERE numSer = ?', (num_ser,))
        plane_rating = cur.fetchone()
        if not plane_rating:
            return jsonify({'message': f'Airplane serial number {num_ser} does not exist', 'status': 'error'}), 400

        # Compare ratings (assuming A is the highest and F is the lowest)
        if pilot_rating[0] > plane_rating[0]:
            return jsonify({'message': f'Pilot rating {pilot_rating[0]} is not sufficient for Airplane rating {plane_rating[0]}', 'status': 'error'}), 400

        # Insert into Flight table
        cur.execute(
            'INSERT INTO Flight (flightNum, numSer, origin, destination, arrTime, departureTime) VALUES (?, ?, ?, ?, ?, ?)',
            (flight_num, num_ser, origin, destination, arr_time, departure_time)
        )

        # Add the pilot to the flightCrew table
        cur.execute(
            'INSERT INTO flightCrew (staffID, flightNum) VALUES (?, ?)',
            (pilot_id, flight_num)
        )
        
        conn.commit()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Flight and pilot added successfully', 'status': 'success', 'flightNum': flight_num, 'pilotID': pilot_id}), 200

@app.route('/api/flightcrew', methods=['POST'])
def add_flight_crew():
    data = request.get_json()
    staff_id = data.get('staffID')
    flight_num = data.get('flightNum')

    if not staff_id or not flight_num:
        return jsonify({'message': 'Both staffID and flightNum are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        # Check if staffID exists in the Staff table
        cur.execute('SELECT id FROM Staff WHERE id = ?', (staff_id,))
        staff = cur.fetchone()
        if not staff:
            return jsonify({'message': f'Staff ID {staff_id} does not exist', 'status': 'error'}), 400

        # Check if flightNum exists in the Flight table
        cur.execute('SELECT flightNum FROM Flight WHERE flightNum = ?', (flight_num,))
        flight = cur.fetchone()
        if not flight:
            return jsonify({'message': f'Flight number {flight_num} does not exist', 'status': 'error'}), 400

        # If both exist, insert into flightCrew
        cur.execute(
            'INSERT INTO flightCrew (staffID, flightNum) VALUES (?, ?)',
            (staff_id, flight_num)
        )
        conn.commit()
    except sqlite3.IntegrityError as e:
        # Check for unique constraint violation
        if 'UNIQUE constraint failed' in str(e):
            return jsonify({'message': f'Crew member {staff_id} is already assigned to flight {flight_num}', 'status': 'error'}), 400
        return jsonify({'message': str(e), 'status': 'error'}), 500
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Crew member added to flight successfully', 'status': 'success', 'staffID': staff_id, 'flightNum': flight_num}), 200

@app.route('/api/flightpath', methods=['POST'])
def add_flight_path():
    data = request.get_json()
    flight_num = data.get('flightNum')
    city_id = data.get('cityID')

    if not flight_num or not city_id:
        return jsonify({'message': 'Both flightNum and cityID are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        # Check if flightNum exists in the Flight table
        cur.execute('SELECT flightNum FROM Flight WHERE flightNum = ?', (flight_num,))
        flight = cur.fetchone()
        if not flight:
            return jsonify({'message': f'Flight number {flight_num} does not exist', 'status': 'error'}), 400

        # Check if cityID exists in the interCity table
        cur.execute('SELECT cityID FROM interCity WHERE cityID = ?', (city_id,))
        city = cur.fetchone()
        if not city:
            return jsonify({'message': f'City ID {city_id} does not exist', 'status': 'error'}), 400

        # If both exist, insert into flightPath
        cur.execute(
            'INSERT INTO flightPath (flightNum, cityID) VALUES (?, ?)',
            (flight_num, city_id)
        )
        conn.commit()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Flight path added successfully', 'status': 'success', 'flightNum': flight_num, 'cityID': city_id}), 200

@app.route('/api/passenger', methods=['POST'])
def add_passenger():
    data = request.get_json()
    passenger_id = data.get('username')
    firstName = data.get('firstName')
    surname = data.get('surname')
    password = data.get('password')
    homeAddress = data.get('homeAddress')
    workAddress = data.get('workAddress')
    homePhoneNumber = data.get('homePhoneNumber')
    workPhoneNumber = data.get('workPhoneNumber')

    if not passenger_id or not firstName or not surname or not password or not homeAddress or not workAddress or not homePhoneNumber or not workPhoneNumber:
        return jsonify({'message': 'All fields are required', 'status': 'error'}), 400

    hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        # Insert into Passenger table
        cur.execute(
            'INSERT INTO Passenger (passengerID, firstName, surname, password) VALUES (?, ?, ?, ?)',
            (passenger_id, firstName, surname, hashed_password)
        )

        # Insert into PassengerContact table
        cur.execute(
            'INSERT INTO PassengerContact (passengerID, homeAddress, workAddress, homePhoneNumber, workPhoneNumber) VALUES (?, ?, ?, ?, ?)',
            (passenger_id, homeAddress, workAddress, homePhoneNumber, workPhoneNumber)
        )
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Passenger and contact added successfully', 'status': 'success', 'id': passenger_id}), 200

@app.route('/api/booking', methods=['POST'])
def add_booking():
    data = request.get_json()
    passenger_id = data.get('passengerID')
    flight_num = data.get('flightNum')

    if not passenger_id or not flight_num:
        return jsonify({'message': 'Both passengerID and flightNum are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        # Check if passengerID exists in the Passenger table
        cur.execute('SELECT passengerID FROM Passenger WHERE passengerID = ?', (passenger_id,))
        passenger = cur.fetchone()
        if not passenger:
            return jsonify({'message': f'Passenger ID {passenger_id} does not exist', 'status': 'error'}), 400

        # Check if flightNum exists in the Flight table
        cur.execute('SELECT flightNum FROM Flight WHERE flightNum = ?', (flight_num,))
        flight = cur.fetchone()
        if not flight:
            return jsonify({'message': f'Flight number {flight_num} does not exist', 'status': 'error'}), 400

        # If both exist, insert into Booking
        cur.execute(
            'INSERT INTO Booking (passengerID, flightNum) VALUES (?, ?)',
            (passenger_id, flight_num)
        )
        conn.commit()
    except sqlite3.IntegrityError as e:
        # Check for unique constraint violation
        if 'UNIQUE constraint failed' in str(e):
            return jsonify({'message': f'Booking for passenger ID {passenger_id} on flight {flight_num} already exists', 'status': 'error'}), 400
        # Handle other constraint violations
        if 'FOREIGN KEY constraint failed' in str(e):
            return jsonify({'message': 'Foreign key constraint failed', 'status': 'error'}), 400
        return jsonify({'message': str(e), 'status': 'error'}), 500
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': 'Booking added successfully', 'status': 'success', 'passengerID': passenger_id, 'flightNum': flight_num}), 200

@app.route('/api/bookings/<string:passenger_id>', methods=['GET'])
def get_bookings(passenger_id):
    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        cur.execute('''
            SELECT f.flightNum, f.origin, f.destination, f.arrTime, f.departureTime
            FROM Booking b
            JOIN Flight f ON b.flightNum = f.flightNum
            WHERE b.passengerID = ?
        ''', (passenger_id,))
        bookings = cur.fetchall()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    if not bookings:
        return jsonify({'message': f'No bookings found for passenger ID {passenger_id}', 'status': 'error'}), 404

    result = []
    for booking in bookings:
        result.append({
            'flightNumber': booking[0],
            'origin': booking[1],
            'destination': booking[2],
            'arrivalTime': booking[3],
            'departureTime': booking[4]
        })

    return jsonify({'bookings': result, 'status': 'success'}), 200

@app.route('/api/flights', methods=['GET'])
def get_flights():
    origin = request.args.get('origin')
    destination = request.args.get('destination')

    query = 'SELECT flightNum, origin, destination, arrTime, departureTime FROM Flight WHERE 1=1'
    params = []

    if origin:
        query += ' AND origin = ?'
        params.append(origin)
    if destination:
        query += ' AND destination = ?'
        params.append(destination)

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        cur.execute(query, params)
        flights = cur.fetchall()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    if not flights:
        return jsonify({'message': 'No flights found matching the criteria', 'status': 'error'}), 404

    result = []
    for flight in flights:
        result.append({
            'flightNumber': flight[0],
            'origin': flight[1],
            'destination': flight[2],
            'arrivalTime': flight[3],
            'departureTime': flight[4]
        })

    return jsonify({'flights': result, 'status': 'success'}), 200

@app.route('/api/flightcrew/<string:empNum>', methods=['GET'])
def get_flight_by_emp_num(empNum):
    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        cur.execute('''
            SELECT f.flightNum, f.origin, f.destination, f.arrTime, f.departureTime
            FROM flightCrew fc
            JOIN Flight f ON fc.flightNum = f.flightNum
            WHERE fc.staffID = ?
        ''', (empNum,))
        flights = cur.fetchall()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    if not flights:
        return jsonify({'message': f'No flights found for employee number {empNum}', 'status': 'error'}), 404

    result = []
    for flight in flights:
        result.append({
            'flightNumber': flight[0],
            'origin': flight[1],
            'destination': flight[2],
            'arrivalTime': flight[3],
            'departureTime': flight[4]
        })

    return jsonify({'flights': result, 'status': 'success'}), 200

@app.route('/api/flights/search/', defaults={'flight_num': ''}, methods=['GET'])
@app.route('/api/flights/search/<string:flight_num>', methods=['GET'])
def search_flights(flight_num):
    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        if flight_num:
            # Use a LIKE query to search for matching flight numbers
            like_query = f"%{flight_num}%"
            cur.execute('''
                SELECT flightNum, origin, destination, arrTime, departureTime
                FROM Flight
                WHERE flightNum LIKE ?
            ''', (like_query,))
        else:
            # Select all flights if no flight number is provided
            cur.execute('''
                SELECT flightNum, origin, destination, arrTime, departureTime
                FROM Flight
            ''')
        flights = cur.fetchall()
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    if not flights:
        return jsonify({'message': f'No flights found matching flight number pattern {flight_num}', 'status': 'error'}), 404

    result = []
    for flight in flights:
        result.append({
            'flightNumber': flight[0],
            'origin': flight[1],
            'destination': flight[2],
            'arrivalTime': flight[3],
            'departureTime': flight[4]
        })

    return jsonify({'flights': result, 'status': 'success'}), 200

@app.route('/api/flight/<int:flight_num>', methods=['DELETE'])
def delete_flight(flight_num):
    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        # Start a transaction
        conn.execute('BEGIN TRANSACTION')

        # Delete from flightCrew table
        cur.execute('DELETE FROM flightCrew WHERE flightNum = ?', (flight_num,))

        # Delete from flightPath table
        cur.execute('DELETE FROM flightPath WHERE flightNum = ?', (flight_num,))

        # Delete from Booking table
        cur.execute('DELETE FROM Booking WHERE flightNum = ?', (flight_num,))

        # Delete from Flight table
        cur.execute('DELETE FROM Flight WHERE flightNum = ?', (flight_num,))

        # Commit the transaction
        conn.commit()
    except sqlite3.Error as e:
        conn.rollback()
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()

    return jsonify({'message': f'Flight number {flight_num} and its dependencies deleted successfully', 'status': 'success'}), 200

@app.route('/api/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        return jsonify({'message': 'Username and password are required', 'status': 'error'}), 400

    conn = sqlite3.connect('airplane.db')
    cur = conn.cursor()
    try:
        cur.execute('SELECT password FROM Passenger WHERE passengerID = ?', (username,))
        user = cur.fetchone()
        if user and bcrypt.checkpw(password.encode('utf-8'), user[0]):
            return jsonify({'message': 'Login successful', 'status': 'success', 'username': username}), 200
        else:
            return jsonify({'message': 'Username or password incorrect', 'status': 'error'}), 401
    except sqlite3.Error as e:
        return jsonify({'message': str(e), 'status': 'error'}), 500
    finally:
        conn.close()
        
if __name__ == '__main__':
    app.run(debug=True)
