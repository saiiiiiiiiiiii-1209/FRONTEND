// import React, { useState, useEffect, useCallback, useRef } from "react";
// import { useNavigate, Outlet, NavLink } from "react-router-dom";
// import "./ReceptionistDashboard.css";

// function ReceptionistDashboard() {
//   const [admissions, setAdmissions] = useState([]);
//   const [patients, setPatients] = useState([]);
//   const initialLoadDone = useRef(false); // Prevent multiple initial loads

//   const navigate = useNavigate();

//   // Log admissions whenever they change
//   useEffect(() => {
//     console.log("🏥 ReceptionistDashboard admissions updated:", admissions);
//   }, [admissions]);

//   // Safe initial data loading (runs only once)
//   useEffect(() => {
//     if (initialLoadDone.current) return;
//     initialLoadDone.current = true;

//     // Example: load patients from localStorage (if any)
//     try {
//       const storedPatients = localStorage.getItem('patients');
//       if (storedPatients) {
//         setPatients(JSON.parse(storedPatients));
//       }
//     } catch (error) {
//       console.error("Failed to load patients:", error);
//     }

//     // Example: load admissions from localStorage (if any) – merge, don't replace
//     try {
//       const storedAdmissions = localStorage.getItem('admissions');
//       if (storedAdmissions) {
//         const parsed = JSON.parse(storedAdmissions);
//         setAdmissions(prev => {
//           // Merge, avoiding duplicates (optional)
//           const merged = [...prev, ...parsed];
//           // Remove duplicates by id if needed
//           return merged;
//         });
//       }
//     } catch (error) {
//       console.error("Failed to load admissions:", error);
//     }
//   }, []); // Empty dependency = runs once on mount

//   // Optional: persist admissions to localStorage whenever they change
//   useEffect(() => {
//     if (admissions.length > 0) {
//       localStorage.setItem('admissions', JSON.stringify(admissions));
//     }
//   }, [admissions]);

//   const addAdmission = useCallback((newAdmission) => {
//     console.log("➕ Adding admission (before state update):", newAdmission);
//     setAdmissions(prev => {
//       const updated = [...prev, { ...newAdmission, id: Date.now() }];
//       console.log("✅ Updated admissions array:", updated);
//       return updated;
//     });
//   }, []);

//   const getAvailableBeds = useCallback(() => {
//     const totalBeds = 20;
//     const isActive = (admission) => {
//       if (!admission.toDate) return true;
//       const today = new Date();
//       today.setHours(0, 0, 0, 0);
//       const discharge = new Date(admission.toDate);
//       discharge.setHours(0, 0, 0, 0);
//       return discharge >= today;
//     };
//     const occupiedBeds = admissions.filter(isActive).map(adm => adm.bedNo);
//     const allBeds = Array.from({ length: totalBeds }, (_, i) => `B${i + 1}`);
//     return allBeds.filter(bed => !occupiedBeds.includes(bed));
//   }, [admissions]);

//   const searchPatients = useCallback((query) => {
//     return patients.filter(p =>
//       p.patientName.toLowerCase().includes(query.toLowerCase())
//     );
//   }, [patients]);

//   const handleLogout = () => {
//     localStorage.removeItem('user');
//     sessionStorage.clear();
//     navigate("/");
//   };

//   // Sidebar menu items
//   const mainMenuItems = [
//     { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/receptionist-dashboard" },
//     { id: "appointments", label: "Appointments", icon: "📅", path: "/receptionist-dashboard/appointment" },
//     { id: "patients", label: "Patients", icon: "👥", path: "/receptionist-dashboard/patientlist" },
//     { id: "admit-patient", label: "Admit Patient", icon: "🛏️", path: "/receptionist-dashboard/admitlist" },
//     { id: "bedview", label: "Bed View", icon: "📊", path: "/receptionist-dashboard/bedview" },
    
//     { id: "laboratory", label: "Laboratory", icon: "🔬", path: "/receptionist-dashboard/laboratory" },
   
//   ];

//   return (
//     <div className="reception-container">
//       {/* Sidebar */}
//       <div className="sidebar">
//         <div className="sidebar-header">
//           <div className="logo-container">
//             <span className="hospital-logo">🏥</span>
//             <div className="header-text">
//               <h2>Clinic Dashboard</h2>
//               <p className="user-role">RECEPTIONIST</p>
//             </div>
//           </div>
//         </div>

