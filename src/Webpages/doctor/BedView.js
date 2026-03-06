// // import React, { useState, useEffect } from 'react';
// // import axios from 'axios';
// // import { useNavigate, useLocation } from 'react-router-dom';
// // import './BedView.css';

// // const BedView = () => {
// //     const [beds, setBeds] = useState([]);
// //     const [loading, setLoading] = useState(true);
// //     const [error, setError] = useState('');
// //     const [filter, setFilter] = useState('All');
// //     const [hoveredBed, setHoveredBed] = useState(null);
// //     const [admissions, setAdmissions] = useState([]);
    
// //     const navigate = useNavigate();
// //     const location = useLocation();

// //     const BEDS_API = 'http://localhost:8005/api/beds';
// //     const ADMISSIONS_API = 'http://localhost:8001/api/admitpatient';

// //     useEffect(() => {
// //         fetchBeds();
// //         fetchAdmissions();
        
// //         // Refresh every 10 seconds
// //         const interval = setInterval(() => {
// //             fetchBeds();
// //             fetchAdmissions();
// //         }, 10000);
        
// //         return () => clearInterval(interval);
// //     }, []);

// //     // Refresh when returning from admission
// //     useEffect(() => {
// //         if (location.state?.refresh) {
// //             fetchBeds();
// //             fetchAdmissions();
// //             window.history.replaceState({}, document.title);
// //         }
// //     }, [location.state]);

// //     const fetchBeds = async () => {
// //         try {
// //             const response = await axios.get(BEDS_API);
// //             const bedsData = response.data.success ? response.data.data : response.data;
            
// //             const sortedBeds = bedsData.sort((a, b) => {
// //                 const numA = parseInt(a.bedNumber.replace(/[^0-9]/g, '')) || 0;
// //                 const numB = parseInt(b.bedNumber.replace(/[^0-9]/g, '')) || 0;
// //                 return numA - numB;
// //             });
            
// //             setBeds(sortedBeds);
// //             setError('');
// //         } catch (err) {
// //             console.error('Fetch error:', err);
// //             setError('Failed to fetch beds');
// //         } finally {
// //             setLoading(false);
// //         }
// //     };

// //     const fetchAdmissions = async () => {
// //         try {
// //             const response = await axios.get(ADMISSIONS_API);
// //             if (response.data.success) {
// //                 setAdmissions(response.data.data);
// //                 console.log('✅ Admissions loaded:', response.data.data.length);
                
// //                 // After fetching admissions, sync bed statuses
// //                 syncBedStatusWithAdmissions(response.data.data);
// //             }
// //         } catch (err) {
// //             console.error('Error fetching admissions:', err);
// //         }
// //     };

// //     // NEW FUNCTION: Sync bed status with admissions
// //     const syncBedStatusWithAdmissions = async (admissionsData) => {
// //         try {
// //             // Get all beds
// //             const bedsResponse = await axios.get(BEDS_API);
// //             const bedsData = bedsResponse.data.success ? bedsResponse.data.data : bedsResponse.data;
            
// //             // Get all occupied beds from admissions
// //             const occupiedBedNumbers = admissionsData
// //                 .filter(adm => adm.status === "Admitted")
// //                 .map(adm => adm.bedNo);
            
// //             // Update each bed's status if needed
// //             for (const bed of bedsData) {
// //                 const shouldBeOccupied = occupiedBedNumbers.includes(bed.bedNumber);
// //                 const currentStatus = bed.status;
                
// //                 if (shouldBeOccupied && currentStatus !== 'Occupied') {
// //                     // Bed should be Occupied but isn't - update it
// //                     console.log(`🔄 Syncing bed ${bed.bedNumber} from ${currentStatus} to Occupied`);
// //                     await axios.put(`${BEDS_API}/${bed._id}`, {
// //                         bedNumber: bed.bedNumber,
// //                         status: 'Occupied'
// //                     });
// //                 } else if (!shouldBeOccupied && currentStatus === 'Occupied') {
// //                     // Bed should be Available but is Occupied - update it
// //                     console.log(`🔄 Syncing bed ${bed.bedNumber} from Occupied to Available`);
// //                     await axios.put(`${BEDS_API}/${bed._id}`, {
// //                         bedNumber: bed.bedNumber,
// //                         status: 'Available'
// //                     });
// //                 }
// //             }
            
// //             // Refresh beds after syncing
// //             fetchBeds();
// //         } catch (err) {
// //             console.error('Error syncing bed status:', err);
// //         }
// //     };

// //     const getPatientForBed = (bedNumber) => {
// //         const admission = admissions.find(adm => 
// //             adm.bedNo === bedNumber && adm.status === "Admitted"
// //         );
        
// //         if (admission) {
// //             return {
// //                 name: admission.patientName,
// //                 gender: admission.gender,
// //                 admitted: admission.fromDate || admission.admissionDate,
// //                 phone: admission.phone,
// //                 symptoms: admission.symptoms || [],
// //                 doctor: admission.admittingDoctor,
// //                 kinName: admission.nameOfKin,
// //                 kinPhone: admission.kinContact,
// //                 admissionId: admission.id || admission._id
// //             };
// //         }
// //         return null;
// //     };

// //     const handleAdmitClick = (bed) => {
// //         navigate('/receptionist-dashboard/admit-patient', {
// //             state: {
// //                 selectedBed: bed,
// //                 fromBedView: true
// //             }
// //         });
// //     };

// //     const handleDischargeClick = async (bed) => {
// //         if (window.confirm(`Discharge patient from bed ${bed.bedNumber}?`)) {
// //             try {
// //                 const admission = admissions.find(adm => 
// //                     adm.bedNo === bed.bedNumber && adm.status === "Admitted"
// //                 );
                
// //                 if (admission) {
// //                     setLoading(true);
                    
// //                     // 1. Update admission status to Discharged
// //                     await axios.put(`${ADMISSIONS_API}/${admission.id || admission._id}`, {
// //                         ...admission,
// //                         status: "Discharged",
// //                         dischargeDate: new Date().toISOString().split('T')[0]
// //                     });
                    
// //                     // 2. Update bed status to Available in bed management system
// //                     await axios.put(`${BEDS_API}/${bed._id}`, {
// //                         bedNumber: bed.bedNumber,
// //                         status: 'Available'
// //                     });
                    
// //                     // 3. Refresh both data sources
// //                     await fetchAdmissions();
// //                     await fetchBeds();
                    
// //                     alert(`✅ Patient discharged from bed ${bed.bedNumber}`);
// //                 }
// //             } catch (err) {
// //                 console.error('Discharge error:', err);
// //                 alert('Failed to discharge patient');
// //             } finally {
// //                 setLoading(false);
// //             }
// //         }
// //     };

// //     const filteredBeds = filter === 'All' 
// //         ? beds 
// //         : beds.filter(bed => bed.status === filter);

// //     const stats = {
// //         total: beds.length,
// //         available: beds.filter(b => b.status === 'Available').length,
// //         occupied: beds.filter(b => b.status === 'Occupied').length,
// //         maintenance: beds.filter(b => b.status === 'Maintenance').length,
// //         reserved: beds.filter(b => b.status === 'Reserved').length
// //     };

// //     if (loading) return (
// //         <div className="bedview-loading">
// //             <div className="loading-spinner"></div>
// //             <p>Loading beds...</p>
// //         </div>
// //     );

// //     return (
// //         <div className="bedview-container">
// //             <div className="bedview-header">
// //                 <h2>🛏️ Bed Availability</h2>
// //                 <div className="bedview-stats">
// //                     <span>Total: {stats.total}</span>
// //                     <span className="stat-available">✅ Available: {stats.available}</span>
// //                     <span className="stat-occupied">👤 Occupied: {stats.occupied}</span>
// //                     <span className="stat-maintenance">🔧 Maintenance: {stats.maintenance}</span>
// //                 </div>
// //             </div>

// //             <div className="bedview-filters">
// //                 <button 
// //                     className={filter === 'All' ? 'active' : ''} 
// //                     onClick={() => setFilter('All')}
// //                 >
// //                     All ({stats.total})
// //                 </button>
// //                 <button 
// //                     className={filter === 'Available' ? 'active' : ''} 
// //                     onClick={() => setFilter('Available')}
// //                 >
// //                     ✅ Available ({stats.available})
// //                 </button>
// //                 <button 
// //                     className={filter === 'Occupied' ? 'active' : ''} 
// //                     onClick={() => setFilter('Occupied')}
// //                 >
// //                     👤 Occupied ({stats.occupied})
// //                 </button>
// //                 <button 
// //                     className={filter === 'Maintenance' ? 'active' : ''} 
// //                     onClick={() => setFilter('Maintenance')}
// //                 >
// //                     🔧 Maintenance ({stats.maintenance})
// //                 </button>
                
// //                 {/* Manual Sync Button */}
// //                 <button 
// //                     onClick={() => fetchAdmissions()}
// //                     style={{
// //                         padding: '8px 16px',
// //                         background: '#2196f3',
// //                         color: 'white',
// //                         border: 'none',
// //                         borderRadius: '4px',
// //                         cursor: 'pointer',
// //                         marginLeft: '10px'
// //                     }}
// //                 >
// //                     🔄 Sync Now
// //                 </button>
// //             </div>

// //             <div className="bedview-grid">
// //                 {filteredBeds.length === 0 ? (
// //                     <div className="no-beds">
// //                         <p>No beds found. Add beds from admin panel first.</p>
// //                     </div>
// //                 ) : (
// //                     filteredBeds.map((bed) => {
// //                         const patient = getPatientForBed(bed.bedNumber);
// //                         const isHovered = hoveredBed === bed._id;
                        
// //                         return (
// //                             <div 
// //                                 key={bed._id} 
// //                                 className={`bed-card ${bed.status.toLowerCase()} ${isHovered ? 'hovered' : ''}`}
// //                                 onMouseEnter={() => setHoveredBed(bed._id)}
// //                                 onMouseLeave={() => setHoveredBed(null)}
// //                             >
// //                                 <div className="bed-card-inner">
// //                                     <div className="bed-card-front">
// //                                         <div className="bed-header">
// //                                             <span className="bed-number">{bed.bedNumber}</span>
// //                                             <span className={`bed-status ${bed.status.toLowerCase()}`}>
// //                                                 {bed.status === 'Available' && '✅ '}
// //                                                 {bed.status === 'Occupied' && '👤 '}
// //                                                 {bed.status === 'Maintenance' && '🔧 '}
// //                                                 {bed.status}
// //                                             </span>
// //                                         </div>
                                        
// //                                         {bed.status === 'Available' && (
// //                                             <div className="empty-bed">
// //                                                 <span className="empty-icon">🛏️</span>
// //                                                 <p>Bed Available</p>
// //                                                 <small>Ready for admission</small>
// //                                             </div>
// //                                         )}
                                        
// //                                         {bed.status === 'Occupied' && patient && (
// //                                             <div className="patient-info">
// //                                                 <div className="patient-name">{patient.name}</div>
// //                                                 <div className="patient-details">
// //                                                     <span>👤 {patient.gender}</span>
// //                                                     <span>📅 {patient.admitted}</span>
// //                                                     <span>📞 {patient.phone}</span>
// //                                                 </div>
// //                                                 {patient.symptoms.length > 0 && (
// //                                                     <div className="patient-symptoms">
// //                                                         <strong>Symptoms:</strong>
// //                                                         <ul>
// //                                                             {patient.symptoms.map((symptom, i) => (
// //                                                                 <li key={i}>• {symptom}</li>
// //                                                             ))}
// //                                                         </ul>
// //                                                     </div>
// //                                                 )}
// //                                                 {patient.doctor && (
// //                                                     <div className="patient-doctor">
// //                                                         👨‍⚕️ Dr. {patient.doctor}
// //                                                     </div>
// //                                                 )}
// //                                             </div>
// //                                         )}
                                        
// //                                         {bed.status === 'Maintenance' && (
// //                                             <div className="maintenance-info">
// //                                                 <span className="maintenance-icon">🔧</span>
// //                                                 <p>Under Maintenance</p>
// //                                             </div>
// //                                         )}
// //                                     </div>

// //                                     <div className="bed-card-back">
// //                                         <div className="back-header">
// //                                             <span className="back-bed">{bed.bedNumber}</span>
// //                                             {bed.status === 'Occupied' && patient && (
// //                                                 <button 
// //                                                     className="discharge-btn"
// //                                                     onClick={() => handleDischargeClick(bed)}
// //                                                     disabled={loading}
// //                                                 >
// //                                                     {loading ? '⏳...' : 'Discharge'}
// //                                                 </button>
// //                                             )}
// //                                             {bed.status === 'Available' && (
// //                                                 <button 
// //                                                     className="admit-btn"
// //                                                     onClick={() => handleAdmitClick(bed)}
// //                                                 >
// //                                                     Admit
// //                                                 </button>
// //                                             )}
// //                                         </div>
                                        
// //                                         <div className="back-details">
// //                                             <p><strong>Status:</strong> {bed.status}</p>
// //                                             {bed.status === 'Occupied' && patient && (
// //                                                 <>
// //                                                     <p><strong>Patient:</strong> {patient.name}</p>
// //                                                     <p><strong>Gender:</strong> {patient.gender}</p>
// //                                                     <p><strong>Admitted:</strong> {patient.admitted}</p>
// //                                                     <p><strong>Phone:</strong> {patient.phone}</p>
// //                                                     {patient.doctor && (
// //                                                         <p><strong>Doctor:</strong> Dr. {patient.doctor}</p>
// //                                                     )}
// //                                                     {patient.kinName && (
// //                                                         <p><strong>Emergency:</strong> {patient.kinName} ({patient.kinPhone})</p>
// //                                                     )}
// //                                                     {patient.symptoms.length > 0 && (
// //                                                         <div className="back-symptoms">
// //                                                             <strong>Symptoms:</strong>
// //                                                             <ul>
// //                                                                 {patient.symptoms.map((symptom, i) => (
// //                                                                     <li key={i}>• {symptom}</li>
// //                                                                 ))}
// //                                                             </ul>
// //                                                         </div>
// //                                                     )}
// //                                                 </>
// //                                             )}
// //                                             {bed.status === 'Available' && (
// //                                                 <p className="back-message">Ready for admission</p>
// //                                             )}
// //                                             {bed.status === 'Maintenance' && (
// //                                                 <p className="back-message">Under maintenance</p>
// //                                             )}
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         );
// //                     })
// //                 )}
// //             </div>
            
// //             <div className="sync-info" style={{
// //                 marginTop: '20px',
// //                 padding: '10px',
// //                 background: '#e3f2fd',
// //                 borderRadius: '4px',
// //                 fontSize: '12px',
// //                 textAlign: 'center',
// //                 color: '#0d47a1'
// //             }}>
// //                 Auto-syncing bed status every 10 seconds | Click "Sync Now" for manual sync
// //             </div>
// //         </div>
// //     );
// // };

// // export default BedView;
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
// import { useNavigate, useLocation } from 'react-router-dom';
// import './BedView.css';

// const BedView = () => {
//     const [beds, setBeds] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState('');
//     const [filter, setFilter] = useState('All');
//     const [hoveredBed, setHoveredBed] = useState(null);
//     const [admissions, setAdmissions] = useState([]);
//     const [syncing, setSyncing] = useState(false);
    
//     const navigate = useNavigate();
//     const location = useLocation();

//     const BEDS_API = 'http://localhost:8005/api/beds';
//     const ADMISSIONS_API = 'http://localhost:8001/api/admitpatient';

//     useEffect(() => {
//         fetchBeds();
//         fetchAdmissions();
        
//         // Refresh every 5 seconds for real-time updates
//         const interval = setInterval(() => {
//             fetchBeds();
//             fetchAdmissions();
//         }, 5000);
        
//         return () => clearInterval(interval);
//     }, []);

//     // Refresh when returning from admission
//     useEffect(() => {
//         if (location.state?.refresh) {
//             fetchBeds();
//             fetchAdmissions();
//             window.history.replaceState({}, document.title);
//         }
//     }, [location.state]);

//     const fetchBeds = async () => {
//         try {
//             const response = await axios.get(BEDS_API);
//             const bedsData = response.data.success ? response.data.data : response.data;
            
//             const sortedBeds = bedsData.sort((a, b) => {
//                 const numA = parseInt(a.bedNumber.replace(/[^0-9]/g, '')) || 0;
//                 const numB = parseInt(b.bedNumber.replace(/[^0-9]/g, '')) || 0;
//                 return numA - numB;
//             });
            
//             setBeds(sortedBeds);
//             setError('');
//         } catch (err) {
//             console.error('Fetch error:', err);
//             setError('Failed to fetch beds');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const fetchAdmissions = async () => {
//         try {
//             const response = await axios.get(ADMISSIONS_API);
//             if (response.data.success) {
//                 setAdmissions(response.data.data);
//                 console.log('✅ Admissions loaded:', response.data.data.length);
//             }
//         } catch (err) {
//             console.error('Error fetching admissions:', err);
//         }
//     };

//     // ========== FIXED: Manual sync function ==========
//     const syncBedStatus = async () => {
//         setSyncing(true);
//         try {
//             // Get all beds
//             const bedsResponse = await axios.get(BEDS_API);
//             const bedsData = bedsResponse.data.success ? bedsResponse.data.data : bedsResponse.data;
            
//             // Get all admitted patients
//             const admittedPatients = admissions.filter(adm => adm.status === "Admitted");
            
//             let updatedCount = 0;
            
//             // For each bed, check if it should be Occupied or Available
//             for (const bed of bedsData) {
//                 const isOccupied = admittedPatients.some(adm => adm.bedNo === bed.bedNumber);
//                 const correctStatus = isOccupied ? 'Occupied' : 'Available';
                
//                 // If current status doesn't match correct status, update it
//                 if (bed.status !== correctStatus && bed.status !== 'Maintenance' && bed.status !== 'Reserved') {
//                     console.log(`🔄 Syncing bed ${bed.bedNumber} from ${bed.status} to ${correctStatus}`);
                    
//                     await axios.put(`${BEDS_API}/${bed._id}`, {
//                         bedNumber: bed.bedNumber,
//                         status: correctStatus
//                     });
                    
//                     updatedCount++;
//                 }
//             }
            
//             // Refresh beds after syncing
//             await fetchBeds();
            
//             if (updatedCount > 0) {
//                 alert(`✅ Synced ${updatedCount} beds`);
//             } else {
//                 alert('✅ All beds are already in sync');
//             }
//         } catch (err) {
//             console.error('Sync error:', err);
//             alert('❌ Sync failed: ' + err.message);
//         } finally {
//             setSyncing(false);
//         }
//     };

//     const getPatientForBed = (bedNumber) => {
//         const admission = admissions.find(adm => 
//             adm.bedNo === bedNumber && adm.status === "Admitted"
//         );
        
//         if (admission) {
//             return {
//                 name: admission.patientName,
//                 gender: admission.gender,
//                 admitted: admission.fromDate || admission.admissionDate,
//                 phone: admission.phone,
//                 symptoms: admission.symptoms || [],
//                 doctor: admission.admittingDoctor,
//                 kinName: admission.nameOfKin,
//                 kinPhone: admission.kinContact,
//                 admissionId: admission.id || admission._id
//             };
//         }
//         return null;
//     };

//     const handleAdmitClick = (bed) => {
//         navigate('/receptionist-dashboard/admit-patient', {
//             state: {
//                 selectedBed: bed,
//                 fromBedView: true
//             }
//         });
//     };

//     const handleDischargeClick = async (bed) => {
//         if (window.confirm(`Discharge patient from bed ${bed.bedNumber}?`)) {
//             try {
//                 const admission = admissions.find(adm => 
//                     adm.bedNo === bed.bedNumber && adm.status === "Admitted"
//                 );
                
//                 if (admission) {
//                     setLoading(true);
                    
//                     // 1. Update admission status to Discharged
//                     await axios.put(`${ADMISSIONS_API}/${admission.id || admission._id}`, {
//                         ...admission,
//                         status: "Discharged",
//                         dischargeDate: new Date().toISOString().split('T')[0]
//                     });
                    
//                     // 2. Update bed status to Available in bed management system
//                     await axios.put(`${BEDS_API}/${bed._id}`, {
//                         bedNumber: bed.bedNumber,
//                         status: 'Available'
//                     });
                    
//                     // 3. Refresh both data sources
//                     await fetchAdmissions();
//                     await fetchBeds();
                    
//                     alert(`✅ Patient discharged from bed ${bed.bedNumber}`);
//                 }
//             } catch (err) {
//                 console.error('Discharge error:', err);
//                 alert('Failed to discharge patient');
//             } finally {
//                 setLoading(false);
//             }
//         }
//     };

//     const filteredBeds = filter === 'All' 
//         ? beds 
//         : beds.filter(bed => bed.status === filter);

//     const stats = {
//         total: beds.length,
//         available: beds.filter(b => b.status === 'Available').length,
//         occupied: beds.filter(b => b.status === 'Occupied').length,
//         maintenance: beds.filter(b => b.status === 'Maintenance').length,
//         reserved: beds.filter(b => b.status === 'Reserved').length
//     };

//     if (loading) return (
//         <div className="bedview-loading">
//             <div className="loading-spinner"></div>
//             <p>Loading beds...</p>
//         </div>
//     );

//     return (
//         <div className="bedview-container">
//             <div className="bedview-header">
//                 <h2>🛏️ Bed Availability</h2>
//                 <div className="bedview-stats">
//                     <span>Total: {stats.total}</span>
//                     <span className="stat-available">✅ Available: {stats.available}</span>
//                     <span className="stat-occupied">👤 Occupied: {stats.occupied}</span>
//                     <span className="stat-maintenance">🔧 Maintenance: {stats.maintenance}</span>
//                 </div>
//             </div>

//             <div className="bedview-filters">
//                 <button 
//                     className={filter === 'All' ? 'active' : ''} 
//                     onClick={() => setFilter('All')}
//                 >
//                     All ({stats.total})
//                 </button>
//                 <button 
//                     className={filter === 'Available' ? 'active' : ''} 
//                     onClick={() => setFilter('Available')}
//                 >
//                     ✅ Available ({stats.available})
//                 </button>
//                 <button 
//                     className={filter === 'Occupied' ? 'active' : ''} 
//                     onClick={() => setFilter('Occupied')}
//                 >
//                     👤 Occupied ({stats.occupied})
//                 </button>
//                 <button 
//                     className={filter === 'Maintenance' ? 'active' : ''} 
//                     onClick={() => setFilter('Maintenance')}
//                 >
//                     🔧 Maintenance ({stats.maintenance})
//                 </button>
                
//                 {/* Manual Sync Button */}
//                 <button 
//                     onClick={syncBedStatus}
//                     disabled={syncing}
//                     style={{
//                         padding: '8px 16px',
//                         background: '#2196f3',
//                         color: 'white',
//                         border: 'none',
//                         borderRadius: '4px',
//                         cursor: syncing ? 'wait' : 'pointer',
//                         marginLeft: '10px',
//                         opacity: syncing ? 0.7 : 1
//                     }}
//                 >
//                     {syncing ? '⏳ Syncing...' : '🔄 Force Sync'}
//                 </button>
//             </div>

//             <div className="bedview-grid">
//                 {filteredBeds.length === 0 ? (
//                     <div className="no-beds">
//                         <p>No beds found. Add beds from admin panel first.</p>
//                     </div>
//                 ) : (
//                     filteredBeds.map((bed) => {
//                         const patient = getPatientForBed(bed.bedNumber);
//                         const isHovered = hoveredBed === bed._id;
                        
//                         return (
//                             <div 
//                                 key={bed._id} 
//                                 className={`bed-card ${bed.status.toLowerCase()} ${isHovered ? 'hovered' : ''}`}
//                                 onMouseEnter={() => setHoveredBed(bed._id)}
//                                 onMouseLeave={() => setHoveredBed(null)}
//                             >
//                                 <div className="bed-card-inner">
//                                     <div className="bed-card-front">
//                                         <div className="bed-header">
//                                             <span className="bed-number">{bed.bedNumber}</span>
//                                             <span className={`bed-status ${bed.status.toLowerCase()}`}>
//                                                 {bed.status === 'Available' && '✅ '}
//                                                 {bed.status === 'Occupied' && '👤 '}
//                                                 {bed.status === 'Maintenance' && '🔧 '}
//                                                 {bed.status}
//                                             </span>
//                                         </div>
                                        
//                                         {bed.status === 'Available' && (
//                                             <div className="empty-bed">
//                                                 <span className="empty-icon">🛏️</span>
//                                                 <p>Bed Available</p>
//                                                 <small>Ready for admission</small>
//                                             </div>
//                                         )}
                                        
//                                         {bed.status === 'Occupied' && patient && (
//                                             <div className="patient-info">
//                                                 <div className="patient-name">{patient.name}</div>
//                                                 <div className="patient-details">
//                                                     <span>👤 {patient.gender}</span>
//                                                     <span>📅 {patient.admitted}</span>
//                                                     <span>📞 {patient.phone}</span>
//                                                 </div>
//                                                 {patient.symptoms.length > 0 && (
//                                                     <div className="patient-symptoms">
//                                                         <strong>Symptoms:</strong>
//                                                         <ul>
//                                                             {patient.symptoms.map((symptom, i) => (
//                                                                 <li key={i}>• {symptom}</li>
//                                                             ))}
//                                                         </ul>
//                                                     </div>
//                                                 )}
//                                                 {patient.doctor && (
//                                                     <div className="patient-doctor">
//                                                         👨‍⚕️ Dr. {patient.doctor}
//                                                     </div>
//                                                 )}
//                                             </div>
//                                         )}
                                        
