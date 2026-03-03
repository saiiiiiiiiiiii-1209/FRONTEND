// import React, { useState, useEffect, useMemo } from "react";
// import "../Appointment.css";

// // ==================== DOCTOR APPOINTMENTS PAGE ====================
// function DoctorAppointments() {
//     // ==================== STATES ====================
//     const [appointments, setAppointments] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [searchTerm, setSearchTerm] = useState("");
//     const [showViewPopup, setShowViewPopup] = useState(false);
//     const [selectedAppointment, setSelectedAppointment] = useState(null);

//     // ==================== LOAD DATA ====================
//     useEffect(() => {
//         loadAppointments();
//     }, []);

//     const loadAppointments = () => {
//         try {
//             const savedAppointments = localStorage.getItem('appointments');
//             if (savedAppointments) {
//                 const parsedAppointments = JSON.parse(savedAppointments);
//                 setAppointments(parsedAppointments);
//             } else {
//                 setAppointments([]);
//             }
//         } catch (error) {
//             console.error("❌ Error loading appointments:", error);
//             setAppointments([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     // ==================== SAVE DATA ====================
//     useEffect(() => {
//         if (!loading) {
//             localStorage.setItem('appointments', JSON.stringify(appointments));
//         }
//     }, [appointments, loading]);

//     // ==================== HELPER FUNCTIONS ====================
//     const getTodaysAppointments = () => {
//         const today = new Date().toISOString().split('T')[0];
//         return appointments.filter(apt => apt.date === today);
//     };

//     const getPendingAppointments = () => {
//         return appointments.filter(apt => apt.status === "Pending");
//     };

//     const getCompletedAppointments = () => {
//         return appointments.filter(apt => apt.status === "Completed");
//     };

//     const getCancelledAppointments = () => {
//         return appointments.filter(apt => apt.status === "Cancelled");
//     };

//     // ==================== STATISTICS ====================
//     const stats = [
//         { label: "Today's Appointments", value: getTodaysAppointments().length, icon: "📅", color: "#1976d2" },
//         { label: "Total Appointments", value: appointments?.length || 0, icon: "🗓️", color: "#388e3c" },
//         { label: "Pending", value: getPendingAppointments().length, icon: "⏳", color: "#f57c00" },
//         { label: "Completed", value: getCompletedAppointments().length, icon: "✅", color: "#7b1fa2" },
//         { label: "Cancelled", value: getCancelledAppointments().length, icon: "❌", color: "#dc3545" },
//     ];

//     // ==================== FORMAT DATE FOR DISPLAY ====================
//     const formatDateForDisplay = (dateString) => {
//         if (!dateString) return "-";
//         try {
//             if (dateString.includes('/')) return dateString;
//             const [year, month, day] = dateString.split('-');
//             if (year && month && day) {
//                 return `${day}/${month}/${year}`;
//             }
//             return dateString;
//         } catch {
//             return dateString;
//         }
//     };

//     // ==================== HANDLERS ====================
//     const handleView = (apt) => {
//         setSelectedAppointment(apt);
//         setShowViewPopup(true);
//     };

//     // ==================== FILTER & SORT ====================
//     const filteredAppointments = useMemo(() => {
//         let result = [...appointments];

//         if (searchTerm) {
//             const q = searchTerm.toLowerCase();
//             result = result.filter(apt =>
//                 apt.patientName?.toLowerCase().includes(q) ||
//                 apt.phone?.includes(q) ||
//                 apt.email?.toLowerCase().includes(q)
//             );
//         }

//         result.sort((a, b) => {
//             if (a.date < b.date) return -1;
//             if (a.date > b.date) return 1;
            
//             if (a.time && b.time) {
//                 if (a.time < b.time) return -1;
//                 if (a.time > b.time) return 1;
//             }
//             return 0;
//         });

//         return result;
//     }, [appointments, searchTerm]);

//     if (loading) {
//         return (
//             <div className="appointments-page">
//                 <div className="loading-state">
//                     <div className="spinner"></div>
//                     <p>Loading appointments...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="appointments-page">
//             {/* ==================== PAGE HEADER ==================== */}
//             <div className="page-header">
//                 <div>
//                     <h1>📋 My Appointments</h1>
//                     <p style={{ marginLeft: "45px" }}>
//                         {new Date().toLocaleDateString("en-US", {
//                             weekday: "long", year: "numeric", month: "long", day: "numeric",
//                         })}
//                     </p>
//                 </div>
//                 {/* <div className="header-actions">
//                     <button className="refresh-btn" onClick={loadAppointments}>
//                         🔄 Refresh
//                     </button>
//                 </div> */}
//             </div>

