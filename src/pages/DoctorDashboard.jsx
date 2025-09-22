import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import AppointmentManagement from '@/components/AppointmentManagement';
import PrescriptionManager from '@/components/PrescriptionManager';
import { Stethoscope, QrCode, Calendar, Users, FileText, LogOut, Scan } from 'lucide-react';

const DoctorDashboard = () => {
  const { user, logout } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);

  useEffect(() => {
    // Load appointments
    const allAppointments = JSON.parse(localStorage.getItem('medipulse_appointments') || '[]');
    const doctorAppointments = allAppointments.filter(apt => apt.doctorId === user.id);
    setAppointments(doctorAppointments);

    // Load patients
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const patientProfiles = profiles.filter(p => p.role === 'patient');
    setPatients(patientProfiles);

    // Load prescriptions
    const allPrescriptions = JSON.parse(localStorage.getItem('medipulse_prescriptions') || '[]');
    const doctorPrescriptions = allPrescriptions.filter(presc => presc.doctorId === user.id);
    setPrescriptions(doctorPrescriptions);
  }, [user.id]);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Doctor Dashboard - MediPulse</title>
        <meta name="description" content="Doctor dashboard for managing patients and appointments" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Stethoscope className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MediPulse</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Link to="/qr-scanner">
                <Button variant="outline">
                  <Scan className="h-4 w-4 mr-2" />
                  QR Scanner
                </Button>
              </Link>
              <span className="text-gray-700">Dr. {user.name}</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Doctor Dashboard</h2>
              <p className="text-gray-600">Manage your patients and appointments</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="appointments">Appointments</TabsTrigger>
                <TabsTrigger value="patients">Patients</TabsTrigger>
                <TabsTrigger value="prescriptions">Prescriptions</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Patients</CardTitle>
                      <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{patients.length}</div>
                      <p className="text-xs text-gray-600">Registered patients</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Appointments Today</CardTitle>
                      <Calendar className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {appointments.filter(apt => 
                          new Date(apt.date).toDateString() === new Date().toDateString()
                        ).length}
                      </div>
                      <p className="text-xs text-gray-600">Scheduled for today</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {appointments.filter(apt => apt.status === 'pending').length}
                      </div>
                      <p className="text-xs text-gray-600">Awaiting approval</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                      <FileText className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{prescriptions.length}</div>
                      <p className="text-xs text-gray-600">Total prescribed</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle>Recent Appointments</CardTitle>
                      <CardDescription>Latest appointment requests</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {appointments.slice(0, 5).map((appointment, index) => (
                        <div key={index} className="flex justify-between items-center py-2 border-b last:border-b-0">
                          <div>
                            <p className="font-medium">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600">{appointment.reason}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm">{new Date(appointment.date).toLocaleDateString()}</p>
                            <span className={`text-xs px-2 py-1 rounded-full ${
                              appointment.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                              appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {appointment.status}
                            </span>
                          </div>
                        </div>
                      ))}
                      {appointments.length === 0 && (
                        <p className="text-gray-500 text-center py-4">No appointments yet</p>
                      )}
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle>Quick Actions</CardTitle>
                      <CardDescription>Common tasks and tools</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <Link to="/qr-scanner">
                        <Button className="w-full justify-start">
                          <QrCode className="h-4 w-4 mr-2" />
                          Scan Patient QR Code
                        </Button>
                      </Link>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => toast({
                          title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                        })}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        Create Prescription
                      </Button>
                      <Button 
                        className="w-full justify-start" 
                        variant="outline"
                        onClick={() => toast({
                          title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                        })}
                      >
                        <Users className="h-4 w-4 mr-2" />
                        View Patient History
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="appointments">
                <AppointmentManagement doctorId={user.id} />
              </TabsContent>

              <TabsContent value="patients">
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle>Patient List</CardTitle>
                    <CardDescription>All registered patients in the system</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {patients.length > 0 ? (
                      <div className="space-y-4">
                        {patients.map((patient, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{patient.name}</h4>
                                <p className="text-sm text-gray-600">{patient.email}</p>
                                <p className="text-sm text-gray-500">
                                  Age: {patient.age || 'N/A'} | Gender: {patient.gender || 'N/A'}
                                </p>
                              </div>
                              <Link to={`/patient/${patient.userId}`}>
                                <Button variant="outline" size="sm">
                                  View Profile
                                </Button>
                              </Link>
                            </div>
                            {patient.medicalHistory && (
                              <p className="text-sm mt-2 text-gray-600">
                                Medical History: {patient.medicalHistory}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No patients registered yet</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="prescriptions">
                <PrescriptionManager doctorId={user.id} />
              </TabsContent>
            </Tabs>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default DoctorDashboard;