// // import React, { useState, useEffect, useMemo } from "react";
// // import "../Patientlist.css";


// // function DoctorPatients() {
// //     // ==================== STATES ====================
// //     const [patients, setPatients] = useState([]);
// //     const [stats, setStats] = useState({ total: 0, male: 0, female: 0, other: 0 });
// //     const [searchTerm, setSearchTerm] = useState("");
// //     const [loading, setLoading] = useState(true);
// //     const [showViewPopup, setShowViewPopup] = useState(false);
// //     const [selectedPatient, setSelectedPatient] = useState(null);

// //     // ==================== LOAD DATA ====================
// //     useEffect(() => {
// //         fetchPatients();
// //     }, []);

// //     const fetchPatients = async () => {
// //         try {
// //             setLoading(true);
// //             const response = await fetch('http://localhost:8001/api/patients');
// //             const data = await response.json();
// //             if (data.success) {
// //                 setPatients(data.data);
// //                 setStats(data.stats);
// //             }
// //         } catch (error) {
// //             console.error('Error fetching patients:', error);
// //             // Fall back to localStorage
// //             const saved = localStorage.getItem('patients');
// //             if (saved) {
// //                 const parsed = JSON.parse(saved);
// //                 setPatients(parsed);
// //                 setStats({
// //                     total: parsed.length,
// //                     male: parsed.filter(p => p.gender === "Male").length,
// //                     female: parsed.filter(p => p.gender === "Female").length,
// //                     other: parsed.filter(p => p.gender !== "Male" && p.gender !== "Female").length,
// //                 });
// //             }
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     // ==================== FILTER ====================
// //     const filteredPatients = useMemo(() => {
// //         if (!patients) return [];
// //         if (!searchTerm.trim()) return patients;

// //         const searchLower = searchTerm.toLowerCase().trim();

// //         return patients.filter((patient) => {
// //             const matches = (field) => {
// //                 if (field === undefined || field === null) return false;
// //                 return String(field).toLowerCase().includes(searchLower);
// //             };

// //             return (
// //                 matches(patient.patientName) ||
// //                 matches(patient.age) ||
// //                 matches(patient.gender) ||
// //                 matches(patient.email) ||
// //                 matches(patient.phone) ||
// //                 matches(patient.bloodGroup) ||
// //                 matches(patient.id)
// //             );
// //         });
// //     }, [patients, searchTerm]);

// //     // ==================== HANDLERS ====================
// //     const handleView = (patient) => {
// //         setSelectedPatient(patient);
// //         setShowViewPopup(true);
// //     };

// //     const handleDelete = async (id) => {
// //         if (window.confirm("Are you sure you want to delete this patient?")) {
// //             try {
// //                 const response = await fetch(`http://localhost:8001/api/patients/${id}`, {
// //                     method: 'DELETE'
// //                 });
// //                 const data = await response.json();
// //                 if (data.success) {
// //                     await fetchPatients();
// //                     alert('✅ Patient deleted successfully!');
// //                 }
// //             } catch (error) {
// //                 console.error('Error deleting patient:', error);
// //                 // Fallback: remove from local state
// //                 setPatients(prev => prev.filter(p => p.id !== id));
// //             }
// //         }
// //     };

// //     if (loading) {
// //         return (
// //             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
// //                 <p>Loading patients...</p>
// //             </div>
// //         );
// //     }

// //     return (
// //         <div className="patients-page">
// //             {/* ==================== HEADER ==================== */}
// //             {/* EXACT SAME as Patientlist.js */}
// //             <div className="page-header">
// //                 <div>
// //                     <h1>👥 My Patients</h1>
// //                     <p style={{ marginLeft: "45px" }}>Total Patients: {stats.total || 0}</p>
// //                 </div>
// //             </div>

