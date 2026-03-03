// import React, { useState, useEffect } from "react";
// import { useNavigate } from "react-router-dom";
// import "./AdmitPatientForm.css";

// function AdmitPatientForm() {
//   const navigate = useNavigate();

//   const [formData, setFormData] = useState({
//     patientName: "",
//     patientId: "",
//     age: "",
//     gender: "",
//     address: "",
//     phone: "",
//     nameOfKin: "",
//     kinContact: "",
//     bedNo: "",
//     fromDate: new Date().toISOString().split('T')[0],
//     toDate: "",
//     symptoms: [],
//     admittingDoctor: ""
//   });

//   const [errors, setErrors] = useState({});
//   const [filteredPatients, setFilteredPatients] = useState([]);
//   const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
//   const [availableBedsList, setAvailableBedsList] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [symptomsDropdownOpen, setSymptomsDropdownOpen] = useState(false);
//   const [existingAdmissions, setExistingAdmissions] = useState([]);
//   const [registeredPatients, setRegisteredPatients] = useState([]);
//   const [selectedPatientValid, setSelectedPatientValid] = useState(false);
//   const [nonRegisteredError, setNonRegisteredError] = useState("");

//   const cardiologySymptoms = [
//     "Chest Pain", "Shortness of Breath", "Palpitations", 
//     "High Blood Pressure", "Dizziness", 
//     "Swelling in Legs", "Irregular Heartbeat",
//     "Sweating", "Jaw Pain",
//     "Lightheadedness", "Rapid Heartbeat", "Slow Heartbeat",
//     "Chest Discomfort", "Coughing",
//     "Bluish Skin", "Fainting", "Confusion"
//   ];

//   // Fetch registered patients from backend
//   const fetchRegisteredPatients = async () => {
//     try {
//       console.log("📥 Fetching registered patients...");
//       const response = await fetch('http://localhost:8001/api/patients');
//       const data = await response.json();
//       console.log("📥 Response:", data);
      
//       if (data.success) {
//         setRegisteredPatients(data.data || []);
//         console.log(`✅ Loaded ${data.data?.length || 0} registered patients`);
//       } else {
//         console.error("❌ Failed to fetch patients:", data.message);
//       }
//     } catch (error) {
//       console.error('❌ Error fetching registered patients:', error);
//     }
//   };

//   // Fetch available beds from backend
//   const fetchAvailableBeds = async () => {
//     try {
//       const response = await fetch('http://localhost:8001/api/availablebeds');
//       const data = await response.json();
//       if (data.success) {
//         setAvailableBedsList(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching available beds:', error);
//     }
//   };

//   // Fetch existing admissions
//   const fetchAdmissions = async () => {
//     try {
//       const response = await fetch('http://localhost:8001/api/admitpatient');
//       const data = await response.json();
//       if (data.success) {
//         setExistingAdmissions(data.data);
//       }
//     } catch (error) {
//       console.error('Error fetching admissions:', error);
//     }
//   };

//   useEffect(() => {
//     fetchRegisteredPatients();
//     fetchAdmissions();
//     fetchAvailableBeds();
//   }, []);

//   const getMinDate = () => new Date().toISOString().split('T')[0];

//   // Validation Functions
//   const validatePatientName = (name) => {
//     if (!name || name.trim() === "") return "Patient name is required";
    
//     // If patient is already selected, validation passes
//     if (selectedPatientValid) return "";
    
//     // Check if name exists in registered patients
//     const patientExists = registeredPatients.some(p => 
//       p.patientName?.toLowerCase() === name.toLowerCase()
//     );
    
//     if (!patientExists) {
//       return "❌ Patient not found in registered list! Please select from suggestions.";
//     }
//     return "";
//   };

//   const validateAge = (age) => {
//     if (!age || age === "") return "Age is required";
//     const ageNum = parseInt(age);
//     if (isNaN(ageNum)) return "Age must be a number";
//     if (ageNum < 1) return "Age must be at least 1 year";
//     if (ageNum > 120) return "Age cannot exceed 120 years";
//     return "";
//   };

//   const validatePhone = (phone, fieldName = "Phone") => {
//     if (!phone || phone === "") return `${fieldName} number is required`;
//     const cleaned = phone.replace(/\D/g, '');
//     if (cleaned.length !== 10) return `${fieldName} number must be exactly 10 digits`;
//     if (!['7', '8', '9'].includes(cleaned[0])) return `${fieldName} number must start with 7, 8, or 9`;
//     return "";
//   };

//   const validateKinContact = (contact) => {
//     if (!contact || contact === "") return "Emergency contact number is required";
//     const cleaned = contact.replace(/\D/g, '');
//     if (cleaned.length !== 10) return "Emergency contact must be exactly 10 digits";
//     if (!['7', '8', '9'].includes(cleaned[0])) return "Emergency contact must start with 7, 8, or 9";
//     return "";
//   };

//   const validateBedNo = (bedNo) => {
//     if (!bedNo || bedNo === "") return "Bed number is required";
    
//     const formattedBed = formatBedNo(bedNo);
//     if (!formattedBed) return "Please enter a valid bed number (e.g., B1, B2)";
    
