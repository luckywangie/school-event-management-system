from models import User, db
from app import app
from werkzeug.security import generate_password_hash

def seed():
    with app.app_context():
        name = "admin"
        email = "admin@gmail.com"
        password = "admin"

        name_exists = User.query.filter_by(name=name).first()
        if name_exists:
            print("Name already exists.")
            return
        
        email_exists = User.query.filter_by(email=email).first()
        if email_exists:
            print("Email already exists.")
            return

        new_admin = User(name=name, email=email, password=generate_password_hash(password), is_admin=True)
        db.session.add(new_admin)
        db.session.commit()
        print("Admin added successfully.")

seed()
