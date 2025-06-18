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
    date_str = data.get("date")
    time_str = data.get("Time")
    location = data.get("location")
    capacity = data.get("capacity")
    category_id = data.get("category_id")

    if not all([title, description, date_str, time_str, location, capacity, category_id]):
        return jsonify({"error": "All fields are required"}), 400

    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Invalid category"}), 404

    existing_event = Event.query.filter_by(
        title=title, date=datetime.fromisoformat(f"{date_str}T{time_str}"), category_id=category_id
    ).first()

    if existing_event:
        return jsonify({"error": "Event already exists with the same title, date, and category"}), 400

    try:
        full_datetime_str = f"{date_str}T{time_str}"
        date = datetime.fromisoformat(full_datetime_str)
    except ValueError:
        return jsonify({"error": "Invalid date or time format. Expected format: YYYY-MM-DD and HH:MM:SS"}), 400

    event = Event(
        title=title,
        description=description,
        date=date,
        location=location,
        capacity=capacity,
        category_id=category_id,
        created_by=user.id
    )

    db.session.add(event)
    db.session.commit()

    return jsonify({
        "success": "Event created successfully",
        "event": {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "capacity": event.capacity,
            "category_id": event.category_id,
            "created_by": event.created_by
        }
    }), 200


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

    return jsonify({"success": "Events fetched successfully", "events": event_list}), 200


# GET event by ID
@event_bp.route("/<int:event_id>", methods=["GET"])
def get_event_by_id(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    return jsonify({
        "success": "Event fetched successfully",
        "event": {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "capacity": event.capacity,
            "category_id": event.category_id,
            "created_by": event.created_by
        }
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
    title = data.get("title")
    description = data.get("description")
    date_str = data.get("date")
    time_str = data.get("Time")
    location = data.get("location")
    capacity = data.get("capacity")
    category_id = data.get("category_id")

    if not all([title, description, date_str, time_str, location, capacity, category_id]):
        return jsonify({"error": "All fields are required"}), 400

    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Invalid category"}), 404

    try:
        full_datetime_str = f"{date_str}T{time_str}"
        event.date = datetime.fromisoformat(full_datetime_str)
    except ValueError:
        return jsonify({"error": "Invalid date or time format. Expected format: YYYY-MM-DD and HH:MM:SS"}), 400

    event.title = title
    event.description = description
    event.location = location
    event.capacity = capacity
    event.category_id = category_id

    db.session.commit()

    return jsonify({
        "success": "Event updated successfully",
        "event": {
            "id": event.id,
            "title": event.title,
            "description": event.description,
            "date": event.date,
            "location": event.location,
            "capacity": event.capacity,
            "category_id": event.category_id,
            "created_by": event.created_by
        }
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
