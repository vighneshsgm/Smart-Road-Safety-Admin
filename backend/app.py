
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db_connection
from decimal import Decimal
from datetime import datetime, date

app = Flask(__name__)
CORS(app)


def close_db(connection, cursor):
    if cursor:
        cursor.close()

    if connection and connection.is_connected():
        connection.close()


def convert_values(rows):
    for row in rows:
        for key, value in row.items():
            if isinstance(value, Decimal):
                row[key] = float(value)
            elif isinstance(value, (datetime, date)):
                row[key] = value.isoformat()

    return rows


@app.route("/")
def home():
    return jsonify({
        "message": "Smart Road Safety System API",
        "status": "running"
    })


@app.route("/api/health")
def health():
    return jsonify({
        "status": "healthy"
    })


@app.route("/api/dashboard/stats", methods=["GET"])
def dashboard_stats():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM cameras")
        total_cameras = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM road_obstructions")
        total_obstructions = cursor.fetchone()[0]

        cursor.execute("""
            SELECT COUNT(*) FROM road_obstructions
            WHERE status = 'active'
        """)
        active_obstructions = cursor.fetchone()[0]

        cursor.execute("""
            SELECT COUNT(*) FROM road_obstructions
            WHERE severity = 'Critical' AND status = 'active'
        """)
        critical_obstructions = cursor.fetchone()[0]

        cursor.execute("""
            SELECT COUNT(*) FROM alerts
            WHERE status = 'unread'
        """)
        unread_alerts = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM detection_logs")
        total_detections = cursor.fetchone()[0]

        return jsonify({
            "total_cameras": total_cameras,
            "total_obstructions": total_obstructions,
            "active_obstructions": active_obstructions,
            "critical_obstructions": critical_obstructions,
            "unread_alerts": unread_alerts,
            "total_detections": total_detections
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        close_db(connection, cursor)


@app.route("/api/cameras", methods=["GET"])
def get_cameras():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, camera_name, camera_code, location,
                   latitude, longitude, status, created_at
            FROM cameras
            ORDER BY id DESC
        """)

        cameras = convert_values(cursor.fetchall())

        return jsonify({
            "total": len(cameras),
            "cameras": cameras
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        close_db(connection, cursor)


@app.route("/api/cameras", methods=["POST"])
def add_camera():
    connection = None
    cursor = None

    data = request.get_json(silent=True) or {}

    required = ["camera_name", "camera_code", "location"]

    if any(not data.get(field) for field in required):
        return jsonify({
            "error": "Camera name, code and location are required"
        }), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO cameras
            (camera_name, camera_code, location, latitude, longitude, status)
            VALUES (%s, %s, %s, %s, %s, %s)
        """, (
            data["camera_name"],
            data["camera_code"],
            data["location"],
            data.get("latitude") or None,
            data.get("longitude") or None,
            data.get("status", "offline")
        ))

        connection.commit()

        return jsonify({
            "message": "Camera added successfully",
            "camera_id": cursor.lastrowid
        }), 201

    except Exception as error:
        if connection:
            connection.rollback()

        return jsonify({"error": str(error)}), 400

    finally:
        close_db(connection, cursor)


@app.route("/api/cameras/<int:camera_id>", methods=["PUT"])
def update_camera(camera_id):
    connection = None
    cursor = None

    data = request.get_json(silent=True) or {}

    required = ["camera_name", "camera_code", "location", "status"]

    if any(field not in data for field in required):
        return jsonify({
            "error": "Camera name, code, location and status are required"
        }), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "SELECT id FROM cameras WHERE id = %s",
            (camera_id,)
        )

        if not cursor.fetchone():
            return jsonify({"error": "Camera not found"}), 404

        cursor.execute("""
            UPDATE cameras
            SET camera_name = %s,
                camera_code = %s,
                location = %s,
                latitude = %s,
                longitude = %s,
                status = %s
            WHERE id = %s
        """, (
            data["camera_name"],
            data["camera_code"],
            data["location"],
            data.get("latitude") or None,
            data.get("longitude") or None,
            data["status"],
            camera_id
        ))

        connection.commit()

        return jsonify({
            "message": "Camera updated successfully"
        })

    except Exception as error:
        if connection:
            connection.rollback()

        return jsonify({"error": str(error)}), 400

    finally:
        close_db(connection, cursor)


