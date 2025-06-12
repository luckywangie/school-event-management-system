from flask import Blueprint, request, jsonify
from models import db, Category

category_bp = Blueprint("category_bp", __name__)
