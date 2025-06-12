from flask import Flask
from flask_migrate import Migrate
from models import db
from views.user import user_bp
from views.event import event_bp
from views.registration import registration_bp
from views.category import category_bp

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db.init_app(app)
migrate = Migrate(app, db)

# Register Blueprints
app.register_blueprint(user_bp, url_prefix='/users')
app.register_blueprint(event_bp, url_prefix='/events')
app.register_blueprint(registration_bp, url_prefix='/registrations')
app.register_blueprint(category_bp, url_prefix='/categories')

if __name__ == "__main__":
    app.run(debug=True)
