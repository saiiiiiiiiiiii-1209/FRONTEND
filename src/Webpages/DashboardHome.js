// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import AppointmentForm from "./AppointmentForm";
// import PatientRegistrationForm from "./PatientRegistrationForm";
// import AdmitPatientForm from "./AdmitPatientForm";
// import Patientlist from "./Patientlist";
// import Appointment from "./Appointment";
// import AdmitList from "./Admitlist";
// import Doctors from "./Doctors";
// import BedView from "./doctor/BedView";
// import "./DashboardHome.css";

// function DashboardHome() {
//   const navigate = useNavigate();

//   // ==================== STATES ====================
//   const [appointments, setAppointments] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const [admissions, setAdmissions] = useState([]);
//   const [showPopup, setShowPopup] = useState(false);
//   const [popupType, setPopupType] = useState("");

//   // Available bed numbers
//   const availableBeds = [
//     "101", "102", "103", "104", "105",
//     "201", "202", "203", "204", "205",
//     "301", "302", "303", "304", "305",
//     "ICU-1", "ICU-2", "ICU-3", "ICU-4", "ICU-5",
//   ];

//   // ==================== LOAD DATA FROM BACKEND ====================
//   const fetchAppointments = async () => {
//     try {
//       const response = await fetch('http://localhost:8001/api/appointments');
//       const data = await response.json();
//       if (data.success) {
//         setAppointments(data.appointments || []);
//       }
//     } catch (error) {
//       console.error("Error fetching appointments:", error);
//       // Fallback to localStorage
//       const saved = localStorage.getItem('appointments');
//       if (saved) setAppointments(JSON.parse(saved));
//     }
//   };

//   const fetchPatients = async () => {
//     try {
//       const response = await fetch('http://localhost:8001/api/patients');
//       const data = await response.json();
//       if (data.success) {
//         setPatients(data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching patients:", error);
//       // Fallback to localStorage
//       const saved = localStorage.getItem('patients');
//       if (saved) setPatients(JSON.parse(saved));
//     }
//   };

//   const fetchAdmissions = async () => {
//     try {
//       const response = await fetch('http://localhost:8001/api/admitpatient');
//       const data = await response.json();
//       if (data.success) {
//         setAdmissions(data.data || []);
//       }
//     } catch (error) {
//       console.error("Error fetching admissions:", error);
//       // Fallback to localStorage
//       const saved = localStorage.getItem('admissions');
//       if (saved) setAdmissions(JSON.parse(saved));
//     }
//   };

//   // Load all data on mount
//   useEffect(() => {
//     fetchAppointments();
//     fetchPatients();
//     fetchAdmissions();
//   }, []);

//   // ==================== APPOINTMENT FUNCTIONS ====================
//   const addAppointment = async (appointment) => {
//     try {
//       const response = await fetch('http://localhost:8001/api/appointments', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(appointment)
//       });
//       const data = await response.json();
//       if (data.success) {
//         fetchAppointments(); // Refresh data
//         return data.appointment;
//       }
//     } catch (error) {
//       console.error("Error adding appointment:", error);
//     }
//   };

//   const updateAppointment = async (id, updatedData) => {
//     try {
//       const response = await fetch(`http://localhost:8001/api/appointments/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedData)
//       });
//       if (response.ok) {
//         fetchAppointments();
//       }
//     } catch (error) {
//       console.error("Error updating appointment:", error);
//     }
//   };

//   const deleteAppointment = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8001/api/appointments/${id}`, {
//         method: 'DELETE'
//       });
//       if (response.ok) {
//         fetchAppointments();
//       }
//     } catch (error) {
//       console.error("Error deleting appointment:", error);
//     }
//   };

//   const getTodaysAppointments = () => {
//     const today = new Date().toISOString().split('T')[0];
//     return appointments.filter(apt => apt.date === today);
//   };

//   // ==================== PATIENT FUNCTIONS ====================
//   const addPatient = async (patient) => {
//     try {
//       const response = await fetch('http://localhost:8001/api/patients', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(patient)
//       });
//       const data = await response.json();
//       if (data.success) {
//         fetchPatients(); // Refresh data
//         return data.data;
//       }
//     } catch (error) {
//       console.error("Error adding patient:", error);
//     }
//   };

//   const updatePatient = async (id, updatedData) => {
//     try {
//       const response = await fetch(`http://localhost:8001/api/patients/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedData)
//       });
//       if (response.ok) {
//         fetchPatients();
//       }
//     } catch (error) {
//       console.error("Error updating patient:", error);
//     }
//   };

