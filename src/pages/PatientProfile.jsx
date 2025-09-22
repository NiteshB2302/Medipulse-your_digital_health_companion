import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, User, Calendar, FileText, AlertCircle } from 'lucide-react';

const PatientProfile = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Load patient data
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const patientProfile = profiles.find(p => p.userId === id);
    setPatient(patientProfile);

    // Load patient appointments
    const allAppointments = JSON.parse(localStorage.getItem('medipulse_appointments') || '[]');
    const patientAppointments = allAppointments.filter(apt => apt.patientId === id);
    setAppointments(patientAppointments);

    // Load patient prescriptions
    const allPrescriptions = JSON.parse(localStorage.getItem('medipulse_prescriptions') || '[]');
    const patientPrescriptions = allPrescriptions.filter(presc => presc.patientId === id);
    setPrescriptions(patientPrescriptions);
  }, [id]);

  if (!patient) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Patient Not Found</h2>
          <Link to="/doctor-dashboard">
            <Button>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{patient.name} - Patient Profile - MediPulse</title>
        <meta name="description" content={`Medical profile for patient ${patient.name}`} />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-6">
              <Link to="/doctor-dashboard">
                <Button variant="outline" className="mb-4">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Dashboard
                </Button>
              </Link>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient Profile</h1>
              <p className="text-gray-600">Comprehensive medical information for {patient.name}</p>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Patient Information */}
              <div className="lg:col-span-1">
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <User className="h-5 w-5 mr-2" />
                      Patient Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Full Name</p>
                      <p className="text-lg font-semibold">{patient.name}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Email</p>
                      <p className="text-lg">{patient.email}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-500">Age</p>
                        <p className="text-lg">{patient.age || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-500">Gender</p>
                        <p className="text-lg capitalize">{patient.gender || 'N/A'}</p>
                      </div>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Contact</p>
                      <p className="text-lg">{patient.contact || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Registration Date</p>
                      <p className="text-lg">{new Date(patient.createdAt).toLocaleDateString()}</p>
                    </div>
                  </CardContent>
                </Card>

                {/* Medical Information */}
                <Card className="health-card mt-6">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Medical Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">Medical History</p>
                      <p className="text-lg">{patient.medicalHistory || 'No medical history recorded'}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Known Allergies</p>
                      <p className="text-lg">{patient.allergies || 'No known allergies'}</p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Appointments and Prescriptions */}
              <div className="lg:col-span-2 space-y-6">
                {/* Appointments */}
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="h-5 w-5 mr-2" />
                      Appointment History
                    </CardTitle>
                    <CardDescription>
                      All appointments for this patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {appointments.length > 0 ? (
                      <div className="space-y-4">
                        {appointments.map((appointment, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{appointment.reason}</h4>
                                <p className="text-sm text-gray-600">
                                  Dr. {appointment.doctorName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                                </p>
                              </div>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                                appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {appointment.status}
                              </span>
                            </div>
                            {appointment.notes && (
                              <p className="text-sm mt-2 text-gray-600">
                                Notes: {appointment.notes}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No appointments found</p>
                    )}
                  </CardContent>
                </Card>

                {/* Prescriptions */}
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <FileText className="h-5 w-5 mr-2" />
                      Prescription History
                    </CardTitle>
                    <CardDescription>
                      All prescriptions for this patient
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {prescriptions.length > 0 ? (
                      <div className="space-y-4">
                        {prescriptions.map((prescription, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{prescription.medication}</h4>
                                <p className="text-sm text-gray-600">
                                  Dr. {prescription.doctorName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Dosage: {prescription.dosage}
                                </p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(prescription.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mt-2 text-gray-600">
                              Instructions: {prescription.instructions}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No prescriptions found</p>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PatientProfile;