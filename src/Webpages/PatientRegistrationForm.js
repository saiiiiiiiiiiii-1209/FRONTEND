

import React, { useState } from "react";
import "./PatientRegistrationForm.css";
import emailjs from '@emailjs/browser';

function PatientRegistrationForm({ onClose, addPatient, patients }) {
  const [formData, setFormData] = useState({
    patientName: "",
    age: "",
    gender: "",
    dob: "",
    email: "",
    phone: "",
    alternatePhone: "",
    address: "",
    symptoms: [],
    bloodGroup: "",
    profession: "",
    nameOfKin: "",
    kinContact: ""
  });
  
  const [errors, setErrors] = useState({});
  const [symptomsDropdownOpen, setSymptomsDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const bloodGroups = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
  
  const cardiologySymptoms = [
    "Chest Pain", "Shortness of Breath", "Palpitations", 
    "High Blood Pressure", "Dizziness", 
    "Swelling in Legs", "Irregular Heartbeat",
   "Sweating","Jaw Pain",
    "Lightheadedness", "Rapid Heartbeat", "Slow Heartbeat",
    "Chest Discomfort", "Coughing",
    "Bluish Skin", "Fainting", "Confusion"
  ];

  const getMinDate = () => new Date().toISOString().split('T')[0];
  
  const calculateAgeFromDOB = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) age--;
    return age.toString();
  };

  // Validation Functions for each field
  const validatePatientName = (name) => {
    if (!name || name.trim() === "") return "Patient name is required";
    const trimmed = name.trim();
    if (trimmed.length < 2) return "Patient name must be at least 2 characters";
    if (trimmed.length > 50) return "Patient name cannot exceed 50 characters";
    if (!/^[a-zA-Z\s\.\-']+$/.test(trimmed)) return "Patient name can only contain letters, spaces, dots, hyphens and apostrophes";
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

  const validateDOB = (dob, age) => {
    if (!dob) return "Date of birth is required";
    
    const birthDate = new Date(dob);
    const today = new Date();
    
    if (birthDate > today) return "Date of birth cannot be in the future";
    
    // Validate age matches DOB
    if (age) {
      const calculatedAge = parseInt(calculateAgeFromDOB(dob));
      const enteredAge = parseInt(age);
      if (calculatedAge !== enteredAge) {
        return "Age doesn't match date of birth";
      }
    }
    
    return "";
  };

  const validateEmail = (email) => {
    if (!email || email === "") return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return "";
  };

  const validatePhone = (phone, fieldName = "Phone") => {
    if (!phone || phone === "") return `${fieldName} number is required`;
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return `${fieldName} number must be exactly 10 digits`;
    if (!['7', '8', '9'].includes(cleaned[0])) return `${fieldName} number must start with 7, 8, or 9`;
    return "";
  };

  const validateAlternatePhone = (phone) => {
    if (!phone) return ""; // Optional field
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length !== 10) return "Alternate phone must be exactly 10 digits";
    if (!['7', '8', '9'].includes(cleaned[0])) return "Alternate phone must start with 7, 8, or 9";
    
    // Check if same as primary phone
    if (phone === formData.phone) return "Alternate phone cannot be same as primary phone";
    
    return "";
  };

  const validateBloodGroup = (bloodGroup) => {
    if (!bloodGroup || bloodGroup === "") return "Please select blood group";
    return "";
  };

  const validateProfession = (profession) => {
    if (!profession) return ""; // Optional field
    if (!/^[a-zA-Z\s\.\-']*$/.test(profession)) return "Profession can only contain letters and spaces";
    return "";
  };

  const validateKinName = (name) => {
    if (!name) return ""; // Optional field
    if (!/^[a-zA-Z\s\.\-']*$/.test(name)) return "Emergency contact name can only contain letters and spaces";
    return "";
  };

  const validateKinContact = (contact) => {
    if (!contact) return ""; // Optional field
    const cleaned = contact.replace(/\D/g, '');
    if (cleaned.length !== 10) return "Emergency contact must be exactly 10 digits";
    if (!['7', '8', '9'].includes(cleaned[0])) return "Emergency contact must start with 7, 8, or 9";
    return "";
  };

  const validateForm = () => {
    const newErrors = {};
    
    const nameError = validatePatientName(formData.patientName);
    if (nameError) newErrors.patientName = nameError;
    
    const ageError = validateAge(formData.age);
    if (ageError) newErrors.age = ageError;
    
    const dobError = validateDOB(formData.dob, formData.age);
    if (dobError) newErrors.dob = dobError;
    
    const phoneError = validatePhone(formData.phone, "Phone");
    if (phoneError) newErrors.phone = phoneError;
    
    if (formData.alternatePhone) {
      const altPhoneError = validateAlternatePhone(formData.alternatePhone);
      if (altPhoneError) newErrors.alternatePhone = altPhoneError;
    }
    
    const emailError = validateEmail(formData.email);
    if (emailError) newErrors.email = emailError;
    
    const bloodGroupError = validateBloodGroup(formData.bloodGroup);
    if (bloodGroupError) newErrors.bloodGroup = bloodGroupError;
    
    const professionError = validateProfession(formData.profession);
    if (professionError) newErrors.profession = professionError;
    
    const kinNameError = validateKinName(formData.nameOfKin);
    if (kinNameError) newErrors.nameOfKin = kinNameError;
    
    if (formData.kinContact) {
      const kinError = validateKinContact(formData.kinContact);
      if (kinError) newErrors.kinContact = kinError;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "dob") {
      const age = calculateAgeFromDOB(value);
      setFormData(prev => ({ ...prev, dob: value, age: age }));
    } else if (name === "age") {
      // Only allow numbers
      if (value === "" || /^\d+$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else if (["phone", "alternatePhone", "kinContact"].includes(name)) {
      // Only allow numbers
      const cleaned = value.replace(/\D/g, '');
      if (cleaned.length <= 10) setFormData(prev => ({ ...prev, [name]: cleaned }));
    } else if (name === "patientName" || name === "profession" || name === "nameOfKin") {
      // Allow only letters, spaces, dots, hyphens for name fields
      if (value === "" || /^[a-zA-Z\s\.\-']*$/.test(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    
    // Clear error for this field when user starts typing
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

  // ✅ NEW FUNCTION: Send email confirmation
  const sendEmailConfirmation = async (patientData) => {
    try {
      // EmailJS configuration - same as appointment form
      const serviceId = 'service_nmfirtr';
      const templateId = 'template_8i5vc4p';
      const publicKey = 'IdqomYdCZMyAOoCnB';

      const today = new Date();
      const registrationDate = today.toLocaleDateString('en-IN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
      });
      
      const registrationTime = today.toLocaleTimeString('en-IN', {
        hour: '2-digit', minute: '2-digit', hour12: true
      });

      const symptomsString = Array.isArray(formData.symptoms) 
        ? formData.symptoms.join(", ") 
        : formData.symptoms || 'No symptoms specified';

      const templateParams = {
        to_email: formData.email,
        patient_name: formData.patientName,
        registration_date: registrationDate,
        registration_time: registrationTime,
        patient_age: formData.age,
        patient_gender: formData.gender,
        patient_phone: formData.phone,
        patient_dob: formData.dob,
        patient_blood_group: formData.bloodGroup,
        patient_address: formData.address || 'Not provided',
        patient_profession: formData.profession || 'Not provided',
        emergency_contact: formData.nameOfKin || 'Not provided',
        emergency_phone: formData.kinContact || 'Not provided',
        symptoms: symptomsString,
        clinic_name: 'Medi Care Hospital',
        clinic_phone: '+91 9876543210',
        clinic_email: 'registrations@medicare.com'
      };

      console.log("📧 Sending email with params:", templateParams);

      const response = await emailjs.send(serviceId, templateId, templateParams, publicKey);
      
      console.log("✅ Email sent successfully:", response);
      return true;
      
    } catch (error) {
      console.error('❌ Failed to send email:', error);
      return false;
    }
  };

  // ✅ FIXED: handleSubmit - register patient, send email, AND create appointment
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      // Check for duplicate in localStorage first
      const isDuplicate = patients?.some(p => 
        p.phone === formData.phone || p.email === formData.email
      );
      
      if (isDuplicate) {
        alert("❌ Patient with this phone or email already exists!");
        setIsLoading(false);
        return;
      }
      
      const patientId = `PAT-${Date.now()}`;
      const registeredDate = new Date().toISOString().split('T')[0];
      const registeredTime = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
      
      const symptomsString = Array.isArray(formData.symptoms) 
        ? formData.symptoms.join(", ") 
        : formData.symptoms || '';
      
      const patientData = {
        id: patientId,
        ...formData,
        symptoms: symptomsString,
        registeredDate: registeredDate,
        registeredTime: registeredTime,
        status: "Active"
      };
      
      console.log("📤 Registering patient:", patientData);
      
      // 1️⃣ First register the patient
      const patientResponse = await fetch('http://localhost:8001/api/patients', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(patientData)
      });

      const patientResult = await patientResponse.json();

      if (patientResult.success) {
        console.log("✅ Patient registered successfully:", patientResult.data);
        
        // 2️⃣ Send email confirmation (same as appointment form)
        const emailSent = await sendEmailConfirmation(patientData);
        
        if (emailSent) {
          console.log("✅ Registration email sent to:", formData.email);
        } else {
          console.warn("⚠️ Email could not be sent, but patient was registered");
        }
        
        // 3️⃣ Then create an appointment for this patient (for today at a default time)
        const now = new Date();
        const defaultTime = now.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
        
        const appointmentData = {
          patientName: formData.patientName,
          age: parseInt(formData.age),
          gender: formData.gender,
          phone: formData.phone,
          email: formData.email,
          symptoms: symptomsString,
          date: registeredDate,
          time: defaultTime,
          status: "Pending",
          type: "Cardiology",
          doctor: "Dr. Pranjal Patil",
          notes: "Auto-created from patient registration",
          bookingDate: registeredDate,
          bookingTime: registeredTime,
          visitType: "First Visit"
        };
        
        console.log("📤 Creating appointment for registered patient:", appointmentData);
        
        const appointmentResponse = await fetch('http://localhost:8001/api/appointments', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(appointmentData)
        });
        
        const appointmentResult = await appointmentResponse.json();
        
        if (appointmentResult.success) {
          console.log("✅ Appointment created successfully:", appointmentResult.appointment);
          
          // Show appropriate message based on email status
          if (emailSent) {
            alert(`✅ Patient ${formData.patientName} registered successfully! Confirmation email sent to ${formData.email}. Appointment also created.`);
          } else {
            alert(`✅ Patient ${formData.patientName} registered and appointment created! (Email could not be sent)`);
          }
        } else {
          console.warn("⚠️ Patient registered but appointment creation failed:", appointmentResult.message);
          
          if (emailSent) {
            alert(`✅ Patient registered! Confirmation email sent. (Appointment could not be auto-created: ${appointmentResult.message})`);
          } else {
            alert(`✅ Patient registered! (Appointment could not be auto-created, email could not be sent)`);
          }
        }
        
        // Call addPatient to update the patient list in the parent component
        addPatient(patientResult.data);
        onClose();
      } else {
        alert(`❌ Error: ${patientResult.message}`);
      }
    } catch (error) {
      console.error("❌ Error:", error);
      alert("❌ Failed to register patient. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="form-overlay" onClick={onClose}>
      <div className="form-container patient-form" onClick={(e) => e.stopPropagation()}>
        <div className="form-header">
          <h2>➕ Register New Patient</h2>
          <button className="close-btn" onClick={onClose} disabled={isLoading}>×</button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h4>Personal Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text"
                  name="patientName"
                  value={formData.patientName}
                  onChange={handleChange}
                  placeholder="Enter full name (letters only)"
                  required
                  disabled={isLoading}
                  className={errors.patientName ? "error" : ""}
                />
                {errors.patientName && <span className="error-message">{errors.patientName}</span>}
              </div>
              <div className="form-group">
                <label>Date of Birth *</label>
                <input
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  max={getMinDate()}
                  required
                  disabled={isLoading}
                  className={errors.dob ? "error" : ""}
                />
                {errors.dob && <span className="error-message">{errors.dob}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group">
                <label>Gender *</label>
                <select 
                  name="gender" 
                  value={formData.gender} 
                  onChange={handleChange}
                  disabled={isLoading}
                >
                  <option>Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              

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
                  disabled={isLoading}
                  className={errors.age ? "error" : ""}
                />
                {errors.age && <span className="error-message">{errors.age}</span>}
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Contact Information</h4>
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
                  disabled={isLoading}
                  className={errors.phone ? "error" : ""}
                />
                {errors.phone && <span className="error-message">{errors.phone}</span>}
              </div>
              <div className="form-group">
                <label>Alternate Phone</label>
                <input
                  style={{marginTop:"24px"}}
                  type="tel"
                  name="alternatePhone"
                  value={formData.alternatePhone}
                  onChange={handleChange}
                  placeholder="Alternate Number (numbers only)"
                  maxLength="10"
                  disabled={isLoading}
                  className={errors.alternatePhone ? "error" : ""}
                />
                {errors.alternatePhone && <span className="error-message">{errors.alternatePhone}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label>Email Address *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter email address"
                  required
                  disabled={isLoading}
                  className={errors.email ? "error" : ""}
                />
                {errors.email && <span className="error-message">{errors.email}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label>Residential Address</label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter complete address"
                  disabled={isLoading}
                />
              </div>
            </div>
          </div>

          <div className="form-section">
            <h4>Medical Information</h4>
            <div className="form-row">
              <div className="form-group">
                <label style={{paddingBottom:"7px"}}>Blood Group *</label>
                <select 
                  name="bloodGroup" 
                  value={formData.bloodGroup} 
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className={errors.bloodGroup ? "error" : ""}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                {errors.bloodGroup && <span className="error-message">{errors.bloodGroup}</span>}
              </div>
              <div className="form-group">
                <label style={{display:"block",paddingTop:"3px"}}>Profession</label>
                <input
                  style={{paddingTop:"13px",paddingBottom:"13px",marginTop:"6px"}}
                  type="text"
                  name="profession"
                  value={formData.profession}
                  onChange={handleChange}
                  placeholder="Enter profession (letters only)"
                  disabled={isLoading}
                  className={errors.profession ? "error" : ""}
                />
                {errors.profession && <span className="error-message">{errors.profession}</span>}
              </div>
            </div>
            
            <div className="form-section">
              <h4>Symptoms (Optional)</h4>
              <div className="symptoms-container">
                <div 
                  className="symptoms-select-box"
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

          <div className="form-section">
            <h4>Emergency Contact</h4>
            <div className="form-row">
              <div className="form-group">
                <label>Contact Person Name</label>
                <input
                  type="text"
                  name="nameOfKin"
                  value={formData.nameOfKin}
                  onChange={handleChange}
                  placeholder="Emergency contact name (letters only)"
                  disabled={isLoading}
                  className={errors.nameOfKin ? "error" : ""}
                />
                {errors.nameOfKin && <span className="error-message">{errors.nameOfKin}</span>}
              </div>
              <div className="form-group">
                <input
                  type="tel"
                  name="kinContact"
                  value={formData.kinContact}
                  onChange={handleChange}
                  placeholder="10-digit number (numbers only)"
                  maxLength="10"
                  disabled={isLoading}
                  className={errors.kinContact ? "error" : ""}
                />
                {errors.kinContact && <span className="error-message">{errors.kinContact}</span>}
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn" onClick={onClose} disabled={isLoading}>
              Cancel
            </button>
            <button type="submit" className="confirm-btn" disabled={isLoading}>
              {isLoading ? (
                <>
                  <span className="loading-spinner"></span>
                  Registering...
                </>
              ) : (
                "Register Patient"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PatientRegistrationForm;