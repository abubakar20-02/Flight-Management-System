import sqlite3

# Connect to SQLite database (it will create the database file if it doesn't exist)
conn = sqlite3.connect('airplane.db')
# Commit the changes and close the connection
conn.commit()
conn.close()
conn = sqlite3.connect('airplane_test.db')
conn.commit()
conn.close()
