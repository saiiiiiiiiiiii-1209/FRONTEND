import React, { useState, useEffect, useMemo } from "react";
import "../Appointment.css";

// ==================== DOCTOR APPOINTMENTS PAGE ====================
function DoctorAppointments() {
    // ==================== STATES ====================
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        pending: 0,
        completed: 0,
        cancelled: 0,
        today: 0
    });

    // ==================== FETCH APPOINTMENTS FROM BACKEND ====================
    const fetchAppointments = async () => {
        try {
            setLoading(true);
            console.log("📥 Doctor: Fetching appointments from backend...");
            
            const response = await fetch('http://localhost:8001/api/appointments');
            const data = await response.json();
            
            if (response.ok && data.success) {
                console.log("✅ Doctor: Appointments fetched:", data.appointments?.length || 0);
                
                const processedAppointments = (data.appointments || []).map(apt => ({
                    ...apt,
                    id: apt._id,
                    _id: apt._id
                }));
                
                // Sort by date and time
                const sortedAppointments = processedAppointments.sort((a, b) => {
                    if (a.date < b.date) return -1;
                    if (a.date > b.date) return 1;
                    if (a.time && b.time) {
                        if (a.time < b.time) return -1;
                        if (a.time > b.time) return 1;
                    }
                    return 0;
                });
                
                setAppointments(sortedAppointments);
                
                // Update stats
                if (data.stats) {
                    setStats(data.stats);
                } else {
                    // Calculate stats manually
                    const total = sortedAppointments.length;
                    const pending = sortedAppointments.filter(a => a.status === "Pending").length;
                    const completed = sortedAppointments.filter(a => a.status === "Completed").length;
                    const cancelled = sortedAppointments.filter(a => a.status === "Cancelled").length;
                    const today = sortedAppointments.filter(a => a.date === new Date().toISOString().split('T')[0]).length;
                    
                    setStats({ total, pending, completed, cancelled, today });
                }
            } else {
                console.error("❌ Doctor: Failed to fetch appointments:", data.message);
                setAppointments([]);
            }
        } catch (error) {
            console.error("❌ Doctor: Error fetching appointments:", error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // ==================== FETCH STATS ====================
    const fetchStats = async () => {
        try {
            const response = await fetch('http://localhost:8001/api/appointments/stats');
            const data = await response.json();
            
            if (response.ok && data.success) {
                setStats(data.stats);
            }
        } catch (error) {
            console.error("❌ Doctor: Error fetching stats:", error);
        }
    };

    // ==================== INITIAL LOAD ====================
    useEffect(() => {
        fetchAppointments();
        
        // Refresh every 30 seconds
        const interval = setInterval(() => {
            fetchAppointments();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // ==================== HELPER FUNCTIONS ====================
    const getTodaysAppointments = () => {
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter(apt => apt.date === today);
    };

    const getPendingAppointments = () => {
        return appointments.filter(apt => apt.status === "Pending");
    };

    const getCompletedAppointments = () => {
        return appointments.filter(apt => apt.status === "Completed");
    };

    const getCancelledAppointments = () => {
        return appointments.filter(apt => apt.status === "Cancelled");
    };

    // ==================== STATISTICS CARDS ====================
    const statCards = [
        { 
            label: "Today's Appointments", 
            value: stats.today || getTodaysAppointments().length, 
            icon: "📅", 
            color: "#1976d2",
            filter: "today"
        },
        { 
            label: "Total Appointments", 
            value: stats.total || appointments.length, 
            icon: "🗓️", 
            color: "#388e3c",
            filter: "all"
        },
        { 
            label: "Pending", 
            value: stats.pending || getPendingAppointments().length, 
            icon: "⏳", 
            color: "#f57c00",
            filter: "Pending"
        },
        { 
            label: "Completed", 
            value: stats.completed || getCompletedAppointments().length, 
            icon: "✅", 
            color: "#7b1fa2",
            filter: "Completed"
        },
        { 
            label: "Cancelled", 
            value: stats.cancelled || getCancelledAppointments().length, 
            icon: "❌", 
            color: "#dc3545",
            filter: "Cancelled"
        },
    ];

    // ==================== HANDLE STAT CLICK ====================
    const handleStatClick = (filterType) => {
        setStatusFilter(filterType);
        setSearchTerm("");
    };

    // ==================== CLEAR FILTERS ====================
    const clearFilters = () => {
        setStatusFilter("all");
        setSearchTerm("");
    };

    // ==================== FORMAT DATE ====================
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

    // ==================== HANDLE VIEW ====================
    const handleView = (apt) => {
        setSelectedAppointment(apt);
        setShowViewPopup(true);
    };

    // ==================== FILTER & SORT ====================
    const filteredAppointments = useMemo(() => {
        let result = [...appointments];

        // Apply status filter
        if (statusFilter === "today") {
            const today = new Date().toISOString().split('T')[0];
            result = result.filter(apt => apt.date === today);
        } else if (statusFilter !== "all") {
            result = result.filter(apt => apt.status === statusFilter);
        }

        // Apply search filter
        if (searchTerm) {
            const q = searchTerm.toLowerCase();
            result = result.filter(apt =>
                apt.patientName?.toLowerCase().includes(q) ||
                apt.phone?.includes(q) ||
                apt.email?.toLowerCase().includes(q) ||
                apt.appointmentId?.toLowerCase().includes(q)
            );
        }

        // Sort by date and time
        result.sort((a, b) => {
            if (a.date < b.date) return -1;
            if (a.date > b.date) return 1;
            
            if (a.time && b.time) {
                if (a.time < b.time) return -1;
                if (a.time > b.time) return 1;
            }
            return 0;
        });

        return result;
    }, [appointments, searchTerm, statusFilter]);

    // ==================== GET ACTIVE FILTER LABEL ====================
    const getActiveFilterLabel = () => {
        if (statusFilter === "all") return "All Appointments";
        if (statusFilter === "today") return "Today's Appointments";
        return `${statusFilter} Appointments`;
    };

    if (loading) {
        return (
            <div className="appointments-page">
                <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading appointments...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="appointments-page">
            {/* ==================== PAGE HEADER ==================== */}
            <div className="page-header">
                <div>
                    <h1>📋 Doctor's Appointments</h1>
                    <p style={{ marginLeft: "45px" }}>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long", year: "numeric", month: "long", day: "numeric",
                        })}
                    </p>
                </div>
                <button 
                    className="refresh-btn"
                    onClick={fetchAppointments}
                    style={{
                        padding: "10px 20px",
                        background: "#0d6efd",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer"
                    }}
                >
                    🔄 Refresh
                </button>
            </div>

            {/* ==================== STATISTICS CARDS ==================== */}
            <div className="stats-grid">
                {statCards.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`stat-card ${statusFilter === stat.filter ? 'active-filter' : ''}`}
                        style={{ 
                            borderLeft: `4px solid ${stat.color}`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            opacity: statusFilter === stat.filter ? 1 : 0.8,
                            transform: statusFilter === stat.filter ? 'scale(1.02)' : 'scale(1)',
                        }}
                        onClick={() => handleStatClick(stat.filter)}
                        title={`Click to show ${stat.label.toLowerCase()}`}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ==================== FILTER INDICATOR ==================== */}
            {/* {(statusFilter !== "all" || searchTerm) && (
                <div style={{
                    padding: "10px 16px",
                    borderRadius: "8px",
                    margin: "10px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "#e7f3ff",
                }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🔍 Showing:</span>
                        <span style={{ fontWeight: 'bold' }}>{getActiveFilterLabel()}</span>
                        <span style={{
                            background: "#0d6efd",
                            color: "white",
                            padding: "2px 8px",
                            borderRadius: "16px",
                            fontSize: "12px"
                        }}>
                            {filteredAppointments.length} records
                        </span>
                    </div>
                    <button 
                        style={{
                            background: "none",
                            border: "1px solid #0d6efd",
                            color: "#0d6efd",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            cursor: "pointer",
                            fontSize: "12px",
                        }}
                        onClick={clearFilters}
                    >
                        Clear Filter ✕
                    </button>
                </div>
            )} */}

            {/* ==================== SEARCH ==================== */}
            <div className="filters-section">
                <h3>🔍 Search Appointments</h3>
                <div className="filter-controls">
                    <div className="filter-group" style={{ width: "100%" }}>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Search by name, phone, email, appointment ID..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "12px" }}
                        />
                    </div>
                </div>
            </div>

            {/* ==================== TABLE ==================== */}
            <div className="table-container">
                <div className="table-header">
                    <h3>Appointment Records - {getActiveFilterLabel()}</h3>
                    <span className="record-count">{filteredAppointments.length} records</span>
                </div>
                <div className="table-responsive">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Sr. No.</th>
                                <th>Appointment ID</th>
                                <th>Patient</th>
                                <th>Date</th>
                                <th>Time</th>
                                <th>Phone</th>
                                <th>Age/Gender</th>
                                <th>Symptoms</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAppointments.length > 0 ? (
                                filteredAppointments.map((apt, index) => {
                                    const today = new Date().toISOString().split('T')[0];
                                    const isToday = apt.date === today;
                                    
                                    return (
                                        <tr key={apt._id || apt.id || index} 
                                            className={`${apt.status === "Completed" ? "completed-row" : ""} ${isToday ? "today-row" : ""}`}>
                                            <td><span className="serial-no">{index + 1}</span></td>
                                            <td>
                                                <span className="appointment-id" style={{fontSize: "12px", color: "#666"}}>
                                                    {apt.appointmentId || apt.id || 'N/A'}
                                                </span>
                                            </td>
                                            <td><span className="patient-name">{apt.patientName}</span></td>
                                            <td>{formatDateForDisplay(apt.date)}</td>
                                            <td>{apt.time}</td>
                                            <td>{apt.phone || "-"}</td>
                                            <td>{apt.age || "-"} / {apt.gender || "-"}</td>
                                            <td className="symptoms-cell">
                                                <span className="symptoms-text">
                                                    {Array.isArray(apt.symptoms) ? apt.symptoms.join(", ") : apt.symptoms || "-"}
                                                </span>
                                            </td>
                                            <td>
                                                <span className={`status-badge ${(apt.status || "Pending").toLowerCase()}`}>
                                                    {apt.status === "Completed" ? "✅ Completed" : 
                                                     apt.status === "Cancelled" ? "❌ Cancelled" : 
                                                     "⏳ Pending"}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons-horizontal">
                                                    <button 
                                                        className="view-btn" 
                                                        title="View Details"
                                                        onClick={() => handleView(apt)}
                                                    >
                                                        👁️
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr className="no-data-row">
                                    <td colSpan="10">
                                        <div className="no-data-content">
                                            <span className="no-data-icon">📭</span>
                                            <p>No appointments found</p>
                                            {(searchTerm || statusFilter !== "all") && (
                                                <button className="clear-filter-btn" onClick={clearFilters}>
                                                    Clear Filters
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* ==================== VIEW POPUP ==================== */}
            {showViewPopup && selectedAppointment && (
                <div
                    className="popup-overlay"
                    onClick={() => setShowViewPopup(false)}
                >
                    <div
                        className="popup-content"
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: "600px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "12px",
                        }}
                    >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ margin: 0, color: "#2c3e50" }}>📋 Appointment Details</h2>
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
                            {/* Appointment Information */}
                            <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Appointment Information</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <strong>Appointment ID:</strong> 
                                        <div style={{ fontSize: "14px", color: "#666" }}>
                                            {selectedAppointment.appointmentId || selectedAppointment.id || 'APT-' + Date.now()}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Status:</strong> 
                                        <span style={{
                                            marginLeft: "8px",
                                            padding: "3px 8px",
                                            borderRadius: "4px",
                                            backgroundColor: 
                                                selectedAppointment.status === "Pending" ? "#fff3cd" :
                                                selectedAppointment.status === "Completed" ? "#d4edda" : "#f8d7da",
                                            color: 
                                                selectedAppointment.status === "Pending" ? "#856404" :
                                                selectedAppointment.status === "Completed" ? "#155724" : "#721c24"
                                        }}>
                                            {selectedAppointment.status}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Date & Time */}
                            <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Date & Time</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div><strong>Date:</strong> {formatDateForDisplay(selectedAppointment.date)}</div>
                                    <div><strong>Time:</strong> {selectedAppointment.time}</div>
                                    <div><strong>Doctor:</strong> {selectedAppointment.doctor || "Dr. Pranjal Patil"}</div>
                                </div>
                            </div>

                            {/* Patient Information */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Patient Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div><strong>Patient Name:</strong> {selectedAppointment.patientName}</div>
                                    <div><strong>Age/Gender:</strong> {selectedAppointment.age || "-"} / {selectedAppointment.gender || "-"}</div>
                                    <div><strong>Phone:</strong> {selectedAppointment.phone}</div>
                                    <div><strong>Email:</strong> {selectedAppointment.email || "-"}</div>
                                </div>
                            </div>

                            {/* Symptoms */}
                            {selectedAppointment.symptoms && (
                                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Symptoms</h3>
                                    <div>{selectedAppointment.symptoms}</div>
                                </div>
                            )}

                            {/* Notes */}
                            {selectedAppointment.notes && (
                                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Additional Notes</h3>
                                    <div>{selectedAppointment.notes}</div>
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

export default DoctorAppointments;