//   const deletePatient = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8001/api/patients/${id}`, {
//         method: 'DELETE'
//       });
//       if (response.ok) {
//         fetchPatients();
//       }
//     } catch (error) {
//       console.error("Error deleting patient:", error);
//     }
//   };

//   const searchPatients = (query) => {
//     if (!query) return [];
//     return patients.filter(p =>
//       p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
//       p.phone?.includes(query) ||
//       p.email?.toLowerCase().includes(query.toLowerCase())
//     );
//   };

//   const getPatientById = (id) => {
//     return patients.find(p => p.id === id);
//   };

//   // ==================== ADMISSION FUNCTIONS ====================
//   const addAdmission = async (admission) => {
//     try {
//       const response = await fetch('http://localhost:8001/api/admitpatient', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(admission)
//       });
//       const data = await response.json();
//       if (data.success) {
//         fetchAdmissions(); // Refresh data
//         return data.data;
//       }
//     } catch (error) {
//       console.error("Error adding admission:", error);
//     }
//   };

//   const updateAdmission = async (id, updatedData) => {
//     try {
//       const response = await fetch(`http://localhost:8001/api/admitpatient/${id}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(updatedData)
//       });
//       if (response.ok) {
//         fetchAdmissions();
//       }
//     } catch (error) {
//       console.error("Error updating admission:", error);
//     }
//   };

//   const dischargePatient = async (id) => {
//     try {
//       const response = await fetch(`http://localhost:8001/api/admitpatient/${id}/discharge`, {
//         method: 'PATCH'
//       });
//       if (response.ok) {
//         fetchAdmissions();
//       }
//     } catch (error) {
//       console.error("Error discharging patient:", error);
//     }
//   };

//   const getAvailableBeds = () => {
//     const occupied = admissions.filter(adm => adm.status === "Admitted").map(adm => adm.bedNo);
//     return availableBeds.filter(bed => !occupied.includes(bed));
//   };

//   const getAdmittedPatients = () => {
//     return admissions.filter(adm => adm.status === "Admitted");
//   };

//   // ==================== CLICK HANDLERS FOR STATS ====================
//   const handleStatClick = (type) => {
//     switch(type) {
//       case 'appointments':
//         navigate("/receptionist-dashboard/appointment");
//         break;
//       case 'today':
//         navigate("/receptionist-dashboard/appointment", { state: { filter: 'today' } });
//         break;
//       case 'patients':
//         navigate("/receptionist-dashboard/Patientlist");
//         break;
//       case 'admitted':
//         navigate("/receptionist-dashboard/admitlist");
//         break;
//       default:
//         break;
//     }
//   };

//   // ==================== POPUP HANDLERS ====================
//   const openPopup = (type) => {
//     setPopupType(type);
//     setShowPopup(true);
//   };

//   const closePopup = () => {
//     setShowPopup(false);
//     setPopupType("");
//   };

//   // ==================== DYNAMIC STATISTICS ====================
//   const stats = [
//     { 
//       label: "Total Appointments", 
//       value: appointments?.length || 0, 
//       icon: "📅", 
//       color: "#1976d2",
//       type: "appointments",
//       description: "Click to view all appointments"
//     },
//     { 
//       label: "Today's Appointments", 
//       value: getTodaysAppointments().length, 
//       icon: "🗓️", 
//       color: "#388e3c",
//       type: "today",
//       description: "Click to view today's appointments"
//     },
//     { 
//       label: "Registered Patients", 
//       value: patients?.length || 0, 
//       icon: "👥", 
//       color: "#f57c00",
//       type: "patients",
//       description: "Click to view all patients"
//     },
//     { 
//       label: "Admitted Patients", 
//       value: getAdmittedPatients().length, 
//       icon: "🛏️", 
//       color: "#d32f2f",
//       type: "admitted",
//       description: "Click to view admitted patients"
//     },
//   ];

