import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
// import "./Admitli"

function DoctorAdmit() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        admitted: 0,
        discharged: 0
    });
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterType, setFilterType] = useState('all'); // 'all', 'admitted', 'discharged'

    // Fetch admissions from backend
    const fetchAdmissions = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8001/api/admitpatient');
            const data = await response.json();
            if (data.success) {
                setAdmissions(data.data);
                calculateStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching admissions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics
    const calculateStats = (admissionsData) => {
        const total = admissionsData.length;
        const admitted = admissionsData.filter(adm => adm.status === "Admitted").length;
        const discharged = admissionsData.filter(adm => adm.status === "Discharged").length;
        
        setStats({ total, admitted, discharged });
    };

    useEffect(() => {
        fetchAdmissions();
    }, []);

    // Format date for display (DD/MM/YYYY)
    const formatDateForDisplay = (dateString) => {
        if (!dateString) return "-";
        try {
            if (dateString.includes('/')) return dateString;
            const [year, month, day] = dateString.split('-');
            if (year && month && day) {
                return `${day}/${month}/${year}`;
            }
            return dateString;
        } catch {
            return dateString;
        }
    };

    // Filter and search
    const filteredAdmissions = useMemo(() => {
        if (!admissions) return [];

        let filtered = [...admissions];

        // Apply status filter
        if (filterType === 'admitted') {
            filtered = filtered.filter(adm => adm.status === "Admitted");
        } else if (filterType === 'discharged') {
            filtered = filtered.filter(adm => adm.status === "Discharged");
        }

        // Apply search
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((admission) => {
                const matches = (field) => {
                    if (field === undefined || field === null) return false;
                    return String(field).toLowerCase().includes(searchLower);
                };

                return (
                    matches(admission.patientName) ||
                    matches(admission.age) ||
                    matches(admission.gender) ||
                    matches(admission.phone) ||
                    matches(admission.bedNo) ||
                    matches(admission.fromDate) ||
                    matches(admission.status)
                );
            });
        }

        return filtered;
    }, [admissions, searchTerm, filterType]);

    // Handlers for filter cards
    const handleTotalCardClick = () => setFilterType('all');
    const handleAdmittedCardClick = () => setFilterType('admitted');
    const handleDischargedCardClick = () => setFilterType('discharged');

    // View handler - ONLY view, no edit/delete
    const handleView = (admission) => {
        setSelectedAdmission(admission);
        setShowViewPopup(true);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="loading-spinner"></div>
                <p>Loading admissions...</p>
            </div>
        );
    }

    return (
        <div className="admitlist-page">
            {/* HEADER */}
            <div className="page-header">
                <div>
                    <h1>🛏️ Admitted Patients (Doctor View)</h1>
                    <p style={{ marginLeft: "45px" }}>
                        {filterType === 'all' ? 'Showing all patients' : 
                         filterType === 'admitted' ? 'Showing admitted patients' : 
                         'Showing discharged patients'}
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                        className="bed-view-btn" 
                        onClick={() => navigate("/doctor-dashboard/DoctorBedView")}
                        style={{
                            background: "linear-gradient(135deg, #0d6efd, #0b5ed7)",
                            color: "#fff",
                            padding: "10px 20px",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "14px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px"
                        }}
                    >
                        <span>🛏️</span>
                        <span>Bed View</span>
                    </button>
                    
                    <button className="add-btn" onClick={() => navigate("/doctor-dashboard")}>
                        <span> ← Back to Dashboard</span>
                    </button>
                </div>
            </div>

            {/* SUMMARY STATS - WITH CLICK HANDLERS */}
            <div className="summary-stats">
                <div 
                    className={`summary-card ${filterType === 'all' ? 'active-card' : ''}`} 
                    style={{ 
                        borderLeft: "4px solid #0d6efd",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        transform: filterType === 'all' ? 'scale(1.02)' : 'scale(1)'
                    }}
                    onClick={handleTotalCardClick}
                >
                    <h4>📊 TOTAL PATIENTS</h4>
                    <h2>{stats.total}</h2>
                </div>
                <div 
                    className={`summary-card ${filterType === 'admitted' ? 'active-card' : ''}`} 
                    style={{ 
                        borderLeft: "4px solid #28a745",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        transform: filterType === 'admitted' ? 'scale(1.02)' : 'scale(1)'
                    }}
                    onClick={handleAdmittedCardClick}
                >
                    <h4>🟢 ADMITTED</h4>
                    <h2>{stats.admitted}</h2>
                </div>
                <div 
                    className={`summary-card ${filterType === 'discharged' ? 'active-card' : ''}`} 
                    style={{ 
                        borderLeft: "4px solid #dc3545",
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        transform: filterType === 'discharged' ? 'scale(1.02)' : 'scale(1)'
                    }}
                    onClick={handleDischargedCardClick}
                >
                    <h4>🔴 DISCHARGED</h4>
                    <h2>{stats.discharged}</h2>
                </div>
            </div><br />

            {/* SEARCH */}
            <div className="search-container-fluid">
                <input
                    type="text"
                    placeholder={`Search in ${filterType === 'all' ? 'all' : filterType} patients...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* TABLE - WITHOUT EDIT/DELETE BUTTONS */}
            <div className="table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th style={{ textAlign: 'center' }}>Sr. No.</th>
                            <th style={{ textAlign: 'center' }}>Patient Name</th>
                            <th style={{ textAlign: 'center' }}>Age/Gender</th>
                            <th style={{ textAlign: 'center' }}>Phone</th>
                            <th style={{ textAlign: 'center' }}>Bed No</th>
                            <th style={{ textAlign: 'center' }}>Admission Date</th>
                            <th style={{ textAlign: 'center' }}>Status</th>
                            <th style={{ textAlign: 'center' }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredAdmissions.length > 0 ? (
                            filteredAdmissions.map((admission, index) => (
                                <tr key={admission.id}>
                                    <td style={{ textAlign: 'center' }}>{index + 1}</td>
                                    <td style={{ textAlign: 'center' }}>{admission.patientName}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        {admission.age || "-"} / {admission.gender || "-"}
                                    </td>
                                    <td style={{ textAlign: 'center' }}>{admission.phone}</td>
                                    <td style={{ textAlign: 'center' }}><strong>{admission.bedNo}</strong></td>
                                    <td style={{ textAlign: 'center' }}>{formatDateForDisplay(admission.fromDate || admission.admissionDate)}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <span style={{
                                            padding: "5px 10px",
                                            borderRadius: "4px",
                                            fontSize: "13px",
                                            fontWeight: "600",
                                            backgroundColor: admission.status === "Admitted" ? "#d4edda" : "#f8d7da",
                                            color: admission.status === "Admitted" ? "#155724" : "#721c24",
                                            display: 'inline-block'
                                        }}>
                                            {admission.status}
                                        </span>
                                    </td>

                                    <td className="action-cell" style={{ textAlign: 'center' }}>
                                        {/* ✅ SIRF VIEW BUTTON - No edit/delete */}
                                        <button
                                            className="view-btn"
                                            onClick={() => handleView(admission)}
                                            title="View Details"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "20px",
                                                padding: "5px 10px",
                                                borderRadius: "4px",
                                                transition: "background 0.2s"
                                            }}
                                            onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
                                            onMouseOut={(e) => e.target.style.background = "none"}
                                        >
                                            👁️
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                                    {searchTerm ? `No patients found matching "${searchTerm}"` : 
                                     `No ${filterType !== 'all' ? filterType : ''} patients found`}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* VIEW POPUP - Same as before */}
            {showViewPopup && selectedAdmission && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowViewPopup(false)}
                    style={{
                        position: "fixed",
                        inset: 0,
                        background: "rgba(0,0,0,0.5)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 1000,
                    }}
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "700px",
                            maxHeight: "85vh",
                            overflowY: "auto",
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "12px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ margin: 0, color: "#2c3e50" }}>🏥 Admission Details</h2>
                            <button
                                onClick={() => setShowViewPopup(false)}
                                style={{
                                    background: "none",
                                    border: "none",
                                    fontSize: "24px",
                                    cursor: "pointer",
                                    color: "#666"
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            {/* Patient Information */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Patient Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div><strong>Patient Name:</strong> {selectedAdmission.patientName}</div>
                                    <div><strong>Patient ID:</strong> {selectedAdmission.patientId || "-"}</div>
                                    <div><strong>Age:</strong> {selectedAdmission.age || "-"}</div>
                                    <div><strong>Gender:</strong> {selectedAdmission.gender || "-"}</div>
                                    <div><strong>Phone:</strong> {selectedAdmission.phone}</div>
                                    <div><strong>Address:</strong> {selectedAdmission.address || "-"}</div>
                                </div>
                            </div>

                            {/* Admission Information */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Admission Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div><strong>Admission ID:</strong> {selectedAdmission.id}</div>
                                    <div><strong>Bed No:</strong> <strong>{selectedAdmission.bedNo}</strong></div>
                                    <div><strong>Admission Date:</strong> {formatDateForDisplay(selectedAdmission.fromDate || selectedAdmission.admissionDate)}</div>
                                    <div><strong>Discharge Date:</strong> {selectedAdmission.toDate ? formatDateForDisplay(selectedAdmission.toDate) : "Not discharged"}</div>
                                    <div><strong>Status:</strong> 
                                        <span style={{
                                            marginLeft: "8px",
                                            padding: "3px 8px",
                                            borderRadius: "4px",
                                            backgroundColor: selectedAdmission.status === "Admitted" ? "#d4edda" : "#f8d7da",
                                            color: selectedAdmission.status === "Admitted" ? "#155724" : "#721c24"
                                        }}>
                                            {selectedAdmission.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information */}
                            {selectedAdmission.symptoms && (
                                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
                                    <div><strong>Symptoms:</strong> {
                                        Array.isArray(selectedAdmission.symptoms) 
                                            ? selectedAdmission.symptoms.join(", ") 
                                            : selectedAdmission.symptoms
                                    }</div>
                                </div>
                            )}

                            {/* Emergency Contact */}
                            {(selectedAdmission.nameOfKin || selectedAdmission.kinContact) && (
                                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Emergency Contact</h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                        <div><strong>Name of Kin:</strong> {selectedAdmission.nameOfKin || "-"}</div>
                                        <div><strong>Kin Contact:</strong> {selectedAdmission.kinContact || "-"}</div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div style={{ marginTop: "25px", textAlign: "right" }}>
                            <button
                                onClick={() => setShowViewPopup(false)}
                                style={{
                                    background: "linear-gradient(135deg, #0d6efd, #0b5ed7)",
                                    color: "#fff",
                                    padding: "10px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorAdmit;