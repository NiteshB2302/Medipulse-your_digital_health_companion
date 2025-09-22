import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from '@/components/ui/use-toast';
import { Shield, Users, Calendar, FileText, Activity, LogOut } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPatients: 0,
    totalDoctors: 0,
    totalAppointments: 0,
    totalPrescriptions: 0
  });
  const [users, setUsers] = useState([]);

  useEffect(() => {
    // Load all data for admin overview
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const appointments = JSON.parse(localStorage.getItem('medipulse_appointments') || '[]');
    const prescriptions = JSON.parse(localStorage.getItem('medipulse_prescriptions') || '[]');

    setUsers(profiles);
    setStats({
      totalUsers: profiles.length,
      totalPatients: profiles.filter(p => p.role === 'patient').length,
      totalDoctors: profiles.filter(p => p.role === 'doctor').length,
      totalAppointments: appointments.length,
      totalPrescriptions: prescriptions.length
    });
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      <Helmet>
        <title>Admin Dashboard - MediPulse</title>
        <meta name="description" content="Admin dashboard for managing the MediPulse platform" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="container mx-auto px-4 py-4 flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">MediPulse Admin</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Admin: {user.name}</span>
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
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h2>
              <p className="text-gray-600">Manage the MediPulse platform and monitor system activity</p>
            </div>

            <Tabs defaultValue="overview" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                      <Users className="h-4 w-4 text-blue-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalUsers}</div>
                      <p className="text-xs text-gray-600">Registered users</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Patients</CardTitle>
                      <Users className="h-4 w-4 text-green-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalPatients}</div>
                      <p className="text-xs text-gray-600">Patient accounts</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Doctors</CardTitle>
                      <Activity className="h-4 w-4 text-purple-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalDoctors}</div>
                      <p className="text-xs text-gray-600">Doctor accounts</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Appointments</CardTitle>
                      <Calendar className="h-4 w-4 text-orange-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                      <p className="text-xs text-gray-600">Total bookings</p>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Prescriptions</CardTitle>
                      <FileText className="h-4 w-4 text-red-600" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{stats.totalPrescriptions}</div>
                      <p className="text-xs text-gray-600">Total prescribed</p>
                    </CardContent>
                  </Card>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle>Recent Activity</CardTitle>
                      <CardDescription>Latest platform activity</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <p className="text-sm">New patient registration</p>
                          <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          <p className="text-sm">Appointment scheduled</p>
                          <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                          <p className="text-sm">Prescription created</p>
                          <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                          <p className="text-sm">Doctor profile updated</p>
                          <span className="text-xs text-gray-500 ml-auto">1 day ago</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle>System Health</CardTitle>
                      <CardDescription>Platform performance metrics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Server Status</span>
                          <span className="text-sm text-green-600 font-medium">Online</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Database</span>
                          <span className="text-sm text-green-600 font-medium">Healthy</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">API Response</span>
                          <span className="text-sm text-green-600 font-medium">Fast</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-sm">Storage</span>
                          <span className="text-sm text-yellow-600 font-medium">75% Used</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="users">
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle>User Management</CardTitle>
                    <CardDescription>Manage all platform users</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {users.length > 0 ? (
                      <div className="space-y-4">
                        {users.map((user, index) => (
                          <div key={index} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <h4 className="font-medium">{user.name}</h4>
                                <p className="text-sm text-gray-600">{user.email}</p>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  user.role === 'patient' ? 'bg-blue-100 text-blue-800' :
                                  user.role === 'doctor' ? 'bg-green-100 text-green-800' :
                                  'bg-purple-100 text-purple-800'
                                }`}>
                                  {user.role}
                                </span>
                              </div>
                              <div className="flex space-x-2">
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => toast({
                                    title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                                  })}
                                >
                                  Edit
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => toast({
                                    title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                                  })}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-gray-500 mt-2">
                              Registered: {new Date(user.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-8">No users found</p>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics">
                <div className="grid md:grid-cols-2 gap-6">
                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle>User Growth</CardTitle>
                      <CardDescription>Platform adoption over time</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>Analytics charts would be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="health-card">
                    <CardHeader>
                      <CardTitle>Appointment Trends</CardTitle>
                      <CardDescription>Booking patterns and trends</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="h-64 flex items-center justify-center text-gray-500">
                        <p>Appointment analytics would be displayed here</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="settings">
                <Card className="health-card">
                  <CardHeader>
                    <CardTitle>Platform Settings</CardTitle>
                    <CardDescription>Configure system-wide settings</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => toast({
                        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                      })}
                    >
                      <Shield className="h-4 w-4 mr-2" />
                      Security Settings
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => toast({
                        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                      })}
                    >
                      <Users className="h-4 w-4 mr-2" />
                      User Permissions
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => toast({
                        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                      })}
                    >
                      <Activity className="h-4 w-4 mr-2" />
                      System Monitoring
                    </Button>
                    <Button 
                      className="w-full justify-start" 
                      variant="outline"
                      onClick={() => toast({
                        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                      })}
                    >
                      <FileText className="h-4 w-4 mr-2" />
                      Backup & Recovery
                    </Button>
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

export default AdminDashboard;