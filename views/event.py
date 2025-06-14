from flask import Blueprint, request, jsonify
from models import db, Event, Category, User

event_bp = Blueprint("event_bp", __name__)


# CREATE an event
@event_bp.route("/", methods=["POST"])
def create_event():
    data = request.get_json()
    title = data.get("title")
    description = data.get("description")
    date = data.get("date")
    location = data.get("location")
    capacity = data.get("capacity")
    category_id = data.get("category_id")
    created_by = data.get("created_by")  # admin user ID

    # Validates the required fields
    if not all([title, description, date, location, capacity, category_id, created_by]):
        return jsonify({"error": "All fields are required"}), 400

    # Validates if creator is an admin
    creator = User.query.get(created_by)
    if not creator or not creator.is_admin:
        return jsonify({"error": "Invalid or unauthorized admin"}), 403

    # Validate category
    category = Category.query.get(category_id)
    if not category:
        return jsonify({"error": "Invalid category"}), 404

    event = Event(
        title=title,
        description=description,
        date=date,
        location=location,
        capacity=capacity,
        category_id=category_id,
        created_by=created_by
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


# UPDATE an event
@event_bp.route("/<int:event_id>", methods=["PUT", "PATCH"])
def update_event(event_id):
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


# DELETE an event
@event_bp.route("/<int:event_id>", methods=["DELETE"])
def delete_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    db.session.delete(event)
    db.session.commit()
    return jsonify({"success": "Event deleted"}), 200
