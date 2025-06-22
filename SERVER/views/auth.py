from flask import Blueprint, request, jsonify
from werkzeug.security import check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from models import db, User, TokenBlocklist
from datetime import datetime, timezone

auth_bp = Blueprint("auth_bp", __name__)


# Logging in
@auth_bp.route("/login", methods=["POST", "OPTIONS"])  # ✅ add OPTIONS
def login():
    data = request.get_json()
    email = data.get("email")
    password = data.get("password")

    if not email or not password:
        return jsonify({"error": "Email and password are required"}), 400

    user = User.query.filter_by(email=email).first()

    if user and check_password_hash(user.password, password):
        access_token = create_access_token(identity=user.id)
        return jsonify({"success": "Login successful", "access_token": access_token}), 200
    else:
        return jsonify({"error": "Invalid credentials"}), 401


# Fetching logged-in user
@auth_bp.route("/current_user", methods=["GET", "OPTIONS"])  # ✅ add OPTIONS
@jwt_required()
def fetch_current_user():
    user = User.query.get(get_jwt_identity())
    if not user:
        return jsonify({"error": "User not found"}), 404

    return jsonify({
        "success": "User fetched successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_admin": user.is_admin,
            "is_active": user.is_active,
            "created_at": user.created_at
        }
    }), 200


# Logout
@auth_bp.route("/logout", methods=["DELETE", "OPTIONS"])  # ✅ add OPTIONS
@jwt_required()
def logout():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)

    new_blocked_token = TokenBlocklist(jti=jti, created_at=now)
    db.session.add(new_blocked_token)
    db.session.commit()

    return jsonify({"success": "Successfully logged out"}), 200