//     if (!availableBedsList.includes(formattedBed)) {
//       return `Bed ${formattedBed} is not available. Available beds: ${availableBedsList.join(', ')}`;
//     }
    
//     const isOccupied = existingAdmissions.some(adm => 
//       adm.bedNo === formattedBed && adm.status === "Admitted"
//     );
    
//     if (isOccupied) return `Bed ${formattedBed} is already occupied by another patient`;
    
//     return "";
//   };

//   const validateFromDate = (date) => {
//     if (!date) return "Admission date is required";
//     const selectedDate = new Date(date);
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);
//     if (selectedDate < today) return "Admission date cannot be in the past";
//     return "";
//   };

//   const validateToDate = (toDate, fromDate) => {
//     if (!toDate) return "";
//     if (toDate < fromDate) return "Discharge date cannot be before admission date";
//     return "";
//   };

//   const validateAdmittingDoctor = (doctor) => {
//     if (!doctor || doctor.trim() === "") return "Admitting doctor name is required";
//     const trimmed = doctor.trim();
//     if (trimmed.length < 3) return "Doctor name must be at least 3 characters";
//     if (!/^[a-zA-Z\s\.\-']+$/.test(trimmed)) return "Doctor name can only contain letters, spaces, dots, hyphens and apostrophes";
//     return "";
//   };

//   const isBedOccupied = (bedNo) => {
//     return existingAdmissions.some(adm => 
//       adm.bedNo === bedNo && adm.status === "Admitted"
//     );
//   };

//   const formatBedNo = (bed) => {
//     if (!bed) return "";
//     const match = bed.match(/^[bB]?(\d+)$/);
//     return match ? `B${match[1]}` : bed;
//   };

//   const validateForm = () => {
//     const newErrors = {};

//     // Only validate patient name if not selected
//     if (!selectedPatientValid) {
//       const nameError = validatePatientName(formData.patientName);
//       if (nameError) newErrors.patientName = nameError;
//     }

//     const ageError = validateAge(formData.age);
//     if (ageError) newErrors.age = ageError;

//     const phoneError = validatePhone(formData.phone, "Phone");
//     if (phoneError) newErrors.phone = phoneError;

//     const kinError = validateKinContact(formData.kinContact);
//     if (kinError) newErrors.kinContact = kinError;

//     const bedError = validateBedNo(formData.bedNo);
//     if (bedError) newErrors.bedNo = bedError;

//     const fromDateError = validateFromDate(formData.fromDate);
//     if (fromDateError) newErrors.fromDate = fromDateError;

//     if (formData.toDate) {
//       const toDateError = validateToDate(formData.toDate, formData.fromDate);
//       if (toDateError) newErrors.toDate = toDateError;
//     }

//     const doctorError = validateAdmittingDoctor(formData.admittingDoctor);
//     if (doctorError) newErrors.admittingDoctor = doctorError;

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;

//     // Handle different input types
//     if (name === "phone" || name === "kinContact") {
//       const cleaned = value.replace(/\D/g, '');
//       if (cleaned.length <= 10) setFormData(prev => ({ ...prev, [name]: cleaned }));
//     } else if (name === "age") {
//       if (value === "" || /^\d+$/.test(value)) {
//         setFormData(prev => ({ ...prev, [name]: value }));
//       }
//     } else if (name === "patientName" || name === "admittingDoctor" || name === "nameOfKin") {
//       if (value === "" || /^[a-zA-Z\s\.\-']*$/.test(value)) {
//         setFormData(prev => ({ ...prev, [name]: value }));
//       }
//     } else {
//       setFormData(prev => ({ ...prev, [name]: value }));
//     }

//     // Special handling for patientName search
//     if (name === "patientName") {
//       // When user manually changes name, invalidate the selected patient
//       setSelectedPatientValid(false);
//       setNonRegisteredError("");

//       if (value.length >= 2) {
//         console.log("🔍 Searching for:", value);
//         const results = searchPatients(value);
//         console.log("📋 Search results:", results);
//         setFilteredPatients(results);
//         setShowPatientSuggestions(results.length > 0);
        
//         if (results.length === 0 && value.length > 2) {
//           setNonRegisteredError("❌ This patient is not registered! Please register first.");
//         }
//       } else {
//         setShowPatientSuggestions(false);
//         setFilteredPatients([]);
//         setNonRegisteredError("");
//       }
//     }

//     // Clear error for this field if it exists
//     if (errors[name]) {
//       setErrors(prev => ({ ...prev, [name]: "" }));
//     }
//   };

//   const handleSymptomChange = (symptom) => {
//     setFormData(prev => ({
//       ...prev,
//       symptoms: prev.symptoms.includes(symptom)
//         ? prev.symptoms.filter(s => s !== symptom)
//         : [...prev.symptoms, symptom],
//     }));
//   };

//   // Search patients from registered patients list
//   const searchPatients = (query) => {
//     if (!registeredPatients || registeredPatients.length === 0) {
//       console.log("⚠️ No registered patients available");
//       return [];
//     }
    
