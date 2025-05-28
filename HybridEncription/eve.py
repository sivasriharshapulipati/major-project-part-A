import numpy as np
from qiskit import QuantumCircuit
from qiskit_aer import Aer

class BB84ProtocolWithEve:
    def __init__(self, key_length=100, eavesdrop=False):
        """
        Initialize the BB84 Protocol simulation with optional eavesdropping.

        :param key_length: Number of qubits for the key exchange.
        :param eavesdrop: Set to True to simulate Eve's eavesdropping.
        """
        self.key_length = key_length
        self.eavesdrop = eavesdrop
        self.alice_bits = np.random.randint(2, size=key_length)
        self.alice_bases = np.random.randint(2, size=key_length)
        self.bob_bases = np.random.randint(2, size=key_length)
        self.eve_bases = np.random.randint(2, size=key_length) if eavesdrop else None
        self.alice_key = []
        self.bob_key = []
        self.intercept_count = 0

    def prepare_and_measure(self):
        """
        Simulates Alice's qubit preparation, Eve's interception (if enabled), 
        and Bob's measurement process.
        """
        simulator = Aer.get_backend('qasm_simulator')

        for i in range(self.key_length):
            qc = QuantumCircuit(1, 1)

            # Step 1: Alice prepares qubit
            if self.alice_bases[i] == 0:  # Rectilinear basis
                if self.alice_bits[i] == 1:
                    qc.x(0)  # Prepare |1>
            else:  # Diagonal basis
                if self.alice_bits[i] == 1:
                    qc.x(0)  # Prepare |1>
                qc.h(0)  # Apply H for diagonal basis

            # Step 2: Eve intercepts (if enabled)
            if self.eavesdrop:
                eve_basis = self.eve_bases[i]

                if eve_basis == 1:
                    qc.h(0)  # Apply H for diagonal basis

                qc.measure(0, 0)  # Eve measures
                result = simulator.run(qc, shots=1).result()
                eve_measurement = int(list(result.get_counts().keys())[0])

                # Eve resends the qubit based on her measurement
                qc = QuantumCircuit(1, 1)  # Reset circuit
                if eve_measurement == 1:
                    qc.x(0)  # Prepare |1>
                if eve_basis == 1:
                    qc.h(0)  # Apply H for diagonal basis

            # Step 3: Bob measures
            if self.bob_bases[i] == 1:
                qc.h(0)  # Apply H to measure in diagonal basis

            qc.measure(0, 0)  # Measure the qubit
            result = simulator.run(qc, shots=1).result()
            measurement = int(list(result.get_counts().keys())[0])

            # Compare Alice and Bob's bases
            if self.alice_bases[i] == self.bob_bases[i]:
                self.alice_key.append(self.alice_bits[i])
                self.bob_key.append(measurement)
                if self.eavesdrop and measurement != self.alice_bits[i]:
                    self.intercept_count += 1

    def generate_key(self):
        """
        Simulates the BB84 key exchange with optional eavesdropping.

        :return: Alice's final key, Bob's final key, keys match status, and interception count (if eavesdrop).
        """
        self.prepare_and_measure()

        # Convert keys to strings for comparison
        alice_key_str = ''.join(map(str, self.alice_key))
        bob_key_str = ''.join(map(str, self.bob_key))

        return {
            "alice_key": self.alice_key,
            "bob_key": self.bob_key,
            "keys_match": alice_key_str == bob_key_str,
            "intercept_count": self.intercept_count if self.eavesdrop else None,
        }

if __name__ == "__main__":
    # Example usage
    key_length = 100  # Adjust as needed
    enable_eavesdrop = True  # Enable or disable Eve

    bb84 = BB84ProtocolWithEve(key_length, eavesdrop=enable_eavesdrop)
    result = bb84.generate_key()

    # Output results
    print("Alice's final key:", result["alice_key"])
    print("Bob's final key:  ", result["bob_key"])
    print("Keys match?       ", result["keys_match"])
    if enable_eavesdrop:
        print("Interception count:", result["intercept_count"])
