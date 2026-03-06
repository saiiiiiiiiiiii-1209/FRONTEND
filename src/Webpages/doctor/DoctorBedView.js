import React, { useState, useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import "./BedView.css";

const DoctorBedView = ({ totalBeds = 20 }) => {
  const navigate = useNavigate();
  const context = useOutletContext();
  const contextAdmissions = context?.admissions || [];
  const [hoveredBed, setHoveredBed] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [apiAdmissions, setApiAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  // Fetch admissions from backend API
  useEffect(() => {
    const fetchAdmissions = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:8001/api/admitpatient');
        const data = await response.json();
        if (data.success) {
          setApiAdmissions(data.data);
          console.log("🛏️ Doctor BedView fetched API admissions:", data.data);
        }
        
        // Auto-refresh every 5 seconds
        const interval = setInterval(async () => {
          const refreshResponse = await fetch('http://localhost:8001/api/admitpatient');
          const refreshData = await refreshResponse.json();
          if (refreshData.success) {
            setApiAdmissions(refreshData.data);
          }
        }, 5000);
        
        return () => clearInterval(interval);
      } catch (error) {
        console.error("❌ Doctor BedView API fetch failed:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAdmissions();
  }, []);

  // Merge API admissions + context admissions
  const admissions = (() => {
    const merged = [...apiAdmissions];
    const apiIds = new Set(apiAdmissions.map(a => String(a._id || a.id)));
    const apiBeds = new Set(apiAdmissions.filter(a => a.status === "Admitted").map(a => a.bedNo));
    
    contextAdmissions.forEach(ca => {
      if (!apiIds.has(String(ca._id || ca.id)) && !apiBeds.has(ca.bedNo)) {
        merged.push(ca);
      }
    });
    return merged;
  })();

  // Helper: get patient name
  const getPatientName = (admission) => {
    return admission.patientName
      || admission.patient_name
      || admission.name
      || admission.fullName
      || admission.full_name
      || admission.patient?.name
      || admission.patientname
      || 'Unknown Patient';
  };

  // Helper: get admission date
  const getAdmissionDate = (admission) => {
    return admission.fromDate 
      || admission.admissionDate 
      || admission.admittedDate 
      || admission.date 
      || '-';
  };

  const bedNumbers = Array.from({ length: totalBeds }, (_, i) => `B${i + 1}`);

  // Helper to check if admission is active
  const isActiveAdmission = (admission) => {
    if (admission.status !== "Admitted") return false;
    if (!admission.toDate) return true;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dischargeDate = new Date(admission.toDate);
    dischargeDate.setHours(0, 0, 0, 0);
    return dischargeDate >= today;
  };

  // Get only active (admitted) patients
  const occupiedBeds = admissions.reduce((map, admission) => {
    if (isActiveAdmission(admission)) {
      map[admission.bedNo] = admission;
    }
    return map;
  }, {});

  // Create bed objects similar to BedView
  const beds = bedNumbers.map(bedNo => {
    const admission = occupiedBeds[bedNo];
    const isOccupied = !!admission;
    
    return {
      bedNumber: bedNo,
      status: isOccupied ? 'Occupied' : 'Available',
      _id: bedNo,
      patient: isOccupied ? admission : null
    };
  });

  // Filter beds based on status
  const filteredBeds = filter === 'All' 
    ? beds 
    : beds.filter(bed => bed.status === filter);

  // Filter beds based on search term
  const searchedBeds = filteredBeds.filter(bed => {
    if (!searchTerm) return true;
    const admission = bed.patient;
    const patientName = admission ? getPatientName(admission).toLowerCase() : "";
    return bed.bedNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      patientName.includes(searchTerm.toLowerCase());
  });

  const stats = {
    total: beds.length,
    available: beds.filter(b => b.status === 'Available').length,
    occupied: beds.filter(b => b.status === 'Occupied').length,
    maintenance: 0,
    reserved: 0
  };

  const handleBackToDashboard = () => {
    navigate("/doctor-dashboard");
  };

  const getPatientForBed = (bedNumber) => {
    const admission = occupiedBeds[bedNumber];
    if (admission) {
      return {
        name: getPatientName(admission),
        gender: admission.gender || '-',
        admitted: getAdmissionDate(admission),
        phone: admission.phone || '-',
        symptoms: Array.isArray(admission.symptoms) ? admission.symptoms : 
                 (admission.symptoms ? [admission.symptoms] : []),
        doctor: admission.admittingDoctor || admission.doctor || 'Not Assigned',
        kinName: admission.nameOfKin || admission.kinName || '-',
        kinPhone: admission.kinContact || admission.kinPhone || '-',
        admissionId: admission._id || admission.id
      };
    }
    return null;
  };

  if (loading) {
    return (
      <div className="bedview-loading">
        <div className="loading-spinner"></div>
        <p>Loading beds...</p>
      </div>
    );
  }

  return (
    <div className="bedview-container">
      <div className="bedview-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <h2>
            <i className="fas fa-bed" style={{ marginRight: '10px' }}></i>
            Bed Occupancy Overview
          </h2>
          <span style={{ 
            fontSize: '14px', 
            background: '#e3f2fd',
            padding: '4px 12px',
            borderRadius: '20px',
            color: '#1976d2',
            fontWeight: '600'
          }}>
            Doctor View
          </span>
        </div>
        
        <div className="bedview-stats">
          <span>Total: {stats.total}</span>
          <span className="stat-available">✅ Available: {stats.available}</span>
          <span className="stat-occupied">👤 Occupied: {stats.occupied}</span>
        </div>

        <button
          className="back-to-dashboard-btn"
          onClick={handleBackToDashboard}
          style={{
            background: "linear-gradient(135deg, #1976d2, #42a5f5)",
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
            marginTop: "10px"
          }}
        >
          <span>←</span>
          <span>Back to Dashboard</span>
        </button>
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
      </div>

      <div className="search-container-fluid" style={{ margin: '20px 0' }}>
        <i className="fas fa-search search-icon"></i>
        <input
          type="text"
          placeholder="Search by bed number or patient name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        {searchTerm && (
          <button className="clear-search" onClick={() => setSearchTerm("")}>
            <i className="fas fa-times"></i>
          </button>
        )}
      </div>

      <div className="bedview-grid">
        {searchedBeds.length === 0 ? (
          <div className="no-beds">
            <i className="fas fa-search" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3>No beds match your search</h3>
            <p>Try a different keyword or clear the search.</p>
          </div>
        ) : (
          searchedBeds.map((bed) => {
            const patient = bed.patient ? getPatientForBed(bed.bedNumber) : null;
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
                      <div className="patient-info">
                        <div className="patient-name">{patient.name}</div>
                        <div className="patient-details">
                          <span>👤 {patient.gender}</span>
                          <span>📅 {patient.admitted}</span>
                          <span>📞 {patient.phone}</span>
                        </div>
                        {patient.symptoms.length > 0 && (
                          <div className="patient-symptoms">
                            <strong>Symptoms:</strong>
                            <ul>
                              {patient.symptoms.slice(0, 3).map((symptom, i) => (
                                <li key={i}>• {symptom}</li>
                              ))}
                              {patient.symptoms.length > 3 && <li>• ...</li>}
                            </ul>
                          </div>
                        )}
                        {patient.doctor && (
                          <div className="patient-doctor">
                            👨‍⚕️ Dr. {patient.doctor}
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="bed-card-back">
                    <div className="back-header">
                      <span className="back-bed">{bed.bedNumber}</span>
                    </div>
                    
                    <div className="back-details">
                      <p><strong>Status:</strong> {bed.status}</p>
                      {bed.status === 'Occupied' && patient && (
                        <>
                          <p><strong>Patient:</strong> {patient.name}</p>
                          <p><strong>Gender:</strong> {patient.gender}</p>
                          <p><strong>Admitted:</strong> {patient.admitted}</p>
                          <p><strong>Phone:</strong> {patient.phone}</p>
                          {patient.doctor && (
                            <p><strong>Doctor:</strong> Dr. {patient.doctor}</p>
                          )}
                          {patient.kinName !== '-' && (
                            <p><strong>Emergency Contact:</strong> {patient.kinName} ({patient.kinPhone})</p>
                          )}
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
                        <>
                          <p className="back-message">Ready for admission</p>
                          <div className="empty-bed-back">
                            <span className="empty-icon">🛏️</span>
                            <p>This bed is available for new patients</p>
                          </div>
                        </>
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
        Auto-refreshing every 5 seconds | Occupied Beds: {stats.occupied} | Available Beds: {stats.available}
      </div>
    </div>
  );
};

export default DoctorBedView;