//     const results = registeredPatients.filter(p =>
//       p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
//       (p.phone && p.phone.includes(query))
//     );
    
//     console.log(`🔍 Found ${results.length} matches for "${query}"`);
//     return results;
//   };

//   // Select patient and auto-fill all matching fields
//   const selectPatient = (patient) => {
//     console.log("✅ Selected registered patient:", patient);
    
//     // Create a unique patient ID if not present
//     const patientId = patient.id || patient._id || `PAT-${Date.now()}`;
    
//     setFormData(prev => ({
//       ...prev,
//       patientName: patient.patientName || "",
//       patientId: patientId,
//       age: patient.age?.toString() || "",
//       gender: patient.gender || "",
//       address: patient.address || "",
//       phone: patient.phone || "",
//       nameOfKin: patient.nameOfKin || "",
//       kinContact: patient.kinContact || "",
//       // Keep existing values for other fields
//       bedNo: prev.bedNo,
//       fromDate: prev.fromDate,
//       toDate: prev.toDate,
//       admittingDoctor: prev.admittingDoctor,
//       symptoms: prev.symptoms
//     }));
    
//     // IMPORTANT: Set selectedPatientValid to true
//     setSelectedPatientValid(true);
//     setShowPatientSuggestions(false);
//     setFilteredPatients([]);
//     setNonRegisteredError("");
    
//     // Clear any patient name errors
//     if (errors.patientName) {
//       setErrors(prev => ({ ...prev, patientName: "" }));
//     }
    
//     // Force a re-render by updating a dummy state
//     setTimeout(() => {
//       console.log("✅ Patient selected and form updated", { 
//         selectedPatientValid: true,
//         patientName: patient.patientName 
//       });
//     }, 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     console.log("📝 Form submitted", { 
//       selectedPatientValid, 
//       formData,
//       errors 
//     });
    
//     // Check if patient is selected
//     if (!selectedPatientValid) {
//       alert("❌ Please select a patient from the registered patients list!");
//       return;
//     }
    
//     // Validate form
//     if (!validateForm()) {
//       console.log("❌ Form validation failed", errors);
      
//       // Scroll to first error
//       const firstError = Object.keys(errors)[0];
//       if (firstError) {
//         const errorElement = document.querySelector(`[name="${firstError}"]`);
//         if (errorElement) {
//           errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
//           errorElement.focus();
//         }
//       }
//       return;
//     }

//     setIsLoading(true);

//     const formattedBed = formatBedNo(formData.bedNo);
    
//     if (isBedOccupied(formattedBed)) {
//       alert(`❌ Bed ${formattedBed} is already occupied! Please select another bed.`);
//       setIsLoading(false);
//       return;
//     }

//     // Prepare submission data
//     const submissionData = {
//       id: `ADM-${Date.now()}`,
//       ...formData,
//       bedNo: formattedBed,
//       admissionDate: new Date().toISOString().split('T')[0],
//       admissionTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
//       status: "Admitted"
//     };

//     try {
//       console.log("📤 Submitting admission data:", submissionData);
      
//       const response = await fetch('http://localhost:8001/api/admitpatient', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(submissionData)
//       });

//       const data = await response.json();

//       if (data.success) {
//         alert(`✅ Patient ${formData.patientName} admitted to Bed ${formattedBed}`);
//         navigate("/receptionist-dashboard/admitlist");
//       } else {
//         alert(`❌ Error: ${data.message}`);
//         setIsLoading(false);
//       }
//     } catch (error) {
//       console.error('Error admitting patient:', error);
//       alert('❌ Failed to admit patient. Please try again.');
//       setIsLoading(false);
//     }
//   };

//   const handleCancel = () => {
//     console.log("🔙 Going back to previous page");
//     navigate("/reception-dashboard");
//   };

//   // Check if all patient fields should be disabled
//   const shouldDisablePatientFields = () => {
//     return isLoading || selectedPatientValid;
//   };

//   // Debug: Log current state
//   useEffect(() => {
//     console.log("🔄 Current state:", {
//       selectedPatientValid,
//       patientName: formData.patientName,
//       patientId: formData.patientId,
//       isLoading,
//       errors: Object.keys(errors).length
//     });
//   }, [selectedPatientValid, formData.patientName, formData.patientId, isLoading, errors]);

//   return (
//     <div className="form-overlay">
//       <div className="form-container">
//         <div className="form-header">
//           <h2>🏥 Admit Patient</h2>
//           <button 
//             className="close-btn" 
//             onClick={handleCancel} 
//             disabled={isLoading}
//             type="button"
//           >
//             ×
//           </button>
//         </div>

//         <form onSubmit={handleSubmit}>
//           <datalist id="bed-numbers">
//             {availableBedsList.map((bed, i) => <option key={i} value={bed} />)}
//           </datalist>

//           <div className="form-section">
//             <h4>Patient Information</h4>
//             <div className="form-group patient-search-container">
//               <label>Patient Name *</label>
//               <input
//                 type="text"
//                 name="patientName"
//                 value={formData.patientName}
//                 onChange={handleChange}
//                 placeholder="Search and select from registered patients"
//                 required
//                 disabled={isLoading}
//                 className={`${errors.patientName ? "error" : ""} ${selectedPatientValid ? "valid" : ""}`}
//                 autoComplete="off"
//               />
//               {errors.patientName && <span className="error-message">{errors.patientName}</span>}
              
