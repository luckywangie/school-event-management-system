from flask import Blueprint, request, jsonify
from models import db, Category

category_bp = Blueprint("category_bp", __name__)

# CREATE a new category
@category_bp.route("/", methods=["POST"])
def create_category():
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
        "id": new_category.id,
        "name": new_category.name,
        "description": new_category.description
    }), 201


# get all categories
@category_bp.route("/", methods=["GET"])
def get_categories():
    categories = Category.query.all()

    results = []
    for c in categories:
        results.append({
            "id": c.id,
            "name": c.name,
            "description": c.description
        })

    return jsonify(results), 200


# get one category by ID
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


# UPDATE a category
@category_bp.route("/<int:id>", methods=["PUT", "PATCH"])
def update_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    data = request.get_json()
    category.name = data.get("name", category.name)
    category.description = data.get("description", category.description)

    db.session.commit()

    return jsonify({
        "id": category.id,
        "name": category.name,
        "description": category.description
    }), 200


# DELETE a category
@category_bp.route("/<int:id>", methods=["DELETE"])
def delete_category(id):
    category = Category.query.get(id)
    if not category:
        return jsonify({"error": "Category not found"}), 404

    db.session.delete(category)
    db.session.commit()

    return jsonify({"success": "Category deleted"}), 200