//             {/* ==================== STATISTICS CARDS ==================== */}
//             <div className="stats-grid">
//                 {stats.map((stat, index) => (
//                     <div key={index} className="stat-card" style={{ borderLeft: `4px solid ${stat.color}` }}>
//                         <div className="stat-icon">{stat.icon}</div>
//                         <div className="stat-info">
//                             <h3>{stat.value}</h3>
//                             <p>{stat.label}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* ==================== SEARCH ==================== */}
//             <div className="filters-section">
//                 <h3>🔍 Search Appointments</h3>
//                 <div className="filter-controls">
//                     <div className="filter-group" style={{ width: "100%" }}>
//                         <input
//                             type="text"
//                             className="filter-input"
//                             placeholder="Search by name, phone, email..."
//                             value={searchTerm}
//                             onChange={(e) => setSearchTerm(e.target.value)}
//                             style={{ width: "100%", padding: "12px" }}
//                         />
//                     </div>
//                 </div>
//                 {searchTerm && (
//                     <div className="active-filters">
//                         <span>Searching for: "{searchTerm}"</span>
//                         <button className="clear-filter-btn" onClick={() => setSearchTerm("")}>
//                             Clear
//                         </button>
//                     </div>
//                 )}
//             </div>

//             {/* ==================== TABLE ==================== */}
//             <div className="table-container">
//                 <div className="table-header">
//                     <h3>Appointment Records</h3>
//                     <span className="record-count">{filteredAppointments.length} records</span>
//                 </div>
//                 <div className="table-responsive">
//                     <table className="data-table">
//                         <thead>
//                             <tr>
//                                 <th>Sr. No.</th>
//                                 <th>Patient</th>
//                                 <th>Date</th>
//                                 <th>Time</th>
//                                 <th>Phone</th>
//                                 <th>Age/Gender</th>
//                                 <th>Symptoms</th>
//                                 <th>Status</th>
//                                 <th>Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {filteredAppointments.length > 0 ? (
//                                 filteredAppointments.map((apt, index) => {
//                                     const today = new Date().toISOString().split('T')[0];
//                                     const isToday = apt.date === today;
                                    
//                                     return (
//                                         <tr key={apt.id || apt._id || index} 
//                                             className={`${apt.status === "Completed" ? "completed-row" : ""} ${isToday ? "today-row" : ""}`}>
//                                             <td><span className="serial-no">{index + 1}</span></td>
//                                             <td><span className="patient-name">{apt.patientName}</span></td>
//                                             <td>{formatDateForDisplay(apt.date)}</td>
//                                             <td>{apt.time}</td>
//                                             <td>{apt.phone || "-"}</td>
//                                             <td>{apt.age || "-"} / {apt.gender || "-"}</td>
//                                             <td className="symptoms-cell">
//                                                 <span className="symptoms-text">
//                                                     {Array.isArray(apt.symptoms) ? apt.symptoms.join(", ") : apt.symptoms || "-"}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 <span className={`status-badge ${(apt.status || "Pending").toLowerCase()}`}>
//                                                     {apt.status === "Completed" ? "✅ Completed" : 
//                                                      apt.status === "Cancelled" ? "❌ Cancelled" : 
//                                                      "⏳ Pending"}
//                                                 </span>
//                                             </td>
//                                             <td>
//                                                 <div className="action-buttons-horizontal">
//                                                     <button 
//                                                         className="view-btn" 
//                                                         title="View Details"
//                                                         onClick={() => handleView(apt)}
//                                                     >
//                                                         👁️
//                                                     </button>
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     );
//                                 })
//                             ) : (
//                                 <tr className="no-data-row">
//                                     <td colSpan="9">
//                                         <div className="no-data-content">
//                                             <span className="no-data-icon">📭</span>
//                                             <p>No appointments found</p>
//                                             {searchTerm && (
//                                                 <button className="clear-filter-btn" onClick={() => setSearchTerm("")}>
//                                                     Clear Search
//                                                 </button>
//                                             )}
//                                         </div>
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>

