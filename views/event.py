from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Event, Category, User
from datetime import datetime

event_bp = Blueprint("event_bp", __name__)


# CREATE an event (admin only)
@event_bp.route("/", methods=["POST"])
@jwt_required()
def create_event():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized: Admins only"}), 403

    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    date_str = data.get("date")  # Date part
    time_str = data.get("Time")  # Time part
    location = data.get("location")
    capacity = data.get("capacity")
    category_id = data.get("category_id")

    if not all([title, description, date_str, time_str, location, capacity, category_id]):
        return jsonify({"error": "All fields are required"}), 400

    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Invalid category"}), 404

    try:
        # Combine the date and time to form a full datetime string
        full_datetime_str = f"{date_str}T{time_str}"
        # Convert the combined string to a datetime object
        date = datetime.fromisoformat(full_datetime_str)
    except ValueError:
        return jsonify({"error": "Invalid date or time format. Expected format: YYYY-MM-DD and HH:MM:SS"}), 400

    event = Event(
        title=title,
        description=description,
        date=date,  # Use the combined datetime object
        location=location,
        capacity=capacity,
        category_id=category_id,
        created_by=user.id
    )

    db.session.add(event)
    db.session.commit()

    return jsonify({
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date,
        "location": event.location,
        "capacity": event.capacity,
        "category_id": event.category_id,
        "created_by": event.created_by
    }), 201

# GET all events
@event_bp.route("/", methods=["GET"])
def get_all_events():
    events = Event.query.all()
    event_list = []

    for e in events:
        event_list.append({
            "id": e.id,
            "title": e.title,
            "description": e.description,
            "date": e.date,
            "location": e.location,
            "capacity": e.capacity,
            "category_id": e.category_id,
            "created_by": e.created_by
        })

    return jsonify(event_list), 200


# GET event by ID
@event_bp.route("/<int:event_id>", methods=["GET"])
def get_event_by_id(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    return jsonify({
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date,
        "location": event.location,
        "capacity": event.capacity,
        "category_id": event.category_id,
        "created_by": event.created_by
    }), 200


# UPDATE an event (admin only)
@event_bp.route("/<int:event_id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_event(event_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized: Admins only"}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    data = request.get_json()
    event.title = data.get("title", event.title)
    event.description = data.get("description", event.description)
    event.date = data.get("date", event.date)
    event.location = data.get("location", event.location)
    event.capacity = data.get("capacity", event.capacity)

    db.session.commit()

    return jsonify({
        "id": event.id,
        "title": event.title,
        "description": event.description,
        "date": event.date,
        "location": event.location,
        "capacity": event.capacity,
        "category_id": event.category_id,
        "created_by": event.created_by
    }), 200


# DELETE an event (admin only)
@event_bp.route("/<int:event_id>", methods=["DELETE"])
@jwt_required()
def delete_event(event_id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized: Admins only"}), 403

    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({"success": "Event deleted"}), 200