//         <div className="sidebar-nav">
//           {/* MAIN Section */}
//           <div className="menu-section">
//             <label className="menu-section-label">MAIN</label>
//             <ul className="sidebar-menu">
//               {mainMenuItems.map((item) => (
//                 <li key={item.id}>
//                   <NavLink
//                     to={item.path}
//                     className={({ isActive }) => isActive ? "active" : ""}
//                     end={item.path === "/receptionist-dashboard"}
//                   >
//                     <span className="menu-icon">{item.icon}</span>
//                     <span className="menu-label">{item.label}</span>
//                   </NavLink>
//                 </li>
//               ))}
//             </ul>
//           </div>

//           {/* Logout Button */}
//           <div className="logout-container">
//             <button className="logout-btn" onClick={handleLogout}>
//               <span className="menu-icon">🚪</span>
//               <span className="menu-label">Logout</span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* Main content with context */}
//       <div className="main-content">
//         <Outlet
//           context={{ admissions, addAdmission, getAvailableBeds, patients, searchPatients }}
//         />
//       </div>
//     </div>
//   );
// }

// export default ReceptionistDashboard;


import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, Outlet, NavLink } from "react-router-dom";
import "./ReceptionistDashboard.css";

function ReceptionistDashboard() {
  const [admissions, setAdmissions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const initialLoadDone = useRef(false);
  const navigate = useNavigate();

  // Real-time data fetching function
  const fetchData = useCallback(() => {
    try {
      // Load patients
      const storedPatients = localStorage.getItem('patients');
      if (storedPatients) {
        const parsedPatients = JSON.parse(storedPatients);
        setPatients(parsedPatients);
        console.log("📋 Patients loaded:", parsedPatients.length);
      }

      // Load admissions
      const storedAdmissions = localStorage.getItem('admissions');
      if (storedAdmissions) {
        const parsedAdmissions = JSON.parse(storedAdmissions);
        setAdmissions(parsedAdmissions);
        console.log("🏥 Admissions loaded:", parsedAdmissions.length);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    if (initialLoadDone.current) return;
    initialLoadDone.current = true;
    fetchData();
  }, [fetchData]);

  // Listen for storage events (when data changes in another tab)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'patients' || e.key === 'admissions') {
        console.log(`🔄 Storage changed: ${e.key}`);
        fetchData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchData]);

  // Custom event listener for same-tab updates
  useEffect(() => {
    const handleDataUpdate = (e) => {
      console.log(`🔄 Data updated: ${e.detail.type}`);
      fetchData();
    };

    window.addEventListener('dataUpdate', handleDataUpdate);
    return () => window.removeEventListener('dataUpdate', handleDataUpdate);
  }, [fetchData]);

  // Trigger data update
  const triggerDataUpdate = useCallback((type) => {
    const event = new CustomEvent('dataUpdate', { 
      detail: { type, timestamp: Date.now() } 
    });
    window.dispatchEvent(event);
  }, []);

  const addAdmission = useCallback((newAdmission) => {
    console.log("➕ Adding admission:", newAdmission);
    
    // Get current admissions
    const currentAdmissions = JSON.parse(localStorage.getItem('admissions') || '[]');
    
    // Add new admission with unique ID
    const admissionWithId = { 
      ...newAdmission, 
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const updatedAdmissions = [...currentAdmissions, admissionWithId];
    
    // Save to localStorage
    localStorage.setItem('admissions', JSON.stringify(updatedAdmissions));
    
    // Update state
    setAdmissions(updatedAdmissions);
    
    // Trigger update event
    triggerDataUpdate('admissions');
    
    console.log("✅ Admission added, total:", updatedAdmissions.length);
    return admissionWithId;
  }, [triggerDataUpdate]);

  const updateAdmission = useCallback((id, updatedData) => {
    console.log("✏️ Updating admission:", id);
    
    const currentAdmissions = JSON.parse(localStorage.getItem('admissions') || '[]');
    const updatedAdmissions = currentAdmissions.map(adm => 
      adm.id === id ? { ...adm, ...updatedData } : adm
    );
    
    localStorage.setItem('admissions', JSON.stringify(updatedAdmissions));
    setAdmissions(updatedAdmissions);
    triggerDataUpdate('admissions');
  }, [triggerDataUpdate]);

  const deleteAdmission = useCallback((id) => {
    console.log("🗑️ Deleting admission:", id);
    
    const currentAdmissions = JSON.parse(localStorage.getItem('admissions') || '[]');
    const updatedAdmissions = currentAdmissions.filter(adm => adm.id !== id);
    
    localStorage.setItem('admissions', JSON.stringify(updatedAdmissions));
    setAdmissions(updatedAdmissions);
    triggerDataUpdate('admissions');
  }, [triggerDataUpdate]);

  const addPatient = useCallback((newPatient) => {
    console.log("➕ Adding patient:", newPatient);
    
    const currentPatients = JSON.parse(localStorage.getItem('patients') || '[]');
    const patientWithId = { 
      ...newPatient, 
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    
    const updatedPatients = [...currentPatients, patientWithId];
    
    localStorage.setItem('patients', JSON.stringify(updatedPatients));
    setPatients(updatedPatients);
    triggerDataUpdate('patients');
    
    console.log("✅ Patient added, total:", updatedPatients.length);
    return patientWithId;
  }, [triggerDataUpdate]);

  const getAvailableBeds = useCallback(() => {
    const totalBeds = 20;
    const isActive = (admission) => {
      if (!admission.toDate) return true;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const discharge = new Date(admission.toDate);
      discharge.setHours(0, 0, 0, 0);
      return discharge >= today;
    };
    
    const occupiedBeds = admissions.filter(isActive).map(adm => adm.bedNo);
    const allBeds = Array.from({ length: totalBeds }, (_, i) => `B${i + 1}`);
    const available = allBeds.filter(bed => !occupiedBeds.includes(bed));
    
    console.log("🛏️ Available beds:", available);
    return available;
  }, [admissions]);

  const searchPatients = useCallback((query) => {
    if (!query) return patients;
    return patients.filter(p =>
      p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
      p.phone?.includes(query) ||
      p.email?.toLowerCase().includes(query.toLowerCase())
    );
  }, [patients]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    sessionStorage.clear();
    navigate("/");
  };

  // Log state changes
  useEffect(() => {
    console.log("📊 Current state:", {
      patients: patients.length,
      admissions: admissions.length,
      availableBeds: getAvailableBeds().length
    });
  }, [patients, admissions, getAvailableBeds]);

  const mainMenuItems = [
    { id: "dashboard", label: "Dashboard", icon: "🏠", path: "/receptionist-dashboard" },
    { id: "appointments", label: "Appointments", icon: "📅", path: "/receptionist-dashboard/appointment" },
    { id: "patients", label: "Patients", icon: "👥", path: "/receptionist-dashboard/patientlist" },
    { id: "admit-patient", label: "Admit Patient", icon: "🛏️", path: "/receptionist-dashboard/admitlist" },
    { id: "bedview", label: "Bed View", icon: "📊", path: "/receptionist-dashboard/bedview" },
    { id: "laboratory", label: "Laboratory", icon: "🔬", path: "/receptionist-dashboard/laboratory" },
  ];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading...</div>
      </div>
    );
  }

  return (
    <div className="reception-container">
      <div className="sidebar">
        <div className="sidebar-header">
          <div className="logo-container">
            <span className="hospital-logo">🏥</span>
            <div className="header-text">
              <h2>Clinic Dashboard</h2>
              <p className="user-role">RECEPTIONIST</p>
            </div>
          </div>
        </div>

        <div className="sidebar-nav">
          <div className="menu-section">
            <label className="menu-section-label">MAIN</label>
            <ul className="sidebar-menu">
              {mainMenuItems.map((item) => (
                <li key={item.id}>
                  <NavLink
                    to={item.path}
                    className={({ isActive }) => isActive ? "active" : ""}
                    end={item.path === "/receptionist-dashboard"}
                    onClick={() => fetchData()} // Refresh data on navigation
                  >
                    <span className="menu-icon">{item.icon}</span>
                    <span className="menu-label">{item.label}</span>
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="logout-container">
            <button className="logout-btn" onClick={handleLogout}>
              <span className="menu-icon">🚪</span>
              <span className="menu-label">Logout</span>
            </button>
          </div>
        </div>
      </div>

      <div className="main-content">
        <Outlet
          context={{ 
            admissions, 
            addAdmission,
            updateAdmission,
            deleteAdmission,
            addPatient,
            getAvailableBeds, 
            patients, 
            searchPatients,
            refreshData: fetchData // Expose refresh function
          }}
        />
      </div>
    </div>
  );
}

export default ReceptionistDashboard;