import { useEffect, useState } from "react";
import { getAllConsents } from "../services/consentService";
import "../styles/consent.css";

function Consent() {

    const [consents, setConsents] = useState([]);

    useEffect(() => {
        loadConsents();
    }, []);

    const loadConsents = async () => {

        try {

            const data = await getAllConsents();
            console.log("Consents:", data);
            setConsents(data);

        } catch (err) {

            console.error(err);

        }

    };

    return (

        <div className="consent-page">

            <div className="consent-header">

                <div>

                    <h1>Patient Consent Management</h1>

                    <p>Manage permissions and access for patient healthcare records.</p>

                </div>

                <div className="total-card">

                    {consents.length} Records

                </div>

            </div>

            <div className="consent-table">

                <table>

                    <thead>

                    <tr>

                        <th>Patient</th>

                        <th>Resource</th>

                        <th>Permission</th>

                        <th>Status</th>

                        <th>Action</th>

                    </tr>

                    </thead>

                    <tbody>

                    {consents.map((consent)=>(

                        <tr key={consent.id}>

                            <td>

                                PAT-{consent.patientId}

                            </td>

                            <td>

                                {consent.resourceType}

                            </td>

                            <td>

                        <span className="permission">

                            {consent.permission}

                        </span>

                            </td>

                            <td>

                        <span className={

                            consent.status.toLowerCase()==="active"

                                ? "active"

                                : "inactive"

                        }>

                            {consent.status}

                        </span>

                            </td>

                            <td>

                                <button className="view-btn">

                                    View

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

export default Consent;