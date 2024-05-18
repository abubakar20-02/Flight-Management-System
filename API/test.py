import unittest
import json
import bcrypt
import sqlite3
from app import app, init_db

class FlaskTestCase(unittest.TestCase):
    
    def setUp(self):
        # Create a test client
        self.app = app.test_client()
        self.app.testing = True

        # Initialize the database and add test data
        init_db()
        self.add_test_data()

    def add_test_data(self):
        # Add test data to the database
        conn = sqlite3.connect('airplane.db')
        cur = conn.cursor()
        
        # Add sample data for testing
        cur.execute('''
            INSERT INTO Passenger (passengerID, firstName, surname, password)
            VALUES (?, ?, ?, ?)
        ''', ('testuser', 'Test', 'User', bcrypt.hashpw('password'.encode('utf-8'), bcrypt.gensalt())))
        
        cur.execute('''
            INSERT INTO Airplane (numSer, manufacturer, modelNum, typeRating)
            VALUES (?, ?, ?, ?)
        ''', (123, 'Boeing', '737', 'B'))

        cur.execute('''
            INSERT INTO Staff (id, firstName, surname, salary)
            VALUES (?, ?, ?, ?)
        ''', ('pilot1', 'John', 'Doe', 50000.0))

        cur.execute('''
            INSERT INTO Staff (id, firstName, surname, salary)
            VALUES (?, ?, ?, ?)
        ''', ('pilot2', 'John', 'Wick', 100000.0))

        cur.execute('''
            INSERT INTO Pilot (id, typeRating)
            VALUES (?, ?)
        ''', ('pilot1', 'B'))
        
        cur.execute('''
            INSERT INTO Flight (flightNum, numSer, origin, destination, arrTime, departureTime)
            VALUES (?, ?, ?, ?, ?, ?)
        ''', (1, 123, 'NYC', 'LAX', '12:00:00', '15:00:00'))
        
        cur.execute('''
            INSERT INTO Booking (passengerID, flightNum)
            VALUES (?, ?)
        ''', ('testuser', 1))

        cur.execute('''
            INSERT INTO flightCrew (staffID, flightNum)
            VALUES (?, ?)
        ''', ('pilot1', 1))

        cur.execute('''
            INSERT INTO interCity (cityID, cityName, cityCountry)
            VALUES (?, ?, ?)
        ''', (1, 'Chicago', 'USA'))

        conn.commit()
        conn.close()

    def tearDown(self):
        # Clean up the database after each test
        conn = sqlite3.connect('airplane.db')
        cur = conn.cursor()
        cur.execute('DELETE FROM Airplane')
        cur.execute('DELETE FROM Booking')
        cur.execute('DELETE FROM Contact')
        cur.execute('DELETE FROM Flight')
        cur.execute('DELETE FROM Passenger')
        cur.execute('DELETE FROM PassengerContact')
        cur.execute('DELETE FROM Pilot')
        cur.execute('DELETE FROM Staff')
        cur.execute('DELETE FROM flightCrew')
        cur.execute('DELETE FROM flightPath')
        cur.execute('DELETE FROM interCity')
        conn.commit()
        conn.close()

    def test_login_success(self):
        response = self.app.post('/api/login', data=json.dumps({
            'username': 'testuser',
            'password': 'password'
        }), content_type='application/json')
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['username'], 'testuser')

    def test_login_failure(self):
        response = self.app.post('/api/login', data=json.dumps({
            'username': 'wronguser',
            'password': 'password'
        }), content_type='application/json')
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 401)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Username or password incorrect')

    def test_login_missing_fields(self):
        response = self.app.post('/api/login', data=json.dumps({
            'username': '',
            'password': ''
        }), content_type='application/json')
        
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Username and password are required')

    def test_add_city(self):
        response = self.app.post('/api/intercity', data=json.dumps({
            'cityID': 2,
            'cityName': 'Los Angeles',
            'cityCountry': 'USA'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_add_city_missing_fields(self):
        response = self.app.post('/api/intercity', data=json.dumps({
            'cityID': 3,
            'cityName': '',
            'cityCountry': ''
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'All fields are required')

    def test_add_airplane(self):
        response = self.app.post('/api/airplanes', data=json.dumps({
            'serialNumber': 124,
            'manufacturer': 'Airbus',
            'modelNumber': 'A320',
            'typeRating': 'C'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_add_airplane_existing_serial(self):
        response = self.app.post('/api/airplanes', data=json.dumps({
            'serialNumber': 123,
            'manufacturer': 'Boeing',
            'modelNumber': '747',
            'typeRating': 'A'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 409)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Airplane with this serial number already exists')

    def test_add_staff(self):
        response = self.app.post('/api/staff', data=json.dumps({
            'firstName': 'Jane',
            'surname': 'Doe',
            'salary': 60000.0,
            'homeAddress': '123 Home St',
            'workAddress': '456 Work Ave',
            'homePhoneNum': '555-555-5555',
            'workPhoneNum': '555-555-5556'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_add_staff_missing_fields(self):
        response = self.app.post('/api/staff', data=json.dumps({
            'firstName': '',
            'surname': '',
            'salary': '',
            'homeAddress': '',
            'workAddress': '',
            'homePhoneNum': '',
            'workPhoneNum': ''
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'All fields are required')

    def test_add_pilot(self):
        response = self.app.post('/api/pilot', data=json.dumps({
            'staffID': 'pilot2',
            'typeRating': 'B'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_add_pilot_missing_fields(self):
        response = self.app.post('/api/pilot', data=json.dumps({
            'staffID': '',
            'typeRating': ''
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'All fields are required')

    def test_add_flight(self):
        response = self.app.post('/api/flight', data=json.dumps({
            'flightNum': 2,
            'numSer': 123,
            'origin': 'LAX',
            'destination': 'SFO',
            'arrTime': '16:00:00',
            'departureTime': '18:00:00',
            'pilotID': 'pilot1'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_add_flight_invalid_airplane(self):
        response = self.app.post('/api/flight', data=json.dumps({
            'flightNum': 3,
            'numSer': 999,
            'origin': 'LAX',
            'destination': 'SFO',
            'arrTime': '16:00:00',
            'departureTime': '18:00:00',
            'pilotID': 'pilot1'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Airplane serial number 999 does not exist')

    def test_add_flight_crew(self):
        response = self.app.post('/api/flightcrew', data=json.dumps({
            'staffID': 'pilot1',
            'flightNum': 1
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')

    def test_add_flight_crew_invalid_flight(self):
        response = self.app.post('/api/flightcrew', data=json.dumps({
            'staffID': 'pilot1',
            'flightNum': 999
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Flight number 999 does not exist')

    def test_add_flight_path(self):
        response = self.app.post('/api/flightpath', data=json.dumps({
            'flightNum': 1,
            'cityID': 1
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_add_flight_path_invalid_city(self):
        response = self.app.post('/api/flightpath', data=json.dumps({
            'flightNum': 1,
            'cityID': 999
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'City ID 999 does not exist')

    def test_add_passenger(self):
        response = self.app.post('/api/passenger', data=json.dumps({
            'username': 'passenger1',
            'firstName': 'Alice',
            'surname': 'Smith',
            'password': 'securepassword',
            'homeAddress': '123 Main St',
            'workAddress': '456 Work Blvd',
            'homePhoneNumber': '555-123-4567',
            'workPhoneNumber': '555-987-6543'
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')

    def test_add_passenger_missing_fields(self):
        response = self.app.post('/api/passenger', data=json.dumps({
            'username': '',
            'firstName': '',
            'surname': '',
            'password': '',
            'homeAddress': '',
            'workAddress': '',
            'homePhoneNumber': '',
            'workPhoneNumber': ''
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'All fields are required')

    def test_same_booking(self):
        response = self.app.post('/api/booking', data=json.dumps({
            'passengerID': 'testuser',
            'flightNum': 1
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')

    def test_add_booking_invalid_passenger(self):
        response = self.app.post('/api/booking', data=json.dumps({
            'passengerID': 'invaliduser',
            'flightNum': 1
        }), content_type='application/json')

        data = json.loads(response.data)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'Passenger ID invaliduser does not exist')

    def test_get_bookings(self):
        response = self.app.get('/api/bookings/testuser')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(len(data['bookings']), 1)

    def test_get_bookings_invalid_user(self):
        response = self.app.get('/api/bookings/invaliduser')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(data['status'], 'error')
        self.assertEqual(data['message'], 'No bookings found for passenger ID invaliduser')

    def test_get_flights(self):
        response = self.app.get('/api/flights')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(len(data['flights']), 1)

    def test_get_flight_by_emp_num(self):
        response = self.app.get('/api/flightcrew/pilot1')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(len(data['flights']), 1)

    def test_search_flights(self):
        response = self.app.get('/api/flights/search/1')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(len(data['flights']), 1)

    def test_delete_flight(self):
        response = self.app.delete('/api/flight/1')
        data = json.loads(response.data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(data['status'], 'success')
        self.assertEqual(data['message'], 'Flight number 1 and its dependencies deleted successfully')

if __name__ == '__main__':
    unittest.main()
