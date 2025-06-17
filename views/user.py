from flask import Blueprint, request, jsonify
from flask_mail import Message
from models import db, User
from werkzeug.security import generate_password_hash

user_bp = Blueprint("user_bp", __name__)

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


# Create a new user
@user_bp.route('/', methods=['POST'])
def create_user():
    data = request.get_json()
    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin', False)  # ✅ default to False

    if not name or not email or not password:
        return jsonify({'error': 'All fields are required'}), 400

    if User.query.filter_by(email=email).first():
        return jsonify({'error': 'Email already exists'}), 400

    user = User(
        name=name,
        email=email,
        password=generate_password_hash(password),
        is_admin=is_admin  # ✅ assign the flag
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({
        "id": user.id,
        "name": user.name,
        "email": user.email,
        "is_admin": user.is_admin
    }), 201


# Get all users

@user_bp.route('/', methods=['GET'])
def get_users():
    users = User.query.all()
    user_list = [{
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'is_admin': user.is_admin,
        'is_active': user.is_active,
        'created_at': user.created_at
    } for user in users]

    return jsonify(user_list), 200



# Get user by ID

@user_bp.route('/<int:user_id>', methods=['GET'])
def get_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    return jsonify({
        'id': user.id,
        'name': user.name,
        'email': user.email,
        'is_admin': user.is_admin,
        'is_active': user.is_active,
        'created_at': user.created_at
    }), 200



# Update user
@user_bp.route('/<int:id>', methods=['PUT'])
def update_user(id):
    user = User.query.get(id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    data = request.get_json()

    print("Raw data received:", data)

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    is_admin = data.get('is_admin')
    is_active = data.get('is_active')

    if name:
        user.name = name

    if email:
        existing_user = User.query.filter_by(email=email).first()
        if existing_user and existing_user.id != user.id:
            return jsonify({'error': 'Email already in use'}), 400
        user.email = email

    if password:
        user.password = generate_password_hash(password)

    # Handle booleans explicitly
    if is_admin is not None:
        print("Before update is_admin:", user.is_admin)
        user.is_admin = str(is_admin).lower() in ['true', '1']
        print("After update is_admin:", user.is_admin)

    if is_active is not None:
        user.is_active = str(is_active).lower() in ['true', '1']

    db.session.commit()

    return jsonify({
        'message': 'User updated successfully',
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email,
            'is_admin': user.is_admin,
            'is_active': user.is_active,
            'created_at': user.created_at
        }
    }), 200

# Delete user

@user_bp.route('/<int:user_id>', methods=['DELETE'])
def delete_user(user_id):
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404

    db.session.delete(user)
    db.session.commit()
    return jsonify({'success': 'User deleted'}), 200
