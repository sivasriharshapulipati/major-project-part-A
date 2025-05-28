from hybrid_crypto import hybrid_encrypt

# Example BB84 shared key
bb84_shared_key = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0]  # Replace with actual BB84 output
data = b"This is the data to encrypt"

# Encrypt data
encrypted_data = hybrid_encrypt(data, bb84_shared_key)
print("Encrypted Data:", encrypted_data)