//               {nonRegisteredError && !selectedPatientValid && (
//                 <span className="error-message" style={{ color: '#dc3545', fontWeight: 'bold' }}>
//                   {nonRegisteredError}
//                 </span>
//               )}
              
//               {!selectedPatientValid && formData.patientName && !errors.patientName && !nonRegisteredError && (
//                 <span className="warning-message">⚠️ Please select from suggestions</span>
//               )}

//               {/* Suggestions dropdown */}
//               {showPatientSuggestions && filteredPatients.length > 0 && !isLoading && (
//                 <div className="patient-suggestions">
//                   {filteredPatients.map(patient => (
//                     <div
//                       key={patient.id || patient._id || Math.random()}
//                       className="patient-suggestion-item"
//                       onClick={() => selectPatient(patient)}
//                     >
//                       <strong>{patient.patientName}</strong>
//                       <span>Age: {patient.age} | Phone: {patient.phone}</span>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Age *</label>
//                 <input
//                   type="text"
//                   name="age"
//                   value={formData.age}
//                   onChange={handleChange}
//                   placeholder="Age (numbers only)"
//                   min="1"
//                   max="120"
//                   required
//                   disabled={shouldDisablePatientFields()}
//                   className={errors.age ? "error" : ""}
//                   readOnly={selectedPatientValid}
//                 />
//                 {errors.age && <span className="error-message">{errors.age}</span>}
//               </div>
//               <div className="form-group">
//                 <label>Gender</label>
//                 <select 
//                   name="gender" 
//                   value={formData.gender} 
//                   onChange={handleChange}
//                   disabled={shouldDisablePatientFields()}
//                 >
//                   <option>Select Gender</option>
//                   <option value="Male">Male</option>
//                   <option value="Female">Female</option>
//                   <option value="Other">Other</option>
//                 </select>
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group full-width">
//                 <label>Address</label>
//                 <input
//                   type="text"
//                   name="address"
//                   value={formData.address}
//                   onChange={handleChange}
//                   placeholder="Enter address"
//                   disabled={shouldDisablePatientFields()}
//                 />
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Mobile Number *</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   placeholder="10-digit number (numbers only)"
//                   maxLength="10"
//                   required
//                   disabled={shouldDisablePatientFields()}
//                   className={errors.phone ? "error" : ""}
//                 />
//                 {errors.phone && <span className="error-message">{errors.phone}</span>}
//               </div>
//             </div>

//             <div className="form-row">
//               <div className="form-group">
//                 <label>Emergency Contact *</label>
//                 <input
//                   type="tel"
//                   name="kinContact"
//                   value={formData.kinContact}
//                   onChange={handleChange}
//                   placeholder="10-digit number (numbers only)"
//                   maxLength="10"
//                   required
//                   disabled={shouldDisablePatientFields()}
//                   className={errors.kinContact ? "error" : ""}
//                 />
//                 {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
//               </div>
//             </div>
//           </div>

//           <div className="form-section">
//             <h4>Admission Details</h4>
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Bed Number *</label>
//                 <input
//                   type="text"
//                   name="bedNo"
//                   value={formData.bedNo}
//                   onChange={handleChange}
//                   placeholder="Select bed number (e.g., B1)"
//                   list="bed-numbers"
//                   required
//                   disabled={isLoading}
//                   className={errors.bedNo ? "error" : ""}
//                 />
//                 {errors.bedNo && <span className="error-message">{errors.bedNo}</span>}
//                 <small className="field-hint">Available beds: {availableBedsList.length}</small>
//               </div>
//             </div>
            
//             <div className="form-row">
//               <div className="form-group">
//                 <label>Admission Date *</label>
//                 <input 
//                   type="date"
//                   name="fromDate"
//                   value={formData.fromDate}
//                   onChange={handleChange}
//                   min={getMinDate()}
//                   required
//                   disabled={isLoading}
//                   className={errors.fromDate ? "error" : ""}
//                 />
//                 {errors.fromDate && <span className="error-message">{errors.fromDate}</span>}
//               </div>
              
//               <div className="form-group">
//                 <label>Expected Discharge Date</label>
//                 <input style={{marginTop:"22px"}}
//                   type="date"
//                   name="toDate"
//                   value={formData.toDate}
//                   onChange={handleChange}
//                   min={formData.fromDate || getMinDate()}
//                   disabled={isLoading}
//                   className={errors.toDate ? "error" : ""}
//                 />
//                 {errors.toDate && <span className="error-message">{errors.toDate}</span>}
//               </div>
//             </div>

//             {/* <div className="form-group">
//               <label>Admitting Doctor *</label>
//               <input
//                 type="text"
//                 name="admittingDoctor"
//                 value={formData.admittingDoctor}
//                 onChange={handleChange}
//                 placeholder="Enter admitting doctor's name"
//                 required
//                 disabled={isLoading}
//                 className={errors.admittingDoctor ? "error" : ""}
//               />
//               {errors.admittingDoctor && <span className="error-message">{errors.admittingDoctor}</span>}
//             </div> */}

