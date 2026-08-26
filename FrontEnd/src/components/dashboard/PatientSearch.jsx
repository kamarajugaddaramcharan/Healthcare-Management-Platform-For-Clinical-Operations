import { Search } from "lucide-react";

function PatientSearch({ searchTerm, setSearchTerm }) {
    return (
        <div className="patient-search">
            <Search size={18} />

            <input
                type="text"
                placeholder="Search patient by name or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
            />
        </div>
    );
}

export default PatientSearch;