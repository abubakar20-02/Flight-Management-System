import sqlite3
import bcrypt
from datetime import datetime, timedelta
from random import choice, randint, sample
from app import init_db

# List of UK places
uk_places = [
    'London', 'Manchester', 'Liverpool', 'Birmingham', 'Leeds', 'Glasgow', 
    'Edinburgh', 'Bristol', 'Cardiff', 'Belfast', 'Newcastle', 'Sheffield', 
    'Nottingham', 'Leicester', 'Brighton'
]

# List of type ratings
type_ratings = ['A', 'B', 'C', 'D', 'E', 'F']

def init_db():
    try:
        conn = sqlite3.connect('airplane.db')
        cur = conn.cursor()
        
        # Dropping tables if they exist
        tables = ['Airplane', 'interCity', 'Staff', 'Contact', 'Pilot', 'Flight', 'flightCrew', 'flightPath', 'Passenger', 'PassengerContact', 'Booking']
        for table in tables:
            cur.execute(f'DROP TABLE IF EXISTS {table}')
        
        # Creating tables
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
                arrTime DATETIME,
                departureTime DATETIME,
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
        print("Database and tables created successfully.")
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

def insert_test_data():
    try:
        conn = sqlite3.connect('airplane.db')
        cur = conn.cursor()

        # Inserting data into Airplane table
        airplanes = [
            (1, 'Boeing', '737', 'A'),
            (2, 'Airbus', 'A320', 'B'),
            (3, 'Boeing', '747', 'C'),
            (4, 'Airbus', 'A380', 'D'),
            (5, 'Embraer', 'E190', 'E')
        ]
        cur.executemany('INSERT INTO Airplane (numSer, manufacturer, modelNum, typeRating) VALUES (?, ?, ?, ?)', airplanes)
        print("Airplane data inserted successfully.")

        # Inserting data into interCity table
        cities = [(i + 1, place, 'UK') for i, place in enumerate(uk_places)]
        cur.executemany('INSERT INTO interCity (cityID, cityName, cityCountry) VALUES (?, ?, ?)', cities)
        print("interCity data inserted successfully.")

        # Inserting data into Staff table
        staff = [
            ('S001', 'John', 'Doe', 70000),
            ('S002', 'Jane', 'Smith', 75000),
            ('S003', 'Jim', 'Brown', 60000),
            ('S004', 'Jack', 'White', 80000),
            ('S005', 'Jill', 'Green', 72000)
        ]
        cur.executemany('INSERT INTO Staff (id, firstName, surname, salary) VALUES (?, ?, ?, ?)', staff)
        print("Staff data inserted successfully.")

        # Inserting data into Contact table
        contacts = [
            (1, 'S001', '123 Elm St', '456 Oak St', '555-1234', '555-5678'),
            (2, 'S002', '789 Pine St', '101 Maple St', '555-8765', '555-4321'),
            (3, 'S003', '234 Birch St', '567 Cedar St', '555-3456', '555-6789'),
            (4, 'S004', '890 Spruce St', '321 Fir St', '555-6543', '555-9876'),
            (5, 'S005', '456 Aspen St', '678 Redwood St', '555-9876', '555-1234')
        ]
        cur.executemany('INSERT INTO Contact (id, staffID, homeAddress, workAddress, homePhoneNum, workPhoneNum) VALUES (?, ?, ?, ?, ?, ?)', contacts)
        print("Contact data inserted successfully.")

        # Inserting data into Pilot table
        pilots = [
            ('S001', 'A'),
            ('S002', 'A'),
            ('S003', 'A'),
            ('S004', 'A'),
            ('S005', 'A')
        ]
        cur.executemany('INSERT INTO Pilot (id, typeRating) VALUES (?, ?)', pilots)
        print("Pilot data inserted successfully.")

        # Inserting data into Flight table with random UK places
        base_time = datetime.now()
        flights = []
        for i in range(1, 101):
            origin, destination = sample(uk_places, 2)
            arr_time = (base_time + timedelta(hours=randint(1, 5))).strftime('%Y-%m-%d %H:%M:%S')
            dep_time = base_time.strftime('%Y-%m-%d %H:%M:%S')
            airplane = choice(airplanes)
            flights.append((i, airplane[0], origin, destination, arr_time, dep_time))
            base_time += timedelta(hours=1)

        cur.executemany('INSERT INTO Flight (flightNum, numSer, origin, destination, arrTime, departureTime) VALUES (?, ?, ?, ?, ?, ?)', flights)
        print("Flight data inserted successfully.")

        # Inserting data into flightCrew table
        assigned_crews = []
        flight_crews = []
        for i in range(1, 101):
            staff_id = f'S00{randint(1, 5)}'
            assigned_crews.append((staff_id, i))
            flight_crews.append((staff_id, i))

        cur.executemany('INSERT INTO flightCrew (staffID, flightNum) VALUES (?, ?)', flight_crews)
        print("flightCrew data inserted successfully.")

        # Inserting data into flightPath table
        flight_paths = []
        assigned_paths = set()
        for i in range(1, 101):
            city_ids = sample(range(1, len(uk_places) + 1), randint(2, 4))
            for city_id in city_ids:
                if (i, city_id) not in assigned_paths:
                    assigned_paths.add((i, city_id))
                    flight_paths.append((i, city_id))

        cur.executemany('INSERT INTO flightPath (flightNum, cityID) VALUES (?, ?)', flight_paths)
        print("flightPath data inserted successfully.")

        # Inserting data into Passenger table with hashed passwords
        password = b'password'  # All passwords are set to 'password'
        hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
        passengers = [
            ('P001', 'Alice', 'Johnson', hashed_password),
            ('P002', 'Bob', 'Lee', hashed_password),
            ('P003', 'Charlie', 'Kim', hashed_password),
            ('P004', 'Diana', 'Wang', hashed_password),
            ('P005', 'Ethan', 'Clark', hashed_password)
        ]
        cur.executemany('INSERT INTO Passenger (passengerID, firstName, surname, password) VALUES (?, ?, ?, ?)', passengers)
        print("Passenger data inserted successfully.")

        # Inserting data into PassengerContact table
        passenger_contacts = [
            ('P001', '789 Apple St', '123 Peach St', '555-6789', '555-1234'),
            ('P002', '456 Banana St', '789 Grape St', '555-8765', '555-4321'),
            ('P003', '123 Cherry St', '456 Lime St', '555-3456', '555-6789'),
            ('P004', '789 Fig St', '123 Plum St', '555-6543', '555-9876'),
            ('P005', '456 Kiwi St', '789 Pear St', '555-9876', '555-1234')
        ]
        cur.executemany('INSERT INTO PassengerContact (passengerID, homeAddress, workAddress, homePhoneNumber, workPhoneNumber) VALUES (?, ?, ?, ?, ?)', passenger_contacts)
        print("PassengerContact data inserted successfully.")

        # Inserting data into Booking table
        assigned_bookings = set()
        bookings = []
        for _ in range(100):
            while True:
                passenger_id = f'P00{randint(1, 5)}'
                flight_num = randint(1, 100)
                if (passenger_id, flight_num) not in assigned_bookings:
                    assigned_bookings.add((passenger_id, flight_num))
                    bookings.append((passenger_id, flight_num))
                    break

        cur.executemany('INSERT INTO Booking (passengerID, flightNum) VALUES (?, ?)', bookings)
        print("Booking data inserted successfully.")

        conn.commit()
    except sqlite3.Error as e:
        print(f"An error occurred: {e}")
    finally:
        if conn:
            conn.close()

if __name__ == "__main__":
    init_db()  # Ensure the database and tables are created
    insert_test_data()  # Insert the test data
