from flask import Flask, request, jsonify
from pymongo import MongoClient
from bb84_key_generation import generate_bb84_key
from hybrid_crypto import hybrid_encrypt

# Initialize Flask app
app = Flask(__name__)

# MongoDB connection
client = MongoClient("mongodb://localhost:27017/")  # Update with your MongoDB connection string
db = client['quantum_security']
collection = db['encrypted_data']

@app.route('/send', methods=['POST'])
def encrypt():
    try:
        # Retrieve data from the POST request
        request_data = request.get_json()
        data = request_data.get('data', '')

        if not data:
            return jsonify({'error': 'No data provided'}), 400

        # Convert data to bytes
        data = data.encode('utf-8')

        # Generate a BB84 shared key
        bb84_shared_key = generate_bb84_key(100)  # Replace with actual implementation

        # Encrypt the data using the BB84 shared key
        encrypted_result = hybrid_encrypt(data, bb84_shared_key)

        # Convert BB84 shared key and encrypted data to hex for storage
        bb84_key_hex = ''.join(map(str, bb84_shared_key))
        encrypted_data_hex = encrypted_result.hex()

        # Store in MongoDB
        record = {
            'bb84_shared_key': bb84_key_hex,
            'encrypted_data': encrypted_data_hex
        }
        collection.insert_one(record)

        return jsonify({
            'message': 'Data successfully encrypted and stored in MongoDB.',
            'record_id': str(record['_id'])  # MongoDB document ID
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)
