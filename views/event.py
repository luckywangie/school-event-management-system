from flask import Blueprint, request, jsonify
from models import db, Category

event_bp = Blueprint("event_bp", __name__)