//                                         {bed.status === 'Maintenance' && (
//                                             <div className="maintenance-info">
//                                                 <span className="maintenance-icon">🔧</span>
//                                                 <p>Under Maintenance</p>
//                                             </div>
//                                         )}
//                                     </div>

//                                     <div className="bed-card-back">
//                                         <div className="back-header">
//                                             <span className="back-bed">{bed.bedNumber}</span>
//                                             {bed.status === 'Occupied' && patient && (
//                                                 <button 
//                                                     className="discharge-btn"
//                                                     onClick={() => handleDischargeClick(bed)}
//                                                     disabled={loading}
//                                                 >
//                                                     {loading ? '⏳...' : 'Discharge'}
//                                                 </button>
//                                             )}
//                                             {bed.status === 'Available' && (
//                                                 <button 
//                                                     className="admit-btn"
//                                                     onClick={() => handleAdmitClick(bed)}
//                                                 >
//                                                     Admit
//                                                 </button>
//                                             )}
//                                         </div>
                                        
//                                         <div className="back-details">
//                                             <p><strong>Status:</strong> {bed.status}</p>
//                                             {bed.status === 'Occupied' && patient && (
//                                                 <>
//                                                     <p><strong>Patient:</strong> {patient.name}</p>
//                                                     <p><strong>Gender:</strong> {patient.gender}</p>
//                                                     <p><strong>Admitted:</strong> {patient.admitted}</p>
//                                                     <p><strong>Phone:</strong> {patient.phone}</p>
//                                                     {patient.doctor && (
//                                                         <p><strong>Doctor:</strong> Dr. {patient.doctor}</p>
//                                                     )}
//                                                     {patient.kinName && (
//                                                         <p><strong>Emergency:</strong> {patient.kinName} ({patient.kinPhone})</p>
//                                                     )}
//                                                     {patient.symptoms.length > 0 && (
//                                                         <div className="back-symptoms">
//                                                             <strong>Symptoms:</strong>
//                                                             <ul>
//                                                                 {patient.symptoms.map((symptom, i) => (
//                                                                     <li key={i}>• {symptom}</li>
//                                                                 ))}
//                                                             </ul>
//                                                         </div>
//                                                     )}
//                                                 </>
//                                             )}
//                                             {bed.status === 'Available' && (
//                                                 <p className="back-message">Ready for admission</p>
//                                             )}
//                                             {bed.status === 'Maintenance' && (
//                                                 <p className="back-message">Under maintenance</p>
//                                             )}
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         );
//                     })
//                 )}
//             </div>
            
//             <div className="sync-info" style={{
//                 marginTop: '20px',
//                 padding: '10px',
//                 background: '#e3f2fd',
//                 borderRadius: '4px',
//                 fontSize: '12px',
//                 textAlign: 'center',
//                 color: '#0d47a1'
//             }}>
//                 Auto-syncing bed status every 5 seconds | Occupied Beds: {stats.occupied} | Admitted Patients: {admissions.filter(a => a.status === 'Admitted').length}
//             </div>
//         </div>
//     );
// };

// export default BedView;


import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useLocation } from 'react-router-dom';
import './BedView.css';

