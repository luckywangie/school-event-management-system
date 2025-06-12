from flask import Blueprint, request, jsonify
from models import db, Category

registration_bp = Blueprint("registration_bp", __name__)