// //             {/* ==================== SUMMARY STATS ==================== */}
// //             {/* EXACT SAME as Patientlist.js */}
// //             <div className="summary-stats">
// //                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
// //                     <h4>👥 TOTAL PATIENTS</h4>
// //                     <h2>{stats.total}</h2>
// //                 </div>

// //                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
// //                     <h4>👨 MALE</h4>
// //                     <h2>{stats.male}</h2>
// //                 </div>

// //                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
// //                     <h4>👩 FEMALE</h4>
// //                     <h2>{stats.female}</h2>
// //                 </div>

// //                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
// //                     <h4>🧑 OTHER</h4>
// //                     <h2>{stats.other}</h2>
// //                 </div>
// //             </div><br />

// //             {/* ==================== SEARCH ==================== */}
// //             {/* EXACT SAME as Patientlist.js */}
// //             <div className="search-container-fluid">
// //                 <input
// //                     type="text"
// //                     placeholder="Search by any field - name, gender, blood group, phone, email..."
// //                     value={searchTerm}
// //                     onChange={(e) => setSearchTerm(e.target.value)}
// //                     className="search-input"
// //                 />
// //             </div>

// //             {/* ==================== TABLE ==================== */}
// //             {/* EXACT SAME as Patientlist.js */}
// //             <div className="table-container">
// //                 <table className="data-table">
// //                     <thead>
// //                         <tr>
// //                             <th>ID</th>
// //                             <th>Patient Name</th>
// //                             <th>Age/Gender</th>
// //                             <th>Phone</th>
// //                             <th>Email</th>
// //                             <th>Blood Group</th>
// //                             <th>Actions</th>
// //                         </tr>
// //                     </thead>

// //                     <tbody>
// //                         {filteredPatients.length > 0 ? (
// //                             filteredPatients.map((patient) => (
// //                                 <tr key={patient.id}>
// //                                     <td>#{String(patient.id).slice(-6)}</td>
// //                                     <td>{patient.patientName}</td>
// //                                     <td>
// //                                         {patient.age || "-"} / {patient.gender || "-"}
// //                                     </td>
// //                                     <td>{patient.phone}</td>
// //                                     <td>{patient.email}</td>
// //                                     <td>{patient.bloodGroup || "-"}</td>

// //                                     <td className="action-cell">
// //                                         <button
// //                                             className="view-btn"
// //                                             onClick={() => handleView(patient)}
// //                                             title="View Patient Details"
// //                                         >
// //                                             👁️
// //                                         </button>

// //                                         <button
// //                                             className="edit-btn"
// //                                             title="Edit Patient"
// //                                         >
// //                                             ✏️
// //                                         </button>

// //                                         <button
// //                                             className="delete-btn"
// //                                             onClick={() => handleDelete(patient.id)}
// //                                             title="Delete Patient"
// //                                         >
// //                                             ❌
// //                                         </button>
// //                                     </td>
// //                                 </tr>
// //                             ))
// //                         ) : (
// //                             <tr>
// //                                 <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
// //                                     {searchTerm ? `No patients found matching "${searchTerm}"` : "No patients found"}
// //                                 </td>
// //                             </tr>
// //                         )}
// //                     </tbody>
// //                 </table>
// //             </div>

// //             {/* ==================== VIEW POPUP ==================== */}
// //             {showViewPopup && selectedPatient && (
// //                 <div className="popup-overlay" onClick={() => setShowViewPopup(false)}>
// //                     <div className="popup-card wide-popup" onClick={(e) => e.stopPropagation()}>
// //                         <h2>📋 {selectedPatient.patientName}'s Details</h2>
// //                         <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
// //                             <p><strong>Name:</strong> {selectedPatient.patientName}</p>
// //                             <p><strong>Age:</strong> {selectedPatient.age}</p>
// //                             <p><strong>Gender:</strong> {selectedPatient.gender}</p>
// //                             <p><strong>Phone:</strong> {selectedPatient.phone}</p>
// //                             <p><strong>Email:</strong> {selectedPatient.email}</p>
// //                             <p><strong>Blood Group:</strong> {selectedPatient.bloodGroup || "N/A"}</p>
// //                             <p><strong>Address:</strong> {selectedPatient.address || "N/A"}</p>
// //                             <p><strong>DOB:</strong> {selectedPatient.dob || "N/A"}</p>
// //                         </div>
// //                         <div className="popup-actions">
// //                             <button className="cancel" onClick={() => setShowViewPopup(false)}>Close</button>
// //                         </div>
// //                     </div>
// //                 </div>
// //             )}
// //         </div>
// //     );
// // }

// // export default DoctorPatients;


// import React, { useState, useEffect, useMemo } from "react";
// import "../Patientlist.css";

// // ==================== DOCTOR PATIENTS PAGE ====================
// function DoctorPatients() {
//     // ==================== STATES ====================
//     const [patients, setPatients] = useState([]);
//     const [stats, setStats] = useState({ total: 0, male: 0, female: 0, other: 0 });
//     const [searchTerm, setSearchTerm] = useState("");
//     const [loading, setLoading] = useState(true);
//     const [showViewPopup, setShowViewPopup] = useState(false);
//     const [selectedPatient, setSelectedPatient] = useState(null);

//     // ==================== LOAD DATA ====================
//     useEffect(() => {
//         fetchPatients();
//     }, []);

//     const fetchPatients = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch('http://localhost:8001/api/patients');
//             const data = await response.json();
//             if (data.success) {
//                 setPatients(data.data);
//                 setStats(data.stats);
//             }
//         } catch (error) {
//             console.error('Error fetching patients:', error);
//             // Fall back to localStorage
//             const saved = localStorage.getItem('patients');
//             if (saved) {
//                 const parsed = JSON.parse(saved);
//                 setPatients(parsed);
//                 setStats({
//                     total: parsed.length,
//                     male: parsed.filter(p => p.gender === "Male").length,
//                     female: parsed.filter(p => p.gender === "Female").length,
//                     other: parsed.filter(p => p.gender !== "Male" && p.gender !== "Female").length,
//                 });
//             }
//         } finally {
//             setLoading(false);
//         }
//     };

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

//     // ==================== FILTER ====================
//     const filteredPatients = useMemo(() => {
//         if (!patients) return [];
//         if (!searchTerm.trim()) return patients;

//         const searchLower = searchTerm.toLowerCase().trim();

//         return patients.filter((patient) => {
//             const matches = (field) => {
//                 if (field === undefined || field === null) return false;
//                 return String(field).toLowerCase().includes(searchLower);
//             };

//             return (
//                 matches(patient.patientName) ||
//                 matches(patient.age) ||
//                 matches(patient.gender) ||
//                 matches(patient.email) ||
//                 matches(patient.phone) ||
//                 matches(patient.bloodGroup)
//             );
//         });
//     }, [patients, searchTerm]);

//     // ==================== HANDLERS ====================
//     const handleView = (patient) => {
//         setSelectedPatient(patient);
//         setShowViewPopup(true);
//     };

//     if (loading) {
//         return (
//             <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//                 <div className="loading-spinner"></div>
//                 <p>Loading patients...</p>
//             </div>
//         );
//     }

//     return (
//         <div className="patients-page">
//             {/* ==================== HEADER ==================== */}
//             <div className="page-header">
//                 <div>
//                     <h1>👥 My Patients</h1>
//                     <p style={{ marginLeft: "45px" }}>Total Patients: {stats.total || 0}</p>
//                 </div>
//             </div>

//             {/* ==================== SUMMARY STATS ==================== */}
//             <div className="summary-stats">
//                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
//                     <h4>👥 TOTAL PATIENTS</h4>
//                     <h2>{stats.total}</h2>
//                 </div>

//                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
//                     <h4>👨 MALE</h4>
//                     <h2>{stats.male}</h2>
//                 </div>

//                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
//                     <h4>👩 FEMALE</h4>
//                     <h2>{stats.female}</h2>
//                 </div>

//                 <div className="summary-card" style={{ borderLeft: "4px solid #0d6efd" }}>
//                     <h4>🧑 OTHER</h4>
//                     <h2>{stats.other}</h2>
//                 </div>
//             </div><br />

//             {/* ==================== SEARCH ==================== */}
//             <div className="search-container-fluid">
//                 <input
//                     type="text"
//                     placeholder="Search by name, phone, email, blood group..."
//                     value={searchTerm}
//                     onChange={(e) => setSearchTerm(e.target.value)}
//                     className="search-input"
//                 />
//             </div>

//             {/* ==================== TABLE - WITH SERIAL NUMBER ==================== */}
//             <div className="table-container">
//                 <table className="data-table">
//                     <thead>
//                         <tr>
//                             {/* ✅ ID ki jagah Serial Number */}
//                             <th>Sr. No.</th>
//                             <th>Patient Name</th>
//                             <th>Age/Gender</th>
//                             <th>Phone</th>
//                             <th>Email</th>
//                             <th>Blood Group</th>
//                             <th>Actions</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {filteredPatients.length > 0 ? (
//                             filteredPatients.map((patient, index) => (
//                                 <tr key={patient.id || patient._id || index}>
//                                     {/* ✅ Serial Number */}
//                                     <td><span className="serial-no">{index + 1}</span></td>
//                                     <td>{patient.patientName}</td>
//                                     <td>
//                                         {patient.age || "-"} / {patient.gender || "-"}
//                                     </td>
//                                     <td>{patient.phone}</td>
//                                     <td>{patient.email}</td>
//                                     <td>{patient.bloodGroup || "-"}</td>

//                                     <td className="action-cell">
//                                         {/* ✅ Sirf View Button */}
//                                         <button
//                                             className="view-btn"
//                                             onClick={() => handleView(patient)}
//                                             title="View Patient Details"
//                                             style={{
//                                                 background: "none",
//                                                 border: "none",
//                                                 cursor: "pointer",
//                                                 fontSize: "20px",
//                                                 padding: "5px 10px",
//                                                 borderRadius: "4px",
//                                                 transition: "all 0.2s"
//                                             }}
//                                             onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
//                                             onMouseOut={(e) => e.target.style.background = "none"}
//                                         >
//                                             👁️
//                                         </button>
//                                     </td>
//                                 </tr>
//                             ))
//                         ) : (
//                             <tr>
//                                 <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
//                                     {searchTerm ? `No patients found matching "${searchTerm}"` : "No patients found"}
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>

//             {/* ==================== VIEW POPUP - DOCTOR APPOINTMENT WALA DESIGN ==================== */}
//             {showViewPopup && selectedPatient && (
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
//                             <h2 style={{ margin: 0, color: "#2c3e50" }}>👤 Patient Details</h2>
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
                            
//                             {/* Personal Information */}
//                             <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Personal Information</h3>
//                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                                     <div>
//                                         <strong>Full Name:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.patientName}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Age:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.age || "-"}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Gender:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.gender || "-"}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Date of Birth:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.dob ? formatDateForDisplay(selectedPatient.dob) : "-"}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Blood Group:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.bloodGroup || "-"}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Contact Information */}
//                             <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Contact Information</h3>
//                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                                     <div>
//                                         <strong>Phone:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.phone}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Alternate Phone:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.alternatePhone || "-"}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Email:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.email}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Address:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.address || "-"}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Emergency Contact */}
//                             <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Emergency Contact</h3>
//                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                                     <div>
//                                         <strong>Name of Kin:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.nameOfKin || "-"}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Kin Contact:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.kinContact || "-"}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>

