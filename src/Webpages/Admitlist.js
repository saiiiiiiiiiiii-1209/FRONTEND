import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Admitlist.css";

function AdmitList() {
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState("");
    const [stats, setStats] = useState({
        total: 0,
        admitted: 0,
        discharged: 0
    });
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [showEditPopup, setShowEditPopup] = useState(false);
    const [showDischargePopup, setShowDischargePopup] = useState(false);
    const [selectedAdmission, setSelectedAdmission] = useState(null);
    const [editFormData, setEditFormData] = useState({});
    const [editErrors, setEditErrors] = useState({});
    const [dischargeData, setDischargeData] = useState({
        dischargeDate: new Date().toISOString().split('T')[0],
        dischargeNotes: "",
        dischargeType: "Recovered"
    });
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
                // Calculate stats from fetched data
                calculateStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching admissions:', error);
        } finally {
            setLoading(false);
        }
    };

    // Calculate statistics from admissions data
    const calculateStats = (admissionsData) => {
        const total = admissionsData.length;
        const admitted = admissionsData.filter(adm => adm.status === "Admitted").length;
        const discharged = admissionsData.filter(adm => adm.status === "Discharged").length;
        
        setStats({
            total,
            admitted,
            discharged
        });
    };

    // Fetch statistics from backend (fallback)
    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/admissionstats');
            const data = await response.json();
            if (data.success) {
                setStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
            // If API fails, calculate from admissions
            if (admissions.length > 0) {
                calculateStats(admissions);
            }
        }
    };

    useEffect(() => {
        fetchAdmissions();
        fetchStats();
    }, []);

    // Update stats when admissions change
    useEffect(() => {
        if (admissions.length > 0) {
            calculateStats(admissions);
        }
    }, [admissions]);

    /* =======================
       FILTER - SEARCH IN ALL FIELDS WITH STATUS FILTER
    ========================*/
    const filteredAdmissions = useMemo(() => {
        if (!admissions) return [];

        let filtered = [...admissions];

        // Apply status filter based on card click
        if (filterType === 'admitted') {
            filtered = filtered.filter(adm => adm.status === "Admitted");
        } else if (filterType === 'discharged') {
            filtered = filtered.filter(adm => adm.status === "Discharged");
        }

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((admission) => {
                const matches = (field) => {
                    if (field === undefined || field === null) return false;
                    return String(field).toLowerCase().includes(searchLower);
                };

                const symptomsMatch = admission.symptoms &&
                    (Array.isArray(admission.symptoms)
                        ? admission.symptoms.some(symptom => symptom.toLowerCase().includes(searchLower))
                        : String(admission.symptoms).toLowerCase().includes(searchLower));

                return (
                    matches(admission.patientName) ||
                    matches(admission.patientId) ||
                    matches(admission.age) ||
                    matches(admission.gender) ||
                    matches(admission.phone) ||
                    matches(admission.bedNo) ||
                    matches(admission.fromDate) ||
                    matches(admission.toDate) ||
                    // matches(admission.admittingDoctor) ||
                    matches(admission.nameOfKin) ||
                    matches(admission.kinContact) ||
                    matches(admission.status) ||
                    matches(admission.address) ||
                    symptomsMatch
                );
            });
        }

        return filtered;
    }, [admissions, searchTerm, filterType]);

    /* =======================
       HANDLERS FOR CARD CLICKS
    ========================*/
    const handleTotalCardClick = () => {
        setFilterType('all');
        setSearchTerm(''); // Optional: clear search when changing filter
    };

    const handleAdmittedCardClick = () => {
        setFilterType('admitted');
        setSearchTerm(''); // Optional: clear search when changing filter
    };

    const handleDischargedCardClick = () => {
        setFilterType('discharged');
        setSearchTerm(''); // Optional: clear search when changing filter
    };

    /* =======================
       OTHER HANDLERS
    ========================*/
    const handleView = (admission) => {
        setSelectedAdmission(admission);
        setShowViewPopup(true);
    };

    const handleEdit = (admission) => {
        setSelectedAdmission(admission);
        setEditFormData({ ...admission });
        setEditErrors({});
        setShowEditPopup(true);
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        
        if (name === "phone" || name === "kinContact") {
            const cleaned = value.replace(/\D/g, '');
            if (cleaned.length <= 10) {
                setEditFormData(prev => ({ ...prev, [name]: cleaned }));
            }
        } 
        else if (name === "age") {
            if (value === "" || /^\d+$/.test(value)) {
                const ageNum = parseInt(value);
                if (value === "" || (ageNum >= 0 && ageNum <= 120)) {
                    setEditFormData(prev => ({ ...prev, [name]: value }));
                }
            }
        } 
        else {
            setEditFormData(prev => ({ ...prev, [name]: value }));
        }
        
        if (editErrors[name]) {
            setEditErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch(`http://localhost:8001/api/admitpatient/${selectedAdmission.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });

            const data = await response.json();

            if (data.success) {
                await fetchAdmissions();
                await fetchStats();
                setShowEditPopup(false);
                setEditErrors({});
                alert(`✅ Admission record updated successfully!`);
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error updating admission:', error);
            alert('Failed to update admission');
        }
    };

    const handleDischarge = (admission) => {
        setSelectedAdmission(admission);
        setDischargeData({
            dischargeDate: new Date().toISOString().split('T')[0],
            dischargeNotes: "",
            dischargeType: "Recovered"
        });
        setShowDischargePopup(true);
    };

    const handleDischargeChange = (e) => {
        const { name, value } = e.target;
        setDischargeData(prev => ({ ...prev, [name]: value }));
    };

    const handleDischargeConfirm = async () => {
        try {
            const response = await fetch(`http://localhost:8001/api/dischargepatient/${selectedAdmission.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(dischargeData)
            });

            const data = await response.json();

            if (data.success) {
                await fetchAdmissions();
                await fetchStats();
                setShowDischargePopup(false);
                alert(`✅ Patient ${selectedAdmission.patientName} discharged successfully!`);
            } else {
                alert(`❌ Error: ${data.message}`);
            }
        } catch (error) {
            console.error('Error discharging patient:', error);
            alert('Failed to discharge patient');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this admission record?")) {
            try {
                const response = await fetch(`http://localhost:8001/api/admitpatient/${id}`, {
                    method: 'DELETE'
                });

                const data = await response.json();

                if (data.success) {
                    await fetchAdmissions();
                    await fetchStats();
                    alert('✅ Admission record deleted successfully!');
                } else {
                    alert(`❌ Error: ${data.message}`);
                }
            } catch (error) {
                console.error('Error deleting admission:', error);
                alert('Failed to delete admission');
            }
        }
    };

    const handleStatusChange = (id, newStatus) => {
        if (newStatus === "Discharged") {
            const admission = admissions.find(adm => adm.id === id);
            if (admission) {
                handleDischarge(admission);
            }
        }
    };

    const inputStyle = {
        padding: "10px",
        borderRadius: "6px",
        border: "1px solid #ddd",
        fontSize: "14px",
        width: "100%",
        boxSizing: "border-box"
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
                    <h1>🛏️ Admit List</h1>
                    <p style={{ marginLeft: "45px" }}>
                        {filterType === 'all' ? 'Showing all patients' : 
                         filterType === 'admitted' ? 'Showing admitted patients' : 
                         'Showing discharged patients'}
                    </p>
                </div>
                <div style={{ display: "flex", gap: "10px" }}>
                    <button 
                        className="bed-view-btn" 
                        onClick={() => navigate("/receptionist-dashboard/bedview")}
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
                            gap: "8px",
                            transition: "all 0.3s ease"
                        }}
                    >
                        <span>🛏️</span>
                        <span>Bed View</span>
                    </button>
                    
                    <button className="add-btn" onClick={() => navigate("/receptionist-dashboard")}>
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
                        transition: "transform 0.2s, box-shadow 0.2s",
                        transform: filterType === 'all' ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: filterType === 'all' ? '0 4px 15px rgba(13, 110, 253, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    onClick={handleTotalCardClick}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = filterType === 'all' ? 'scale(1.02)' : 'scale(1)'}
                >
                    <h4>📊 TOTAL PATIENTS</h4>
                    <h2>{stats.total}</h2>
                    <small></small>
                </div>
                <div 
                    className={`summary-card ${filterType === 'admitted' ? 'active-card' : ''}`} 
                    style={{ 
                        borderLeft: "4px solid #28a745",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        transform: filterType === 'admitted' ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: filterType === 'admitted' ? '0 4px 15px rgba(40, 167, 69, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    onClick={handleAdmittedCardClick}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = filterType === 'admitted' ? 'scale(1.02)' : 'scale(1)'}
                >
                    <h4>🟢 ADMITTED</h4>
                    <h2>{stats.admitted}</h2>
                    <small></small>
                </div>
                <div 
                    className={`summary-card ${filterType === 'discharged' ? 'active-card' : ''}`} 
                    style={{ 
                        borderLeft: "4px solid #dc3545",
                        cursor: "pointer",
                        transition: "transform 0.2s, box-shadow 0.2s",
                        transform: filterType === 'discharged' ? 'scale(1.02)' : 'scale(1)',
                        boxShadow: filterType === 'discharged' ? '0 4px 15px rgba(220, 53, 69, 0.3)' : '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                    onClick={handleDischargedCardClick}
                    onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
                    onMouseOut={(e) => e.currentTarget.style.transform = filterType === 'discharged' ? 'scale(1.02)' : 'scale(1)'}
                >
                    <h4>🔴 DISCHARGED</h4>
                    <h2>{stats.discharged}</h2>
                    <small></small>
                </div>
            </div><br />

            {/* FILTER INDICATOR AND CLEAR BUTTON */}
            {/* {filterType !== 'all' && (
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <div style={{ 
                        background: '#e3f2fd', 
                        padding: '8px 15px', 
                        borderRadius: '20px',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <span>🔍 Showing: <strong>{filterType === 'admitted' ? 'Admitted Patients' : 'Discharged Patients'}</strong></span>
                        <button 
                            onClick={() => setFilterType('all')}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#0d6efd',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '14px'
                            }}
                        >
                            ✕ Clear filter
                        </button>
                    </div>
                    <div style={{ color: '#666' }}>
                        Found {filteredAdmissions.length} {filterType === 'admitted' ? 'admitted' : filterType === 'discharged' ? 'discharged' : ''} patients
                    </div>
                </div>
            )} */}

            {/* SEARCH */}
            <div className="search-container-fluid">
                <input
                    type="text"
                    placeholder={`Search in ${filterType === 'all' ? 'all' : filterType === 'admitted' ? 'admitted' : 'discharged'} patients...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* TABLE - WITH CENTER ALIGNMENT */}
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
                                    <td style={{ textAlign: 'center' }}>{admission.fromDate || admission.admissionDate}</td>
                                    <td style={{ textAlign: 'center' }}>
                                        <select
                                            value={admission.status}
                                            onChange={(e) => handleStatusChange(admission.id, e.target.value)}
                                            style={{
                                                padding: "5px 10px",
                                                borderRadius: "4px",
                                                border: "1px solid #ddd",
                                                fontSize: "13px",
                                                fontWeight: "600",
                                                cursor: "pointer",
                                                backgroundColor: admission.status === "Admitted" ? "#d4edda" : "#f8d7da",
                                                color: admission.status === "Admitted" ? "#155724" : "#721c24",
                                                textAlign: 'center',
                                                margin: '0 auto',
                                                display: 'block'
                                            }}
                                        >
                                            <option value="Admitted">Admitted</option>
                                            <option value="Discharged">Discharged</option>
                                        </select>
                                    </td>

                                    <td className="action-cell" style={{ textAlign: 'center' }}>
                                        <button
                                            className="view-btn"
                                            onClick={() => handleView(admission)}
                                            title="View Details"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                padding: "5px",
                                                borderRadius: "4px",
                                                transition: "background 0.2s",
                                                margin: '0 3px'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
                                            onMouseOut={(e) => e.target.style.background = "none"}
                                        >
                                            👁️
                                        </button>
                                        <button
                                            className="edit-btn"
                                            onClick={() => handleEdit(admission)}
                                            title="Edit Admission"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                padding: "5px",
                                                borderRadius: "4px",
                                                transition: "background 0.2s",
                                                margin: '0 3px'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
                                            onMouseOut={(e) => e.target.style.background = "none"}
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="delete-btn"
                                            onClick={() => handleDelete(admission.id)}
                                            title="Delete Record"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "18px",
                                                padding: "5px",
                                                borderRadius: "4px",
                                                transition: "background 0.2s",
                                                margin: '0 3px'
                                            }}
                                            onMouseOver={(e) => e.target.style.background = "#ffebee"}
                                            onMouseOut={(e) => e.target.style.background = "none"}
                                        >
                                            ❌
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                                    {searchTerm ? `No ${filterType !== 'all' ? filterType : ''} patients found matching "${searchTerm}"` : 
                                     `No ${filterType !== 'all' ? filterType : ''} patients found`}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* VIEW POPUP */}
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
                                    <div><strong>Admission Date:</strong> {selectedAdmission.fromDate || selectedAdmission.admissionDate}</div>
                                    <div><strong>Discharge Date:</strong> {selectedAdmission.toDate || "Not discharged"}</div>
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
                                    {/* <div><strong>Admitting Doctor:</strong> {selectedAdmission.admittingDoctor || "-"}</div> */}
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

            {/* EDIT POPUP */}
            {showEditPopup && selectedAdmission && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowEditPopup(false)}
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
                            <h2 style={{ margin: 0, color: "#2c3e50" }}>✏️ Edit Admission</h2>
                            <button
                                onClick={() => setShowEditPopup(false)}
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

                        <form onSubmit={handleEditSubmit}>
                            <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                                {/* Patient Information */}
                                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Patient Information</h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div style={{ gridColumn: "span 2" }}>
                                            <input
                                                name="patientName"
                                                placeholder="Patient Name"
                                                value={editFormData.patientName || ""}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <input
                                                name="age"
                                                type="number"
                                                placeholder="Age"
                                                value={editFormData.age || ""}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <select
                                                name="gender"
                                                value={editFormData.gender || ""}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                            >
                                                <option value="">Gender</option>
                                                <option value="Male">Male</option>
                                                <option value="Female">Female</option>
                                                <option value="Other">Other</option>
                                            </select>
                                        </div>
                                        <div style={{ gridColumn: "span 2" }}>
                                            <input
                                                name="phone"
                                                placeholder="Phone"
                                                value={editFormData.phone || ""}
                                                onChange={handleEditChange}
                                                maxLength="10"
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div style={{ gridColumn: "span 2" }}>
                                            <textarea
                                                name="address"
                                                placeholder="Address"
                                                value={editFormData.address || ""}
                                                onChange={handleEditChange}
                                                rows="2"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Admission Details */}
                                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Admission Details</h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div>
                                            <input
                                                name="bedNo"
                                                placeholder="Bed No"
                                                value={editFormData.bedNo || ""}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            {/* <input
                                                name="admittingDoctor"
                                                placeholder="Admitting Doctor"
                                                value={editFormData.admittingDoctor || ""}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                            /> */}
                                        </div>
                                        <div>
                                            <input
                                                name="fromDate"
                                                type="date"
                                                placeholder="Admission Date"
                                                value={editFormData.fromDate || ""}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <select
                                                name="status"
                                                value={editFormData.status || "Admitted"}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                            >
                                                <option value="Admitted">Admitted</option>
                                                <option value="Discharged">Discharged</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {/* Symptoms */}
                                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
                                    <div>
                                        <input
                                            name="symptoms"
                                            placeholder="Symptoms (comma separated)"
                                            value={Array.isArray(editFormData.symptoms) ? editFormData.symptoms.join(", ") : editFormData.symptoms || ""}
                                            onChange={(e) => setEditFormData({...editFormData, symptoms: e.target.value})}
                                            style={inputStyle}
                                        />
                                    </div>
                                </div>

                                {/* Emergency Contact */}
                                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Emergency Contact</h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                        <div>
                                            <input
                                                name="nameOfKin"
                                                placeholder="Name of Kin"
                                                value={editFormData.nameOfKin || ""}
                                                onChange={handleEditChange}
                                                style={inputStyle}
                                            />
                                        </div>
                                        <div>
                                            <input
                                                name="kinContact"
                                                placeholder="Kin Contact"
                                                value={editFormData.kinContact || ""}
                                                onChange={handleEditChange}
                                                maxLength="10"
                                                style={inputStyle}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                                <button
                                    type="button"
                                    onClick={() => setShowEditPopup(false)}
                                    style={{
                                        background: "linear-gradient(135deg, #6c757d, #5c636a)",
                                        color: "#fff",
                                        padding: "10px 25px",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                    }}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    style={{
                                        background: "linear-gradient(135deg, #28a745, #218838)",
                                        color: "#fff",
                                        padding: "10px 25px",
                                        border: "none",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontWeight: "600",
                                    }}
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* DISCHARGE POPUP */}
            {showDischargePopup && selectedAdmission && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowDischargePopup(false)}
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
                            width: "500px",
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "12px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ margin: 0, color: "#2c3e50" }}>🚑 Discharge Patient</h2>
                            <button
                                onClick={() => setShowDischargePopup(false)}
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

                        <div style={{ marginBottom: "20px" }}>
                            <p><strong>Patient:</strong> {selectedAdmission.patientName}</p>
                            <p><strong>Bed No:</strong> {selectedAdmission.bedNo}</p>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                                    Discharge Date *
                                </label>
                                <input
                                    type="date"
                                    name="dischargeDate"
                                    value={dischargeData.dischargeDate}
                                    onChange={handleDischargeChange}
                                    max={new Date().toISOString().split('T')[0]}
                                    style={inputStyle}
                                    required
                                />
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                                    Discharge Type *
                                </label>
                                <select
                                    name="dischargeType"
                                    value={dischargeData.dischargeType}
                                    onChange={handleDischargeChange}
                                    style={inputStyle}
                                >
                                    <option value="Recovered">Recovered</option>
                                    <option value="Referred">Referred to another hospital</option>
                                    <option value="LAMA">Left Against Medical Advice (LAMA)</option>
                                    <option value="Expired">Expired</option>
                                </select>
                            </div>

                            <div>
                                <label style={{ display: "block", marginBottom: "5px", fontWeight: "600", fontSize: "14px" }}>
                                    Discharge Notes
                                </label>
                                <textarea
                                    name="dischargeNotes"
                                    value={dischargeData.dischargeNotes}
                                    onChange={handleDischargeChange}
                                    rows="4"
                                    placeholder="Enter discharge summary, follow-up instructions, etc."
                                    style={{...inputStyle, resize: "vertical"}}
                                />
                            </div>
                        </div>

                        <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
                            <button
                                onClick={() => setShowDischargePopup(false)}
                                style={{
                                    background: "linear-gradient(135deg, #6c757d, #5c636a)",
                                    color: "#fff",
                                    padding: "10px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDischargeConfirm}
                                style={{
                                    background: "linear-gradient(135deg, #dc3545, #c82333)",
                                    color: "#fff",
                                    padding: "10px 25px",
                                    border: "none",
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                }}
                            >
                                Confirm Discharge
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdmitList;