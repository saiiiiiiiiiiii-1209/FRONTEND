

// import React, { useState, useEffect, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
// import "./Patientlist.css";
// import PatientRegistrationForm from "./PatientRegistrationForm";

// function Patientlist() {
//   const navigate = useNavigate();
  
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filterType, setFilterType] = useState("all"); // "all", "male", "female", "other"
//   const [stats, setStats] = useState({
//     total: 0,
//     male: 0,
//     female: 0,
//     other: 0
//   });
//   const [showEditPopup, setShowEditPopup] = useState(false);
//   const [showViewPopup, setShowViewPopup] = useState(false);
//   const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
//   const [selectedPatient, setSelectedPatient] = useState(null);
//   const [formData, setFormData] = useState({});
//   const [editErrors, setEditErrors] = useState({});
//   const [patients, setPatients] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Fetch patients from backend
//   const fetchPatients = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:8001/api/patients');
//       const data = await response.json();
//       if (data.success) {
//         setPatients(data.data);
//         setStats(data.stats);
//       }
//     } catch (error) {
//       console.error('Error fetching patients:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Fetch statistics
//   const fetchStats = async () => {
//     try {
//       const response = await fetch('http://localhost:8001/api/patients/stats');
//       const data = await response.json();
//       if (data.success) {
//         setStats(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching stats:', error);
//     }
//   };

//   useEffect(() => {
//     fetchPatients();
//     fetchStats();
//   }, []);

//   // ==================== FILTER HANDLER ====================
//   const handleFilterClick = (type) => {
//     setFilterType(type);
//   };

//   // Get count for each filter
//   const getFilteredCount = (gender) => {
//     if (!patients) return 0;
//     if (gender === "all") return patients.length;
//     return patients.filter(p => p.gender?.toLowerCase() === gender.toLowerCase()).length;
//   };

//   /* =======================
//      FILTERED PATIENTS - WITH GENDER FILTER
//   ========================*/
//   const filteredPatients = useMemo(() => {
//     if (!patients) return [];

//     let filtered = patients;

//     // Apply gender filter
//     if (filterType !== "all") {
//       filtered = filtered.filter(patient => 
//         patient.gender?.toLowerCase() === filterType.toLowerCase()
//       );
//     }

//     // Apply search filter
//     if (searchTerm.trim()) {
//       const searchLower = searchTerm.toLowerCase().trim();
//       filtered = filtered.filter((patient) => {
//         const matches = (field) => {
//           if (field === undefined || field === null) return false;
//           return String(field).toLowerCase().includes(searchLower);
//         };

//         const symptomsMatch = patient.symptoms && 
//           (Array.isArray(patient.symptoms) 
//             ? patient.symptoms.some(symptom => symptom.toLowerCase().includes(searchLower))
//             : String(patient.symptoms).toLowerCase().includes(searchLower));

//         return (
//           matches(patient.patientName) ||
//           matches(patient.age) ||
//           matches(patient.gender) ||
//           matches(patient.dob) ||
//           matches(patient.email) ||
//           matches(patient.phone) ||
//           matches(patient.alternatePhone) ||
//           matches(patient.address) ||
//           matches(patient.bloodGroup) ||
//           matches(patient.profession) ||
//           matches(patient.nameOfKin) ||
//           matches(patient.kinContact) ||
//           matches(patient.registeredDate) ||
//           matches(patient.registeredTime) ||
//           matches(patient.status) ||
//           matches(patient.id) ||
//           symptomsMatch
//         );
//       });
//     }

//     return filtered;
//   }, [patients, searchTerm, filterType]);

//   /* =======================
//      VALIDATION FUNCTIONS
//   ========================*/
//   const validatePhone = (phone) => {
//     if (!phone) return false;
//     const cleaned = phone.replace(/\D/g, '');
//     return cleaned.length === 10 && ['7', '8', '9'].includes(cleaned[0]);
//   };

//   const validateAge = (age) => {
//     if (!age && age !== 0) return false;
//     const ageNum = parseInt(age);
//     return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
//   };

//   const validateName = (name) => {
//     if (!name) return false;
//     const trimmed = name.trim();
//     return trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-Z\s]+$/.test(trimmed);
//   };

//   const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

//   const validateEditForm = () => {
//     const newErrors = {};
    
//     if (!validateName(formData.patientName)) 
//       newErrors.patientName = "Patient name must be 2-50 characters and contain only letters";
    
//     if (!validateAge(formData.age)) 
//       newErrors.age = "Age must be between 1-120 years";
    
//     if (!formData.gender) 
//       newErrors.gender = "Please select gender";
    
//     if (!validatePhone(formData.phone)) 
//       newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    
//     if (formData.alternatePhone && !validatePhone(formData.alternatePhone))
//       newErrors.alternatePhone = "Enter valid 10-digit number starting with 7,8,9";
    
//     if (!validateEmail(formData.email)) 
//       newErrors.email = "Enter valid email address";
    
//     if (formData.kinContact && !validatePhone(formData.kinContact)) 
//       newErrors.kinContact = "Enter valid 10-digit emergency contact number";
    
//     setEditErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   /* =======================
//      HANDLERS
//   ========================*/
//   const handleView = (patient) => {
//     setSelectedPatient(patient);
//     setShowViewPopup(true);
//   };

//   const handleEdit = (patient) => {
//     setSelectedPatient(patient);
//     setFormData({ ...patient });
//     setEditErrors({});
//     setShowEditPopup(true);
//   };

//   const handleEditChange = (e) => {
//     const { name, value } = e.target;
    
//     if (name === "phone" || name === "alternatePhone" || name === "kinContact") {
//       const cleaned = value.replace(/\D/g, '');
//       if (cleaned.length <= 10) {
//         setFormData(prev => ({ ...prev, [name]: cleaned }));
//       }
//     } 
//     else if (name === "age") {
//       if (value === "" || /^\d+$/.test(value)) {
//         const ageNum = parseInt(value);
//         if (value === "" || (ageNum >= 0 && ageNum <= 120)) {
//           setFormData(prev => ({ ...prev, [name]: value }));
//         }
//       }
//     } 
//     else if (name === "patientName") {
//       if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
//         setFormData(prev => ({ ...prev, [name]: value }));
//       }
//     }
//     else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }
    
//     if (editErrors[name]) {
//       setEditErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSave = async (e) => {
//     e.preventDefault();
    
//     if (!validateEditForm()) {
//       alert("❌ Please fix the errors before saving!");
//       return;
//     }
    
//     try {
//       const response = await fetch(`http://localhost:8001/api/patients/${selectedPatient.id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(formData)
//       });

//       const data = await response.json();

//       if (data.success) {
//         await fetchPatients();
//         await fetchStats();
//         setShowEditPopup(false);
//         setEditErrors({});
//         alert(`✅ Patient ${formData.patientName} updated successfully!`);
//       } else {
//         alert(`❌ Error: ${data.message}`);
//       }
//     } catch (error) {
//       console.error('Error updating patient:', error);
//       alert('Failed to update patient');
//     }
//   };

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this patient?")) {
//       try {
//         const response = await fetch(`http://localhost:8001/api/patients/${id}`, {
//           method: 'DELETE'
//         });

//         const data = await response.json();

//         if (data.success) {
//           await fetchPatients();
//           await fetchStats();
//           alert('✅ Patient deleted successfully!');
//         } else {
//           alert(`❌ Error: ${data.message}`);
//         }
//       } catch (error) {
//         console.error('Error deleting patient:', error);
//         alert('Failed to delete patient');
//       }
//     }
//   };

//   const handleAddPatient = (patientData) => {
//     setPatients(prev => [...prev, patientData]);
//     setShowRegistrationPopup(false);
//     fetchStats(); // Refresh stats
//   };

//   const inputStyle = {
//     padding: "10px",
//     borderRadius: "6px",
//     border: "1px solid #ddd",
//     fontSize: "14px",
//     width: "100%",
//     boxSizing: "border-box"
//   };

//   const errorStyle = {
//     border: "1px solid #dc3545",
//     backgroundColor: "#fff8f8"
//   };

//   if (loading) {
//     return (
//       <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
//         <div className="loading-spinner"></div>
//         <p>Loading patients...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="patients-page">

//       {/* HEADER */}
//       <div className="page-header">
//         <div>
//           <h1>👥 Patient List</h1>
//           <p style={{ marginLeft: "45px" }}>Total Patients: {stats.total || 0}</p>
//         </div>
//         <button className="add-btn" onClick={() => setShowRegistrationPopup(true)}>
//           <span> + Register Patient</span>
//         </button>
//       </div>

//       {/* SUMMARY STATS - CLICKABLE GENDER FILTERS */}
//       <div className="summary-stats">
//         <div 
//           className={`summary-card ${filterType === 'all' ? 'active-filter' : ''}`}
//           style={{ 
//             borderLeft: "4px solid #0d6efd",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             opacity: filterType === 'all' ? 1 : 0.8,
//             transform: filterType === 'all' ? 'scale(1.02)' : 'scale(1)'
//           }}
//           onClick={() => handleFilterClick('all')}
//           title={`Click to show all patients (${getFilteredCount('all')} patients)`}
//         >
//           <h4>👥 TOTAL PATIENTS</h4>
//           <h2>{stats.total}</h2>
//           {filterType === 'all' && (
//             <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
//           )}
//         </div>
        
//         <div 
//           className={`summary-card ${filterType === 'male' ? 'active-filter' : ''}`}
//           style={{ 
//             borderLeft: "4px solid #0d6efd",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             opacity: filterType === 'male' ? 1 : 0.8,
//             transform: filterType === 'male' ? 'scale(1.02)' : 'scale(1)'
//           }}
//           onClick={() => handleFilterClick('male')}
//           title={`Click to show male patients only (${getFilteredCount('male')} patients)`}
//         >
//           <h4>👨 MALE</h4>
//           <h2>{stats.male}</h2>
//           {filterType === 'male' && (
//             <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
//           )}
//         </div>
        
//         <div 
//           className={`summary-card ${filterType === 'female' ? 'active-filter' : ''}`}
//           style={{ 
//             borderLeft: "4px solid #0d6efd",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             opacity: filterType === 'female' ? 1 : 0.8,
//             transform: filterType === 'female' ? 'scale(1.02)' : 'scale(1)'
//           }}
//           onClick={() => handleFilterClick('female')}
//           title={`Click to show female patients only (${getFilteredCount('female')} patients)`}
//         >
//           <h4>👩 FEMALE</h4>
//           <h2>{stats.female}</h2>
//           {filterType === 'female' && (
//             <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
//           )}
//         </div>
        
//         <div 
//           className={`summary-card ${filterType === 'other' ? 'active-filter' : ''}`}
//           style={{ 
//             borderLeft: "4px solid #0d6efd",
//             cursor: "pointer",
//             transition: "all 0.2s",
//             opacity: filterType === 'other' ? 1 : 0.8,
//             transform: filterType === 'other' ? 'scale(1.02)' : 'scale(1)'
//           }}
//           onClick={() => handleFilterClick('other')}
//           title={`Click to show other gender patients only (${getFilteredCount('other')} patients)`}
//         >
//           <h4>🧑 OTHER</h4>
//           <h2>{stats.other}</h2>
//           {filterType === 'other' && (
//             <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
//           )}
//         </div>
//       </div><br />

//       {/* FILTER INDICATOR */}
//       {/* {filterType !== 'all' && (
//         <div style={{
//           background: "#e7f3ff",
//           padding: "8px 16px",
//           borderRadius: "20px",
//           margin: "10px 0",
//           display: "inline-block",
//           fontSize: "14px",
//           color: "#0d6efd"
//         }}>
//           <span>🔍 Showing {filterType} patients only ({filteredPatients.length} patients)</span>
//           <button 
//             style={{
//               background: "none",
//               border: "1px solid #0d6efd",
//               color: "#0d6efd",
//               padding: "4px 12px",
//               borderRadius: "16px",
//               marginLeft: "10px",
//               cursor: "pointer",
//               fontSize: "12px"
//             }}
//             onClick={() => setFilterType('all')}
//             onMouseOver={(e) => {
//               e.target.style.background = "#0d6efd";
//               e.target.style.color = "white";
//             }}
//             onMouseOut={(e) => {
//               e.target.style.background = "none";
//               e.target.style.color = "#0d6efd";
//             }}
//           >
//             Clear Filter ✕
//           </button>
//         </div>
//       )} */}

//       {/* SEARCH */}
//       <div className="search-container-fluid">
//         <input
//           type="text"
//           placeholder="Search by any field - name, gender, blood group, symptoms, profession..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="search-input"
//         />
//       </div>

//       {/* TABLE - First 6 Fields Only - WITH CENTER ALIGNMENT */}
//       <div className="table-container">
//         <table className="data-table">
//           <thead>
//             <tr>
//               <th style={{ textAlign: 'center' }}>ID</th>
//               <th style={{ textAlign: 'center' }}>Patient Name</th>
//               <th style={{ textAlign: 'center' }}>Age/Gender</th>
//               <th style={{ textAlign: 'center' }}>Phone</th>
//               <th style={{ textAlign: 'center' }}>Email</th>
//               <th style={{ textAlign: 'center' }}>Blood Group</th>
//               <th style={{ textAlign: 'center' }}>Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredPatients.length > 0 ? (
//               filteredPatients.map((patient) => (
//                 <tr key={patient.id}>
//                   <td style={{ textAlign: 'center' }}>#{String(patient.id).slice(-6)}</td>
//                   <td style={{ textAlign: 'center' }}>{patient.patientName}</td>
//                   <td style={{ textAlign: 'center' }}>
//                     {patient.age || "-"} / {patient.gender || "-"}
//                   </td>
//                   <td style={{ textAlign: 'center' }}>{patient.phone}</td>
//                   <td style={{ textAlign: 'center' }}>{patient.email}</td>
//                   <td style={{ textAlign: 'center' }}>{patient.bloodGroup || "-"}</td>

//                   <td className="action-cell" style={{ textAlign: 'center' }}>
//                     <button
//                       className="view-btn"
//                       onClick={() => handleView(patient)}
//                       title="View Patient Details"
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: "18px",
//                         padding: "5px",
//                         borderRadius: "4px",
//                         transition: "background 0.2s",
//                         margin: '0 3px'
//                       }}
//                       onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
//                       onMouseOut={(e) => e.target.style.background = "none"}
//                     >
//                       👁️
//                     </button>

//                     <button
//                       className="edit-btn"
//                       onClick={() => handleEdit(patient)}
//                       title="Edit Patient"
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: "18px",
//                         padding: "5px",
//                         borderRadius: "4px",
//                         transition: "background 0.2s",
//                         margin: '0 3px'
//                       }}
//                       onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
//                       onMouseOut={(e) => e.target.style.background = "none"}
//                     >
//                       ✏️
//                     </button>

//                     <button
//                       className="delete-btn"
//                       onClick={() => handleDelete(patient.id)}
//                       title="Delete Patient"
//                       style={{
//                         background: "none",
//                         border: "none",
//                         cursor: "pointer",
//                         fontSize: "18px",
//                         padding: "5px",
//                         borderRadius: "4px",
//                         transition: "background 0.2s",
//                         margin: '0 3px'
//                       }}
//                       onMouseOver={(e) => e.target.style.background = "#ffebee"}
//                       onMouseOut={(e) => e.target.style.background = "none"}
//                     >
//                       ❌
//                     </button>
//                   </td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
//                   {searchTerm 
//                     ? `No patients found matching "${searchTerm}"` 
//                     : filterType !== 'all'
//                     ? `No ${filterType} patients found`
//                     : "No patients found"}
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>

