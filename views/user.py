from flask import Blueprint, request, jsonify
from models import db, Category

user_bp = Blueprint("user_bp", __name__)
