from flask import Flask, request, jsonify
import pandas as pd

app = Flask(__name__)

# Load dataset
df = pd.read_csv("dataset.csv")

@app.route("/")
def home():
    return "E-commerce Chatbot API is running!"

@app.route("/top-products", methods=["GET"])
def top_products():
    top = df['product_name'].value_counts().head(5)
    return jsonify(top.to_dict())

@app.route("/order-status/<int:order_id>", methods=["GET"])
def order_status(order_id):
    order = df[df['order_id'] == order_id]
    if not order.empty:
        return jsonify({"order_id": order_id, "status": order.iloc[0]['status']})
    else:
        return jsonify({"error": "Order not found"}), 404

if __name__ == "__main__":
    app.run(debug=True)
