from eve import BB84ProtocolWithEve

# Enable eavesdropping
bb84 = BB84ProtocolWithEve(key_length=100, eavesdrop=False)
result = bb84.generate_key()
kar = sum(1 for a, b in zip(result["alice_key"], result["bob_key"]) if a == b) / len(result["alice_key"])
print("Key Agreement Rate (KAR):", kar)
errors = sum(1 for a, b in zip(result["alice_key"], result["bob_key"]) if a != b)
qber = errors / len(result["alice_key"])
print("Quantum Bit Error Rate (QBER):", qber)
if bb84.eavesdrop:
    edr = result["intercept_count"] / bb84.key_length
    print("Eavesdropping Detection Rate (EDR):", edr)
efficiency = len(result["alice_key"]) / bb84.key_length
print("Resource Efficiency:", efficiency)
import time

start_time = time.time()
result = bb84.generate_key()
end_time = time.time()
execution_time = end_time - start_time
print("Execution Time (s):", execution_time)


# print("Alice's key:       ", result["alice_key"])
# print("Bob's key:         ", result["bob_key"])
# print("Do keys match?     ", "Yes" if result["keys_match"] else "No")
# print("Interception count:", result["intercept_count"])
