
from database import get_db_connection

connection = get_db_connection()
cursor = connection.cursor()

query = """
INSERT INTO cameras
(camera_name, camera_code, location, latitude, longitude, status)
VALUES (%s, %s, %s, %s, %s, %s)
"""

cameras = [
    ("Main Gate Camera", "CAM001", "SGMCOE Main Gate", 16.2250000, 74.3500000, "online"),
    ("College Road Camera", "CAM002", "College Road", 16.2260000, 74.3510000, "online"),
    ("Bridge Camera", "CAM003", "Demo Bridge Location", 16.2270000, 74.3520000, "offline")
]

try:
    cursor.executemany(query, cameras)
    connection.commit()
    print(cursor.rowcount, "Camera Records Inserted Successfully!")

except Exception as error:
    connection.rollback()
    print("Insertion Failed:", error)

finally:
    cursor.close()
    connection.close()