//                             {/* Medical Information */}
//                             {(selectedPatient.symptoms || selectedPatient.profession) && (
//                                 <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                     <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
//                                     <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                                         {selectedPatient.profession && (
//                                             <div>
//                                                 <strong>Profession:</strong> 
//                                                 <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                                     {selectedPatient.profession}
//                                                 </div>
//                                             </div>
//                                         )}
//                                         {selectedPatient.symptoms && (
//                                             <div style={{ gridColumn: "span 2" }}>
//                                                 <strong>Symptoms:</strong> 
//                                                 <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                                     {Array.isArray(selectedPatient.symptoms) 
//                                                         ? selectedPatient.symptoms.join(", ") 
//                                                         : selectedPatient.symptoms}
//                                                 </div>
//                                             </div>
//                                         )}
//                                     </div>
//                                 </div>
//                             )}

//                             {/* Registration Information */}
//                             <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Registration Information</h3>
//                                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                                     <div>
//                                         <strong>Registration Date:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.registeredDate ? formatDateForDisplay(selectedPatient.registeredDate) : "-"}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Registration Time:</strong> 
//                                         <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
//                                             {selectedPatient.registeredTime || "-"}
//                                         </div>
//                                     </div>
//                                     <div>
//                                         <strong>Status:</strong> 
//                                         <span style={{
//                                             marginLeft: "8px",
//                                             padding: "3px 8px",
//                                             borderRadius: "4px",
//                                             backgroundColor: "#d4edda",
//                                             color: "#155724"
//                                         }}>
//                                             {selectedPatient.status || "Active"}
//                                         </span>
//                                     </div>
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

// export default DoctorPatients;

import React, { useState, useEffect, useMemo } from "react";
import "../Patientlist.css";