//       {/* VIEW POPUP */}
//       {showViewPopup && selectedPatient && (
//         <div
//           className="popup-overlay"
//           onClick={() => setShowViewPopup(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             className="popup-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "700px",
//               maxHeight: "85vh",
//               overflowY: "auto",
//               background: "#fff",
//               padding: "30px",
//               borderRadius: "12px",
//               boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//               <h2 style={{ margin: 0, color: "#2c3e50" }}>👤 Patient Details</h2>
//               <button
//                 onClick={() => setShowViewPopup(false)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   fontSize: "24px",
//                   cursor: "pointer",
//                   color: "#666"
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
//               {/* Personal Information */}
//               <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Personal Information</h3>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                   <div><strong>Patient ID:</strong> #{selectedPatient.id}</div>
//                   <div><strong>Full Name:</strong> {selectedPatient.patientName}</div>
//                   <div><strong>Age:</strong> {selectedPatient.age || "-"}</div>
//                   <div><strong>Gender:</strong> {selectedPatient.gender || "-"}</div>
//                   <div><strong>Date of Birth:</strong> {selectedPatient.dob || "-"}</div>
//                   <div><strong>Blood Group:</strong> {selectedPatient.bloodGroup || "-"}</div>
//                 </div>
//               </div>

//               {/* Contact Information */}
//               <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Contact Information</h3>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                   <div><strong>Phone:</strong> {selectedPatient.phone}</div>
//                   <div><strong>Alternate Phone:</strong> {selectedPatient.alternatePhone || "-"}</div>
//                   <div><strong>Email:</strong> {selectedPatient.email}</div>
//                   <div><strong>Address:</strong> {selectedPatient.address || "-"}</div>
//                 </div>
//               </div>

//               {/* Emergency Contact */}
//               <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Emergency Contact</h3>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                   <div><strong>Name of Kin:</strong> {selectedPatient.nameOfKin || "-"}</div>
//                   <div><strong>Kin Contact:</strong> {selectedPatient.kinContact || "-"}</div>
//                 </div>
//               </div>

//               {/* Medical Information */}
//               {(selectedPatient.symptoms || selectedPatient.profession) && (
//                 <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                   <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                     {selectedPatient.profession && (
//                       <div><strong>Profession:</strong> {selectedPatient.profession}</div>
//                     )}
//                     {selectedPatient.symptoms && (
//                       <div style={{ gridColumn: "span 2" }}>
//                         <strong>Symptoms:</strong> {
//                           Array.isArray(selectedPatient.symptoms) 
//                             ? selectedPatient.symptoms.join(", ") 
//                             : selectedPatient.symptoms
//                         }
//                       </div>
//                     )}
//                   </div>
//                 </div>
//               )}

//               {/* Registration Information */}
//               <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                 <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Registration Information</h3>
//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
//                   <div><strong>Registration Date:</strong> {selectedPatient.registeredDate || "-"}</div>
//                   <div><strong>Registration Time:</strong> {selectedPatient.registeredTime || "-"}</div>
//                   <div><strong>Status:</strong> 
//                     <span style={{
//                       marginLeft: "8px",
//                       padding: "3px 8px",
//                       borderRadius: "4px",
//                       backgroundColor: "#d4edda",
//                       color: "#155724"
//                     }}>
//                       {selectedPatient.status || "Active"}
//                     </span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div style={{ marginTop: "25px", textAlign: "right" }}>
//               <button
//                 onClick={() => setShowViewPopup(false)}
//                 style={{
//                   background: "linear-gradient(135deg, #0d6efd, #0b5ed7)",
//                   color: "#fff",
//                   padding: "10px 25px",
//                   border: "none",
//                   borderRadius: "8px",
//                   cursor: "pointer",
//                   fontWeight: "600",
//                 }}
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* EDIT POPUP */}
//       {showEditPopup && selectedPatient && (
//         <div
//           className="popup-overlay"
//           onClick={() => setShowEditPopup(false)}
//           style={{
//             position: "fixed",
//             inset: 0,
//             background: "rgba(0,0,0,0.5)",
//             display: "flex",
//             justifyContent: "center",
//             alignItems: "center",
//             zIndex: 1000,
//           }}
//         >
//           <div
//             className="popup-content"
//             onClick={(e) => e.stopPropagation()}
//             style={{
//               width: "700px",
//               maxHeight: "85vh",
//               overflowY: "auto",
//               background: "#fff",
//               padding: "30px",
//               borderRadius: "12px",
//               boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
//             }}
//           >
//             <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
//               <h2 style={{ margin: 0, color: "#2c3e50" }}>✏️ Edit Patient</h2>
//               <button
//                 onClick={() => setShowEditPopup(false)}
//                 style={{
//                   background: "none",
//                   border: "none",
//                   fontSize: "24px",
//                   cursor: "pointer",
//                   color: "#666"
//                 }}
//               >
//                 ×
//               </button>
//             </div>

//             <form onSubmit={handleSave}>
//               <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
//                 {/* Personal Information */}
//                 <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                   <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Personal Information</h3>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//                     <div style={{ gridColumn: "span 2" }}>
//                       <input
//                         name="patientName"
//                         placeholder="Patient Name *"
//                         value={formData.patientName || ""}
//                         onChange={handleEditChange}
//                         style={{...inputStyle, ...(editErrors.patientName ? errorStyle : {})}}
//                         required
//                       />
//                       {editErrors.patientName && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.patientName}</span>}
//                     </div>
//                     <div>
//                       <input
//                         name="age"
//                         type="number"
//                         placeholder="Age *"
//                         value={formData.age || ""}
//                         onChange={handleEditChange}
//                         min="1"
//                         max="120"
//                         style={{...inputStyle, ...(editErrors.age ? errorStyle : {})}}
//                         required
//                       />
//                       {editErrors.age && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.age}</span>}
//                     </div>
//                     <div>
//                       <select
//                         name="gender"
//                         value={formData.gender || ""}
//                         onChange={handleEditChange}
//                         style={{...inputStyle, ...(editErrors.gender ? errorStyle : {})}}
//                         required
//                       >
//                         <option value="">Gender *</option>
//                         <option value="Male">Male</option>
//                         <option value="Female">Female</option>
//                         <option value="Other">Other</option>
//                       </select>
//                       {editErrors.gender && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.gender}</span>}
//                     </div>
//                     <div>
//                       <input
//                         name="dob"
//                         type="date"
//                         placeholder="Date of Birth"
//                         value={formData.dob || ""}
//                         onChange={handleEditChange}
//                         style={inputStyle}
//                       />
//                     </div>
//                     <div>
//                       <input
//                         name="bloodGroup"
//                         placeholder="Blood Group"
//                         value={formData.bloodGroup || ""}
//                         onChange={handleEditChange}
//                         style={inputStyle}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Contact Information */}
//                 <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                   <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Contact Information</h3>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//                     <div style={{ gridColumn: "span 2" }}>
//                       <input
//                         name="phone"
//                         placeholder="Phone *"
//                         value={formData.phone || ""}
//                         onChange={handleEditChange}
//                         maxLength="10"
//                         style={{...inputStyle, ...(editErrors.phone ? errorStyle : {})}}
//                         required
//                       />
//                       {editErrors.phone && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.phone}</span>}
//                     </div>
//                     <div style={{ gridColumn: "span 2" }}>
//                       <input
//                         name="alternatePhone"
//                         placeholder="Alternate Phone"
//                         value={formData.alternatePhone || ""}
//                         onChange={handleEditChange}
//                         maxLength="10"
//                         style={{...inputStyle, ...(editErrors.alternatePhone ? errorStyle : {})}}
//                       />
//                       {editErrors.alternatePhone && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.alternatePhone}</span>}
//                     </div>
//                     <div style={{ gridColumn: "span 2" }}>
//                       <input
//                         name="email"
//                         type="email"
//                         placeholder="Email *"
//                         value={formData.email || ""}
//                         onChange={handleEditChange}
//                         style={{...inputStyle, ...(editErrors.email ? errorStyle : {})}}
//                         required
//                       />
//                       {editErrors.email && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.email}</span>}
//                     </div>
//                     <div style={{ gridColumn: "span 2" }}>
//                       <textarea
//                         name="address"
//                         placeholder="Address"
//                         value={formData.address || ""}
//                         onChange={handleEditChange}
//                         rows="2"
//                         style={{...inputStyle, resize: "vertical"}}
//                       />
//                     </div>
//                   </div>
//                 </div>

//                 {/* Emergency Contact */}
//                 <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                   <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Emergency Contact</h3>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//                     <div>
//                       <input
//                         name="nameOfKin"
//                         placeholder="Name of Kin"
//                         value={formData.nameOfKin || ""}
//                         onChange={handleEditChange}
//                         style={inputStyle}
//                       />
//                     </div>
//                     <div>
//                       <input
//                         name="kinContact"
//                         placeholder="Kin Contact"
//                         value={formData.kinContact || ""}
//                         onChange={handleEditChange}
//                         maxLength="10"
//                         style={{...inputStyle, ...(editErrors.kinContact ? errorStyle : {})}}
//                       />
//                       {editErrors.kinContact && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.kinContact}</span>}
//                     </div>
//                   </div>
//                 </div>