//   // Recent activities
//   const recentActivities = [
//     ...(appointments?.slice(-3).map(apt => ({
//       time: `${apt.date} ${apt.time}`,
//       activity: `Appointment booked for ${apt.patientName}`,
//       type: "appointment"
//     })) || []),
//     ...(patients?.slice(-3).map(pat => ({
//       time: `${pat.registeredDate} ${pat.registeredTime}`,
//       activity: `New patient registered: ${pat.patientName}`,
//       type: "registration"
//     })) || []),
//     ...(admissions?.slice(-3).map(adm => ({
//       time: `${adm.admissionDate} ${adm.admissionTime}`,
//       activity: `Patient admitted: ${adm.patientName} (Bed ${adm.bedNo})`,
//       type: "admission"
//     })) || [])
//   ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);

//   return (
//     <div className="dashboard-home">
//       {/* ==================== PAGE HEADER ==================== */}
//       <div className="dashboard-header">
//         <h1 style={{color:"white"}}>Welcome to Reception Dashboard</h1>
//         <p className="subtitle" style={{color:"white"}}>
//           {new Date().toLocaleDateString("en-US", {
//             weekday: "long", year: "numeric", month: "long", day: "numeric",
//           })}
//         </p>
//       </div>

//       {/* ==================== CLICKABLE STATISTICS CARDS ==================== */}
//       <div className="stats-grid">
//         {stats.map((stat, index) => (
//           <div 
//             key={index} 
//             className="stat-card clickable-stat"
//             style={{ 
//               borderLeft: `4px solid ${stat.color}`,
//               cursor: "pointer",
//               transition: "all 0.2s ease"
//             }}
//             onClick={() => handleStatClick(stat.type)}
//             title={stat.description}
//             onMouseOver={(e) => {
//               e.currentTarget.style.transform = "translateY(-4px)";
//               e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
//             }}
//             onMouseOut={(e) => {
//               e.currentTarget.style.transform = "translateY(0)";
//               e.currentTarget.style.boxShadow = "none";
//             }}
//           >
//             <div className="stat-icon">{stat.icon}</div>
//             <div className="stat-info">
//               <h3>{stat.value}</h3>
//               <p>{stat.label}</p>
//               <small style={{ fontSize: "11px", color: stat.color, marginTop: "4px", display: "block" }}>
//                 Click to view →
//               </small>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* ==================== QUICK ACTIONS ==================== */}
//       <div className="quick-actions-section">
//         <h2>Quick Actions</h2>
//         <div className="action-buttons">
//           <button className="action-btn" onClick={() => openPopup("appointment")}>
//             <span className="action-icon">📅</span>
//             <span>Book Appointment</span>
//           </button>
//           <button className="action-btn" onClick={() => openPopup("patient")}>
//             <span className="action-icon">➕</span>
//             <span>Add New Patient</span>
//           </button>
//           <button className="action-btn" onClick={() => openPopup("admit")}>
//             <span className="action-icon">🏥</span>
//             <span>Admit Patient</span>
//           </button>
//           <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/BedView")}>
//             <span className="action-icon">👨‍⚕️</span>
//             <span>Available Facilities</span>
//           </button>
//         </div>
//         <div className="action-buttons">
//           <button
//             className="action-btn"
//             onClick={() => navigate("/receptionist-dashboard/appointment")}
//           >
//             <span className="action-icon">📋</span>
//             <span>Appointment List</span>
//           </button>

//           <button
//             className="action-btn"
//             onClick={() => navigate("/receptionist-dashboard/Patientlist")}
//           >
//             <span className="action-icon">👥</span>
//             <span>All Patient List</span>
//           </button>

//           <button
//             className="action-btn"
//             onClick={() => navigate("/receptionist-dashboard/admitlist")}
//           >
//             <span className="action-icon">🛏️</span>
//             <span>Admitted List</span>
//           </button>

//           <button
//             className="action-btn"
//             onClick={() => navigate("/receptionist-dashboard/laboratory")}
//           >
//             <span className="action-icon">🔬</span>
//             <span>Laboratory</span>
//           </button>
//         </div>
//       </div>

//       {/* ==================== RECENT ACTIVITIES ==================== */}
//       <div className="recent-activities-section">
//         <h2>Recent Activities</h2>
//         <div className="activities-list">
//           {recentActivities.length > 0 ? (
//             recentActivities.map((activity, index) => (
//               <div key={index} className="activity-item">
//                 <span className="activity-time">{activity.time}</span>
//                 <span className="activity-text">{activity.activity}</span>
//                 <span className={`activity-type ${activity.type}`}>{activity.type}</span>
//               </div>
//             ))
//           ) : (
//             <div className="no-activities">
//               <p>No recent activities</p>
//             </div>
//           )}
//         </div>
//       </div>

