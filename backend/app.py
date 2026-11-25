
from flask import Flask, jsonify, request
from flask_cors import CORS
from database import get_db_connection

app = Flask(__name__)
CORS(app)


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


@app.route("/api/dashboard/stats")
def dashboard_stats():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor()

        cursor.execute("SELECT COUNT(*) FROM cameras")
        total_cameras = cursor.fetchone()[0]

        cursor.execute(
            "SELECT COUNT(*) FROM road_obstructions WHERE status = 'active'"
        )
        active_obstructions = cursor.fetchone()[0]

        cursor.execute(
            "SELECT COUNT(*) FROM alerts WHERE status = 'unread'"
        )
        unread_alerts = cursor.fetchone()[0]

        cursor.execute("SELECT COUNT(*) FROM detection_logs")
        total_detections = cursor.fetchone()[0]

        return jsonify({
            "total_cameras": total_cameras,
            "active_obstructions": active_obstructions,
            "unread_alerts": unread_alerts,
            "total_detections": total_detections
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


@app.route("/api/cameras", methods=["GET"])
def get_cameras():
    connection = None
    cursor = None

    try:
        connection = get_db_connection()
        cursor = connection.cursor(dictionary=True)

        cursor.execute("""
            SELECT
                id,
                camera_name,
                camera_code,
                location,
                latitude,
                longitude,
                status,
                created_at
            FROM cameras
            ORDER BY id DESC
        """)

        cameras = cursor.fetchall()

        return jsonify({
            "total": len(cameras),
            "cameras": cameras
        })

    except Exception as error:
        return jsonify({"error": str(error)}), 500

    finally:
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


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
            data.get("latitude"),
            data.get("longitude"),
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
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


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
            data.get("latitude"),
            data.get("longitude"),
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
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


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
        if cursor:
            cursor.close()
        if connection and connection.is_connected():
            connection.close()


if __name__ == "__main__":
    app.run(debug=True, port=5000)
