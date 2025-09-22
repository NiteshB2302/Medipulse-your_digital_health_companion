import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Calendar, Clock, User, Plus } from 'lucide-react';

const AppointmentBooking = ({ patientId }) => {
  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [formData, setFormData] = useState({
    doctorId: '',
    doctorName: '',
    date: '',
    time: '',
    reason: ''
  });

  useEffect(() => {
    // Load appointments
    const allAppointments = JSON.parse(localStorage.getItem('medipulse_appointments') || '[]');
    const patientAppointments = allAppointments.filter(apt => apt.patientId === patientId);
    setAppointments(patientAppointments);

    // Load doctors
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const doctorProfiles = profiles.filter(p => p.role === 'doctor');
    setDoctors(doctorProfiles);
  }, [patientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.doctorId || !formData.date || !formData.time || !formData.reason) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedDoctor = doctors.find(d => d.userId === formData.doctorId);
    const newAppointment = {
      id: Date.now().toString(),
      patientId,
      patientName: JSON.parse(localStorage.getItem('medipulse_user')).name,
      doctorId: formData.doctorId,
      doctorName: selectedDoctor?.name || 'Unknown Doctor',
      date: formData.date,
      time: formData.time,
      reason: formData.reason,
      status: 'pending',
      createdAt: new Date().toISOString()
    };

    // Save appointment
    const allAppointments = JSON.parse(localStorage.getItem('medipulse_appointments') || '[]');
    allAppointments.push(newAppointment);
    localStorage.setItem('medipulse_appointments', JSON.stringify(allAppointments));

    // Update local state
    setAppointments(prev => [...prev, newAppointment]);
    
    // Reset form
    setFormData({
      doctorId: '',
      doctorName: '',
      date: '',
      time: '',
      reason: ''
    });
    setShowBookingForm(false);

    toast({
      title: "Appointment Requested",
      description: "Your appointment request has been sent to the doctor"
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card className="health-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Calendar className="h-5 w-5 mr-2" />
                Appointments
              </CardTitle>
              <CardDescription>
                Book and manage your medical appointments
              </CardDescription>
            </div>
            <Button onClick={() => setShowBookingForm(!showBookingForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Book Appointment
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showBookingForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold mb-4">Book New Appointment</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="doctor">Select Doctor</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, doctorId: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Choose a doctor" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctors.map((doctor) => (
                          <SelectItem key={doctor.userId} value={doctor.userId}>
                            Dr. {doctor.name} - {doctor.specialization || 'General Practice'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="reason">Reason for Visit</Label>
                    <Input
                      id="reason"
                      placeholder="Brief description"
                      value={formData.reason}
                      onChange={(e) => setFormData(prev => ({ ...prev, reason: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date">Preferred Date</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                      min={new Date().toISOString().split('T')[0]}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Preferred Time</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00 AM</SelectItem>
                        <SelectItem value="10:00">10:00 AM</SelectItem>
                        <SelectItem value="11:00">11:00 AM</SelectItem>
                        <SelectItem value="14:00">02:00 PM</SelectItem>
                        <SelectItem value="15:00">03:00 PM</SelectItem>
                        <SelectItem value="16:00">04:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit">Book Appointment</Button>
                  <Button type="button" variant="outline" onClick={() => setShowBookingForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {appointments.length > 0 ? (
            <div className="space-y-4">
              {appointments.map((appointment, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border rounded-lg p-4"
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <User className="h-4 w-4 text-gray-500" />
                        <span className="font-medium">Dr. {appointment.doctorName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Calendar className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {new Date(appointment.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">{appointment.time}</span>
                      </div>
                      <p className="text-sm text-gray-700 mt-2">{appointment.reason}</p>
                    </div>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(appointment.status)}`}>
                      {appointment.status}
                    </span>
                  </div>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No appointments scheduled</p>
              <p className="text-sm text-gray-400">Book your first appointment to get started</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppointmentBooking;