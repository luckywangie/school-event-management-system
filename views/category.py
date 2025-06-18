from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Category, User

category_bp = Blueprint("category_bp", __name__)

# CREATE a new category (admin only)
@category_bp.route("/", methods=["POST"])
@jwt_required()
def create_category():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized: Admins only"}), 403

    data = request.get_json()
    name = data.get("name")
    description = data.get("description", "")

    if not name:
        return jsonify({"error": "Category name is required"}), 400

    # Check if category already exists
    existing = Category.query.filter_by(name=name).first()
    if existing:
        return jsonify({"error": "Category already exists"}), 409

    new_category = Category(name=name, description=description)
    db.session.add(new_category)
    db.session.commit()

    return jsonify({
        "message": "Category created successfully",
        "id": new_category.id,
        "name": new_category.name,
        "description": new_category.description
    }), 201


# GET all categories (open to everyone)
@category_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.all()

    return jsonify([
        {
            "id": c.id,
            "name": c.name,
            "description": c.description
        } for c in categories
    ]), 200


# GET one category by ID (open to everyone)
@category_bp.route("/<int:id>", methods=["GET"])
def get_category_by_id(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    return jsonify({
        "id": category.id,
        "name": category.name,
        "description": category.description
    }), 200


# UPDATE a category (admin only)
@category_bp.route("/<int:id>", methods=["PUT", "PATCH"])
@jwt_required()
def update_category(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized: Admins only"}), 403

    category = Category.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json()
    category.name = data.get("name", category.name)
    category.description = data.get("description", category.description)

    db.session.commit()

    return jsonify({
        "message": "Category updated successfully",
        "id": category.id,
        "name": category.name,
        "description": category.description
    }), 200


# DELETE a category (admin only)
@category_bp.route("/<int:id>", methods=["DELETE"])
@jwt_required()
def delete_category(id):
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.is_admin:
        return jsonify({"error": "Unauthorized: Admins only"}), 403

    category = Category.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"success": "Category deleted"}), 200
