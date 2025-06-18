from flask import Blueprint, request, jsonify
from flask_mail import Message
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import generate_password_hash
from models import db, User

user_bp = Blueprint("user_bp", __name__)


# Send a welcome email to any email (Public)
@user_bp.route('/send-email', methods=['POST'])
def send_email_to_any_email():
    from app import mail  
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')

    if not name or not email:
        return jsonify({'error': 'Name and email are required'}), 400

    subject = "Welcome to Eventbright!"
    body = f"Hi {name},\n\nWelcome to Eventbright! We’re glad to have you with us.\n\nBest,\nThe Eventbright Team"

    try:
        msg = Message(subject=subject, recipients=[email], body=body)
        mail.send(msg)
        return jsonify({'success': f'Email sent to {email}'}), 200
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify({'error': 'Failed to send email'}), 500


# Create a new user (Public)
@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email', '').strip().lower()
    password = data.get('password')
    is_admin = data.get('is_admin', False)

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    hashed_password = generate_password_hash(password)

    user = User(
        name=name,
        email=email,
        password=hashed_password,
        is_admin=is_admin
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "success": "User created successfully",
        "user": {
            "id": user.id,
            "name": user.name,
            "email": user.email,
            "is_admin": user.is_admin
        }
    }), 201


# Get all users (Admin only)
@user_bp.route('/', methods=['GET'])
@jwt_required()
def get_users():
    current_user = User.query.get(get_jwt_identity())
    if not current_user or not current_user.is_admin:
        return jsonify({'error': 'Admins only'}), 403

    users = User.query.all()
    user_list = [{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'is_admin': user.is_admin,
        'is_active': user.is_active,
        'created_at': user.created_at
    } for user in users]

    return jsonify({"success": "Users fetched successfully", "users": user_list}), 200


# Get user by ID (Admin or self)
@user_bp.route('/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.id != user_id and not current_user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'success': 'User fetched successfully',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin,
            'is_active': user.is_active,
            'created_at': user.created_at
        }
    }), 200


# Update user (Admin or self)
@user_bp.route('/<int:id>', methods=['PUT'])
@jwt_required()
def update_user(id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.id != id and not current_user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403

    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin')
    is_active = data.get('is_active')

    if name:
        user.name = name

    if email:
        email = email.strip().lower()
        existing_user = User.query.filter_by(email=email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'error': 'Email already in use'}), 400
        user.email = email

    if password:
        if not password.startswith('$pbkdf2:'):
            user.password = generate_password_hash(password)
        else:
            user.password = password

    if is_admin is not None and current_user.is_admin:
        user.is_admin = str(is_admin).lower() in ['true', '1']

    if is_active is not None and current_user.is_admin:
        user.is_active = str(is_active).lower() in ['true', '1']

    db.session.commit()

    return jsonify({
        'success': 'User updated successfully',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin,
            'is_active': user.is_active,
            'created_at': user.created_at
        }
    }), 200


# Delete user (Admin or self)
@user_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    current_user = User.query.get(get_jwt_identity())
    if current_user.id != user_id and not current_user.is_admin:
        return jsonify({'error': 'Unauthorized'}), 403

    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()

    return jsonify({'success': 'User and their events deleted'}), 200
