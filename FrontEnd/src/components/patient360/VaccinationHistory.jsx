import { FaSyringe, FaCheckCircle } from "react-icons/fa";

const vaccines = [
    {
        vaccine: "COVID-19 Booster",
        date: "15 Jan 2026",
        status: "Completed",
    },
    {
        vaccine: "Influenza",
        date: "10 Oct 2025",
        status: "Completed",
    },
    {
        vaccine: "Hepatitis B",
        date: "22 Jul 2024",
        status: "Completed",
    },
    {
        vaccine: "Tetanus",
        date: "05 May 2023",
        status: "Completed",
    },
];

function VaccinationHistory() {
    return (
        <div className="card shadow border-0 rounded-4 mt-4 p-4">

            <div className="d-flex align-items-center mb-4">
                <FaSyringe className="text-success me-3" style={{ fontSize: 30 }} />
                <div>
                    <h3 className="mb-0">Vaccination History</h3>
                    <small className="text-muted">
                        Immunization records
                    </small>
                </div>
            </div>

            <table className="table table-hover align-middle">

                <thead>

                <tr>
                    <th>Vaccine</th>
                    <th>Date</th>
                    <th>Status</th>
                </tr>

                </thead>

                <tbody>

                {vaccines.map((item, index) => (

                    <tr key={index}>

                        <td>{item.vaccine}</td>

                        <td>{item.date}</td>

                        <td>
                                <span className="badge bg-success">
                                    <FaCheckCircle className="me-1" />
                                    {item.status}
                                </span>
                        </td>

                    </tr>

                ))}

                </tbody>

            </table>

        </div>
    );
}

export default VaccinationHistory;