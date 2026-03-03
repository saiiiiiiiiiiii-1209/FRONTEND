
// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "../DashboardHome.css";

// // ==================== DOCTOR DASHBOARD HOME ====================
// function DoctorDashboardHome() {
//     const navigate = useNavigate();

//     // ==================== STATES ====================
//     const [appointments, setAppointments] = useState([]);
//     const [patients, setPatients] = useState([]);
//     const [admissions, setAdmissions] = useState([]);
//     const [loading, setLoading] = useState(true);
    
//     // Doctor Availability Modal State
//     const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    
//     // Today's date and day
//     const today = new Date();
//     const todayDate = today.toISOString().split('T')[0];
//     const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
//     const todayDay = days[today.getDay()];
//     const todayDisplay = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
//     // Today's Availability
//     const [todayAvailability, setTodayAvailability] = useState({
//         enabled: true,
//         start: '09:00',
//         end: '19:00'
//     });

//     // ==================== LOAD TODAY'S AVAILABILITY ====================
//     useEffect(() => {
//         loadTodaysAvailability();
//     }, []);

//     const loadTodaysAvailability = () => {
//         try {
//             const saved = localStorage.getItem('doctorAvailability');
//             if (saved) {
//                 const allAvailability = JSON.parse(saved);
//                 // Sirf aaj ka din load karo
//                 if (allAvailability[todayDay]) {
//                     setTodayAvailability(allAvailability[todayDay]);
//                 }
//             }
//         } catch (error) {
//             console.error('Error loading today\'s availability:', error);
//         }
//     };

//     // ==================== SAVE TODAY'S AVAILABILITY ====================
//     const saveTodaysAvailability = () => {
//         try {
//             // Pehle puri availability load karo
//             let allAvailability = {};
//             const saved = localStorage.getItem('doctorAvailability');
//             if (saved) {
//                 allAvailability = JSON.parse(saved);
//             } else {
//                 // Default for all days
//                 days.forEach(day => {
//                     allAvailability[day] = { enabled: true, start: '09:00', end: '19:00' };
//                 });
//             }
            
//             // Sirf aaj ka din update karo
//             allAvailability[todayDay] = todayAvailability;
            
//             // Save karo
//             localStorage.setItem('doctorAvailability', JSON.stringify(allAvailability));
            
//             // Trigger event for AppointmentForm
//             window.dispatchEvent(new CustomEvent('doctorAvailabilityUpdated'));
            
//             alert(`✅ Today's schedule saved successfully!\n${todayDisplay}: ${todayAvailability.enabled ? todayAvailability.start + ' - ' + todayAvailability.end : 'Not Available'}`);
//             setShowAvailabilityModal(false);
//         } catch (error) {
//             console.error('Error saving today\'s availability:', error);
//             alert('Failed to save schedule. Please try again.');
//         }
//     };

//     // ==================== LOAD DATA ====================
//     const fetchAllData = async () => {
//         try {
//             setLoading(true);
            
//             // Fetch appointments from backend
//             const appointmentsResponse = await fetch('http://localhost:8001/api/appointments');
//             const appointmentsData = await appointmentsResponse.json();
//             if (appointmentsData.success) {
//                 setAppointments(appointmentsData.appointments || []);
//             } else {
//                 // Fallback to localStorage
//                 const savedAppointments = localStorage.getItem('appointments');
//                 if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
//             }

//             // Fetch patients from backend
//             const patientsResponse = await fetch('http://localhost:8001/api/patients');
//             const patientsData = await patientsResponse.json();
//             if (patientsData.success) {
//                 setPatients(patientsData.data || []);
//             } else {
//                 // Fallback to localStorage
//                 const savedPatients = localStorage.getItem('patients');
//                 if (savedPatients) setPatients(JSON.parse(savedPatients));
//             }

//             // Fetch admissions from backend
//             const admissionsResponse = await fetch('http://localhost:8001/api/admitpatient');
//             const admissionsData = await admissionsResponse.json();
//             if (admissionsData.success) {
//                 setAdmissions(admissionsData.data || []);
//             } else {
//                 // Fallback to localStorage
//                 const savedAdmissions = localStorage.getItem('admissions');
//                 if (savedAdmissions) setAdmissions(JSON.parse(savedAdmissions));
//             }
//         } catch (error) {
//             console.error("Error fetching data:", error);
            
//             // Fallback to localStorage
//             const savedAppointments = localStorage.getItem('appointments');
//             if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

//             const savedPatients = localStorage.getItem('patients');
//             if (savedPatients) setPatients(JSON.parse(savedPatients));

//             const savedAdmissions = localStorage.getItem('admissions');
//             if (savedAdmissions) setAdmissions(JSON.parse(savedAdmissions));
//         } finally {
//             setLoading(false);
//         }
//     };

//     // Load data on mount and set up auto-refresh
//     useEffect(() => {
//         fetchAllData();
        
//         // Auto-refresh every 30 seconds
//         const interval = setInterval(() => {
//             fetchAllData();
//         }, 30000);
        
//         return () => clearInterval(interval);
//     }, []);

//     // ==================== HELPER FUNCTIONS ====================
//     const getTodaysAppointments = () => {
//         const today = new Date().toISOString().split('T')[0];
//         return appointments.filter(apt => apt.date === today);
//     };

