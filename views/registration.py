from flask import Blueprint, request, jsonify
from models import db, User, Event, EventRegistration
from sqlalchemy.exc import IntegrityError

registration_bp = Blueprint("registration_bp", __name__)

# REGISTER a user for an event  
@registration_bp.route("/", methods=["POST"])
def create_registration():
    data = request.get_json()
    user_id = data.get("user_id")
    event_id = data.get("event_id")

    if not user_id or not event_id:
        return jsonify({"error": "user_id and event_id are required"}), 400

    # checks if user and event exist
    user = User.query.get(user_id)
    event = Event.query.get(event_id)
    if not user or not event:
        return jsonify({"error": "Invalid user_id or event_id"}), 404

    # checks capacity 
    if event.capacity and len(event.registrations) >= event.capacity:
        return jsonify({"error": "Event is at full capacity"}), 400

    registration = EventRegistration(user_id=user_id, event_id=event_id)

    try:
        db.session.add(registration)
        db.session.commit()
        return jsonify({
            "success": "User registered",
            "registration_id": registration.id
        }), 201

    except IntegrityError:
        db.session.rollback()
        return jsonify({"error": "User already registered for this event"}), 409


# CANCEL a registration 

@registration_bp.route("/<int:registration_id>", methods=["DELETE"])
def delete_registration(registration_id):
    registration = EventRegistration.query.get(registration_id)
    if not registration:
        return jsonify({"error": "Registration not found"}), 404

    db.session.delete(registration)
    db.session.commit()
    return jsonify({"success": "Registration cancelled"}), 200


# LIST all registrations 
@registration_bp.route("/", methods=["GET"])
def get_all_registrations():
    regs = EventRegistration.query.all()
    results = []
    for r in regs:
        results.append({
            "id": r.id,
            "user_id": r.user_id,
            "event_id": r.event_id,
            "registered_at": r.registered_at
        })
    return jsonify(results), 200



# LIST registrations for a specific USER  
@registration_bp.route("/users/<int:user_id>", methods=["GET"])
def get_registrations_by_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({"error": "User not found"}), 404

    results = []
    for r in user.registrations:
        results.append({
            "registration_id": r.id,
            "event_id": r.event_id,
            "registered_at": r.registered_at
        })
    return jsonify(results), 200



#LIST participants for a specific EVENT  
@registration_bp.route("/events/<int:event_id>", methods=["GET"])
def get_registrations_by_event(event_id):
    event = Event.query.get(event_id)
    if not event:
        return jsonify({"error": "Event not found"}), 404

    participants = []
    for r in event.registrations:
        participants.append({
            "registration_id": r.id,
            "registered_at": r.registered_at,
            "user": {
                "id": r.user.id,
                "name": r.user.name,
                "email": r.user.email
            }
        })
    return jsonify(participants), 200