@app.route("/api/cameras/<int:camera_id>", methods=["DELETE"])
def delete_camera(camera_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM cameras WHERE id = %s",
            (camera_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"error": "Camera not found"}), 404

        connection.commit()

        return jsonify({
            "message": "Camera deleted successfully"
        })

    except Exception as error:
        if connection:
            connection.rollback()

        return jsonify({"error": str(error)}), 400

    finally:
        close_db(connection, cursor)


@app.route("/api/obstructions", methods=["GET"])
def get_obstructions():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT id, obstruction_type, description, location,
                   latitude, longitude, severity, status,
                   detected_at, resolved_at
            FROM road_obstructions
            ORDER BY id DESC
        """)

        obstructions = convert_values(cursor.fetchall())

        return jsonify({
            "total": len(obstructions),
            "obstructions": obstructions
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        close_db(connection, cursor)


@app.route("/api/obstructions", methods=["POST"])
def add_obstruction():
    connection = None
    cursor = None

    data = request.get_json(silent=True) or {}

    if not data.get("obstruction_type") or not data.get("location"):
        return jsonify({
            "error": "Obstruction type and location are required"
        }), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            INSERT INTO road_obstructions
            (obstruction_type, description, location,
             latitude, longitude, severity, status)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """, (
            data["obstruction_type"],
            data.get("description"),
            data["location"],
            data.get("latitude") or None,
            data.get("longitude") or None,
            data.get("severity"),
            data.get("status", "active")
        ))

        connection.commit()

        return jsonify({
            "message": "Obstruction added successfully",
            "obstruction_id": cursor.lastrowid
        }), 201

    except Exception as error:
        if connection:
            connection.rollback()

        return jsonify({"error": str(error)}), 400

    finally:
        close_db(connection, cursor)


@app.route("/api/obstructions/<int:obstruction_id>", methods=["PUT"])
def update_obstruction(obstruction_id):
    connection = None
    cursor = None

    data = request.get_json(silent=True) or {}

    required = ["obstruction_type", "location", "severity", "status"]

    if any(field not in data for field in required):
        return jsonify({
            "error": "Obstruction type, location, severity and status are required"
        }), 400

    if data["status"] not in ["active", "resolved"]:
        return jsonify({
            "error": "Status must be active or resolved"
        }), 400

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("""
            SELECT id FROM road_obstructions WHERE id = %s
        """, (obstruction_id,))

        if not cursor.fetchone():
            return jsonify({"error": "Obstruction not found"}), 404

        cursor.execute("""
            UPDATE road_obstructions
            SET obstruction_type = %s,
                description = %s,
                location = %s,
                latitude = %s,
                longitude = %s,
                severity = %s,
                status = %s,
                resolved_at = CASE
                    WHEN %s = 'resolved' THEN CURRENT_TIMESTAMP
                    ELSE NULL
                END
            WHERE id = %s
        """, (
            data["obstruction_type"],
            data.get("description"),
            data["location"],
            data.get("latitude") or None,
            data.get("longitude") or None,
            data["severity"],
            data["status"],
            data["status"],
            obstruction_id
        ))

        connection.commit()

        return jsonify({
            "message": "Obstruction updated successfully"
        })

    except Exception as error:
        if connection:
            connection.rollback()

        return jsonify({"error": str(error)}), 400

    finally:
        close_db(connection, cursor)


@app.route("/api/obstructions/<int:obstruction_id>", methods=["DELETE"])
def delete_obstruction(obstruction_id):
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute(
            "DELETE FROM road_obstructions WHERE id = %s",
            (obstruction_id,)
        )

        if cursor.rowcount == 0:
            return jsonify({"error": "Obstruction not found"}), 404

        connection.commit()

        return jsonify({
            "message": "Obstruction deleted successfully"
        })

    except Exception as error:
        if connection:
            connection.rollback()

        return jsonify({"error": str(error)}), 400

    finally:
        close_db(connection, cursor)


if __name__ == "__main__":
    app.run(host="127.0.0.1", port=5000, debug=True)
