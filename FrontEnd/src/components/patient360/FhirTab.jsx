import { FileJson } from "lucide-react";

function FhirTab({ patient }) {

    return (

        <div
            style={{
                background:"#131b2e",
                borderRadius:18,
                padding:25,
                color:"white"
            }}
        >

            <h2>
                <FileJson /> FHIR Resource
            </h2>

            <pre
                style={{
                    marginTop:20,
                    background:"#0f172a",
                    padding:20,
                    borderRadius:12,
                    overflow:"auto"
                }}
            >
{JSON.stringify(patient,null,2)}
            </pre>

        </div>

    );

}

export default FhirTab;