//             {/* ==================== VIEW POPUP - PEHLE PHOTO WALA DESIGN ==================== */}
//             {showViewPopup && selectedAppointment && (
//                 <div
//                     className="popup-overlay"
//                     onClick={() => setShowViewPopup(false)}
//                     style={{
//                         position: "fixed",
//                         inset: 0,
//                         background: "rgba(0,0,0,0.5)",
//                         display: "flex",
//                         justifyContent: "center",
//                         alignItems: "center",
//                         zIndex: 1000,
//                     }}
//                 >
//                     <div
//                         className="popup-content"
//                         onClick={(e) => e.stopPropagation()}
//                         style={{
//                             width: "600px",
//                             maxHeight: "80vh",
//                             overflowY: "auto",
//                             background: "#fff",
//                             padding: "30px",
//                             borderRadius: "12px",
//                             boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//                         }}
//                     >
//                         {/* Header with Title and Close Button */}
//                         <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//                             <h2 style={{ margin: 0, color: "#2c3e50" }}>📋 Appointment Details</h2>
//                             <button
//                                 onClick={() => setShowViewPopup(false)}
//                                 style={{
//                                     background: "none",
//                                     border: "none",
//                                     fontSize: "24px",
//                                     cursor: "pointer",
//                                     color: "#666"
//                                 }}
//                             >
//                                 ×
//                             </button>
//                         </div>

//                         {/* Content Grid - 2 Columns */}
//                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            
//                             {/* Appointment Information - Left Column */}
//                             <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Appointment Information</h3>
//                                 <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//                                     <div>
//                                         <strong>Appointment ID:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#666", wordBreak: "break-all" }}>
//                                             {selectedAppointment.appointmentId || selectedAppointment.id || 'APT-' + Date.now()}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>MongoDB ID:</strong> 
//                                         <div style={{ fontSize: "12px", color: "#999", wordBreak: "break-all" }}>
//                                             {selectedAppointment._id || selectedAppointment.id || 'N/A'}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Status:</strong> 
//                                         <span style={{
//                                             marginLeft: "8px",
//                                             padding: "3px 8px",
//                                             borderRadius: "4px",
//                                             backgroundColor: 
//                                                 selectedAppointment.status === "Pending" ? "#fff3cd" :
//                                                 selectedAppointment.status === "Completed" ? "#d4edda" : "#f8d7da",
//                                             color: 
//                                                 selectedAppointment.status === "Pending" ? "#856404" :
//                                                 selectedAppointment.status === "Completed" ? "#155724" : "#721c24"
//                                         }}>
//                                             {selectedAppointment.status}
//                                         </span>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Date & Time - Right Column */}
//                             <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Date & Time</h3>
//                                 <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//                                     <div>
//                                         <strong>Date:</strong> {formatDateForDisplay(selectedAppointment.date)}
//                                     </div>
//                                     <div>
//                                         <strong>Time:</strong> {selectedAppointment.time}
//                                     </div>
//                                     <div>
//                                         <strong>Department:</strong> {selectedAppointment.type || "Cardiology"}
//                                     </div>
//                                     <div>
//                                         <strong>Doctor:</strong> {selectedAppointment.doctor || "Dr. Pranjal Patil"}
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Patient Information - Full Width */}
//                             <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Patient Information</h3>
//                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                                     <div><strong>Patient Name:</strong> {selectedAppointment.patientName}</div>
//                                     <div><strong>Age/Gender:</strong> {selectedAppointment.age || "-"} / {selectedAppointment.gender || "-"}</div>
//                                     <div><strong>Phone:</strong> {selectedAppointment.phone}</div>
//                                     <div><strong>Email:</strong> {selectedAppointment.email || "-"}</div>
//                                 </div>
//                             </div>

//                             {/* Symptoms - Full Width */}
//                             {selectedAppointment.symptoms && (
//                                 <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                     <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Symptoms</h3>
//                                     <div>{selectedAppointment.symptoms}</div>
//                                 </div>
//                             )}

//                             {/* Additional Notes - Full Width */}
//                             {selectedAppointment.notes && (
//                                 <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                     <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Additional Notes</h3>
//                                     <div>{selectedAppointment.notes}</div>
//                                 </div>
//                             )}

//                             {/* Booking Information - Full Width */}
//                             <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Booking Information</h3>
//                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                                     <div><strong>Booking Date:</strong> {selectedAppointment.bookingDate ? formatDateForDisplay(selectedAppointment.bookingDate) : "-"}</div>
//                                     <div><strong>Booking Time:</strong> {selectedAppointment.bookingTime || "-"}</div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Close Button */}
//                         <div style={{ marginTop: "25px", textAlign: "right" }}>
//                             <button
//                                 onClick={() => setShowViewPopup(false)}
//                                 style={{
//                                     background: "linear-gradient(135deg, #0d6efd, #0b5ed7)",
//                                     color: "#fff",
//                                     padding: "10px 25px",
//                                     border: "none",
//                                     borderRadius: "8px",
//                                     cursor: "pointer",
//                                     fontWeight: "600",
//                                 }}
//                             >
//                                 Close
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DoctorAppointments;

