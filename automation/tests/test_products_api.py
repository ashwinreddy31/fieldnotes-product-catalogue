
import requests

BASE_URL = "http://localhost:4000"


# 1. Get all products
def test_get_all_products():
    response = requests.get(f"{BASE_URL}/api/products")

    assert response.status_code == 200

    products = response.json()

    assert isinstance(products, list)
    assert len(products) > 0

    for product in products:
        assert "id" in product
        assert "title" in product
        assert "price" in product
        assert "category" in product
        assert "rating" in product

    print("Total products:", len(products))


# 2. Get featured products
def test_get_featured_products():
    response = requests.get(
        f"{BASE_URL}/api/products/featured"
    )

    assert response.status_code == 200

    products = response.json()

    assert len(products) == 5

    ratings = [
        product["rating"]["rate"]
        for product in products
    ]

    assert ratings == sorted(ratings, reverse=True)

    print("Featured products:", len(products))


# 3. Search products
def test_search_products():
    response = requests.get(
        f"{BASE_URL}/api/products",
        params={"search": "shirt"}
    )

    assert response.status_code == 200

    products = response.json()

    assert len(products) > 0

    for product in products:
        searchable_text = (
            product["title"] + " " +
            product["description"] + " " +
            product["category"]
        ).lower()

        assert "shirt" in searchable_text

    print("Search results:", len(products))


# 4. Filter products by category
def test_filter_products_by_category():
    response = requests.get(
        f"{BASE_URL}/api/products",
        params={"category": "electronics"}
    )

    assert response.status_code == 200

    products = response.json()

    assert len(products) > 0

    for product in products:
        assert product["category"] == "electronics"

    print("Electronics products:", len(products))


# 5. Get product details by ID
def test_get_product_by_id():
    product_id = 1

    response = requests.get(
        f"{BASE_URL}/api/products/{product_id}"
    )

    assert response.status_code == 200

    product = response.json()

    assert product["id"] == product_id
    assert "title" in product
    assert "price" in product
    assert "description" in product
    assert "category" in product
    assert "rating" in product

    print("Product details:", product["title"])


# 6. Invalid product ID
def test_get_product_with_invalid_id():
    response = requests.get(
        f"{BASE_URL}/api/products/abc"
    )

    assert response.status_code == 400

    data = response.json()

    assert "error" in data

    print("Invalid ID response:", data["error"])


# 7. Product ID must be positive
def test_get_product_with_zero_id():
    response = requests.get(
        f"{BASE_URL}/api/products/0"
    )

    assert response.status_code == 400


# 8. Enquiry with invalid email
def test_enquiry_with_invalid_email():
    payload = {
        "name": "Ashwin",
        "email": "invalid-email",
        "phone": "9876543210",
        "message": "I want product details"
    }

    response = requests.post(
        f"{BASE_URL}/api/enquiries",
        json=payload
    )

    assert response.status_code == 400

    data = response.json()

    assert "fields" in data
    assert "email" in data["fields"]

    print("Email validation:", data["fields"]["email"])


# 9. Enquiry with missing name
def test_enquiry_with_missing_name():
    payload = {
        "name": "",
        "email": "ashwin@example.com",
        "phone": "9876543210",
        "message": "Interested in product"
    }

    response = requests.post(
        f"{BASE_URL}/api/enquiries",
        json=payload
    )

    assert response.status_code == 400

    data = response.json()

    assert "name" in data["fields"]


# 10. Enquiry with missing phone
def test_enquiry_with_missing_phone():
    payload = {
        "name": "Ashwin",
        "email": "ashwin@example.com",
        "phone": "",
        "message": "Interested in product"
    }

    response = requests.post(
        f"{BASE_URL}/api/enquiries",
        json=payload
    )

    assert response.status_code == 400

    data = response.json()

    assert "phone" in data["fields"]


# 11. Enquiry with missing message
def test_enquiry_with_missing_message():
    payload = {
        "name": "Ashwin",
        "email": "ashwin@example.com",
        "phone": "9876543210",
        "message": ""
    }

    response = requests.post(
        f"{BASE_URL}/api/enquiries",
        json=payload
    )

    assert response.status_code == 400

    data = response.json()

    assert "message" in data["fields"]


# 12. Valid enquiry submission
def test_submit_valid_enquiry():
    payload = {
        "name": "Ashwin",
        "email": "ashwin@example.com",
        "phone": "9876543210",
        "message": "I am interested in your products",
        "productTitle": "Test Product"
    }

    response = requests.post(
        f"{BASE_URL}/api/enquiries",
        json=payload
    )

    assert response.status_code == 201

    data = response.json()

    assert data["message"] == "Your enquiry has been sent."

    print("Enquiry response:", data["message"])


# 13. Health API
def test_health_api():
    response = requests.get(
        f"{BASE_URL}/api/health"
    )

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"

    print("Backend health:", data["status"])


# 14. Get product categories
def test_get_product_categories():
    response = requests.get(
        f"{BASE_URL}/api/categories"
    )

    assert response.status_code == 200

    categories = response.json()

    assert isinstance(categories, list)
    assert len(categories) > 0

    print("Available categories:", categories)