//     const getAdmittedPatients = () => {
//         return admissions.filter(adm => adm.status === "Admitted");
//     };

//     // Get today's status display
//     const getTodayStatusDisplay = () => {
//         if (!todayAvailability.enabled) {
//             return "❌ Not Available Today";
//         }
//         return `✅ Available: ${todayAvailability.start} - ${todayAvailability.end}`;
//     };

//     // ==================== STATISTICS - 4 CARDS ====================
//     const stats = [
//         { 
//             label: "Today's Appointments", 
//             value: getTodaysAppointments().length, 
//             icon: "📅", 
//             color: "#1976d2",
//             path: "/doctor-dashboard/appointments"
//         },
//         { 
//             label: "Total Appointments", 
//             value: appointments?.length || 0, 
//             icon: "🗓️", 
//             color: "#388e3c",
//             path: "/doctor-dashboard/appointments"
//         },
//         { 
//             label: "Registered Patients", 
//             value: patients?.length || 0, 
//             icon: "👥", 
//             color: "#f57c00",
//             path: "/doctor-dashboard/patients"
//         },
//         { 
//             label: "Admitted Patients", 
//             value: getAdmittedPatients().length, 
//             icon: "🛏️", 
//             color: "#7b1fa2",
//             path: "/doctor-dashboard/admitlist"
//         },
//     ];

//     // ==================== RECENT ACTIVITIES ====================
//     const recentActivities = [
//         ...(appointments?.slice(-3).map(apt => ({
//             time: `${apt.date} ${apt.time}`,
//             activity: `Appointment with ${apt.patientName}`,
//             type: "appointment"
//         })) || []),
//         ...(patients?.slice(-3).map(pat => ({
//             time: `${pat.registeredDate || ''} ${pat.registeredTime || ''}`,
//             activity: `Patient registered: ${pat.patientName}`,
//             type: "patient"
//         })) || []),
//         ...(admissions?.slice(-3).map(adm => ({
//             time: `${adm.admissionDate || adm.fromDate || ''} ${adm.admissionTime || ''}`,
//             activity: `Patient admitted: ${adm.patientName} (Bed ${adm.bedNo})`,
//             type: "admission"
//         })) || [])
//     ]
//     .filter(activity => activity.time)
//     .sort((a, b) => b.time?.localeCompare(a.time))
//     .slice(0, 5);

//     // Handle stat click
//     const handleStatClick = (path) => {
//         navigate(path);
//     };

//     if (loading) {
//         return (
//             <div className="dashboard-home">
//                 {/* <div className="dashboard-header">
//                     <h1 style={{ color: "white" }}>Welcome, Dr. Pranjal Patil</h1>
//                     <p className="subtitle" style={{ color: "white" }}>
//                         {new Date().toLocaleDateString("en-US", {
//                             weekday: "long", year: "numeric", month: "long", day: "numeric",
//                         })}
//                     </p>
//                 </div> */}
//                 <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
//                     <div className="loading-spinner"></div>
//                     <p style={{ marginLeft: '10px' }}>Loading dashboard data...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="dashboard-home">
//             {/* ==================== PAGE HEADER ==================== */}
//             <div className="dashboard-header" style={{ 
//                 display: 'flex', 
//                 justifyContent: 'space-between', 
//                 alignItems: 'center',
//                 flexWrap: 'wrap',
//                 gap: '15px'
//             }}>
//                 <div>
//                     <h1 style={{ color: "white" }}>Welcome, Dr. Pranjal Patil</h1>
//                     <p className="subtitle" style={{ color: "white" }}>
//                         {todayDisplay}
//                     </p>
//                 </div>
                
//                 {/* Today's Status Badge */}
//                 <div style={{
//                     background: todayAvailability.enabled ? '#d4edda' : '#f8d7da',
//                     color: todayAvailability.enabled ? '#155724' : '#721c24',
//                     padding: '8px 16px',
//                     borderRadius: '30px',
//                     fontWeight: 'bold',
//                     display: 'none',
//                     alignItems: 'center',
//                     gap: '8px',
//                     border: todayAvailability.enabled ? '1px solid #c3e6cb' : '1px solid #f5c6cb'
//                 }}>
//                     <span>{todayAvailability.enabled ? '✅' : '❌'}</span>
//                     <span>
//                         {todayAvailability.enabled 
//                             ? `${todayAvailability.start} - ${todayAvailability.end}` 
//                             : 'Not Available'}
//                     </span>
//                 </div>
                
//                 {/* Availability Button */}
//                 <button 
//                     onClick={() => setShowAvailabilityModal(true)}
//                     style={{
//                         background: 'white',
//                         color: '#1976d2',
//                         border: 'none',
//                         padding: '10px 20px',
//                         borderRadius: '8px',
//                         fontWeight: 'bold',
//                         cursor: 'pointer',
//                         display: 'flex',
//                         alignItems: 'center',
//                         gap: '8px',
//                         fontSize: '14px',
//                         boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
//                         transition: 'all 0.2s ease'
//                     }}
//                     onMouseOver={(e) => {
//                         e.currentTarget.style.transform = 'translateY(-2px)';
//                         e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
//                     }}
//                     onMouseOut={(e) => {
//                         e.currentTarget.style.transform = 'translateY(0)';
//                         e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
//                     }}
//                 >
//                     <span>⏰</span>
//                     Set Today's Schedule
//                 </button>
//             </div>