import React, { useState, useEffect, useMemo } from "react";
import "../Appointment.css";

// ==================== DOCTOR APPOINTMENTS PAGE ====================
function DoctorAppointments() {
    // ==================== STATES ====================
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all"); // ✅ Status filter state
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [selectedAppointment, setSelectedAppointment] = useState(null);

    // ==================== LOAD DATA ====================
    useEffect(() => {
        loadAppointments();
    }, []);

    const loadAppointments = () => {
        try {
            const savedAppointments = localStorage.getItem('appointments');
            if (savedAppointments) {
                const parsedAppointments = JSON.parse(savedAppointments);
                setAppointments(parsedAppointments);
            } else {
                setAppointments([]);
            }
        } catch (error) {
            console.error("❌ Error loading appointments:", error);
            setAppointments([]);
        } finally {
            setLoading(false);
        }
    };

    // ==================== SAVE DATA ====================
    useEffect(() => {
        if (!loading) {
            localStorage.setItem('appointments', JSON.stringify(appointments));
        }
    }, [appointments, loading]);

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

    // ==================== STATISTICS ====================
    const stats = [
        { 
            label: "Today's Appointments", 
            value: getTodaysAppointments().length, 
            icon: "📅", 
            color: "#1976d2",
            filter: "today"  // ✅ Custom filter type
        },
        { 
            label: "Total Appointments", 
            value: appointments?.length || 0, 
            icon: "🗓️", 
            color: "#388e3c",
            filter: "all"  // ✅ Show all
        },
        { 
            label: "Pending", 
            value: getPendingAppointments().length, 
            icon: "⏳", 
            color: "#f57c00",
            filter: "Pending"  // ✅ Filter by status
        },
        { 
            label: "Completed", 
            value: getCompletedAppointments().length, 
            icon: "✅", 
            color: "#7b1fa2",
            filter: "Completed"  // ✅ Filter by status
        },
        { 
            label: "Cancelled", 
            value: getCancelledAppointments().length, 
            icon: "❌", 
            color: "#dc3545",
            filter: "Cancelled"  // ✅ Filter by status
        },
    ];

    // ==================== HANDLE STAT CLICK ====================
    const handleStatClick = (filterType) => {
        setStatusFilter(filterType);
        // Clear search when filtering by stats
        setSearchTerm("");
    };

    // ==================== CLEAR FILTERS ====================
    const clearFilters = () => {
        setStatusFilter("all");
        setSearchTerm("");
    };

    // ==================== FORMAT DATE FOR DISPLAY ====================
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

    // ==================== HANDLERS ====================
    const handleView = (apt) => {
        setSelectedAppointment(apt);
        setShowViewPopup(true);
    };

    // ==================== FILTER & SORT ====================
    const filteredAppointments = useMemo(() => {
        let result = [...appointments];

        // ✅ Apply status filter based on stat click
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
                apt.email?.toLowerCase().includes(q)
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
                    <h1>📋 My Appointments</h1>
                    <p style={{ marginLeft: "45px" }}>
                        {new Date().toLocaleDateString("en-US", {
                            weekday: "long", year: "numeric", month: "long", day: "numeric",
                        })}
                    </p>
                </div>
            </div>

            {/* ==================== STATISTICS CARDS (CLICKABLE) ==================== */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className={`stat-card ${statusFilter === stat.filter ? 'active-filter' : ''}`}
                        style={{ 
                            borderLeft: `4px solid ${stat.color}`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            opacity: statusFilter === stat.filter ? 1 : 0.8,
                            transform: statusFilter === stat.filter ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: statusFilter === stat.filter ? `0 4px 12px ${stat.color}40` : 'none'
                        }}
                        onClick={() => handleStatClick(stat.filter)}
                        title={`Click to show ${stat.label.toLowerCase()}`}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                        {/* {statusFilter === stat.filter && (
                            <div style={{
                                position: 'absolute',
                                top: '10px',
                                right: '10px',
                                fontSize: '12px',
                                fontWeight: 'bold',
                                color: stat.color
                            }}>
                                ✓ Active
                            </div>
                        )} */}
                    </div>
                ))}
            </div>

            {/* ==================== ACTIVE FILTER INDICATOR ==================== */}
            {(statusFilter !== "all" || searchTerm) && (
                <div style={{
                    // background: "#e7f3ff",
                    padding: "10px 16px",
                    borderRadius: "8px",
                    margin: "10px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "#0d6efd"
                }}>
                    {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🔍 Showing:</span>
                        <span style={{ fontWeight: 'bold' }}>{getActiveFilterLabel()}</span>
                        {statusFilter !== "all" && (
                            <span style={{
                                background: "#0d6efd",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "16px",
                                fontSize: "12px"
                            }}>
                                {filteredAppointments.length} records
                            </span>
                        )}
                    </div> */}
                    {/* <button 
                        style={{
                            background: "none",
                            border: "1px solid #0d6efd",
                            color: "#0d6efd",
                            padding: "4px 12px",
                            borderRadius: "16px",
                            cursor: "pointer",
                            fontSize: "12px",
                            fontWeight: "500"
                        }}
                        onClick={clearFilters}
                        onMouseOver={(e) => {
                            e.target.style.background = "#0d6efd";
                            e.target.style.color = "white";
                        }}
                        onMouseOut={(e) => {
                            e.target.style.background = "none";
                            e.target.style.color = "#0d6efd";
                        }}
                    >
                        Clear Filter ✕
                    </button> */}
                </div>
            )}

            {/* ==================== SEARCH ==================== */}
            <div className="filters-section">
                <h3>🔍 Search Appointments</h3>
                <div className="filter-controls">
                    <div className="filter-group" style={{ width: "100%" }}>
                        <input
                            type="text"
                            className="filter-input"
                            placeholder="Search by name, phone, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: "100%", padding: "12px" }}
                        />
                    </div>
                </div>
                {searchTerm && (
                    <div className="active-filters">
                        <span>Searching for: "{searchTerm}"</span>
                        <button className="clear-filter-btn" onClick={() => setSearchTerm("")}>
                            Clear
                        </button>
                    </div>
                )}
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
                                        <tr key={apt.id || apt._id || index} 
                                            className={`${apt.status === "Completed" ? "completed-row" : ""} ${isToday ? "today-row" : ""}`}>
                                            <td><span className="serial-no">{index + 1}</span></td>
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
                                    <td colSpan="9">
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
                            width: "600px",
                            maxHeight: "80vh",
                            overflowY: "auto",
                            background: "#fff",
                            padding: "30px",
                            borderRadius: "12px",
                            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
                        }}
                    >
                        {/* Header with Title and Close Button */}
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

                        {/* Content Grid - 2 Columns */}
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                            
                            {/* Appointment Information - Left Column */}
                            <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Appointment Information</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <strong>Appointment ID:</strong> 
                                        <div style={{ fontSize: "14px", color: "#666", wordBreak: "break-all" }}>
                                            {selectedAppointment.appointmentId || selectedAppointment.id || 'APT-' + Date.now()}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>MongoDB ID:</strong> 
                                        <div style={{ fontSize: "12px", color: "#999", wordBreak: "break-all" }}>
                                            {selectedAppointment._id || selectedAppointment.id || 'N/A'}
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

                            {/* Date & Time - Right Column */}
                            <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Date & Time</h3>
                                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                    <div>
                                        <strong>Date:</strong> {formatDateForDisplay(selectedAppointment.date)}
                                    </div>
                                    <div>
                                        <strong>Time:</strong> {selectedAppointment.time}
                                    </div>
                                    <div>
                                        <strong>Department:</strong> {selectedAppointment.type || "Cardiology"}
                                    </div>
                                    <div>
                                        <strong>Doctor:</strong> {selectedAppointment.doctor || "Dr. Pranjal Patil"}
                                    </div>
                                </div>
                            </div>

                            {/* Patient Information - Full Width */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Patient Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div><strong>Patient Name:</strong> {selectedAppointment.patientName}</div>
                                    <div><strong>Age/Gender:</strong> {selectedAppointment.age || "-"} / {selectedAppointment.gender || "-"}</div>
                                    <div><strong>Phone:</strong> {selectedAppointment.phone}</div>
                                    <div><strong>Email:</strong> {selectedAppointment.email || "-"}</div>
                                </div>
                            </div>

                            {/* Symptoms - Full Width */}
                            {selectedAppointment.symptoms && (
                                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Symptoms</h3>
                                    <div>{selectedAppointment.symptoms}</div>
                                </div>
                            )}

                            {/* Additional Notes - Full Width */}
                            {selectedAppointment.notes && (
                                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Additional Notes</h3>
                                    <div>{selectedAppointment.notes}</div>
                                </div>
                            )}

                            {/* Booking Information - Full Width */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Booking Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div><strong>Booking Date:</strong> {selectedAppointment.bookingDate ? formatDateForDisplay(selectedAppointment.bookingDate) : "-"}</div>
                                    <div><strong>Booking Time:</strong> {selectedAppointment.bookingTime || "-"}</div>
                                </div>
                            </div>
                        </div>

                        {/* Close Button */}
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