const BedView = () => {
    const [beds, setBeds] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filter, setFilter] = useState('All');
    const [hoveredBed, setHoveredBed] = useState(null);
    const [admissions, setAdmissions] = useState([]);
    const [syncing, setSyncing] = useState(false);
    
    const navigate = useNavigate();
    const location = useLocation();

    const BEDS_API = 'http://localhost:8005/api/beds';
    const ADMISSIONS_API = 'http://localhost:8001/api/admitpatient';

    useEffect(() => {
        fetchBeds();
        fetchAdmissions();
        
        // Refresh every 5 seconds for real-time updates
        const interval = setInterval(() => {
            fetchBeds();
            fetchAdmissions();
        }, 5000);
        
        return () => clearInterval(interval);
    }, []);

    // Refresh when returning from admission
    useEffect(() => {
        if (location.state?.refresh) {
            fetchBeds();
            fetchAdmissions();
            window.history.replaceState({}, document.title);
        }
    }, [location.state]);

    const fetchBeds = async () => {
        try {
            const response = await axios.get(BEDS_API);
            const bedsData = response.data.success ? response.data.data : response.data;
            
            const sortedBeds = bedsData.sort((a, b) => {
                const numA = parseInt(a.bedNumber.replace(/[^0-9]/g, '')) || 0;
                const numB = parseInt(b.bedNumber.replace(/[^0-9]/g, '')) || 0;
                return numA - numB;
            });
            
            setBeds(sortedBeds);
            setError('');
        } catch (err) {
            console.error('Fetch error:', err);
            setError('Failed to fetch beds');
        } finally {
            setLoading(false);
        }
    };

    const fetchAdmissions = async () => {
        try {
            const response = await axios.get(ADMISSIONS_API);
            if (response.data.success) {
                setAdmissions(response.data.data);
                console.log('✅ Admissions loaded:', response.data.data.length);
            }
        } catch (err) {
            console.error('Error fetching admissions:', err);
        }
    };

    // ========== FIXED: Manual sync function that SKIPS maintenance beds ==========
    const syncBedStatus = async () => {
        setSyncing(true);
        try {
            // Get all beds
            const bedsResponse = await axios.get(BEDS_API);
            const bedsData = bedsResponse.data.success ? bedsResponse.data.data : bedsResponse.data;
            
            // Get all admitted patients
            const admittedPatients = admissions.filter(adm => adm.status === "Admitted");
            
            let updatedCount = 0;
            let skippedCount = 0;
            
            // For each bed, check if it should be Occupied or Available
            for (const bed of bedsData) {
                // ========== FIXED: Skip maintenance beds completely ==========
                if (bed.status === 'Maintenance') {
                    console.log(`⏭️ Skipping maintenance bed ${bed.bedNumber} - maintenance beds are never auto-synced`);
                    skippedCount++;
                    continue; // Don't change maintenance beds
                }
                
                const isOccupied = admittedPatients.some(adm => adm.bedNo === bed.bedNumber);
                const correctStatus = isOccupied ? 'Occupied' : 'Available';
                
                // If current status doesn't match correct status, update it
                if (bed.status !== correctStatus && bed.status !== 'Reserved') {
                    console.log(`🔄 Syncing bed ${bed.bedNumber} from ${bed.status} to ${correctStatus}`);
                    
                    await axios.put(`${BEDS_API}/${bed._id}`, {
                        bedNumber: bed.bedNumber,
                        status: correctStatus
                    });
                    
                    updatedCount++;
                }
            }
            
            // Refresh beds after syncing
            await fetchBeds();
            
            if (updatedCount > 0) {
                alert(`✅ Synced ${updatedCount} beds (${skippedCount} maintenance beds were skipped)`);
            } else {
                alert(`✅ All beds are already in sync (${skippedCount} maintenance beds skipped)`);
            }
        } catch (err) {
            console.error('Sync error:', err);
            alert('❌ Sync failed: ' + err.message);
        } finally {
            setSyncing(false);
        }
    };

    const getPatientForBed = (bedNumber) => {
        const admission = admissions.find(adm => 
            adm.bedNo === bedNumber && adm.status === "Admitted"
        );
        
        if (admission) {
            return {
                name: admission.patientName,
                gender: admission.gender,
                admitted: admission.fromDate || admission.admissionDate,
                // phone: admission.phone,
                symptoms: admission.symptoms || [],
                // doctor: admission.admittingDoctor,
                kinName: admission.nameOfKin,
                // kinPhone: admission.kinContact,
                admissionId: admission.id || admission._id
            };
        }
        return null;
    };

    const handleAdmitClick = (bed) => {
        navigate('/receptionist-dashboard/admit-patient', {
            state: {
                selectedBed: bed,
                fromBedView: true
            }
        });
    };

    const handleDischargeClick = async (bed) => {
        if (window.confirm(`Discharge patient from bed ${bed.bedNumber}?`)) {
            try {
                const admission = admissions.find(adm => 
                    adm.bedNo === bed.bedNumber && adm.status === "Admitted"
                );
                
                if (admission) {
                    setLoading(true);
                    
                    // 1. Update admission status to Discharged
                    await axios.put(`${ADMISSIONS_API}/${admission.id || admission._id}`, {
                        ...admission,
                        status: "Discharged",
                        dischargeDate: new Date().toISOString().split('T')[0]
                    });
                    
                    // 2. Update bed status to Available in bed management system
                    await axios.put(`${BEDS_API}/${bed._id}`, {
                        bedNumber: bed.bedNumber,
                        status: 'Available'
                    });
                    
                    // 3. Refresh both data sources
                    await fetchAdmissions();
                    await fetchBeds();
                    
                    alert(`✅ Patient discharged from bed ${bed.bedNumber}`);
                }
            } catch (err) {
                console.error('Discharge error:', err);
                alert('Failed to discharge patient');
            } finally {
                setLoading(false);
            }
        }
    };

    const filteredBeds = filter === 'All' 
        ? beds 
        : beds.filter(bed => bed.status === filter);

    const stats = {
        total: beds.length,
        available: beds.filter(b => b.status === 'Available').length,
        occupied: beds.filter(b => b.status === 'Occupied').length,
        maintenance: beds.filter(b => b.status === 'Maintenance').length,
        reserved: beds.filter(b => b.status === 'Reserved').length
    };

    if (loading) return (
        <div className="bedview-loading">
            <div className="loading-spinner"></div>
            <p>Loading beds...</p>
        </div>
    );

    return (
        <div className="bedview-container">
            <div className="bedview-header">
                <h2>🛏️ Bed Availability</h2>
                <div className="bedview-stats">
                    <span>Total: {stats.total}</span>
                    <span className="stat-available">✅ Available: {stats.available}</span>
                    <span className="stat-occupied">👤 Occupied: {stats.occupied}</span>
                    <span className="stat-maintenance">🔧 Maintenance: {stats.maintenance}</span>
                </div>
            </div>

            <div className="bedview-filters">
                <button 
                    className={filter === 'All' ? 'active' : ''} 
                    onClick={() => setFilter('All')}
                >
                    All ({stats.total})
                </button>
                <button 
                    className={filter === 'Available' ? 'active' : ''} 
                    onClick={() => setFilter('Available')}
                >
                    ✅ Available ({stats.available})
                </button>
                <button 
                    className={filter === 'Occupied' ? 'active' : ''} 
                    onClick={() => setFilter('Occupied')}
                >
                    👤 Occupied ({stats.occupied})
                </button>
                <button 
                    className={filter === 'Maintenance' ? 'active' : ''} 
                    onClick={() => setFilter('Maintenance')}
                >
                    🔧 Maintenance ({stats.maintenance})
                </button>
                
                {/* Manual Sync Button */}
                <button 
                    onClick={syncBedStatus}
                    disabled={syncing}
                    style={{
                        padding: '8px 16px',
                        background: '#2196f3',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: syncing ? 'wait' : 'pointer',
                        marginLeft: '10px',
                        opacity: syncing ? 0.7 : 1
                    }}
                >
                    {syncing ? '⏳ Syncing...' : '🔄 Force Sync'}
                </button>
            </div>

            <div className="bedview-grid">
                {filteredBeds.length === 0 ? (
                    <div className="no-beds">
                        <p>No beds found. Add beds from admin panel first.</p>
                    </div>
                ) : (
                    filteredBeds.map((bed) => {
                        const patient = getPatientForBed(bed.bedNumber);
                        const isHovered = hoveredBed === bed._id;
                        
                        return (
                            <div 
                                key={bed._id} 
                                className={`bed-card ${bed.status.toLowerCase()} ${isHovered ? 'hovered' : ''}`}
                                onMouseEnter={() => setHoveredBed(bed._id)}
                                onMouseLeave={() => setHoveredBed(null)}
                            >
                                <div className="bed-card-inner">
                                    <div className="bed-card-front">
                                        <div className="bed-header">
                                            <span className="bed-number">{bed.bedNumber}</span>
                                            <span className={`bed-status ${bed.status.toLowerCase()}`}>
                                                {bed.status === 'Available' && '✅ '}
                                                {bed.status === 'Occupied' && '👤 '}
                                                {bed.status === 'Maintenance' && '🔧 '}
                                                {bed.status}
                                            </span>
                                        </div>
                                        
                                        {bed.status === 'Available' && (
                                            <div className="empty-bed">
                                                <span className="empty-icon">🛏️</span>
                                                <p>Bed Available</p>
                                                <small>Ready for admission</small>
                                            </div>
                                        )}
                                        
                                        {bed.status === 'Occupied' && patient && (
                                             <div className="empty-bed">
                                                <span className="empty-icon">🛏️</span>
                                                <p style={{color:"red"}}>Occupied</p>
                                                {/* <small>Ready for admission</small> */}
                                            </div>
                                        )}
                                        
                                        {bed.status === 'Maintenance' && (
                                            <div className="maintenance-info">
                                                <span className="maintenance-icon">🔧</span>
                                                <p>Under Maintenance</p>
                                                <small>This bed will never be auto-synced</small>
                                            </div>
                                        )}
                                    </div>

                                    <div className="bed-card-back-card-occupied">
                                        <div className="back-header">
                                            <span className="back-bed">{bed.bedNumber}</span>
                                            {bed.status === 'Occupied' && patient && (
                                                <button 
                                                    className="discharge-btn"
                                                    onClick={() => handleDischargeClick(bed)}
                                                    disabled={loading}
                                                >
                                                    {loading ? '⏳...' : 'Discharge'}
                                                </button>
                                            )}
                                            {bed.status === 'Available' && (
                                                <button 
                                                    className="admit-btn"
                                                    onClick={() => handleAdmitClick(bed)}
                                                >
                                                    Admit
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="back-details">
                                            <p><strong>Status:</strong> {bed.status}</p>
                                            {bed.status === 'Occupied' && patient && (
                                                <>
                                                    <p><strong>Patient:</strong> {patient.name}</p>
                                                    <p><strong>Gender:</strong> {patient.gender}</p>
                                                    <p><strong>Admitted:</strong> {patient.admitted}</p>
                                                    {/* <p><strong>Phone:</strong> {patient.phone}</p> */}
                                                    {/* {patient.doctor && (
                                                        // <p><strong>Doctor:</strong> Dr. {patient.doctor}</p>
                                                    )} */}
                                                    {/* {patient.kinName && (
                                                        <p><strong>Emergency:</strong> {patient.kinName} ({patient.kinPhone})</p>
                                                    )} */}
                                                    {patient.symptoms.length > 0 && (
                                                        <div className="back-symptoms">
                                                            <strong>Symptoms:</strong>
                                                            <ul>
                                                                {patient.symptoms.map((symptom, i) => (
                                                                    <li key={i}>• {symptom}</li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </>
                                            )}
                                            {bed.status === 'Available' && (
                                                <p className="back-message">Ready for admission</p>
                                            )}
                                            {bed.status === 'Maintenance' && (
                                                <p className="back-message">Under maintenance - will not be auto-synced</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
            
            <div className="sync-info" style={{
                marginTop: '20px',
                padding: '10px',
                background: '#e3f2fd',
                borderRadius: '4px',
                fontSize: '12px',
                textAlign: 'center',
                color: '#0d47a1'
            }}>
                Auto-syncing bed status every 5 seconds | Occupied Beds: {stats.occupied} | 
                Admitted Patients: {admissions.filter(a => a.status === 'Admitted').length} | 
                <span style={{color: '#f57c00', fontWeight: 'bold'}}> Maintenance Beds: {stats.maintenance} (Never auto-synced)</span>
            </div>
        </div>
    );
};

export default BedView;