from bb84_key_generation import generate_bb84_key
from hybrid_crypto import hybrid_encrypt, hybrid_decrypt

# Generate BB84 key
bb84_shared_key = generate_bb84_key(100)
print(bb84_shared_key)
# Data to encrypt
data = b"This is sensitive data."

# Encrypt the data
encrypted_data = hybrid_encrypt(data, bb84_shared_key)
print("Encrypted Data:", encrypted_data)

# Decrypt the data
decrypted_data = hybrid_decrypt(encrypted_data, bb84_shared_key)
print("Decrypted Data:", decrypted_data.decode())
