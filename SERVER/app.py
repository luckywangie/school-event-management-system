from flask import Flask, request
from flask_migrate import Migrate
from flask_mail import Mail
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from datetime import timedelta

from models import db, TokenBlocklist
from views.user import user_bp
from views.event import event_bp
from views.registration import registration_bp
from views.category import category_bp
from views.auth import auth_bp

app = Flask(__name__)

# === DB CONFIG ===
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# === MAIL CONFIG ===
app.config['MAIL_SERVER'] = 'smtp.gmail.com'
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config["MAIL_USE_SSL"] = False
app.config['MAIL_USERNAME'] = 'devworkzzy@gmail.com'
app.config['MAIL_PASSWORD'] = 'ikdd hmwo zphg bvws'
app.config['MAIL_DEFAULT_SENDER'] = 'contact us.eventbright@gmail.com'

# === JWT CONFIG ===
app.config["JWT_SECRET_KEY"] = "gftsdfjjjdsefghiuygv"  # 🔒 change this in production
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=2)
app.config["JWT_BLACKLIST_ENABLED"] = True
app.config["JWT_BLACKLIST_TOKEN_CHECKS"] = ["access"]
app.config["JWT_VERIFY_SUB"] = False  # Optional: testing config

# === CORS CONFIG (Fix for React frontend with JWT) ===
CORS(app,
     resources={r"/*": {"origins": "http://localhost:5173"}},
     supports_credentials=True,
     headers=["Content-Type", "Authorization"],  # ✅ use `headers=` not `allow_headers=`
     methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"]
)


# Optional: Automatically respond to preflight OPTIONS
@app.before_request
def handle_options():
    if request.method == 'OPTIONS':
        return '', 200

# === INIT EXTENSIONS ===
db.init_app(app)
migrate = Migrate(app, db)

mail = Mail()
mail.init_app(app)

jwt = JWTManager(app)
jwt.init_app(app)

# === JWT TOKEN REVOCATION CHECK ===
@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload):
    jti = jwt_payload["jti"]
    return TokenBlocklist.query.filter_by(jti=jti).first() is not None

# === REGISTER BLUEPRINTS ===
app.register_blueprint(user_bp, url_prefix='/users')
app.register_blueprint(event_bp, url_prefix='/events')
app.register_blueprint(registration_bp, url_prefix='/registrations')
app.register_blueprint(category_bp, url_prefix='/categories')
app.register_blueprint(auth_bp, url_prefix='/auth')

# === RUN SERVER ===
if __name__ == "__main__":
    app.run(debug=True)
