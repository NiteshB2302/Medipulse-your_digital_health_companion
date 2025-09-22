import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import QRCodeGenerator from '@/components/QRCodeGenerator';
import AppointmentBooking from '@/components/AppointmentBooking';
import MedicationReminders from '@/components/MedicationReminders';
import { QrCode, Calendar, Pill, FileText, User, LogOut } from 'lucide-react';

const PatientDashboard = () => {
  const { user, logout } = useAuth();
  const [patientData, setPatientData] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Load patient data from localStorage
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const profile = profiles.find(p => p.userId === user.id);
    setPatientData(profile);

    // Load appointments
    const allAppointments = JSON.parse(localStorage.getItem('medipulse_appointments') || '[]');
    const userAppointments = allAppointments.filter(apt => apt.patientId === user.id);
    setAppointments(userAppointments);

    // Load prescriptions
    const allPrescriptions = JSON.parse(localStorage.getItem('medipulse_prescriptions') || '[]');
    const userPrescriptions = allPrescriptions.filter(presc => presc.patientId === user.id);
    setPrescriptions(userPrescriptions);
  }, [user.id]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Patient Dashboard - MediPulse</title>
        <meta name="description" content="Patient dashboard for managing health records and appointments" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <QrCode className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MediPulse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.name}</span>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Patient Dashboard</h2>
              <p className="text-gray-600">Manage your health records and appointments</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="qr-code">QR Code</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="records">Records</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Appointments</CardTitle>
                      <Calendar className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{appointments.length}</div>
                      <p className="text-xs text-gray-600">
                        {appointments.filter(apt => apt.status === 'pending').length} pending
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                      <FileText className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{prescriptions.length}</div>
                      <p className="text-xs text-gray-600">Active prescriptions</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Health Score</CardTitle>
                      <User className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">85%</div>
                      <p className="text-xs text-gray-600">Good health status</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Next Appointment</CardTitle>
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {appointments.filter(apt => apt.status === 'confirmed').length > 0 ? '2 days' : 'None'}
                      </div>
                      <p className="text-xs text-gray-600">Upcoming</p>
                    </CardContent>
                  </Card>
                </div>

                {patientData && (
                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle>Patient Information</CardTitle>
                      <CardDescription>Your registered health information</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm font-medium text-gray-500">Age</p>
                          <p className="text-lg">{patientData.age || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Gender</p>
                          <p className="text-lg capitalize">{patientData.gender || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Contact</p>
                          <p className="text-lg">{patientData.contact || 'Not specified'}</p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-500">Medical History</p>
                          <p className="text-lg">{patientData.medicalHistory || 'None recorded'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-sm font-medium text-gray-500">Allergies</p>
                          <p className="text-lg">{patientData.allergies || 'None recorded'}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="qr-code">
                <QRCodeGenerator patientId={user.id} patientName={user.name} />
              </TabsContent>

              <TabsContent value="appointments">
                <AppointmentBooking patientId={user.id} />
              </TabsContent>

              <TabsContent value="medications">
                <MedicationReminders patientId={user.id} />
              </TabsContent>

              <TabsContent value="records">
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle>Medical Records</CardTitle>
                    <CardDescription>Your prescriptions and medical documents</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {prescriptions.length > 0 ? (
                      <div className="space-y-4">
                        {prescriptions.map((prescription, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{prescription.medication}</h4>
                                <p className="text-sm text-gray-600">Dr. {prescription.doctorName}</p>
                                <p className="text-sm text-gray-500">{prescription.dosage}</p>
                              </div>
                              <span className="text-xs text-gray-500">
                                {new Date(prescription.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mt-2">{prescription.instructions}</p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No medical records found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default PatientDashboard;