//             {/* ==================== STATISTICS CARDS ==================== */}
//             <div className="stats-grid">
//                 {stats.map((stat, index) => (
//                     <div 
//                         key={index} 
//                         className="stat-card" 
//                         style={{ 
//                             borderLeft: `4px solid ${stat.color}`,
//                             cursor: "pointer",
//                             transition: "all 0.2s ease"
//                         }}
//                         onClick={() => handleStatClick(stat.path)}
//                         onMouseOver={(e) => {
//                             e.currentTarget.style.transform = "translateY(-4px)";
//                             e.currentTarget.style.boxShadow = `0 8px 20px ${stat.color}40`;
//                         }}
//                         onMouseOut={(e) => {
//                             e.currentTarget.style.transform = "translateY(0)";
//                             e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
//                         }}
//                     >
//                         <div className="stat-icon">{stat.icon}</div>
//                         <div className="stat-info">
//                             <h3>{stat.value}</h3>
//                             <p>{stat.label}</p>
//                         </div>
//                     </div>
//                 ))}
//             </div>

//             {/* ==================== TODAY'S SCHEDULE CARD ==================== */}
//             <div className="quick-actions-section" style={{ marginBottom: '20px' }}>
//                 <h2>Today's Schedule ({todayDisplay})</h2>
//                 <div style={{
//                     background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
//                     borderRadius: '12px',
//                     padding: '20px',
//                     color: 'white',
//                     display: 'flex',
//                     justifyContent: 'space-between',
//                     alignItems: 'center',
//                     flexWrap: 'wrap',
//                     gap: '15px'
//                 }}>
//                     <div>
//                         <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '5px' }}>
//                             Current Status
//                         </div>
//                         <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
//                             {todayAvailability.enabled ? 'Available' : 'Not Available'}
//                         </div>
//                     </div>
//                     <div>
//                         <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '5px' }}>
//                             Working Hours
//                         </div>
//                         <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
//                             {todayAvailability.enabled 
//                                 ? `${todayAvailability.start} - ${todayAvailability.end}`
//                                 : '---'}
//                         </div>
//                     </div>
//                     <button
//                         onClick={() => setShowAvailabilityModal(true)}
//                         style={{
//                             background: 'rgba(255,255,255,0.2)',
//                             border: '1px solid rgba(255,255,255,0.3)',
//                             color: 'white',
//                             padding: '10px 20px',
//                             borderRadius: '8px',
//                             cursor: 'pointer',
//                             fontSize: '14px',
//                             fontWeight: 'bold',
//                             backdropFilter: 'blur(5px)'
//                         }}
//                     >
//                         Update Schedule
//                     </button>
//                 </div>
//             </div>

//             {/* ==================== QUICK ACTIONS ==================== */}
//             <div className="quick-actions-section">
//                 <h2>Quick Actions</h2>
//                 <div className="action-buttons">
//                     <button className="action-btn" onClick={() => navigate("/doctor-dashboard/appointments")}>
//                         <span className="action-icon">📅</span>
//                         <span>View Appointments</span>
//                     </button>
//                     <button className="action-btn" onClick={() => navigate("/doctor-dashboard/patients")}>
//                         <span className="action-icon">👥</span>
//                         <span>My Patients</span>
//                     </button>
//                     <button className="action-btn" onClick={() => navigate("/doctor-dashboard/DoctorBedView")}>
//                         <span className="action-icon">🛏️</span>
//                         <span>Bed View</span>
//                     </button>
//                     <button className="action-btn" onClick={() => navigate("/doctor-dashboard/admitlist")}>
//                         <span className="action-icon">🏥</span>
//                         <span>Admitted List</span>
//                     </button>
//                 </div>
//             </div>

//             {/* ==================== RECENT ACTIVITIES ==================== */}
//             <div className="recent-activities-section">
//                 <h2>Recent Activities</h2>
//                 <div className="activities-list">
//                     {recentActivities.length > 0 ? (
//                         recentActivities.map((activity, index) => (
//                             <div key={index} className="activity-item">
//                                 <span className="activity-time">{activity.time}</span>
//                                 <span className="activity-text">{activity.activity}</span>
//                                 <span className={`activity-type ${activity.type}`}>{activity.type}</span>
//                             </div>
//                         ))
//                     ) : (
//                         <div className="no-activities">
//                             <p>No recent activities</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             {/* ==================== TODAY'S AVAILABILITY MODAL ==================== */}
//             {showAvailabilityModal && (
//                 <div style={{
//                     position: 'fixed',
//                     top: 0,
//                     left: 0,
//                     right: 0,
//                     bottom: 0,
//                     background: 'rgba(0, 0, 0, 0.5)',
//                     display: 'flex',
//                     alignItems: 'center',
//                     justifyContent: 'center',
//                     zIndex: 1000
//                 }} onClick={() => setShowAvailabilityModal(false)}>
//                     <div style={{
//                         background: 'white',
//                         borderRadius: '12px',
//                         width: '90%',
//                         maxWidth: '450px',
//                         padding: '24px',
//                         boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
//                     }} onClick={(e) => e.stopPropagation()}>
                        
//                         <div style={{
//                             display: 'flex',
//                             justifyContent: 'space-between',
//                             alignItems: 'center',
//                             marginBottom: '20px',
//                             borderBottom: '1px solid #e0e0e0',
//                             paddingBottom: '15px'
//                         }}>
//                             <h3 style={{ margin: 0, color: '#1976d2' }}>
//                                 <span style={{ marginRight: '8px' }}>⏰</span>
//                                 Set Today's Schedule
//                             </h3>
//                             <button 
//                                 onClick={() => setShowAvailabilityModal(false)}
//                                 style={{
//                                     background: 'none',
//                                     border: 'none',
//                                     fontSize: '24px',
//                                     cursor: 'pointer',
//                                     color: '#666'
//                                 }}
//                             >×</button>
//                         </div>

//                         <div style={{
//                             background: '#e3f2fd',
//                             color: '#1976d2',
//                             padding: '15px',
//                             borderRadius: '8px',
//                             marginBottom: '20px',
//                             textAlign: 'center',
//                             fontSize: '16px',
//                             fontWeight: 'bold'
//                         }}>
//                             {todayDisplay}
//                         </div>

//                         <p style={{
//                             background: '#f8f9fa',
//                             padding: '12px',
//                             borderRadius: '8px',
//                             marginBottom: '20px',
//                             fontSize: '14px',
//                             color: '#495057'
//                         }}>
//                             Set your availability for today. Patients can only book appointments during these hours.
//                         </p>
                        
//                         <div style={{ marginBottom: '20px' }}>
//                             <div style={{
//                                 background: '#f8f9fa',
//                                 borderRadius: '8px',
//                                 padding: '20px',
//                                 border: '1px solid #e9ecef'
//                             }}>
//                                 <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
//                                     <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
//                                         <input
//                                             type="checkbox"
//                                             checked={todayAvailability.enabled}
//                                             onChange={() => setTodayAvailability(prev => ({
//                                                 ...prev,
//                                                 enabled: !prev.enabled
//                                             }))}
//                                             style={{ width: '18px', height: '18px' }}
//                                         />
//                                         <span style={{ fontSize: '16px', color: '#495057', fontWeight: 500 }}>
//                                             Available Today
//                                         </span>
//                                     </label>
//                                 </div>

//                                 {todayAvailability.enabled && (
//                                     <div style={{ display: 'flex', gap: '15px' }}>
//                                         <div style={{ flex: 1 }}>
//                                             <label style={{ display: 'block', fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>From</label>
//                                             <input
//                                                 type="time"
//                                                 value={todayAvailability.start}
//                                                 onChange={(e) => setTodayAvailability(prev => ({
//                                                     ...prev,
//                                                     start: e.target.value
//                                                 }))}
//                                                 style={{
//                                                     width: '100%',
//                                                     padding: '10px 12px',
//                                                     border: '1px solid #ced4da',
//                                                     borderRadius: '6px',
//                                                     fontSize: '14px'
//                                                 }}
//                                             />
//                                         </div>
//                                         <div style={{ flex: 1 }}>
//                                             <label style={{ display: 'block', fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>To</label>
//                                             <input
//                                                 type="time"
//                                                 value={todayAvailability.end}
//                                                 onChange={(e) => setTodayAvailability(prev => ({
//                                                     ...prev,
//                                                     end: e.target.value
//                                                 }))}
//                                                 style={{
//                                                     width: '100%',
//                                                     padding: '10px 12px',
//                                                     border: '1px solid #ced4da',
//                                                     borderRadius: '6px',
//                                                     fontSize: '14px'
//                                                 }}
//                                             />
//                                         </div>
//                                     </div>
//                                 )}

//                                 {!todayAvailability.enabled && (
//                                     <div style={{ color: '#dc3545', fontSize: '14px', paddingLeft: '28px' }}>
//                                         ❌ You will not be available for appointments today
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         <div style={{
//                             display: 'flex',
//                             justifyContent: 'flex-end',
//                             gap: '12px',
//                             marginTop: '20px',
//                             paddingTop: '20px',
//                             borderTop: '1px solid #e9ecef'
//                         }}>
//                             <button 
//                                 onClick={() => setShowAvailabilityModal(false)}
//                                 style={{
//                                     padding: '12px 24px',
//                                     borderRadius: '6px',
//                                     background: '#e9ecef',
//                                     color: '#495057',
//                                     border: 'none',
//                                     cursor: 'pointer',
//                                     fontWeight: 500,
//                                     fontSize: '14px'
//                                 }}
//                             >
//                                 Cancel
//                             </button>
//                             <button 
//                                 onClick={saveTodaysAvailability}
//                                 style={{
//                                     padding: '12px 24px',
//                                     borderRadius: '6px',
//                                     background: '#28a745',
//                                     color: 'white',
//                                     border: 'none',
//                                     cursor: 'pointer',
//                                     fontWeight: 500,
//                                     fontSize: '14px'
//                                 }}
//                                 onMouseOver={(e) => e.target.style.background = '#218838'}
//                                 onMouseOut={(e) => e.target.style.background = '#28a745'}
//                             >
//                                 Save Today's Schedule
//                             </button>
//                         </div>

//                         <div style={{
//                             marginTop: '15px',
//                             padding: '10px',
//                             background: '#fff3cd',
//                             border: '1px solid #ffeeba',
//                             borderRadius: '6px',
//                             fontSize: '12px',
//                             color: '#856404',
//                             textAlign: 'center'
//                         }}>
//                             ⏰ This setting is for <strong>today only</strong> ({todayDisplay})
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </div>
//     );
// }

// export default DoctorDashboardHome;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../DashboardHome.css";

// ==================== DOCTOR DASHBOARD HOME ====================
function DoctorDashboardHome() {
    const navigate = useNavigate();

    // ==================== STATES ====================
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [admissions, setAdmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Doctor Availability Modal State
    const [showAvailabilityModal, setShowAvailabilityModal] = useState(false);
    
    // Validation Errors
    const [timeError, setTimeError] = useState('');
    
    // Today's date and day
    const today = new Date();
    const todayDate = today.toISOString().split('T')[0];
    const days = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    const todayDay = days[today.getDay()];
    const todayDisplay = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
    
    // Current time for validation (for today)
    const currentTime = today.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Today's Availability
    const [todayAvailability, setTodayAvailability] = useState({
        enabled: true,
        start: '09:00',
        end: '19:00'
    });

    // ==================== TIME VALIDATION FUNCTION ====================
    const validateTimes = (start, end) => {
        // Check if times are in valid 24-hour format
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        
        if (!timeRegex.test(start) || !timeRegex.test(end)) {
            return "Time must be in 24-hour format (e.g., 09:00, 17:30)";
        }
        
        // Convert to comparable values
        const startMinutes = parseInt(start.split(':')[0]) * 60 + parseInt(start.split(':')[1]);
        const endMinutes = parseInt(end.split(':')[0]) * 60 + parseInt(end.split(':')[1]);
        
        // Start time should be less than end time
        if (startMinutes >= endMinutes) {
            return "Start time must be less than end time";
        }
        
        // For today, check if end time is not in the past
        if (todayAvailability.enabled) {
            const currentMinutes = parseInt(currentTime.split(':')[0]) * 60 + parseInt(currentTime.split(':')[1]);
            
            // If end time is in the past, show warning but don't block (doctor might be setting for future)
            if (endMinutes < currentMinutes) {
                return "⚠️ Warning: End time is in the past";
            }
        }
        
        return '';
    };

    // ==================== LOAD TODAY'S AVAILABILITY ====================
    useEffect(() => {
        loadTodaysAvailability();
    }, []);

    const loadTodaysAvailability = () => {
        try {
            const saved = localStorage.getItem('doctorAvailability');
            if (saved) {
                const allAvailability = JSON.parse(saved);
                // Sirf aaj ka din load karo
                if (allAvailability[todayDay]) {
                    setTodayAvailability(allAvailability[todayDay]);
                }
            }
        } catch (error) {
            console.error('Error loading today\'s availability:', error);
        }
    };

    // ==================== HANDLE TIME CHANGE WITH VALIDATION ====================
    const handleStartTimeChange = (value) => {
        setTodayAvailability(prev => ({
            ...prev,
            start: value
        }));
        
        // Validate with new start time and current end time
        const error = validateTimes(value, todayAvailability.end);
        setTimeError(error);
    };

    const handleEndTimeChange = (value) => {
        setTodayAvailability(prev => ({
            ...prev,
            end: value
        }));
        
        // Validate with current start time and new end time
        const error = validateTimes(todayAvailability.start, value);
        setTimeError(error);
    };

    const handleToggleChange = () => {
        setTodayAvailability(prev => ({
            ...prev,
            enabled: !prev.enabled
        }));
        setTimeError(''); // Clear error when toggling
    };

    // ==================== SAVE TODAY'S AVAILABILITY ====================
    const saveTodaysAvailability = () => {
        try {
            // Validate before saving
            if (todayAvailability.enabled) {
                const error = validateTimes(todayAvailability.start, todayAvailability.end);
                if (error && !error.includes('⚠️')) {
                    alert(`Invalid time: ${error}`);
                    return;
                }
            }
            
            // Pehle puri availability load karo
            let allAvailability = {};
            const saved = localStorage.getItem('doctorAvailability');
            if (saved) {
                allAvailability = JSON.parse(saved);
            } else {
                // Default for all days
                days.forEach(day => {
                    allAvailability[day] = { enabled: true, start: '09:00', end: '19:00' };
                });
            }
            
            // Sirf aaj ka din update karo
            allAvailability[todayDay] = todayAvailability;
            
            // Save karo
            localStorage.setItem('doctorAvailability', JSON.stringify(allAvailability));
            
            // Trigger event for AppointmentForm
            window.dispatchEvent(new CustomEvent('doctorAvailabilityUpdated'));
            
            alert(`✅ Today's schedule saved successfully!\n${todayDisplay}: ${todayAvailability.enabled ? todayAvailability.start + ' - ' + todayAvailability.end : 'Not Available'}`);
            setShowAvailabilityModal(false);
            setTimeError('');
        } catch (error) {
            console.error('Error saving today\'s availability:', error);
            alert('Failed to save schedule. Please try again.');
        }
    };

    // ==================== LOAD DATA ====================
    const fetchAllData = async () => {
        try {
            setLoading(true);
            
            // Fetch appointments from backend
            const appointmentsResponse = await fetch('http://localhost:8001/api/appointments');
            const appointmentsData = await appointmentsResponse.json();
            if (appointmentsData.success) {
                setAppointments(appointmentsData.appointments || []);
            } else {
                // Fallback to localStorage
                const savedAppointments = localStorage.getItem('appointments');
                if (savedAppointments) setAppointments(JSON.parse(savedAppointments));
            }

            // Fetch patients from backend
            const patientsResponse = await fetch('http://localhost:8001/api/patients');
            const patientsData = await patientsResponse.json();
            if (patientsData.success) {
                setPatients(patientsData.data || []);
            } else {
                // Fallback to localStorage
                const savedPatients = localStorage.getItem('patients');
                if (savedPatients) setPatients(JSON.parse(savedPatients));
            }

            // Fetch admissions from backend
            const admissionsResponse = await fetch('http://localhost:8001/api/admitpatient');
            const admissionsData = await admissionsResponse.json();
            if (admissionsData.success) {
                setAdmissions(admissionsData.data || []);
            } else {
                // Fallback to localStorage
                const savedAdmissions = localStorage.getItem('admissions');
                if (savedAdmissions) setAdmissions(JSON.parse(savedAdmissions));
            }
        } catch (error) {
            console.error("Error fetching data:", error);
            
            // Fallback to localStorage
            const savedAppointments = localStorage.getItem('appointments');
            if (savedAppointments) setAppointments(JSON.parse(savedAppointments));

            const savedPatients = localStorage.getItem('patients');
            if (savedPatients) setPatients(JSON.parse(savedPatients));

            const savedAdmissions = localStorage.getItem('admissions');
            if (savedAdmissions) setAdmissions(JSON.parse(savedAdmissions));
        } finally {
            setLoading(false);
        }
    };

    // Load data on mount and set up auto-refresh
    useEffect(() => {
        fetchAllData();
        
        // Auto-refresh every 30 seconds
        const interval = setInterval(() => {
            fetchAllData();
        }, 30000);
        
        return () => clearInterval(interval);
    }, []);

    // ==================== HELPER FUNCTIONS ====================
    const getTodaysAppointments = () => {
        const today = new Date().toISOString().split('T')[0];
        return appointments.filter(apt => apt.date === today);
    };

    const getAdmittedPatients = () => {
        return admissions.filter(adm => adm.status === "Admitted");
    };

    // Get today's status display
    const getTodayStatusDisplay = () => {
        if (!todayAvailability.enabled) {
            return "❌ Not Available Today";
        }
        return `✅ Available: ${todayAvailability.start} - ${todayAvailability.end}`;
    };

    // ==================== STATISTICS - 4 CARDS ====================
    const stats = [
        { 
            label: "Today's Appointments", 
            value: getTodaysAppointments().length, 
            icon: "📅", 
            color: "#1976d2",
            path: "/doctor-dashboard/appointments"
        },
        { 
            label: "Total Appointments", 
            value: appointments?.length || 0, 
            icon: "🗓️", 
            color: "#388e3c",
            path: "/doctor-dashboard/appointments"
        },
        { 
            label: "Registered Patients", 
            value: patients?.length || 0, 
            icon: "👥", 
            color: "#f57c00",
            path: "/doctor-dashboard/patients"
        },
        { 
            label: "Admitted Patients", 
            value: getAdmittedPatients().length, 
            icon: "🛏️", 
            color: "#7b1fa2",
            path: "/doctor-dashboard/admitlist"
        },
    ];

    // ==================== RECENT ACTIVITIES ====================
    const recentActivities = [
        ...(appointments?.slice(-3).map(apt => ({
            time: `${apt.date} ${apt.time}`,
            activity: `Appointment with ${apt.patientName}`,
            type: "appointment"
        })) || []),
        ...(patients?.slice(-3).map(pat => ({
            time: `${pat.registeredDate || ''} ${pat.registeredTime || ''}`,
            activity: `Patient registered: ${pat.patientName}`,
            type: "patient"
        })) || []),
        ...(admissions?.slice(-3).map(adm => ({
            time: `${adm.admissionDate || adm.fromDate || ''} ${adm.admissionTime || ''}`,
            activity: `Patient admitted: ${adm.patientName} (Bed ${adm.bedNo})`,
            type: "admission"
        })) || [])
    ]
    .filter(activity => activity.time)
    .sort((a, b) => b.time?.localeCompare(a.time))
    .slice(0, 5);

    // Handle stat click
    const handleStatClick = (path) => {
        navigate(path);
    };

    if (loading) {
        return (
            <div className="dashboard-home">
                <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
                    <div className="loading-spinner"></div>
                    <p style={{ marginLeft: '10px' }}>Loading dashboard data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-home">
            {/* ==================== PAGE HEADER ==================== */}
            <div className="dashboard-header" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: '15px'
            }}>
                <div>
                    <h1 style={{ color: "white" }}>Welcome, Dr. Pranjal Patil</h1>
                    <p className="subtitle" style={{ color: "white" }}>
                        {todayDisplay}
                    </p>
                </div>
                
                {/* Availability Button */}
                <button 
                    onClick={() => setShowAvailabilityModal(true)}
                    style={{
                        background: 'white',
                        color: '#1976d2',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        fontWeight: 'bold',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
                    }}
                    onMouseOut={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                    }}
                >
                    <span>⏰</span>
                    Set Today's Schedule
                </button>
            </div>

            {/* ==================== STATISTICS CARDS ==================== */}
            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <div 
                        key={index} 
                        className="stat-card" 
                        style={{ 
                            borderLeft: `4px solid ${stat.color}`,
                            cursor: "pointer",
                            transition: "all 0.2s ease"
                        }}
                        onClick={() => handleStatClick(stat.path)}
                        onMouseOver={(e) => {
                            e.currentTarget.style.transform = "translateY(-4px)";
                            e.currentTarget.style.boxShadow = `0 8px 20px ${stat.color}40`;
                        }}
                        onMouseOut={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
                        }}
                    >
                        <div className="stat-icon">{stat.icon}</div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* ==================== TODAY'S SCHEDULE CARD ==================== */}
            <div className="quick-actions-section" style={{ marginBottom: '20px' }}>
                <h2>Today's Schedule ({todayDisplay})</h2>
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: 'white',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '15px'
                }}>
                    <div>
                        <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '5px' }}>
                            Current Status
                        </div>
                        <div style={{ fontSize: '24px', fontWeight: 'bold' }}>
                            {todayAvailability.enabled ? 'Available' : 'Not Available'}
                        </div>
                    </div>
                    <div>
                        <div style={{ fontSize: '14px', opacity: '0.9', marginBottom: '5px' }}>
                            Working Hours
                        </div>
                        <div style={{ fontSize: '20px', fontWeight: 'bold' }}>
                            {todayAvailability.enabled 
                                ? `${todayAvailability.start} - ${todayAvailability.end}`
                                : '---'}
                        </div>
                    </div>
                    <button
                        onClick={() => setShowAvailabilityModal(true)}
                        style={{
                            background: 'rgba(255,255,255,0.2)',
                            border: '1px solid rgba(255,255,255,0.3)',
                            color: 'white',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            backdropFilter: 'blur(5px)'
                        }}
                    >
                        Update Schedule
                    </button>
                </div>
            </div>

            {/* ==================== QUICK ACTIONS ==================== */}
            <div className="quick-actions-section">
                <h2>Quick Actions</h2>
                <div className="action-buttons">
                    <button className="action-btn" onClick={() => navigate("/doctor-dashboard/appointments")}>
                        <span className="action-icon">📅</span>
                        <span>View Appointments</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate("/doctor-dashboard/patients")}>
                        <span className="action-icon">👥</span>
                        <span>My Patients</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate("/doctor-dashboard/DoctorBedView")}>
                        <span className="action-icon">🛏️</span>
                        <span>Bed View</span>
                    </button>
                    <button className="action-btn" onClick={() => navigate("/doctor-dashboard/admitlist")}>
                        <span className="action-icon">🏥</span>
                        <span>Admitted List</span>
                    </button>
                </div>
            </div>

            {/* ==================== RECENT ACTIVITIES ==================== */}
            <div className="recent-activities-section">
                <h2>Recent Activities</h2>
                <div className="activities-list">
                    {recentActivities.length > 0 ? (
                        recentActivities.map((activity, index) => (
                            <div key={index} className="activity-item">
                                <span className="activity-time">{activity.time}</span>
                                <span className="activity-text">{activity.activity}</span>
                                <span className={`activity-type ${activity.type}`}>{activity.type}</span>
                            </div>
                        ))
                    ) : (
                        <div className="no-activities">
                            <p>No recent activities</p>
                        </div>
                    )}
                </div>
            </div>

            {/* ==================== TODAY'S AVAILABILITY MODAL ==================== */}
            {showAvailabilityModal && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0, 0, 0, 0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }} onClick={() => setShowAvailabilityModal(false)}>
                    <div style={{
                        background: 'white',
                        borderRadius: '12px',
                        width: '90%',
                        maxWidth: '500px',
                        padding: '24px',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
                    }} onClick={(e) => e.stopPropagation()}>
                        
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '20px',
                            borderBottom: '1px solid #e0e0e0',
                            paddingBottom: '15px'
                        }}>
                            <h3 style={{ margin: 0, color: '#1976d2' }}>
                                <span style={{ marginRight: '8px' }}>⏰</span>
                                Set Today's Schedule
                            </h3>
                            <button 
                                onClick={() => setShowAvailabilityModal(false)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '24px',
                                    cursor: 'pointer',
                                    color: '#666'
                                }}
                            >×</button>
                        </div>

                        <div style={{
                            background: '#e3f2fd',
                            color: '#1976d2',
                            padding: '15px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            textAlign: 'center',
                            fontSize: '16px',
                            fontWeight: 'bold'
                        }}>
                            {todayDisplay}
                        </div>

                        <p style={{
                            background: '#f8f9fa',
                            padding: '12px',
                            borderRadius: '8px',
                            marginBottom: '20px',
                            fontSize: '14px',
                            color: '#495057'
                        }}>
                            Set your availability for today. Patients can only book appointments during these hours.
                        </p>
                        
                        <div style={{ marginBottom: '20px' }}>
                            <div style={{
                                background: '#f8f9fa',
                                borderRadius: '8px',
                                padding: '20px',
                                border: '1px solid #e9ecef'
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '15px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                                        <input
                                            type="checkbox"
                                            checked={todayAvailability.enabled}
                                            onChange={handleToggleChange}
                                            style={{ width: '18px', height: '18px' }}
                                        />
                                        <span style={{ fontSize: '16px', color: '#495057', fontWeight: 500 }}>
                                            Available Today
                                        </span>
                                    </label>
                                </div>

                                {todayAvailability.enabled && (
                                    <>
                                        <div style={{ display: 'flex', gap: '15px', marginBottom: timeError ? '10px' : '0' }}>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                                                    From (24h format)
                                                </label>
                                                <input
                                                    type="time"
                                                    value={todayAvailability.start}
                                                    onChange={(e) => handleStartTimeChange(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        border: `1px solid ${timeError ? '#dc3545' : '#ced4da'}`,
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                    step="60"
                                                />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <label style={{ display: 'block', fontSize: '12px', color: '#6c757d', marginBottom: '4px' }}>
                                                    To (24h format)
                                                </label>
                                                <input
                                                    type="time"
                                                    value={todayAvailability.end}
                                                    onChange={(e) => handleEndTimeChange(e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '10px 12px',
                                                        border: `1px solid ${timeError ? '#dc3545' : '#ced4da'}`,
                                                        borderRadius: '6px',
                                                        fontSize: '14px'
                                                    }}
                                                    step="60"
                                                />
                                            </div>
                                        </div>
                                        
                                        {/* Time Validation Error Message */}
                                        {timeError && (
                                            <div style={{
                                                marginTop: '10px',
                                                padding: '8px 12px',
                                                background: timeError.includes('⚠️') ? '#fff3cd' : '#f8d7da',
                                                color: timeError.includes('⚠️') ? '#856404' : '#721c24',
                                                borderRadius: '4px',
                                                fontSize: '13px',
                                                border: timeError.includes('⚠️') ? '1px solid #ffeeba' : '1px solid #f5c6cb'
                                            }}>
                                                {timeError}
                                            </div>
                                        )}
                                        
                                        {/* Current time info for today */}
                                        <div style={{
                                            marginTop: '10px',
                                            fontSize: '12px',
                                            color: '#6c757d',
                                            textAlign: 'right'
                                        }}>
                                            Current time: {currentTime}
                                        </div>
                                    </>
                                )}

                                {!todayAvailability.enabled && (
                                    <div style={{ color: '#dc3545', fontSize: '14px', paddingLeft: '28px' }}>
                                        ❌ You will not be available for appointments today
                                    </div>
                                )}
                            </div>
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'flex-end',
                            gap: '12px',
                            marginTop: '20px',
                            paddingTop: '20px',
                            borderTop: '1px solid #e9ecef'
                        }}>
                            <button 
                                onClick={() => {
                                    setShowAvailabilityModal(false);
                                    setTimeError('');
                                    // Reset to original values
                                    loadTodaysAvailability();
                                }}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '6px',
                                    background: '#e9ecef',
                                    color: '#495057',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 500,
                                    fontSize: '14px'
                                }}
                            >
                                Cancel
                            </button>
                            <button 
                                onClick={saveTodaysAvailability}
                                disabled={todayAvailability.enabled && timeError && !timeError.includes('⚠️')}
                                style={{
                                    padding: '12px 24px',
                                    borderRadius: '6px',
                                    background: (todayAvailability.enabled && timeError && !timeError.includes('⚠️')) ? '#6c757d' : '#28a745',
                                    color: 'white',
                                    border: 'none',
                                    cursor: (todayAvailability.enabled && timeError && !timeError.includes('⚠️')) ? 'not-allowed' : 'pointer',
                                    fontWeight: 500,
                                    fontSize: '14px',
                                    opacity: (todayAvailability.enabled && timeError && !timeError.includes('⚠️')) ? 0.6 : 1
                                }}
                                onMouseOver={(e) => {
                                    if (!(todayAvailability.enabled && timeError && !timeError.includes('⚠️'))) {
                                        e.target.style.background = '#218838';
                                    }
                                }}
                                onMouseOut={(e) => {
                                    if (!(todayAvailability.enabled && timeError && !timeError.includes('⚠️'))) {
                                        e.target.style.background = '#28a745';
                                    }
                                }}
                            >
                                Save Today's Schedule
                            </button>
                        </div>

                        <div style={{
                            marginTop: '15px',
                            padding: '10px',
                            background: '#fff3cd',
                            border: '1px solid #ffeeba',
                            borderRadius: '6px',
                            fontSize: '12px',
                            color: '#856404',
                            textAlign: 'center'
                        }}>
                            ⏰ This setting is for <strong>today only</strong> ({todayDisplay})
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default DoctorDashboardHome;