//             <div className="form-section">
//               <h4>Symptoms (Optional)</h4>
//               <div className="symptoms-container">
//                 <div 
//                   className={`symptoms-select-box ${symptomsDropdownOpen ? 'open' : ''}`}
//                   onClick={() => !isLoading && setSymptomsDropdownOpen(!symptomsDropdownOpen)}
//                 >
//                   <div className="selected-symptoms-preview">
//                     {formData.symptoms.length > 0 ? (
//                       <div className="selected-chips">
//                         {formData.symptoms.slice(0, 2).map((symptom) => (
//                           <span key={symptom} className="symptom-chip">
//                             {symptom}
//                             <button 
//                               type="button"
//                               className="chip-remove"
//                               onClick={(e) => {
//                                 e.stopPropagation();
//                                 handleSymptomChange(symptom);
//                               }}
//                               disabled={isLoading}
//                             >×</button>
//                           </span>
//                         ))}
//                         {formData.symptoms.length > 2 && (
//                           <span className="more-count">
//                             +{formData.symptoms.length - 2} more
//                           </span>
//                         )}
//                       </div>
//                     ) : (
//                       <span className="placeholder">Select symptoms</span>
//                     )}
//                   </div>
//                   <span className={`dropdown-arrow ${symptomsDropdownOpen ? 'open' : ''}`}>▼</span>
//                 </div>
                
//                 {symptomsDropdownOpen && !isLoading && (
//                   <div className="symptoms-dropdown-menu">
//                     {cardiologySymptoms.map((symptom) => (
//                       <label key={symptom} className="symptom-option">
//                         <input
//                           type="checkbox"
//                           checked={formData.symptoms.includes(symptom)}
//                           onChange={() => handleSymptomChange(symptom)}
//                         />
//                         <span className="checkbox-label">{symptom}</span>
//                       </label>
//                     ))}
//                   </div>
//                 )}
//               </div>
//             </div>
//           </div>

//           <div className="form-actions">
//             <button 
//               type="button" 
//               onClick={handleCancel} 
//               className="cancel-btn" 
//               disabled={isLoading}
//             >
//               Cancel
//             </button>
//             <button 
//               type="submit" 
//               className="confirm-btn"
//               disabled={isLoading || !selectedPatientValid}
//             >
//               {isLoading ? (
//                 <>
//                   <span className="loading-spinner"></span>
//                   Admitting...
//                 </>
//               ) : (
//                 "✓ Admit Patient"
//               )}
//             </button>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default AdmitPatientForm;

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdmitPatientForm.css";

