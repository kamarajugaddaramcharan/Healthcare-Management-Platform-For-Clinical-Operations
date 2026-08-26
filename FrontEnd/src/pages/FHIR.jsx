import { useEffect, useState } from "react";
import { getAllFHIR } from "../services/fhirService";
import "../styles/fhir.css";

function FHIR() {

    const [records, setRecords] = useState([]);

    useEffect(() => {
        loadFHIR();
    }, []);

    const loadFHIR = async () => {

        try {

            const data = await getAllFHIR();
            console.log("FHIR:", data);
            setRecords(data);

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="fhir-page">

            <div className="fhir-header">

                <div>

                    <h1>FHIR Resource Center</h1>

                    <p>Manage and monitor healthcare interoperability resources.</p>

                </div>

                <div className="fhir-count">

                    {records.length} Resources

                </div>

            </div>

            <div className="fhir-table">

                <table>

                    <thead>

                    <tr>

                        <th>Patient</th>

                        <th>FHIR Resource</th>

                        <th>Data Preview</th>

                        <th>Created</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                    </thead>

                    <tbody>

                    {records.map((record)=>(

                        <tr key={record.id}>

                            <td>

                                PAT-{record.patientId}

                            </td>

                            <td>

                        <span className="fhir-resource">

                            {record.resourceType}

                        </span>

                            </td>

                            <td>

                                <code style={{fontSize:"12px"}}>

                                    {String(record.resourceData).length > 45
                                        ? String(record.resourceData).substring(0,45) + "..."
                                        : String(record.resourceData)}

                                </code>

                            </td>

                            <td>

                                {record.createdAt}

                            </td>

                            <td>

                        <span className="fhir-status">

                            Active

                        </span>

                            </td>

                            <td>

                                <button className="fhir-btn">

                                    View JSON

                                </button>

                            </td>

                        </tr>

                    ))}

                    </tbody>

                </table>

            </div>

        </div>

    );
}

export default FHIR;