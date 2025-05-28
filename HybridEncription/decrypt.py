from hybrid_crypto import hybrid_decrypt

# Example BB84 shared key (same as used for encryption)
bb84_shared_key = [1, 0, 1, 1, 0, 1, 0, 1, 1, 0]
encrypted_data=b"\xbdi\xa4a:\xd5\xbe\x183\xff\xe4?\x91`\x03'\x1e\x1c\x90\xd5|6\x0f\x92C\x8c=\xcc\xb4\xea\x90\xdcP\xcf\xbe\x89\xe2\xe0\x13pn\x1f?\x08E\xbd\xc1'"
# Decrypt data
decrypted_data = hybrid_decrypt(encrypted_data, bb84_shared_key)
print("Decrypted Data:", decrypted_data.decode())
