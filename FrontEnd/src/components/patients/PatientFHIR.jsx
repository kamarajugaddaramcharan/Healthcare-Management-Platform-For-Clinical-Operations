import { FileText } from "lucide-react";

function PatientFHIR() {
    return (
        <div>
            <h1>FHIR Resources</h1>

            <p style={{ color: "#64748b" }}>
                Your interoperable healthcare records
            </p>

            <div
                style={{
                    marginTop: 25,
                    background: "#fff",
                    borderRadius: 22,
                    padding: 30,
                }}
            >
                <FileText
                    size={35}
                    color="#2563eb"
                />

                <h2
                    style={{
                        marginTop: 18,
                    }}
                >
                    Patient Resource
                </h2>

                <pre
                    style={{
                        marginTop: 20,
                        padding: 20,
                        background: "#0f172a",
                        color: "#e2e8f0",
                        borderRadius: 14,
                        overflowX: "auto",
                    }}
                >
{`{
  "resourceType": "Patient",
  "id": "P001",
  "active": true,
  "gender": "male",
  "address": [
    {
      "city": "Hyderabad"
    }
  ]
}`}
                </pre>
            </div>
        </div>
    );
}

export default PatientFHIR;