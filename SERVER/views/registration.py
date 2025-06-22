from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, Event, EventRegistration
from sqlalchemy.exc import IntegrityError

registration_bp = Blueprint("registration_bp", __name__)

# REGISTER a user for an event  
@registration_bp.route("/", methods=["POST"])
@jwt_required()
def create_registration():
    data = request.get_json()
    event_id = data.get("event_id")
    user_id = get_jwt_identity()  # ✅ Get from token instead

    user = User.query.get(user_id)
    event = Event.query.get(event_id)

    if not user or not event:
        return jsonify({"error": "Invalid user_id or event_id"}), 404

    if event.capacity and len(event.registrations) >= event.capacity:
        return jsonify({"error": "Event is at full capacity"}), 400

    # Check if already registered
    if any(reg.user_id == user_id for reg in event.registrations):
        return jsonify({"error": "Already registered for this event"}), 409

    registration = EventRegistration(user_id=user_id, event_id=event_id)
    db.session.add(registration)
    db.session.commit()

    return jsonify({"success": "Registration successful"}), 200


# CANCEL a registration 
@registration_bp.route("/<int:registration_id>", methods=["DELETE"])
@jwt_required()
def delete_registration(registration_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    registration = EventRegistration.query.get(registration_id)
    if not registration:
        return jsonify({"error": "Registration not found"}), 404

    if registration.user_id != current_user_id and not current_user.is_admin:
        return jsonify({"error": "Unauthorized to cancel this registration"}), 403

    db.session.delete(registration)
    db.session.commit()
    return jsonify({"success": "Registration cancelled"}), 200


# LIST all registrations (admin only)
@registration_bp.route("/", methods=["GET"])
@jwt_required()
def get_all_registrations():
    current_user = User.query.get(get_jwt_identity())
    if not current_user.is_admin:
        return jsonify({"error": "Admins only"}), 403

    regs = EventRegistration.query.all()
    results = []
    for r in regs:
        results.append({
            "id": r.id,
            "user_id": r.user_id,
            "event_id": r.event_id,
            "registered_at": r.registered_at
        })
    return jsonify({"success": "All registrations fetched", "registrations": results}), 200


# LIST registrations for a specific USER
@registration_bp.route("/users/<int:user_id>", methods=["GET"])
@jwt_required()
def get_registrations_by_user(user_id):
    current_user_id = get_jwt_identity()
    current_user = User.query.get(current_user_id)

    if user_id != current_user_id and not current_user.is_admin:
        return jsonify({"error": "Unauthorized"}), 403

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
    return jsonify({"success": "User registrations fetched", "registrations": results}), 200


# LIST participants for a specific EVENT 
@registration_bp.route("/events/<int:event_id>", methods=["GET"])
@jwt_required()
def get_registrations_by_event(event_id):
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not current_user.is_admin:
        return jsonify({"error": "Admins only"}), 403

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

    return jsonify({"success": "Event participants fetched", "participants": participants}), 200