//       {/* ==================== FORMS ==================== */}
//       {showPopup && popupType === "appointment" && (
//         <AppointmentForm
//           onClose={closePopup}
//           addAppointment={addAppointment}
//           appointments={appointments}
//         />
//       )}

//       {showPopup && popupType === "patient" && (
//         <PatientRegistrationForm
//           onClose={closePopup}
//           addPatient={addPatient}
//           patients={patients}
//         />
//       )}

//       {showPopup && popupType === "admit" && (
//         <AdmitPatientForm
//           onClose={closePopup}
//           addAdmission={addAdmission}
//           searchPatients={searchPatients}
//           getAvailableBeds={getAvailableBeds}
//           availableBeds={availableBeds}
//         />
//       )}
//     </div>
//   );
// }

// export default DashboardHome;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AppointmentForm from "./AppointmentForm";
import PatientRegistrationForm from "./PatientRegistrationForm";
import AdmitPatientForm from "./AdmitPatientForm";
import Patientlist from "./Patientlist";
import Appointment from "./Appointment";
import AdmitList from "./Admitlist";
import Doctors from "./Doctors";
import BedView from "./doctor/BedView";
import "./DashboardHome.css";

function DashboardHome() {
  const navigate = useNavigate();

  // ==================== STATES ====================
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [admissions, setAdmissions] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [popupType, setPopupType] = useState("");
  const [todayDate, setTodayDate] = useState(new Date().toISOString().split('T')[0]);

  // Available bed numbers
  const availableBeds = [
    "101", "102", "103", "104", "105",
    "201", "202", "203", "204", "205",
    "301", "302", "303", "304", "305",
    "ICU-1", "ICU-2", "ICU-3", "ICU-4", "ICU-5",
  ];

  // ==================== LOAD DATA FROM BACKEND ====================
  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/appointments');
      const data = await response.json();
      if (data.success) {
        setAppointments(data.appointments || []);
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      // Fallback to localStorage
      const saved = localStorage.getItem('appointments');
      if (saved) setAppointments(JSON.parse(saved));
    }
  };

  const fetchPatients = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/patients');
      const data = await response.json();
      if (data.success) {
        setPatients(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching patients:", error);
      // Fallback to localStorage
      const saved = localStorage.getItem('patients');
      if (saved) setPatients(JSON.parse(saved));
    }
  };

  const fetchAdmissions = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admitpatient');
      const data = await response.json();
      if (data.success) {
        setAdmissions(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching admissions:", error);
      // Fallback to localStorage
      const saved = localStorage.getItem('admissions');
      if (saved) setAdmissions(JSON.parse(saved));
    }
  };

  // Load all data on mount
  useEffect(() => {
    fetchAppointments();
    fetchPatients();
    fetchAdmissions();
    
    // Update today's date every day at midnight
    const updateDate = () => {
      const newDate = new Date().toISOString().split('T')[0];
      setTodayDate(newDate);
      console.log("📅 Date updated to:", newDate);
    };

    // Check every hour if date changed
    const interval = setInterval(() => {
      const currentDate = new Date().toISOString().split('T')[0];
      if (currentDate !== todayDate) {
        updateDate();
        // Refresh appointments to get today's data
        fetchAppointments();
      }
    }, 3600000); // Check every hour

    return () => clearInterval(interval);
  }, []);

  // ==================== APPOINTMENT FUNCTIONS ====================
  const addAppointment = async (appointment) => {
    try {
      const response = await fetch('http://localhost:8001/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(appointment)
      });
      const data = await response.json();
      if (data.success) {
        fetchAppointments(); // Refresh data
        return data.appointment;
      }
    } catch (error) {
      console.error("Error adding appointment:", error);
    }
  };

  const updateAppointment = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8001/api/appointments/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const deleteAppointment = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/api/appointments/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchAppointments();
      }
    } catch (error) {
      console.error("Error deleting appointment:", error);
    }
  };

  // ✅ FIXED: Get today's appointments based on current date
  const getTodaysAppointments = () => {
    const today = new Date().toISOString().split('T')[0];
    console.log("📅 Getting appointments for date:", today);
    console.log("Total appointments:", appointments.length);
    
    const todaysApps = appointments.filter(apt => {
      const aptDate = apt.date ? apt.date.split('T')[0] : apt.date;
      return aptDate === today;
    });
    
    console.log(`✅ Found ${todaysApps.length} appointments for ${today}`);
    return todaysApps;
  };

  // ==================== PATIENT FUNCTIONS ====================
  const addPatient = async (patient) => {
    try {
      const response = await fetch('http://localhost:8001/api/patients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(patient)
      });
      const data = await response.json();
      if (data.success) {
        fetchPatients(); // Refresh data
        return data.data;
      }
    } catch (error) {
      console.error("Error adding patient:", error);
    }
  };

  const updatePatient = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8001/api/patients/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        fetchPatients();
      }
    } catch (error) {
      console.error("Error updating patient:", error);
    }
  };

  const deletePatient = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/api/patients/${id}`, {
        method: 'DELETE'
      });
      if (response.ok) {
        fetchPatients();
      }
    } catch (error) {
      console.error("Error deleting patient:", error);
    }
  };

  const searchPatients = (query) => {
    if (!query) return [];
    return patients.filter(p =>
      p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
      p.phone?.includes(query) ||
      p.email?.toLowerCase().includes(query.toLowerCase())
    );
  };

  const getPatientById = (id) => {
    return patients.find(p => p.id === id);
  };

  // ==================== ADMISSION FUNCTIONS ====================
  const addAdmission = async (admission) => {
    try {
      const response = await fetch('http://localhost:8001/api/admitpatient', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(admission)
      });
      const data = await response.json();
      if (data.success) {
        fetchAdmissions(); // Refresh data
        return data.data;
      }
    } catch (error) {
      console.error("Error adding admission:", error);
    }
  };

  const updateAdmission = async (id, updatedData) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admitpatient/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData)
      });
      if (response.ok) {
        fetchAdmissions();
      }
    } catch (error) {
      console.error("Error updating admission:", error);
    }
  };

  const dischargePatient = async (id) => {
    try {
      const response = await fetch(`http://localhost:8001/api/admitpatient/${id}/discharge`, {
        method: 'PATCH'
      });
      if (response.ok) {
        fetchAdmissions();
      }
    } catch (error) {
      console.error("Error discharging patient:", error);
    }
  };

  const getAvailableBeds = () => {
    const occupied = admissions.filter(adm => adm.status === "Admitted").map(adm => adm.bedNo);
    return availableBeds.filter(bed => !occupied.includes(bed));
  };

  const getAdmittedPatients = () => {
    return admissions.filter(adm => adm.status === "Admitted");
  };

  // ==================== CLICK HANDLERS FOR STATS ====================
  const handleStatClick = (type) => {
    switch(type) {
      case 'appointments':
        navigate("/receptionist-dashboard/appointment");
        break;
      case 'today':
        // Pass today's date as state to filter in Appointment component
        navigate("/receptionist-dashboard/appointment", { 
          state: { filter: 'today', date: new Date().toISOString().split('T')[0] } 
        });
        break;
      case 'patients':
        navigate("/receptionist-dashboard/Patientlist");
        break;
      case 'admitted':
        navigate("/receptionist-dashboard/admitlist");
        break;
      default:
        break;
    }
  };

  // ==================== POPUP HANDLERS ====================
  const openPopup = (type) => {
    setPopupType(type);
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
    setPopupType("");
  };

  // ==================== DYNAMIC STATISTICS ====================
  const stats = [
    { 
      label: "Total Appointments", 
      value: appointments?.length || 0, 
      icon: "📅", 
      color: "#1976d2",
      type: "appointments",
      description: "Click to view all appointments"
    },
    { 
      label: "Today's Appointments", 
      value: getTodaysAppointments().length, 
      icon: "🗓️", 
      color: "#388e3c",
      type: "today",
      description: `Click to view today's appointments (${new Date().toLocaleDateString('en-IN')})`
    },
    { 
      label: "Registered Patients", 
      value: patients?.length || 0, 
      icon: "👥", 
      color: "#f57c00",
      type: "patients",
      description: "Click to view all patients"
    },
    { 
      label: "Admitted Patients", 
      value: getAdmittedPatients().length, 
      icon: "🛏️", 
      color: "#d32f2f",
      type: "admitted",
      description: "Click to view admitted patients"
    },
  ];

  // Recent activities
  const recentActivities = [
    ...(appointments?.slice(-3).map(apt => ({
      time: `${apt.date} ${apt.time}`,
      activity: `Appointment booked for ${apt.patientName}`,
      type: "appointment"
    })) || []),
    ...(patients?.slice(-3).map(pat => ({
      time: `${pat.registeredDate} ${pat.registeredTime}`,
      activity: `New patient registered: ${pat.patientName}`,
      type: "registration"
    })) || []),
    ...(admissions?.slice(-3).map(adm => ({
      time: `${adm.admissionDate} ${adm.admissionTime}`,
      activity: `Patient admitted: ${adm.patientName} (Bed ${adm.bedNo})`,
      type: "admission"
    })) || [])
  ].sort((a, b) => b.time.localeCompare(a.time)).slice(0, 5);

  return (
    <div className="dashboard-home">
      {/* ==================== PAGE HEADER ==================== */}
      <div className="dashboard-header">
        <h1 style={{color:"white"}}>Welcome to Reception Dashboard</h1>
        <p className="subtitle" style={{color:"white"}}>
          {new Date().toLocaleDateString("en-US", {
            weekday: "long", year: "numeric", month: "long", day: "numeric",
          })}
        </p>
      </div>

      {/* ==================== CLICKABLE STATISTICS CARDS ==================== */}
      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div 
            key={index} 
            className="stat-card clickable-stat"
            style={{ 
              borderLeft: `4px solid ${stat.color}`,
              cursor: "pointer",
              transition: "all 0.2s ease"
            }}
            onClick={() => handleStatClick(stat.type)}
            title={stat.description}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = "translateY(-4px)";
              e.currentTarget.style.boxShadow = "0 6px 12px rgba(0,0,0,0.15)";
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            <div className="stat-icon">{stat.icon}</div>
            <div className="stat-info">
              <h3>{stat.value}</h3>
              <p>{stat.label}</p>
              {stat.type === 'today' && (
                <small style={{ fontSize: "10px", color: "#666", display: "block" }}>
                  {new Date().toLocaleDateString('en-IN')}
                </small>
              )}
              <small style={{ fontSize: "11px", color: stat.color, marginTop: "4px", display: "block" }}>
                Click to view →
              </small>
            </div>
          </div>
        ))}
      </div>

      {/* ==================== QUICK ACTIONS ==================== */}
      <div className="quick-actions-section">
        <h2>Quick Actions</h2>
        <div className="action-buttons">
          <button className="action-btn" onClick={() => openPopup("appointment")}>
            <span className="action-icon">📅</span>
            <span>Book Appointment</span>
          </button>
          <button className="action-btn" onClick={() => openPopup("patient")}>
            <span className="action-icon">➕</span>
            <span>Add New Patient</span>
          </button>
          <button className="action-btn" onClick={() => openPopup("admit")}>
            <span className="action-icon">🏥</span>
            <span>Admit Patient</span>
          </button>
          <button className="action-btn" onClick={() => navigate("/receptionist-dashboard/BedView")}>
            <span className="action-icon">🛏️</span>
            <span>Available Beds</span>
          </button>
        </div>
        <div className="action-buttons">
          <button
            className="action-btn"
            onClick={() => navigate("/receptionist-dashboard/appointment")}
          >
            <span className="action-icon">📋</span>
            <span>Appointment List</span>
          </button>

          <button
            className="action-btn"
            onClick={() => navigate("/receptionist-dashboard/Patientlist")}
          >
            <span className="action-icon">👥</span>
            <span>All Patient List</span>
          </button>

          <button
            className="action-btn"
            onClick={() => navigate("/receptionist-dashboard/admitlist")}
          >
            <span className="action-icon">🛏️</span>
            <span>Admitted List</span>
          </button>

          <button
            className="action-btn"
            onClick={() => navigate("/receptionist-dashboard/laboratory")}
          >
            <span className="action-icon">🔬</span>
            <span>Laboratory</span>
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

      {/* ==================== FORMS ==================== */}
      {showPopup && popupType === "appointment" && (
        <AppointmentForm
          onClose={closePopup}
          addAppointment={addAppointment}
          appointments={appointments}
        />
      )}

      {showPopup && popupType === "patient" && (
        <PatientRegistrationForm
          onClose={closePopup}
          addPatient={addPatient}
          patients={patients}
        />
      )}

      {showPopup && popupType === "admit" && (
        <AdmitPatientForm
          onClose={closePopup}
          addAdmission={addAdmission}
          searchPatients={searchPatients}
          getAvailableBeds={getAvailableBeds}
          availableBeds={availableBeds}
        />
      )}
    </div>
  );
}

export default DashboardHome;