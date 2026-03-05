import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";

// ==================== CONTEXT ====================
import { AppointmentsProvider } from "./context/AppointmentsContext";
import { PatientsProvider } from "./context/PatientsContext";
import { AdmissionsProvider } from "./context/AdmissionsContext";

// ==================== IMPORT COMPONENTS ====================
import HomePages from "./Webpages/HomePages";
import ReceptionistDashboard from "./Webpages/ReceptionistDashboard";
import DashboardHome from "./Webpages/DashboardHome";
import AppointmentForm from "./Webpages/AppointmentForm";
import Appointment from "./Webpages/Appointment";
import PatientRegistrationForm from "./Webpages/PatientRegistrationForm";
import AdmitPatientForm from "./Webpages/AdmitPatientForm";
import BedView from "./Webpages/doctor/BedView";
import Doctors from "./Webpages/Doctors";
import Laboratory from "./Webpages/Laboratory";
import Services from "./Webpages/Services";
import SignupForm from "./Webpages/SignupForm";
import DoctorDashboard from "./Webpages/DoctorDashboard";
import DoctorDashboardHome from "./Webpages/doctor/DoctorDashboardHome";
import DoctorAppointments from "./Webpages/doctor/DoctorAppointments";
import DoctorPatients from "./Webpages/doctor/DoctorPatients";
import DoctorProfile from "./Webpages/doctor/DoctorProfile";
import Patientlist from "./Webpages/Patientlist";
import Admitlist from "./Webpages/Admitlist";
import DoctorBedView from './Webpages/doctor/DoctorBedView';
import DoctorAdmit from "./Webpages/doctor/Doctoradmit";

function App() {
  const location = useLocation();

  return (
    <PatientsProvider>
      <AdmissionsProvider>
        <AppointmentsProvider>
          <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
              
              {/* PUBLIC ROUTES */}
              <Route path="/" element={<HomePages />} />
              <Route path="/signupform" element={<SignupForm />} />

              {/* DOCTOR DASHBOARD ROUTES */}
              <Route path="/doctor-dashboard" element={<DoctorDashboard />}>
                <Route index element={<DoctorDashboardHome />} />
                <Route path="appointments" element={<DoctorAppointments />} />
                <Route path="patients" element={<DoctorPatients />} />
                <Route path="profile" element={<DoctorProfile />} />
                <Route path="/doctor-dashboard/DoctorBedView" element={<DoctorBedView />}/>
                <Route path="/doctor-dashboard/admitlist" element={<DoctorAdmit />} />
              </Route>

              {/* RECEPTIONIST DASHBOARD ROUTES */}
              <Route
                path="/receptionist-dashboard"
                element={
                  <ReceptionistDashboard />
                }
              >
                <Route index element={<DashboardHome />} />
                <Route path="appointmentsform" element={<AppointmentForm />} />
                <Route path="appointment" element={<Appointment />} />
                <Route path="patientregistrationform" element={<PatientRegistrationForm />} />
                <Route path="admit-patient" element={<AdmitPatientForm />} />
                <Route path="bedview" element={<BedView />} />
                <Route path="doctors" element={<Doctors />} />
                <Route path="laboratory" element={<Laboratory />} />
                <Route path="services" element={<Services />} />
                <Route path="Patientlist" element={<Patientlist />} />
                <Route path="Admitlist" element={<Admitlist />} />
              </Route>

              {/* 404 REDIRECT */}
              <Route path="*" element={<Navigate to="/receptionist-dashboard" />} />
            </Routes>
          </AnimatePresence>
        </AppointmentsProvider>
      </AdmissionsProvider>
    </PatientsProvider>
  );
}

export default App;