function AdmitPatientForm() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    age: "",
    gender: "", // Changed from "Male" to empty string
    address: "",
    phone: "",
    nameOfKin: "",
    kinContact: "",
    bedNo: "",
    fromDate: new Date().toISOString().split('T')[0],
    toDate: "",
    symptoms: [],
    // admittingDoctor: ""  // Completely removed
  });

  const [errors, setErrors] = useState({});
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [showPatientSuggestions, setShowPatientSuggestions] = useState(false);
  const [availableBedsList, setAvailableBedsList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [symptomsDropdownOpen, setSymptomsDropdownOpen] = useState(false);
  const [existingAdmissions, setExistingAdmissions] = useState([]);
  const [registeredPatients, setRegisteredPatients] = useState([]);
  const [selectedPatientValid, setSelectedPatientValid] = useState(false);
  const [nonRegisteredError, setNonRegisteredError] = useState("");

  const cardiologySymptoms = [
    "Chest Pain", "Shortness of Breath", "Palpitations", 
    "High Blood Pressure", "Dizziness", 
    "Swelling in Legs", "Irregular Heartbeat",
    "Sweating", "Jaw Pain",
    "Lightheadedness", "Rapid Heartbeat", "Slow Heartbeat",
    "Chest Discomfort", "Coughing",
    "Bluish Skin", "Fainting", "Confusion"
  ];

  // Fetch registered patients from backend
  const fetchRegisteredPatients = async () => {
    try {
      console.log("📥 Fetching registered patients...");
      const response = await fetch('http://localhost:8001/api/patients');
      const data = await response.json();
      console.log("📥 Response:", data);
      
      if (data.success) {
        setRegisteredPatients(data.data || []);
        console.log(`✅ Loaded ${data.data?.length || 0} registered patients`);
      } else {
        console.error("❌ Failed to fetch patients:", data.message);
      }
    } catch (error) {
      console.error('❌ Error fetching registered patients:', error);
    }
  };

  // Fetch available beds from backend
  const fetchAvailableBeds = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/availablebeds');
      const data = await response.json();
      if (data.success) {
        setAvailableBedsList(data.data);
      }
    } catch (error) {
      console.error('Error fetching available beds:', error);
    }
  };

  // Fetch existing admissions
  const fetchAdmissions = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/admitpatient');
      const data = await response.json();
      if (data.success) {
        setExistingAdmissions(data.data);
      }
    } catch (error) {
      console.error('Error fetching admissions:', error);
    }
  };

  useEffect(() => {
    fetchRegisteredPatients();
    fetchAdmissions();
    fetchAvailableBeds();
  }, []);

  const getMinDate = () => new Date().toISOString().split('T')[0];

  // Validation Functions
  const validatePatientName = (name) => {
    if (!name || name.trim() === "") return "Patient name is required";
    
    // If patient is already selected, validation passes
    if (selectedPatientValid) return "";
    
    // Check if name exists in registered patients
    const patientExists = registeredPatients.some(p => 
      p.patientName?.toLowerCase() === name.toLowerCase()
    );
    
    if (!patientExists) {
      return "❌ Patient not found in registered list! Please select from suggestions.";
    }
    return "";
  };

  const validateAge = (age) => {
    if (!age || age === "") return "Age is required";
    const ageNum = parseInt(age);
    if (isNaN(ageNum)) return "Age must be a number";
    if (ageNum < 1) return "Age must be at least 1 year";
    if (ageNum > 120) return "Age cannot exceed 120 years";
    return "";
  };

  const validatePhone = (phone, fieldName = "Phone") => {
    if (!phone || phone === "") return `${fieldName} number is required`;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return `${fieldName} number must be exactly 10 digits`;
    if (!['7', '8', '9'].includes(cleaned[0])) return `${fieldName} number must start with 7, 8, or 9`;
    return "";
  };

  const validateKinContact = (contact) => {
    if (!contact || contact === "") return "Emergency contact number is required";
    const cleaned = contact.replace(/\D/g, '');
    if (cleaned.length !== 10) return "Emergency contact must be exactly 10 digits";
    if (!['7', '8', '9'].includes(cleaned[0])) return "Emergency contact must start with 7, 8, or 9";
    return "";
  };

  const validateBedNo = (bedNo) => {
    if (!bedNo || bedNo === "") return "Bed number is required";
    
    const formattedBed = formatBedNo(bedNo);
    if (!formattedBed) return "Please enter a valid bed number (e.g., B1, B2)";
    
    if (!availableBedsList.includes(formattedBed)) {
      return `Bed ${formattedBed} is not available. Available beds: ${availableBedsList.join(', ')}`;
    }
    
    const isOccupied = existingAdmissions.some(adm => 
      adm.bedNo === formattedBed && adm.status === "Admitted"
    );
    
    if (isOccupied) return `Bed ${formattedBed} is already occupied by another patient`;
    
    return "";
  };

  const validateFromDate = (date) => {
    if (!date) return "Admission date is required";
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (selectedDate < today) return "Admission date cannot be in the past";
    return "";
  };

  const validateToDate = (toDate, fromDate) => {
    if (!toDate) return "";
    if (toDate < fromDate) return "Discharge date cannot be before admission date";
    return "";
  };

  // Removed validateAdmittingDoctor function completely

  const isBedOccupied = (bedNo) => {
    return existingAdmissions.some(adm => 
      adm.bedNo === bedNo && adm.status === "Admitted"
    );
  };

  const formatBedNo = (bed) => {
    if (!bed) return "";
    const match = bed.match(/^[bB]?(\d+)$/);
    return match ? `B${match[1]}` : bed;
  };

  const validateForm = () => {
    const newErrors = {};

    // Only validate patient name if not selected
    if (!selectedPatientValid) {
      const nameError = validatePatientName(formData.patientName);
      if (nameError) newErrors.patientName = nameError;
    }

    const ageError = validateAge(formData.age);
    if (ageError) newErrors.age = ageError;

    const phoneError = validatePhone(formData.phone, "Phone");
    if (phoneError) newErrors.phone = phoneError;

    const kinError = validateKinContact(formData.kinContact);
    if (kinError) newErrors.kinContact = kinError;

    const bedError = validateBedNo(formData.bedNo);
    if (bedError) newErrors.bedNo = bedError;

    const fromDateError = validateFromDate(formData.fromDate);
    if (fromDateError) newErrors.fromDate = fromDateError;

    if (formData.toDate) {
      const toDateError = validateToDate(formData.toDate, formData.fromDate);
      if (toDateError) newErrors.toDate = toDateError;
    }

    // Removed admitting doctor validation

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Handle different input types
    if (name === "phone" || name === "kinContact") {
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === "age") {
      if (value === "" || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (name === "patientName" || name === "nameOfKin") { // Removed admittingDoctor
      if (value === "" || /^[a-zA-Z\s\.\-']*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }

    // Special handling for patientName search
    if (name === "patientName") {
      // When user manually changes name, invalidate the selected patient
      setSelectedPatientValid(false);
      setNonRegisteredError("");

      if (value.length >= 2) {
        console.log("🔍 Searching for:", value);
        const results = searchPatients(value);
        console.log("📋 Search results:", results);
        setFilteredPatients(results);
        setShowPatientSuggestions(results.length > 0);
        
        if (results.length === 0 && value.length > 2) {
          setNonRegisteredError("❌ This patient is not registered! Please register first.");
        }
      } else {
        setShowPatientSuggestions(false);
        setFilteredPatients([]);
        setNonRegisteredError("");
      }
    }

    // Clear error for this field if it exists
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSymptomChange = (symptom) => {
    setFormData(prev => ({
      ...prev,
      symptoms: prev.symptoms.includes(symptom)
        ? prev.symptoms.filter(s => s !== symptom)
        : [...prev.symptoms, symptom],
    }));
  };

  // Search patients from registered patients list
  const searchPatients = (query) => {
    if (!registeredPatients || registeredPatients.length === 0) {
      console.log("⚠️ No registered patients available");
      return [];
    }
    
    const results = registeredPatients.filter(p =>
      p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
      (p.phone && p.phone.includes(query))
    );
    
    console.log(`🔍 Found ${results.length} matches for "${query}"`);
    return results;
  };

  // Select patient and auto-fill all matching fields
  const selectPatient = (patient) => {
    console.log("✅ Selected registered patient:", patient);
    
    // Create a unique patient ID if not present
    const patientId = patient.id || patient._id || `PAT-${Date.now()}`;
    
    setFormData(prev => ({
      ...prev,
      patientName: patient.patientName || "",
      patientId: patientId,
      age: patient.age?.toString() || "",
      gender: patient.gender || "", // Keep as empty if not provided
      address: patient.address || "",
      phone: patient.phone || "",
      nameOfKin: patient.nameOfKin || "",
      kinContact: patient.kinContact || "",
      // Keep existing values for other fields
      bedNo: prev.bedNo,
      fromDate: prev.fromDate,
      toDate: prev.toDate,
      // admittingDoctor removed
      symptoms: prev.symptoms
    }));
    
    // IMPORTANT: Set selectedPatientValid to true
    setSelectedPatientValid(true);
    setShowPatientSuggestions(false);
    setFilteredPatients([]);
    setNonRegisteredError("");
    
    // Clear any patient name errors
    if (errors.patientName) {
      setErrors(prev => ({ ...prev, patientName: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    console.log("📝 Form submitted", { 
      selectedPatientValid, 
      formData,
      errors 
    });
    
    // Check if patient is selected
    if (!selectedPatientValid) {
      alert("❌ Please select a patient from the registered patients list!");
      return;
    }
    
    // Check if gender is selected
    if (!formData.gender) {
      alert("❌ Please select gender!");
      return;
    }
    
    // Validate form
    if (!validateForm()) {
      console.log("❌ Form validation failed", errors);
      
      // Scroll to first error
      const firstError = Object.keys(errors)[0];
      if (firstError) {
        const errorElement = document.querySelector(`[name="${firstError}"]`);
        if (errorElement) {
          errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          errorElement.focus();
        }
      }
      return;
    }

    setIsLoading(true);

    const formattedBed = formatBedNo(formData.bedNo);
    
    if (isBedOccupied(formattedBed)) {
      alert(`❌ Bed ${formattedBed} is already occupied! Please select another bed.`);
      setIsLoading(false);
      return;
    }

    // Prepare submission data (removed admittingDoctor)
    const submissionData = {
      id: `ADM-${Date.now()}`,
      patientName: formData.patientName,
      patientId: formData.patientId,
      age: formData.age,
      gender: formData.gender,
      address: formData.address,
      phone: formData.phone,
      nameOfKin: formData.nameOfKin,
      kinContact: formData.kinContact,
      bedNo: formattedBed,
      fromDate: formData.fromDate,
      toDate: formData.toDate,
      symptoms: formData.symptoms,
      admissionDate: new Date().toISOString().split('T')[0],
      admissionTime: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false }),
      status: "Admitted"
    };

    try {
      console.log("📤 Submitting admission data:", submissionData);
      
      const response = await fetch('http://localhost:8001/api/admitpatient', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData)
      });

      const data = await response.json();

      if (data.success) {
        alert(`✅ Patient ${formData.patientName} admitted to Bed ${formattedBed}`);
        navigate("/receptionist-dashboard/admitlist");
      } else {
        alert(`❌ Error: ${data.message}`);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Error admitting patient:', error);
      alert('❌ Failed to admit patient. Please try again.');
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    console.log("🔙 Going back to previous page");
    navigate("/reception-dashboard");
  };

  // Check if all patient fields should be disabled
  const shouldDisablePatientFields = () => {
    return isLoading || selectedPatientValid;
  };

  return (
    <div className="form-overlay">
      <div className="form-container">
        <div className="form-header">
          <h2>🏥 Admit Patient</h2>
          <button 
            className="close-btn" 
            onClick={handleCancel} 
            disabled={isLoading}
            type="button"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <datalist id="bed-numbers">
            {availableBedsList.map((bed, i) => <option key={i} value={bed} />)}
          </datalist>

          <div className="form-section">
            <h4>Patient Information</h4>
            <div className="form-group patient-search-container">
              <label>Patient Name *</label>
              <input
                type="text"
                name="patientName"
                value={formData.patientName}
                onChange={handleChange}
                placeholder="Search and select from registered patients"
                required
                disabled={isLoading}
                className={`${errors.patientName ? "error" : ""} ${selectedPatientValid ? "valid" : ""}`}
                autoComplete="off"
              />
              {errors.patientName && <span className="error-message">{errors.patientName}</span>}
              
              {nonRegisteredError && !selectedPatientValid && (
                <span className="error-message" style={{ color: '#dc3545', fontWeight: 'bold' }}>
                  {nonRegisteredError}
                </span>
              )}
              
              {!selectedPatientValid && formData.patientName && !errors.patientName && !nonRegisteredError && (
                <span className="warning-message">⚠️ Please select from suggestions</span>
              )}

              {/* Suggestions dropdown */}
              {showPatientSuggestions && filteredPatients.length > 0 && !isLoading && (
                <div className="patient-suggestions">
                  {filteredPatients.map(patient => (
                    <div
                      key={patient.id || patient._id || Math.random()}
                      className="patient-suggestion-item"
                      onClick={() => selectPatient(patient)}
                    >
                      <strong>{patient.patientName}</strong>
                      <span>Age: {patient.age} | Phone: {patient.phone}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="text"
                  name="age"
                  value={formData.age}
                  onChange={handleChange}
                  placeholder="Age (numbers only)"
                  min="1"
                  max="120"
                  required
                  disabled={shouldDisablePatientFields()}
                  className={errors.age ? "error" : ""}
                  readOnly={selectedPatientValid}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  disabled={shouldDisablePatientFields()}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
                {errors.gender && <span className="error-message">{errors.gender}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                  disabled={shouldDisablePatientFields()}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Mobile Number *</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10-digit number (numbers only)"
                  maxLength="10"
                  required
                  disabled={shouldDisablePatientFields()}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Emergency Contact *</label>
                <input
                  type="tel"
                  name="kinContact"
                  value={formData.kinContact}
                  onChange={handleChange}
                  placeholder="10-digit number (numbers only)"
                  maxLength="10"
                  required
                  disabled={shouldDisablePatientFields()}
                  className={errors.kinContact ? "error" : ""}
                />
                {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Admission Details</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Bed Number *</label>
                <input
                  type="text"
                  name="bedNo"
                  value={formData.bedNo}
                  onChange={handleChange}
                  placeholder="Select bed number (e.g., B1)"
                  list="bed-numbers"
                  required
                  disabled={isLoading}
                  className={errors.bedNo ? "error" : ""}
                />
                {errors.bedNo && <span className="error-message">{errors.bedNo}</span>}
                <small className="field-hint">Available beds: {availableBedsList.length}</small>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Admission Date *</label>
                <input 
                  type="date"
                  name="fromDate"
                  value={formData.fromDate}
                  onChange={handleChange}
                  min={getMinDate()}
                  required
                  disabled={isLoading}
                  className={errors.fromDate ? "error" : ""}
                />
                {errors.fromDate && <span className="error-message">{errors.fromDate}</span>}
              </div>
              
              <div className="form-group">
                <label>Expected Discharge Date</label>
                <input
                  type="date"
                  name="toDate"
                  value={formData.toDate}
                  onChange={handleChange}
                  min={formData.fromDate || getMinDate()}
                  disabled={isLoading}
                  className={errors.toDate ? "error" : ""}
                />
                {errors.toDate && <span className="error-message">{errors.toDate}</span>}
              </div>
            </div>

            {/* Admitting Doctor field completely removed */}

            <div className="form-section">
              <h4>Symptoms (Optional)</h4>
              <div className="symptoms-container">
                <div 
                  className={`symptoms-select-box ${symptomsDropdownOpen ? 'open' : ''}`}
                  onClick={() => !isLoading && setSymptomsDropdownOpen(!symptomsDropdownOpen)}
                >
                  <div className="selected-symptoms-preview">
                    {formData.symptoms.length > 0 ? (
                      <div className="selected-chips">
                        {formData.symptoms.slice(0, 2).map((symptom) => (
                          <span key={symptom} className="symptom-chip">
                            {symptom}
                            <button 
                              type="button"
                              className="chip-remove"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleSymptomChange(symptom);
                              }}
                              disabled={isLoading}
                            >×</button>
                          </span>
                        ))}
                        {formData.symptoms.length > 2 && (
                          <span className="more-count">
                            +{formData.symptoms.length - 2} more
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="placeholder">Select symptoms</span>
                    )}
                  </div>
                  <span className={`dropdown-arrow ${symptomsDropdownOpen ? 'open' : ''}`}>▼</span>
                </div>
                
                {symptomsDropdownOpen && !isLoading && (
                  <div className="symptoms-dropdown-menu">
                    {cardiologySymptoms.map((symptom) => (
                      <label key={symptom} className="symptom-option">
                        <input
                          type="checkbox"
                          checked={formData.symptoms.includes(symptom)}
                          onChange={() => handleSymptomChange(symptom)}
                        />
                        <span className="checkbox-label">{symptom}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button 
              type="button" 
              onClick={handleCancel} 
              className="cancel-btn" 
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="confirm-btn"
              disabled={isLoading || !selectedPatientValid}
            >
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Admitting...
                </>
              ) : (
                "✓ Admit Patient"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AdmitPatientForm;