//                 {/* Medical Information */}
//                 <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
//                   <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
//                   <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
//                     <div>
//                       <input
//                         name="profession"
//                         placeholder="Profession"
//                         value={formData.profession || ""}
//                         onChange={handleEditChange}
//                         style={inputStyle}
//                       />
//                     </div>
//                     <div>
//                       <input
//                         name="symptoms"
//                         placeholder="Symptoms (comma separated)"
//                         value={Array.isArray(formData.symptoms) ? formData.symptoms.join(", ") : formData.symptoms || ""}
//                         onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
//                         style={inputStyle}
//                       />
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               <div style={{ marginTop: "25px", display: "flex", justifyContent: "flex-end", gap: "10px" }}>
//                 <button
//                   type="button"
//                   onClick={() => setShowEditPopup(false)}
//                   style={{
//                     background: "linear-gradient(135deg, #6c757d, #5c636a)",
//                     color: "#fff",
//                     padding: "10px 25px",
//                     border: "none",
//                     borderRadius: "8px",
//                     cursor: "pointer",
//                     fontWeight: "600",
//                   }}
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   style={{
//                     background: "linear-gradient(135deg, #28a745, #218838)",
//                     color: "#fff",
//                     padding: "10px 25px",
//                     border: "none",
//                     borderRadius: "8px",
//                     cursor: "pointer",
//                     fontWeight: "600",
//                   }}
//                 >
//                   Save Changes
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* REGISTRATION POPUP */}
//       {showRegistrationPopup && (
//         <PatientRegistrationForm
//           onClose={() => setShowRegistrationPopup(false)}
//           addPatient={handleAddPatient}
//           patients={patients}
//         />
//       )}
//     </div>
//   );
// }

// export default Patientlist;

import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Patientlist.css";
import PatientRegistrationForm from "./PatientRegistrationForm";

function Patientlist() {
  const navigate = useNavigate();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all"); // "all", "male", "female", "other"
  const [stats, setStats] = useState({
    total: 0,
    male: 0,
    female: 0,
    other: 0
  });
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [showRegistrationPopup, setShowRegistrationPopup] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [formData, setFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch patients from backend
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
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/patients/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    fetchPatients();
    fetchStats();
  }, []);

  // ==================== FILTER HANDLER ====================
  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  // Get count for each filter
  const getFilteredCount = (gender) => {
    if (!patients) return 0;
    if (gender === "all") return patients.length;
    return patients.filter(p => p.gender?.toLowerCase() === gender.toLowerCase()).length;
  };

  /* =======================
     FILTERED PATIENTS - WITH GENDER FILTER
  ========================*/
  const filteredPatients = useMemo(() => {
    if (!patients) return [];

    let filtered = patients;

    // Apply gender filter
    if (filterType !== "all") {
      filtered = filtered.filter(patient => 
        patient.gender?.toLowerCase() === filterType.toLowerCase()
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

        const symptomsMatch = patient.symptoms && 
          (Array.isArray(patient.symptoms) 
            ? patient.symptoms.some(symptom => symptom.toLowerCase().includes(searchLower))
            : String(patient.symptoms).toLowerCase().includes(searchLower));

        return (
          matches(patient.patientName) ||
          matches(patient.age) ||
          matches(patient.gender) ||
          matches(patient.dob) ||
          matches(patient.email) ||
          matches(patient.phone) ||
          matches(patient.alternatePhone) ||
          matches(patient.address) ||
          matches(patient.bloodGroup) ||
          matches(patient.profession) ||
          matches(patient.nameOfKin) ||
          matches(patient.kinContact) ||
          matches(patient.registeredDate) ||
          matches(patient.registeredTime) ||
          matches(patient.status) ||
          // ✅ ID ko search mein include karo but show mat karo
          matches(patient.id) ||
          symptomsMatch
        );
      });
    }

    return filtered;
  }, [patients, searchTerm, filterType]);

  /* =======================
     VALIDATION FUNCTIONS
  ========================*/
  const validatePhone = (phone) => {
    if (!phone) return false;
    const cleaned = phone.replace(/\D/g, '');
    return cleaned.length === 10 && ['7', '8', '9'].includes(cleaned[0]);
  };

  const validateAge = (age) => {
    if (!age && age !== 0) return false;
    const ageNum = parseInt(age);
    return !isNaN(ageNum) && ageNum > 0 && ageNum <= 120;
  };

  const validateName = (name) => {
    if (!name) return false;
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 50 && /^[a-zA-Z\s]+$/.test(trimmed);
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateEditForm = () => {
    const newErrors = {};
    
    if (!validateName(formData.patientName)) 
      newErrors.patientName = "Patient name must be 2-50 characters and contain only letters";
    
    if (!validateAge(formData.age)) 
      newErrors.age = "Age must be between 1-120 years";
    
    if (!formData.gender) 
      newErrors.gender = "Please select gender";
    
    if (!validatePhone(formData.phone)) 
      newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    
    if (formData.alternatePhone && !validatePhone(formData.alternatePhone))
      newErrors.alternatePhone = "Enter valid 10-digit number starting with 7,8,9";
    
    if (!validateEmail(formData.email)) 
      newErrors.email = "Enter valid email address";
    
    if (formData.kinContact && !validatePhone(formData.kinContact)) 
      newErrors.kinContact = "Enter valid 10-digit emergency contact number";
    
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /* =======================
     HANDLERS
  ========================*/
  const handleView = (patient) => {
    setSelectedPatient(patient);
    setShowViewPopup(true);
  };

  const handleEdit = (patient) => {
    setSelectedPatient(patient);
    setFormData({ ...patient });
    setEditErrors({});
    setShowEditPopup(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone" || name === "alternatePhone" || name === "kinContact") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) {
        setFormData(prev => ({ ...prev, [name]: cleaned }));
      }
    } 
    else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        const ageNum = parseInt(value);
        if (value === "" || (ageNum >= 0 && ageNum <= 120)) {
          setFormData(prev => ({ ...prev, [name]: value }));
        }
      }
    } 
    else if (name === "patientName") {
      if (value === "" || /^[a-zA-Z\s]*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    if (editErrors[name]) {
      setEditErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) {
      alert("❌ Please fix the errors before saving!");
      return;
    }
    
    try {
      const response = await fetch(`http://localhost:8001/api/patients/${selectedPatient.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        await fetchPatients();
        await fetchStats();
        setShowEditPopup(false);
        setEditErrors({});
        alert(`✅ Patient ${formData.patientName} updated successfully!`);
      } else {
        alert(`❌ Error: ${data.message}`);
      }
    } catch (error) {
      console.error('Error updating patient:', error);
      alert('Failed to update patient');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        const response = await fetch(`http://localhost:8001/api/patients/${id}`, {
          method: 'DELETE'
        });

        const data = await response.json();

        if (data.success) {
          await fetchPatients();
          await fetchStats();
          alert('✅ Patient deleted successfully!');
        } else {
          alert(`❌ Error: ${data.message}`);
        }
      } catch (error) {
        console.error('Error deleting patient:', error);
        alert('Failed to delete patient');
      }
    }
  };

  const handleAddPatient = (patientData) => {
    setPatients(prev => [...prev, patientData]);
    setShowRegistrationPopup(false);
    fetchStats(); // Refresh stats
  };

  const inputStyle = {
    padding: "10px",
    borderRadius: "6px",
    border: "1px solid #ddd",
    fontSize: "14px",
    width: "100%",
    boxSizing: "border-box"
  };

  const errorStyle = {
    border: "1px solid #dc3545",
    backgroundColor: "#fff8f8"
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

      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1>👥 Patient List</h1>
          <p style={{ marginLeft: "45px" }}>Total Patients: {stats.total || 0}</p>
        </div>
        <button className="add-btn" onClick={() => setShowRegistrationPopup(true)}>
          <span> + Register Patient</span>
        </button>
      </div>

      {/* SUMMARY STATS - CLICKABLE GENDER FILTERS */}
      <div className="summary-stats">
        <div 
          className={`summary-card ${filterType === 'all' ? 'active-filter' : ''}`}
          style={{ 
            borderLeft: "4px solid #0d6efd",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: filterType === 'all' ? 1 : 0.8,
            transform: filterType === 'all' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleFilterClick('all')}
          title={`Click to show all patients (${getFilteredCount('all')} patients)`}
        >
          <h4>👥 TOTAL PATIENTS</h4>
          <h2>{stats.total}</h2>
          {filterType === 'all' && (
            <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
          )}
        </div>
        
        <div 
          className={`summary-card ${filterType === 'male' ? 'active-filter' : ''}`}
          style={{ 
            borderLeft: "4px solid #0d6efd",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: filterType === 'male' ? 1 : 0.8,
            transform: filterType === 'male' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleFilterClick('male')}
          title={`Click to show male patients only (${getFilteredCount('male')} patients)`}
        >
          <h4>👨 MALE</h4>
          <h2>{stats.male}</h2>
          {filterType === 'male' && (
            <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
          )}
        </div>
        
        <div 
          className={`summary-card ${filterType === 'female' ? 'active-filter' : ''}`}
          style={{ 
            borderLeft: "4px solid #0d6efd",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: filterType === 'female' ? 1 : 0.8,
            transform: filterType === 'female' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleFilterClick('female')}
          title={`Click to show female patients only (${getFilteredCount('female')} patients)`}
        >
          <h4>👩 FEMALE</h4>
          <h2>{stats.female}</h2>
          {filterType === 'female' && (
            <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
          )}
        </div>
        
        <div 
          className={`summary-card ${filterType === 'other' ? 'active-filter' : ''}`}
          style={{ 
            borderLeft: "4px solid #0d6efd",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: filterType === 'other' ? 1 : 0.8,
            transform: filterType === 'other' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleFilterClick('other')}
          title={`Click to show other gender patients only (${getFilteredCount('other')} patients)`}
        >
          <h4>🧑 OTHER</h4>
          <h2>{stats.other}</h2>
          {filterType === 'other' && (
            <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
          )}
        </div>
      </div><br />

      {/* SEARCH */}
      <div className="search-container-fluid">
        <input
          type="text"
          placeholder="Search by any field - name, gender, blood group, symptoms, profession..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {/* TABLE - WITH SERIAL NUMBER INSTEAD OF ID */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              {/* ✅ Changed from ID to Sr. No. */}
              <th style={{ textAlign: 'center' }}>Sr. No.</th>
              <th style={{ textAlign: 'center' }}>Patient Name</th>
              <th style={{ textAlign: 'center' }}>Age/Gender</th>
              <th style={{ textAlign: 'center' }}>Phone</th>
              <th style={{ textAlign: 'center' }}>Email</th>
              <th style={{ textAlign: 'center' }}>Blood Group</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient, index) => (
                <tr key={patient.id}>
                  {/* ✅ Serial Number - calculated based on current filter and search */}
                  <td style={{ textAlign: 'center', fontWeight: '500' }}>
                    {index + 1}
                  </td>
                  <td style={{ textAlign: 'center' }}>{patient.patientName}</td>
                  <td style={{ textAlign: 'center' }}>
                    {patient.age || "-"} / {patient.gender || "-"}
                  </td>
                  <td style={{ textAlign: 'center' }}>{patient.phone}</td>
                  <td style={{ textAlign: 'center' }}>{patient.email}</td>
                  <td style={{ textAlign: 'center' }}>{patient.bloodGroup || "-"}</td>

                  <td className="action-cell" style={{ textAlign: 'center' }}>
                    <button
                      className="view-btn"
                      onClick={() => handleView(patient)}
                      title="View Patient Details"
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
                      onClick={() => handleEdit(patient)}
                      title="Edit Patient"
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
                      onClick={() => handleDelete(patient.id)}
                      title="Delete Patient"
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
                <td colSpan="7" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                  {searchTerm 
                    ? `No patients found matching "${searchTerm}"` 
                    : filterType !== 'all'
                    ? `No ${filterType} patients found`
                    : "No patients found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW POPUP */}
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

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
              {/* Personal Information */}
              <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Personal Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  {/* ✅ ID ko view popup mein bhi hide kiya */}
                  <div><strong>Full Name:</strong> {selectedPatient.patientName}</div>
                  <div><strong>Age:</strong> {selectedPatient.age || "-"}</div>
                  <div><strong>Gender:</strong> {selectedPatient.gender || "-"}</div>
                  <div><strong>Date of Birth:</strong> {selectedPatient.dob || "-"}</div>
                  <div><strong>Blood Group:</strong> {selectedPatient.bloodGroup || "-"}</div>
                </div>
              </div>

              {/* Contact Information */}
              <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Contact Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div><strong>Phone:</strong> {selectedPatient.phone}</div>
                  <div><strong>Alternate Phone:</strong> {selectedPatient.alternatePhone || "-"}</div>
                  <div><strong>Email:</strong> {selectedPatient.email}</div>
                  <div><strong>Address:</strong> {selectedPatient.address || "-"}</div>
                </div>
              </div>

              {/* Emergency Contact */}
              <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Emergency Contact</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div><strong>Name of Kin:</strong> {selectedPatient.nameOfKin || "-"}</div>
                  <div><strong>Kin Contact:</strong> {selectedPatient.kinContact || "-"}</div>
                </div>
              </div>

              {/* Medical Information */}
              {(selectedPatient.symptoms || selectedPatient.profession) && (
                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                    {selectedPatient.profession && (
                      <div><strong>Profession:</strong> {selectedPatient.profession}</div>
                    )}
                    {selectedPatient.symptoms && (
                      <div style={{ gridColumn: "span 2" }}>
                        <strong>Symptoms:</strong> {
                          Array.isArray(selectedPatient.symptoms) 
                            ? selectedPatient.symptoms.join(", ") 
                            : selectedPatient.symptoms
                        }
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Registration Information */}
              <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Registration Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div><strong>Registration Date:</strong> {selectedPatient.registeredDate || "-"}</div>
                  <div><strong>Registration Time:</strong> {selectedPatient.registeredTime || "-"}</div>
                  <div><strong>Status:</strong> 
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
      {showEditPopup && selectedPatient && (
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
              <h2 style={{ margin: 0, color: "#2c3e50" }}>✏️ Edit Patient</h2>
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

            <form onSubmit={handleSave}>
              <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                {/* Personal Information */}
                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Personal Information</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div style={{ gridColumn: "span 2" }}>
                      <input
                        name="patientName"
                        placeholder="Patient Name *"
                        value={formData.patientName || ""}
                        onChange={handleEditChange}
                        style={{...inputStyle, ...(editErrors.patientName ? errorStyle : {})}}
                        required
                      />
                      {editErrors.patientName && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.patientName}</span>}
                    </div>
                    <div>
                      <input
                        name="age"
                        type="number"
                        placeholder="Age *"
                        value={formData.age || ""}
                        onChange={handleEditChange}
                        min="1"
                        max="120"
                        style={{...inputStyle, ...(editErrors.age ? errorStyle : {})}}
                        required
                      />
                      {editErrors.age && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.age}</span>}
                    </div>
                    <div>
                      <select
                        name="gender"
                        value={formData.gender || ""}
                        onChange={handleEditChange}
                        style={{...inputStyle, ...(editErrors.gender ? errorStyle : {})}}
                        required
                      >
                        <option value="">Gender *</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {editErrors.gender && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.gender}</span>}
                    </div>
                    <div>
                      <input
                        name="dob"
                        type="date"
                        placeholder="Date of Birth"
                        value={formData.dob || ""}
                        onChange={handleEditChange}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <input
                        name="bloodGroup"
                        placeholder="Blood Group"
                        value={formData.bloodGroup || ""}
                        onChange={handleEditChange}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                </div>

                {/* Contact Information */}
                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Contact Information</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div style={{ gridColumn: "span 2" }}>
                      <input
                        name="phone"
                        placeholder="Phone *"
                        value={formData.phone || ""}
                        onChange={handleEditChange}
                        maxLength="10"
                        style={{...inputStyle, ...(editErrors.phone ? errorStyle : {})}}
                        required
                      />
                      {editErrors.phone && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.phone}</span>}
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <input
                        name="alternatePhone"
                        placeholder="Alternate Phone"
                        value={formData.alternatePhone || ""}
                        onChange={handleEditChange}
                        maxLength="10"
                        style={{...inputStyle, ...(editErrors.alternatePhone ? errorStyle : {})}}
                      />
                      {editErrors.alternatePhone && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.alternatePhone}</span>}
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <input
                        name="email"
                        type="email"
                        placeholder="Email *"
                        value={formData.email || ""}
                        onChange={handleEditChange}
                        style={{...inputStyle, ...(editErrors.email ? errorStyle : {})}}
                        required
                      />
                      {editErrors.email && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.email}</span>}
                    </div>
                    <div style={{ gridColumn: "span 2" }}>
                      <textarea
                        name="address"
                        placeholder="Address"
                        value={formData.address || ""}
                        onChange={handleEditChange}
                        rows="2"
                        style={{...inputStyle, resize: "vertical"}}
                      />
                    </div>
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
                        value={formData.nameOfKin || ""}
                        onChange={handleEditChange}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <input
                        name="kinContact"
                        placeholder="Kin Contact"
                        value={formData.kinContact || ""}
                        onChange={handleEditChange}
                        maxLength="10"
                        style={{...inputStyle, ...(editErrors.kinContact ? errorStyle : {})}}
                      />
                      {editErrors.kinContact && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.kinContact}</span>}
                    </div>
                  </div>
                </div>

                {/* Medical Information */}
                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Medical Information</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <input
                        name="profession"
                        placeholder="Profession"
                        value={formData.profession || ""}
                        onChange={handleEditChange}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <input
                        name="symptoms"
                        placeholder="Symptoms (comma separated)"
                        value={Array.isArray(formData.symptoms) ? formData.symptoms.join(", ") : formData.symptoms || ""}
                        onChange={(e) => setFormData({...formData, symptoms: e.target.value})}
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

      {/* REGISTRATION POPUP */}
      {showRegistrationPopup && (
        <PatientRegistrationForm
          onClose={() => setShowRegistrationPopup(false)}
          addPatient={handleAddPatient}
          patients={patients}
        />
      )}
    </div>
  );
}

export default Patientlist;