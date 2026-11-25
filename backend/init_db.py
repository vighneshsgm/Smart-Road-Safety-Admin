
from database import get_db_connection

connection = get_db_connection()
cursor = connection.cursor()

queries = [
    """
    CREATE TABLE IF NOT EXISTS admin_users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(150) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'admin',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS cameras (
        id INT AUTO_INCREMENT PRIMARY KEY,
        camera_name VARCHAR(150) NOT NULL,
        camera_code VARCHAR(50) UNIQUE NOT NULL,
        location VARCHAR(255),
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        status VARCHAR(30) DEFAULT 'offline',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS road_obstructions (
        id INT AUTO_INCREMENT PRIMARY KEY,
        obstruction_type VARCHAR(100) NOT NULL,
        description TEXT,
        location VARCHAR(255),
        latitude DECIMAL(10,7),
        longitude DECIMAL(10,7),
        severity VARCHAR(30),
        status VARCHAR(30) DEFAULT 'active',
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        resolved_at TIMESTAMP NULL
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS alerts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(200) NOT NULL,
        message TEXT,
        severity VARCHAR(30),
        status VARCHAR(30) DEFAULT 'unread',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """,
    """
    CREATE TABLE IF NOT EXISTS detection_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        camera_id INT,
        event_type VARCHAR(100) NOT NULL,
        confidence DECIMAL(5,2),
        detected_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (camera_id) REFERENCES cameras(id)
        ON DELETE SET NULL
    )
    """
]

try:
    for query in queries:
        cursor.execute(query)

    connection.commit()
    print("All Database Tables Created Successfully!")

except Exception as error:
    connection.rollback()
    print("Table Creation Failed:", error)

finally:
    cursor.close()
    connection.close()
