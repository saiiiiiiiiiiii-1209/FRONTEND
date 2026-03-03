import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAppointments } from "../context/AppointmentsContext";
import AppointmentForm from "./AppointmentForm";  
import "./Appointment.css";

function Appointment() {
  const navigate = useNavigate();
  const { appointments, updateAppointment, deleteAppointment } =
    useAppointments();
    
  const [searchTerm, setSearchTerm] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    cancelled: 0
  });
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [showViewPopup, setShowViewPopup] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [formData, setFormData] = useState({});
  const [editErrors, setEditErrors] = useState({});
  const [showPopup, setShowPopup] = useState(false);
  const [localAppointments, setLocalAppointments] = useState([]);
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [symptomsDropdownOpen, setSymptomsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loading, setLoading] = useState(true);

  const cardiologySymptoms = [
    "Chest Pain", "Shortness of Breath", "Palpitations", 
    "High Blood Pressure", "Dizziness", "Fatigue", 
    "Swelling in Legs", "Irregular Heartbeat",
    "Nausea", "Sweating", "Pain in Arms", "Jaw Pain",
    "Lightheadedness", "Rapid Heartbeat", "Slow Heartbeat",
    "Chest Discomfort", "Coughing", "Ankle Swelling",
    "Bluish Skin", "Fainting", "Confusion"
  ];

  // ==================== HELPER FUNCTION TO SORT BY DATE AND TIME ====================
  const sortByDateTime = (appointments) => {
    return [...appointments].sort((a, b) => {
      // First compare by date
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);
      
      if (dateA < dateB) return -1; // Earlier date first
      if (dateA > dateB) return 1;  // Later date last
      
      // If same date, compare by time
      // Convert time strings to comparable format (HH:MM)
      const timeA = a.time || "23:59"; // Default to end of day if no time
      const timeB = b.time || "23:59";
      
      if (timeA < timeB) return -1; // Earlier time first
      if (timeA > timeB) return 1;  // Later time last
      
      return 0; // Equal dates and times
    });
  };

  // ==================== FILTER HANDLER ====================
  const handleFilterClick = (type) => {
    setFilterType(type);
  };

  const getFilteredCount = (status) => {
    if (!localAppointments) return 0;
    if (status === "all") return localAppointments.length;
    return localAppointments.filter(a => a.status?.toLowerCase() === status.toLowerCase()).length;
  };

  // ==================== FETCH REGISTERED PATIENTS ====================
  const fetchRegisteredPatients = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/patients');
      const data = await response.json();
      if (data.success) {
        setRegisteredPatients(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} registered patients`);
      }
    } catch (error) {
      console.error('Error fetching registered patients:', error);
    }
  };

  // ==================== FETCH APPOINTMENTS ====================
  const fetchAppointmentsFromBackend = async () => {
    try {
      setLoading(true);
      console.log("📥 Fetching appointments from backend...");
      
      const response = await fetch('http://localhost:8001/api/appointments');
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("✅ Appointments fetched:", data.appointments?.length || 0);
        
        const processedAppointments = (data.appointments || []).map(apt => ({
          ...apt,
          id: apt._id,
          _id: apt._id
        }));
        
        // ✅ Sort by date and time (earliest first)
        const sortedAppointments = sortByDateTime(processedAppointments);
        
        console.log("📊 Appointments sorted by date/time (earliest first):", 
          sortedAppointments.map(a => `${a.date} ${a.time}`));
        
        setLocalAppointments(sortedAppointments);
        setStats(data.stats || {
          total: 0,
          pending: 0,
          completed: 0,
          cancelled: 0
        });
        
        localStorage.setItem('appointments', JSON.stringify(sortedAppointments));
      } else {
        console.error("❌ Failed to fetch appointments:", data.message);
        const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        
        // ✅ Sort saved appointments by date and time (earliest first)
        const sortedSaved = sortByDateTime(savedAppointments);
        setLocalAppointments(sortedSaved);
        
        const total = sortedSaved.length;
        const pending = sortedSaved.filter(a => a.status === "Pending").length;
        const completed = sortedSaved.filter(a => a.status === "Completed").length;
        const cancelled = sortedSaved.filter(a => a.status === "Cancelled").length;
        
        setStats({ total, pending, completed, cancelled });
      }
    } catch (error) {
      console.error("❌ Error fetching appointments:", error);
      const savedAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
      
      // ✅ Sort saved appointments by date and time (earliest first)
      const sortedSaved = sortByDateTime(savedAppointments);
      setLocalAppointments(sortedSaved);
      
      const total = sortedSaved.length;
      const pending = sortedSaved.filter(a => a.status === "Pending").length;
      const completed = sortedSaved.filter(a => a.status === "Completed").length;
      const cancelled = sortedSaved.filter(a => a.status === "Cancelled").length;
      
      setStats({ total, pending, completed, cancelled });
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/appointments/stats');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setStats(data.stats);
      }
    } catch (error) {
      console.error("❌ Error fetching stats:", error);
    }
  };

  useEffect(() => {
    fetchAppointmentsFromBackend();
    fetchRegisteredPatients();
  }, []);

  useEffect(() => {
    if (appointments && appointments.length > 0) {
      const processedAppointments = appointments.map(apt => ({
        ...apt,
        id: apt._id,
        _id: apt._id
      }));
      // ✅ Sort by date and time (earliest first)
      const sortedAppointments = sortByDateTime(processedAppointments);
      setLocalAppointments(sortedAppointments);
    }
  }, [appointments]);

  // ==================== ADD APPOINTMENT FUNCTION - Automatically sorted by date/time ====================
  const addAppointment = async (appointment) => {
    console.log("%c🟢🟢🟢 ADD APPOINTMENT CALLED 🟢🟢🟢", "color: green; font-size: 16px; font-weight: bold");
    console.log("📦 Data received from form:", appointment);
    
    try {
      setIsLoading(true);
      
      const now = new Date();
      const bookingDate = now.toISOString().split('T')[0];
      const bookingTime = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit', 
        hour12: false 
      });
      
      console.log("📅 Booking Date:", bookingDate);
      console.log("⏰ Booking Time:", bookingTime);
      
      let symptomsString = "";
      if (Array.isArray(appointment.symptoms)) {
        symptomsString = appointment.symptoms.join(", ");
      } else if (typeof appointment.symptoms === 'string') {
        symptomsString = appointment.symptoms;
      }

      const appointmentData = {
        patientName: appointment.patientName,
        age: parseInt(appointment.age),
        gender: appointment.gender,
        phone: appointment.phone,
        email: appointment.email,
        symptoms: symptomsString,
        date: appointment.date,
        time: appointment.time,
        status: "Pending",
        type: "Cardiology",
        doctor: "Dr. Pranjal Patil",
        notes: appointment.notes || "",
        bookingDate: bookingDate,
        bookingTime: bookingTime
      };

      console.log("📤 Sending to backend API:", appointmentData);

      const response = await fetch('http://localhost:8001/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(appointmentData)
      });

      console.log("📥 Response status:", response.status);
      
      let data;
      try {
        data = await response.json();
        console.log("📥 Response data:", data);
      } catch (e) {
        console.error("❌ Could not parse response:", e);
        throw new Error("Server returned invalid response");
      }

      if (response.ok && data.success) {
        console.log("%c✅ SUCCESS! Appointment saved to MongoDB", "color: green; font-size: 16px");
        console.log("📋 Appointment ID:", data.appointment.appointmentId);
        console.log("📋 MongoDB _id:", data.appointment._id);
        
        const newAppointment = {
          _id: data.appointment._id,
          id: data.appointment._id,
          appointmentId: data.appointment.appointmentId,
          patientName: data.appointment.patientName,
          age: data.appointment.age,
          gender: data.appointment.gender,
          phone: data.appointment.phone,
          email: data.appointment.email,
          symptoms: data.appointment.symptoms,
          date: data.appointment.date,
          time: data.appointment.time,
          doctor: data.appointment.doctor,
          status: data.appointment.status,
          bookingDate: data.appointment.bookingDate,
          bookingTime: data.appointment.bookingTime
        };
        
        // ✅ Add new appointment and sort by date/time (earliest first)
        setLocalAppointments(prev => {
          const updated = [...prev, newAppointment];
          // Sort by date and time (earliest first)
          const sorted = sortByDateTime(updated);
          console.log("📋 New appointment added and sorted by time");
          return sorted;
        });
        
        setStats(prev => ({
          ...prev,
          total: prev.total + 1,
          pending: prev.pending + 1
        }));
        
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAppointments = [...existingAppointments, newAppointment];
        // ✅ Save to localStorage with sorting
        localStorage.setItem('appointments', JSON.stringify(sortByDateTime(updatedAppointments)));
        
        alert(`✅ Appointment booked successfully! ID: ${data.appointment.appointmentId}`);
        
        setShowPopup(false);
        setSelectedPatientForAppointment(null);
        
        return newAppointment;
      } else {
        throw new Error(data.message || `Server error: ${response.status}`);
      }
    } catch (error) {
      console.error("%c🔴 ERROR in addAppointment:", "color: red; font-size: 16px", error);
      alert(`❌ Failed to save appointment: ${error.message}`);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== FILTERED APPOINTMENTS ====================
  const filteredAppointments = useMemo(() => {
    if (!localAppointments) return [];

    let filtered = [...localAppointments];

    if (filterType !== "all") {
      filtered = filtered.filter(apt => 
        apt.status?.toLowerCase() === filterType.toLowerCase()
      );
    }

    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter((apt) => {
        return (
          apt.patientName?.toLowerCase().includes(searchLower) ||
          apt.phone?.includes(searchTerm) ||
          apt.appointmentId?.toLowerCase().includes(searchLower) ||
          apt.email?.toLowerCase().includes(searchLower)
        );
      });
    }

    // ✅ Sort by date and time (earliest first)
    return sortByDateTime(filtered);
  }, [localAppointments, searchTerm, filterType]);

  // ==================== STATE FOR PATIENT TO APPOINTMENT ====================
  const [showAppointmentFromPatient, setShowAppointmentFromPatient] = useState(false);
  const [selectedPatientForAppointment, setSelectedPatientForAppointment] = useState(null);

  // ==================== CREATE APPOINTMENT FROM REGISTERED PATIENT ====================
  const createAppointmentFromPatient = (patient) => {
    // Set default appointment time (current time + 1 hour)
    const now = new Date();
    now.setHours(now.getHours() + 1);
    const defaultTime = now.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit', 
      hour12: false 
    });
    
    // Create appointment data object
    const appointmentData = {
      patientName: patient.patientName,
      age: patient.age,
      gender: patient.gender,
      phone: patient.phone,
      email: patient.email || '',
      symptoms: Array.isArray(patient.symptoms) ? patient.symptoms : (patient.symptoms ? [patient.symptoms] : []),
      date: new Date().toISOString().split('T')[0],
      time: defaultTime,
      notes: "Appointment created from registered patient"
    };
    
    setSelectedPatientForAppointment(appointmentData);
    setShowPopup(true);
  };

  // ==================== VALIDATION FUNCTIONS ====================
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

  const getCurrentDateTime = () => {
    const now = new Date();
    return {
      date: now.toISOString().split("T")[0],
      time: now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false }),
    };
  };

  const validateEditForm = () => {
    const newErrors = {};
    const currentDateTime = getCurrentDateTime();
    
    if (!validateName(formData.patientName)) 
      newErrors.patientName = "Patient name must be 2-50 characters and contain only letters";
    
    if (!validateAge(formData.age)) 
      newErrors.age = "Age must be between 1-120 years";
    
    if (!formData.gender) 
      newErrors.gender = "Please select gender";
    
    if (!validatePhone(formData.phone)) 
      newErrors.phone = "Enter valid 10-digit number starting with 7,8,9";
    
    if (!formData.date) 
      newErrors.date = "Please select appointment date";
    else {
      const selectedDate = new Date(formData.date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (selectedDate < today)
        newErrors.date = "Appointment date cannot be in the past";
    }
    
    if (!formData.time) 
      newErrors.time = "Please select appointment time";
    else if (formData.date === currentDateTime.date) {
      if (formData.time < currentDateTime.time)
        newErrors.time = "Appointment time cannot be in the past";
    }
    
    setEditErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ==================== HANDLERS ====================
  const handleView = (apt) => {
    setSelectedAppointment(apt);
    setShowViewPopup(true);
  };

  const handleEdit = (apt) => {
    let symptomsArray = apt.symptoms;
    if (typeof apt.symptoms === 'string') {
      symptomsArray = apt.symptoms.split(',').map(s => s.trim()).filter(s => s);
    } else if (!Array.isArray(apt.symptoms)) {
      symptomsArray = [];
    }
    
    setSelectedAppointment(apt);
    setFormData({ 
      ...apt, 
      symptoms: symptomsArray,
      type: apt.type || "Cardiology",
      doctor: apt.doctor || "Dr. Pranjal Patil",
      notes: apt.notes || ""
    });
    setEditErrors({});
    setSymptomsDropdownOpen(false);
    setShowEditPopup(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "phone") {
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

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms?.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...(prev.symptoms || []), symptom],
    }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    
    if (!validateEditForm()) {
      alert("❌ Please fix the errors before saving!");
      return;
    }
    
    try {
      setIsLoading(true);
      
      const updatedData = {
        ...formData,
        symptoms: formData.symptoms?.join(", ") || ""
      };
      
      const mongoId = formData._id || selectedAppointment._id;
      
      if (!mongoId) {
        throw new Error("MongoDB ID not found");
      }
      
      console.log("✏️ Updating appointment with ID:", mongoId);
      
      const response = await fetch(`http://localhost:8001/api/appointments/${mongoId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData)
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("✅ Appointment updated in MongoDB:", data);
        
        if (data.stats) {
          setStats(data.stats);
        }
        
        setLocalAppointments(prev => {
          const updated = prev.map(apt => (apt._id === mongoId) 
            ? { ...apt, ...updatedData } 
            : apt
          );
          // ✅ Re-sort after update (in case date/time changed)
          return sortByDateTime(updated);
        });
        
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAppointments = existingAppointments.map(apt => 
          (apt._id === mongoId) 
            ? { ...apt, ...updatedData } 
            : apt
        );
        localStorage.setItem('appointments', JSON.stringify(sortByDateTime(updatedAppointments)));
        
        setShowEditPopup(false);
        alert(`✅ Appointment updated successfully!`);
      } else {
        throw new Error(data.message || "Failed to update");
      }
    } catch (error) {
      console.error("❌ Error updating appointment:", error);
      alert(`❌ Failed to update: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (apt) => {
    if (!apt) return;
    
    const mongoId = apt._id;
    
    if (!mongoId) {
      alert("❌ Cannot delete: MongoDB ID not found");
      return;
    }
    
    if (!window.confirm(`Are you sure you want to delete appointment for ${apt.patientName}?`)) return;
    
    try {
      setIsLoading(true);
      
      const response = await fetch(`http://localhost:8001/api/appointments/${mongoId}`, {
        method: 'DELETE'
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("✅ Appointment deleted from MongoDB");
        
        if (data.stats) {
          setStats(data.stats);
        }
        
        setLocalAppointments(prev => prev.filter(a => a._id !== mongoId));
        
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAppointments = existingAppointments.filter(a => a._id !== mongoId);
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
        
        alert("✅ Appointment deleted successfully!");
      } else {
        throw new Error(data.message || "Failed to delete");
      }
    } catch (error) {
      console.error("❌ Error deleting appointment:", error);
      alert(`❌ Failed to delete: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // ==================== handleStatusChange with restrictions ====================
  const handleStatusChange = async (apt, newStatus) => {
    try {
      const mongoId = apt._id;
      const oldStatus = apt?.status;
      
      if (!mongoId) {
        alert("❌ Cannot update: MongoDB ID not found");
        return;
      }

      if (oldStatus === 'Completed' || oldStatus === 'Cancelled') {
        if (newStatus === 'Pending') {
          alert("❌ Cannot change status from Completed/Cancelled back to Pending!");
          return;
        }
      }
      
      console.log(`🔄 Changing status from ${oldStatus} to ${newStatus}`);
      
      setLocalAppointments(prev => 
        prev.map(a => a._id === mongoId ? { ...a, status: newStatus } : a)
      );
      
      const response = await fetch(`http://localhost:8001/api/appointments/${mongoId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        console.log("✅ Status updated in MongoDB");
        
        if (data.stats) {
          setStats(data.stats);
        }
        
        const existingAppointments = JSON.parse(localStorage.getItem('appointments') || '[]');
        const updatedAppointments = existingAppointments.map(a => 
          a._id === mongoId ? { ...a, status: newStatus } : a
        );
        localStorage.setItem('appointments', JSON.stringify(updatedAppointments));
      } else {
        setLocalAppointments(prev => 
          prev.map(a => a._id === mongoId ? { ...a, status: oldStatus } : a)
        );
        throw new Error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error("❌ Error updating status:", error);
      alert(`❌ Failed to update status: ${error.message}`);
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

  const errorStyle = {
    border: "1px solid #dc3545",
    backgroundColor: "#fff8f8"
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div className="loading-spinner"></div>
        <p>Loading appointments...</p>
      </div>
    );
  }

  return (
    <div className="appointments-page">

      <div className="page-header">
        <div>
          <h1>📋 Appointment Management</h1>
          <p style={{ marginLeft: "45px" }}>Total Appointments: {stats.total || 0}</p>
        </div>
        <button className="add-btn" onClick={() => setShowPopup(true)} disabled={isLoading}>
          <span> + Book Appointment</span>
        </button>
      </div>

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
          title={`Click to show all appointments (${getFilteredCount('all')} appointments)`}
        >
          <h4>📅 TOTAL</h4>
          <h2>{stats.total}</h2>
          {filterType === 'all' && (
            <small style={{color: '#0d6efd', fontWeight: 'bold'}}></small>
          )}
        </div>

        <div 
          className={`summary-card ${filterType === 'pending' ? 'active-filter' : ''}`}
          style={{ 
            borderLeft: "4px solid #ffc107",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: filterType === 'pending' ? 1 : 0.8,
            transform: filterType === 'pending' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleFilterClick('pending')}
          title={`Click to show pending appointments (${getFilteredCount('pending')} appointments)`}
        >
          <h4>⏳ PENDING</h4>
          <h2>{stats.pending}</h2>
          {filterType === 'pending' && (
            <small style={{color: '#ffc107', fontWeight: 'bold'}}></small>
          )}
        </div>

        <div 
          className={`summary-card ${filterType === 'completed' ? 'active-filter' : ''}`}
          style={{ 
            borderLeft: "4px solid #28a745",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: filterType === 'completed' ? 1 : 0.8,
            transform: filterType === 'completed' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleFilterClick('completed')}
          title={`Click to show completed appointments (${getFilteredCount('completed')} appointments)`}
        >
          <h4>✔ COMPLETED</h4>
          <h2>{stats.completed}</h2>
          {filterType === 'completed' && (
            <small style={{color: '#28a745', fontWeight: 'bold'}}></small>
          )}
        </div>

        <div 
          className={`summary-card ${filterType === 'cancelled' ? 'active-filter' : ''}`}
          style={{ 
            borderLeft: "4px solid #dc3545",
            cursor: "pointer",
            transition: "all 0.2s",
            opacity: filterType === 'cancelled' ? 1 : 0.8,
            transform: filterType === 'cancelled' ? 'scale(1.02)' : 'scale(1)'
          }}
          onClick={() => handleFilterClick('cancelled')}
          title={`Click to show cancelled appointments (${getFilteredCount('cancelled')} appointments)`}
        >
          <h4>❌ CANCELLED</h4>
          <h2>{stats.cancelled}</h2>
          {filterType === 'cancelled' && (
            <small style={{color: '#dc3545', fontWeight: 'bold'}}></small>
          )}
        </div>
      </div><br />

      <div className="search-container-fluid">
        <input
          type="text"
          placeholder="Search by patient name, mobile, email, or appointment ID..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Sr. No.</th>
              <th>Patient</th>
              <th>Age/Gender</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredAppointments.length > 0 ? (
              filteredAppointments.map((apt, index) => (
                <tr key={apt._id || apt.id || index}>
                  <td>{index + 1}</td>
                  <td>{apt.patientName}</td>
                  <td>
                    {apt.age || "-"} / {apt.gender || "-"}
                  </td>
                  <td>{apt.phone}</td>
                  <td>{apt.email || "-"}</td>
                  <td>{apt.date}</td>
                  <td>{apt.time}</td>

                  <td>
                    <select
                      value={apt.status}
                      onChange={(e) => handleStatusChange(apt, e.target.value)}
                      style={{
                        padding: "5px 10px",
                        borderRadius: "4px",
                        border: "1px solid #ddd",
                        fontSize: "13px",
                        fontWeight: "600",
                        cursor: "pointer",
                        backgroundColor: 
                          apt.status === "Pending" ? "#fff3cd" :
                          apt.status === "Completed" ? "#d4edda" : "#f8d7da",
                        color: 
                          apt.status === "Pending" ? "#856404" :
                          apt.status === "Completed" ? "#155724" : "#721c24",
                        borderColor: 
                          apt.status === "Pending" ? "#ffeeba" :
                          apt.status === "Completed" ? "#c3e6cb" : "#f5c6cb"
                      }}
                    >
                      <option value="Pending" disabled={apt.status === 'Completed' || apt.status === 'Cancelled'}>
                        Pending {apt.status === 'Completed' ? '(locked)' : apt.status === 'Cancelled' ? '(locked)' : ''}
                      </option>
                      <option value="Completed">Completed</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </td>

                  <td className="action-cell">
                    <button
                      className="view-btn"
                      onClick={() => handleView(apt)}
                      title="View Details"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "5px",
                        borderRadius: "4px",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
                      onMouseOut={(e) => e.target.style.background = "none"}
                    >
                      👁️
                    </button>

                    <button
                      className="edit-btn"
                      onClick={() => handleEdit(apt)}
                      title="Edit Appointment"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "5px",
                        borderRadius: "4px",
                        transition: "background 0.2s"
                      }}
                      onMouseOver={(e) => e.target.style.background = "#e3f2fd"}
                      onMouseOut={(e) => e.target.style.background = "none"}
                    >
                      ✏️
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(apt)}
                      title="Delete Appointment"
                      style={{
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        fontSize: "18px",
                        padding: "5px",
                        borderRadius: "4px",
                        transition: "background 0.2s"
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
                <td colSpan="9" style={{ textAlign: "center", padding: "30px", color: "#666" }}>
                  {searchTerm 
                    ? `No appointments found matching "${searchTerm}"` 
                    : filterType !== 'all'
                    ? `No ${filterType} appointments found`
                    : "No appointments found"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* VIEW POPUP */}
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
              <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Appointment Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div><strong>Appointment ID:</strong> {selectedAppointment.appointmentId || 'N/A'}</div>
                  <div><strong>MongoDB ID:</strong> <small>{selectedAppointment._id}</small></div>
                  <div><strong>Status:</strong> 
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
                  <div><strong>Date:</strong> {selectedAppointment.date}</div>
                  <div><strong>Time:</strong> {selectedAppointment.time}</div>
                  <div><strong>Department:</strong> {selectedAppointment.type || "Cardiology"}</div>
                  
                </div>
              </div>

              <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Patient Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div><strong>Patient Name:</strong> {selectedAppointment.patientName}</div>
                  <div><strong>Age/Gender:</strong> {selectedAppointment.age} / {selectedAppointment.gender}</div>
                  <div><strong>Phone:</strong> {selectedAppointment.phone}</div>
                  <div><strong>Email:</strong> {selectedAppointment.email}</div>
                </div>
              </div>

              {selectedAppointment.symptoms && (
                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Symptoms</h3>
                  <div>{selectedAppointment.symptoms}</div>
                </div>
              )}

              {selectedAppointment.notes && (
                <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Additional Notes</h3>
                  <div>{selectedAppointment.notes}</div>
                </div>
              )}

              <div style={{ gridColumn: "span 2", background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Booking Information</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                  <div><strong>Booking Date:</strong> {selectedAppointment.bookingDate}</div>
                  <div><strong>Booking Time:</strong> {selectedAppointment.bookingTime}</div>
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
      {showEditPopup && selectedAppointment && (
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
              width: "600px",
              maxHeight: "85vh",
              overflowY: "auto",
              background: "#fff",
              padding: "30px",
              borderRadius: "12px",
              boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ margin: 0, color: "#2c3e50" }}>✏️ Edit Appointment</h2>
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
                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Patient Details</h3>
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
                        <option value="">Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                      </select>
                      {editErrors.gender && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.gender}</span>}
                    </div>
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
                  </div>
                </div>

                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Symptoms (Optional)</h3>
                  <div className="symptoms-container">
                    <div 
                      className="symptoms-select-box"
                      onClick={() => setSymptomsDropdownOpen(!symptomsDropdownOpen)}
                      style={{
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        cursor: "pointer",
                        backgroundColor: "#fff",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center"
                      }}
                    >
                      <div className="selected-symptoms-preview">
                        {formData.symptoms?.length > 0 ? (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                            {formData.symptoms.slice(0, 2).map((symptom) => (
                              <span key={symptom} style={{
                                background: "#e3f2fd",
                                padding: "4px 8px",
                                borderRadius: "16px",
                                fontSize: "12px",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "4px"
                              }}>
                                {symptom}
                                <button 
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleSymptomChange(symptom);
                                  }}
                                  style={{
                                    background: "none",
                                    border: "none",
                                    cursor: "pointer",
                                    fontSize: "14px",
                                    padding: "0 2px"
                                  }}
                                >×</button>
                              </span>
                            ))}
                            {formData.symptoms.length > 2 && (
                              <span style={{ color: "#666", fontSize: "12px" }}>
                                +{formData.symptoms.length - 2} more
                              </span>
                            )}
                          </div>
                        ) : (
                          <span style={{ color: "#999" }}>Select symptoms</span>
                        )}
                      </div>
                      <span style={{ fontSize: "12px", color: "#666" }}>▼</span>
                    </div>
                    
                    {symptomsDropdownOpen && (
                      <div style={{
                        marginTop: "10px",
                        padding: "10px",
                        border: "1px solid #ddd",
                        borderRadius: "6px",
                        maxHeight: "200px",
                        overflowY: "auto",
                        backgroundColor: "#fff"
                      }}>
                        {cardiologySymptoms.map((symptom) => (
                          <label key={symptom} style={{ display: "block", padding: "5px", cursor: "pointer" }}>
                            <input
                              type="checkbox"
                              checked={formData.symptoms?.includes(symptom) || false}
                              onChange={() => handleSymptomChange(symptom)}
                              style={{ marginRight: "8px" }}
                            />
                            {symptom}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ background: "#f8f9fa", padding: "15px", borderRadius: "8px" }}>
                  <h3 style={{ margin: "0 0 15px 0", color: "#0d6efd", fontSize: "16px" }}>Appointment Details</h3>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <div>
                      <input
                        name="date"
                        type="date"
                        placeholder="Date *"
                        value={formData.date || ""}
                        onChange={handleEditChange}
                        min={new Date().toISOString().split('T')[0]}
                        style={{...inputStyle, ...(editErrors.date ? errorStyle : {})}}
                        required
                      />
                      {editErrors.date && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.date}</span>}
                    </div>
                    <div>
                      <input
                        name="time"
                        type="time"
                        placeholder="Time *"
                        value={formData.time || ""}
                        onChange={handleEditChange}
                        style={{...inputStyle, ...(editErrors.time ? errorStyle : {})}}
                        required
                      />
                      {editErrors.time && <span style={{color: "#dc3545", fontSize: "12px", marginTop: "3px", display: "block"}}>{editErrors.time}</span>}
                    </div>
                    <div>
                      <input
                        name="type"
                        placeholder="Department"
                        value={formData.type || "Cardiology"}
                        onChange={handleEditChange}
                        style={inputStyle}
                      />
                    </div>
                    
                    <div style={{ gridColumn: "span 2" }}>
                      <textarea
                        name="notes"
                        placeholder="Additional notes..."
                        value={formData.notes || ""}
                        onChange={handleEditChange}
                        rows="3"
                        style={{...inputStyle, resize: "vertical"}}
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
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPOINTMENT FORM POPUP */}
      {showPopup && (
        <AppointmentForm
          onClose={() => {
            console.log("Closing popup");
            setShowPopup(false);
            setSelectedPatientForAppointment(null);
          }}
          addAppointment={addAppointment}
          appointments={localAppointments}
          initialPatientData={selectedPatientForAppointment}
        />
      )}
    </div>
  );
}

export default Appointment;