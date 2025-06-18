from app import app
from models import db, User, Category, Event
from datetime import datetime

with app.app_context():
    print("Seeding database...")

    # Clear existing data
    Event.query.delete()
    Category.query.delete()
    User.query.delete()

    # Seed Users
    user1 = User(name="Lucky", email="lucky@gmail.com", password="password123", is_admin=True)
    user2 = User(name="Amina", email="amina@student.com", password="amina123")
    user3 = User(name="Brian", email="brian@student.com", password="brian123")

    db.session.add_all([user1, user2, user3])
    db.session.commit()

    # Seed Categories
    seminar = Category(name="Seminar", description="Educational seminars")
    sports = Category(name="Sports", description="Games and sports events")
    concert = Category(name="Concert", description="Music and live shows")

    db.session.add_all([seminar, sports, concert])
    db.session.commit()

    # Seed Events
    event1 = Event(
        title="Python Seminar",
        description="Intro to Python",
        date=datetime(2025, 7, 5, 14, 0),
        location="Hall A",
        capacity=100,
        category_id=seminar.id,
        created_by=user1.id
    )

    event2 = Event(
        title="Football Finals",
        description="Interclass tournament",
        date=datetime(2025, 7, 10, 16, 0),
        location="Main Field",
        capacity=200,
        category_id=sports.id,
        created_by=user1.id
    )

    db.session.add_all([event1, event2])
    db.session.commit()

    print("Seeding complete.")