// ==================== DOCTOR PATIENTS PAGE ====================
function DoctorPatients() {
    // ==================== STATES ====================
    const [patients, setPatients] = useState([]);
    const [stats, setStats] = useState({ total: 0, male: 0, female: 0, other: 0 });
    const [searchTerm, setSearchTerm] = useState("");
    const [genderFilter, setGenderFilter] = useState("all"); // ✅ Gender filter state
    const [loading, setLoading] = useState(true);
    const [showViewPopup, setShowViewPopup] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState(null);

    // ==================== LOAD DATA ====================
    useEffect(() => {
        fetchPatients();
    }, []);

    const fetchPatients = async () => {
        try {
            setLoading(true);
            const response = await fetch('http://localhost:8001/api/patients');
            const data = await response.json();
            if (data.success) {
                setPatients(data.data);
                setStats(data.stats);
            }
        } catch (error) {
            console.error('Error fetching patients:', error);
            // Fall back to localStorage
            const saved = localStorage.getItem('patients');
            if (saved) {
                const parsed = JSON.parse(saved);
                setPatients(parsed);
                setStats({
                    total: parsed.length,
                    male: parsed.filter(p => p.gender === "Male").length,
                    female: parsed.filter(p => p.gender === "Female").length,
                    other: parsed.filter(p => p.gender !== "Male" && p.gender !== "Female").length,
                });
            }
        } finally {
            setLoading(false);
        }
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

    // ==================== STATS CONFIGURATION ====================
    const statCards = [
        { 
            label: "TOTAL PATIENTS", 
            value: stats.total, 
            icon: "👥", 
            color: "#0d6efd",
            filter: "all"
        },
        { 
            label: "MALE", 
            value: stats.male, 
            icon: "👨", 
            color: "#0d6efd",
            filter: "Male"
        },
        { 
            label: "FEMALE", 
            value: stats.female, 
            icon: "👩", 
            color: "#0d6efd",
            filter: "Female"
        },
        { 
            label: "OTHER", 
            value: stats.other, 
            icon: "🧑", 
            color: "#0d6efd",
            filter: "Other"
        },
    ];

    // ==================== HANDLE STAT CLICK ====================
    const handleStatClick = (filterType) => {
        setGenderFilter(filterType);
        setSearchTerm(""); // Clear search when filtering
    };

    // ==================== CLEAR FILTERS ====================
    const clearFilters = () => {
        setGenderFilter("all");
        setSearchTerm("");
    };

    // ==================== GET ACTIVE FILTER LABEL ====================
    const getActiveFilterLabel = () => {
        if (genderFilter === "all") return "All Patients";
        return `${genderFilter} Patients`;
    };

    // ==================== FILTER ====================
    const filteredPatients = useMemo(() => {
        if (!patients) return [];

        let filtered = [...patients];

        // ✅ Apply gender filter
        if (genderFilter !== "all") {
            filtered = filtered.filter(patient => 
                patient.gender === genderFilter
            );
        }

        // Apply search filter
        if (searchTerm.trim()) {
            const searchLower = searchTerm.toLowerCase().trim();
            filtered = filtered.filter((patient) => {
                const matches = (field) => {
                    if (field === undefined || field === null) return false;
                    return String(field).toLowerCase().includes(searchLower);
                };

                return (
                    matches(patient.patientName) ||
                    matches(patient.age) ||
                    matches(patient.gender) ||
                    matches(patient.email) ||
                    matches(patient.phone) ||
                    matches(patient.bloodGroup)
                );
            });
        }

        return filtered;
    }, [patients, searchTerm, genderFilter]);

    // ==================== HANDLERS ====================
    const handleView = (patient) => {
        setSelectedPatient(patient);
        setShowViewPopup(true);
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <div className="loading-spinner"></div>
                <p>Loading patients...</p>
            </div>
        );
    }

    return (
        <div className="patients-page">
            {/* ==================== HEADER ==================== */}
            <div className="page-header">
                <div>
                    <h1>👥 My Patients</h1>
                    <p style={{ marginLeft: "45px" }}>Total Patients: {stats.total || 0}</p>
                </div>
            </div>

            {/* ==================== SUMMARY STATS (CLICKABLE) ==================== */}
            <div className="summary-stats">
                {statCards.map((stat, index) => (
                    <div 
                        key={index}
                        className={`summary-card ${genderFilter === stat.filter ? 'active-filter' : ''}`}
                        style={{ 
                            borderLeft: `4px solid ${stat.color}`,
                            cursor: "pointer",
                            transition: "all 0.2s",
                            opacity: genderFilter === stat.filter ? 1 : 0.8,
                            transform: genderFilter === stat.filter ? 'scale(1.02)' : 'scale(1)',
                            boxShadow: genderFilter === stat.filter ? `0 4px 12px ${stat.color}40` : 'none'
                        }}
                        onClick={() => handleStatClick(stat.filter)}
                        title={`Click to show ${stat.label.toLowerCase()}`}
                    >
                        <h4>{stat.icon} {stat.label}</h4>
                        <h2>{stat.value}</h2>
                        {/* {genderFilter === stat.filter && (
                            <small style={{
                                color: stat.color,
                                fontWeight: 'bold',
                                position: 'absolute',
                                bottom: '5px',
                                right: '10px'
                            }}>
                                ✓ Active
                            </small>
                        )} */}
                    </div>
                ))}
            </div><br />

            {/* ==================== ACTIVE FILTER INDICATOR ==================== */}
            {(genderFilter !== "all" || searchTerm) && (
                <div style={{
                    // background: "#e7f3ff",
                    // padding: "10px 16px",
                    borderRadius: "8px",
                    // margin: "10px 0",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    fontSize: "14px",
                    color: "#0d6efd"
                }}>
                    {/* <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span>🔍 Showing:</span>
                        <span style={{ fontWeight: 'bold' }}>{getActiveFilterLabel()}</span>
                        {genderFilter !== "all" && (
                            <span style={{
                                background: "#0d6efd",
                                color: "white",
                                padding: "2px 8px",
                                borderRadius: "16px",
                                fontSize: "12px"
                            }}>
                                {filteredPatients.length} records
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
            <div className="search-container-fluid">
                <input
                    type="text"
                    placeholder="Search by name, phone, email, blood group..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-input"
                />
            </div>

            {/* ==================== TABLE ==================== */}
            <div className="table-container">
                <div className="table-header">
                    <h3>Patient Records - {getActiveFilterLabel()}</h3>
                    <span className="record-count">{filteredPatients.length} records</span>
                </div>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>Sr. No.</th>
                            <th>Patient Name</th>
                            <th>Age/Gender</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Blood Group</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {filteredPatients.length > 0 ? (
                            filteredPatients.map((patient, index) => (
                                <tr key={patient.id || patient._id || index}>
                                    <td><span className="serial-no">{index + 1}</span></td>
                                    <td>{patient.patientName}</td>
                                    <td>
                                        {patient.age || "-"} / {patient.gender || "-"}
                                    </td>
                                    <td>{patient.phone}</td>
                                    <td>{patient.email}</td>
                                    <td>{patient.bloodGroup || "-"}</td>

                                    <td className="action-cell">
                                        <button
                                            className="view-btn"
                                            onClick={() => handleView(patient)}
                                            title="View Patient Details"
                                            style={{
                                                background: "none",
                                                border: "none",
                                                cursor: "pointer",
                                                fontSize: "20px",
                                                padding: "5px 10px",
                                                borderRadius: "4px",
                                                transition: "all 0.2s"
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
                                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                                    {searchTerm ? `No patients found matching "${searchTerm}"` : 
                                     genderFilter !== "all" ? `No ${genderFilter} patients found` : 
                                     "No patients found"}
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* ==================== VIEW POPUP ==================== */}
            {showViewPopup && selectedPatient && (
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
                            <h2 style={{ margin: 0, color: "#2c3e50" }}>👤 Patient Details</h2>
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
                            
                            {/* Personal Information */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Personal Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div>
                                        <strong>Full Name:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.patientName}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Age:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.age || "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Gender:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.gender || "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Date of Birth:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.dob ? formatDateForDisplay(selectedPatient.dob) : "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Blood Group:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.bloodGroup || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Information */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Contact Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div>
                                        <strong>Phone:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.phone}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Alternate Phone:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.alternatePhone || "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Email:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.email}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Address:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.address || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Emergency Contact */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Emergency Contact</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div>
                                        <strong>Name of Kin:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.nameOfKin || "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Kin Contact:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.kinContact || "-"}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Medical Information */}
                            {(selectedPatient.symptoms || selectedPatient.profession) && (
                                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                    <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
                                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                        {selectedPatient.profession && (
                                            <div>
                                                <strong>Profession:</strong> 
                                                <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                                    {selectedPatient.profession}
                                                </div>
                                            </div>
                                        )}
                                        {selectedPatient.symptoms && (
                                            <div style={{ gridColumn: "span 2" }}>
                                                <strong>Symptoms:</strong> 
                                                <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                                    {Array.isArray(selectedPatient.symptoms) 
                                                        ? selectedPatient.symptoms.join(", ") 
                                                        : selectedPatient.symptoms}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Registration Information */}
                            <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Registration Information</h3>
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                                    <div>
                                        <strong>Registration Date:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.registeredDate ? formatDateForDisplay(selectedPatient.registeredDate) : "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Registration Time:</strong> 
                                        <div style={{ fontSize: "14px", color: "#333", marginTop: "4px" }}>
                                            {selectedPatient.registeredTime || "-"}
                                        </div>
                                    </div>
                                    <div>
                                        <strong>Status:</strong> 
                                        <span style={{
                                            marginLeft: "8px",
                                            padding: "3px 8px",
                                            borderRadius: "4px",
                                            backgroundColor: "#d4edda",
                                            color: "#155724"
                                        }}>
                                            {selectedPatient.status || "Active"}
                                        </span>
                                    </div>
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

export default DoctorPatients;