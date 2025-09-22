import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { FileText, Plus, User, Calendar } from 'lucide-react';

const PrescriptionManager = ({ doctorId }) => {
  const [prescriptions, setPrescriptions] = useState([]);
  const [patients, setPatients] = useState([]);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);
  const [formData, setFormData] = useState({
    patientId: '',
    patientName: '',
    medication: '',
    dosage: '',
    instructions: '',
    duration: ''
  });

  useEffect(() => {
    // Load prescriptions for this doctor
    const allPrescriptions = JSON.parse(localStorage.getItem('medipulse_prescriptions') || '[]');
    const doctorPrescriptions = allPrescriptions.filter(presc => presc.doctorId === doctorId);
    setPrescriptions(doctorPrescriptions);

    // Load patients
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const patientProfiles = profiles.filter(p => p.role === 'patient');
    setPatients(patientProfiles);
  }, [doctorId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.patientId || !formData.medication || !formData.dosage || !formData.instructions) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const selectedPatient = patients.find(p => p.userId === formData.patientId);
    const doctorUser = JSON.parse(localStorage.getItem('medipulse_user'));
    
    const newPrescription = {
      id: Date.now().toString(),
      doctorId,
      doctorName: doctorUser.name,
      patientId: formData.patientId,
      patientName: selectedPatient?.name || 'Unknown Patient',
      medication: formData.medication,
      dosage: formData.dosage,
      instructions: formData.instructions,
      duration: formData.duration,
      createdAt: new Date().toISOString()
    };

    // Save prescription
    const allPrescriptions = JSON.parse(localStorage.getItem('medipulse_prescriptions') || '[]');
    allPrescriptions.push(newPrescription);
    localStorage.setItem('medipulse_prescriptions', JSON.stringify(allPrescriptions));

    // Update local state
    setPrescriptions(prev => [...prev, newPrescription]);
    
    // Reset form
    setFormData({
      patientId: '',
      patientName: '',
      medication: '',
      dosage: '',
      instructions: '',
      duration: ''
    });
    setShowPrescriptionForm(false);

    toast({
      title: "Prescription Created",
      description: "Prescription has been added to patient's records"
    });
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center">
              <FileText className="h-5 w-5 mr-2" />
              Prescription Management
            </CardTitle>
            <CardDescription>
              Create and manage patient prescriptions
            </CardDescription>
          </div>
          <Button onClick={() => setShowPrescriptionForm(!showPrescriptionForm)}>
            <Plus className="h-4 w-4 mr-2" />
            New Prescription
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {showPrescriptionForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mb-6 p-4 border rounded-lg bg-gray-50"
          >
            <h3 className="text-lg font-semibold mb-4">Create New Prescription</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="patient">Select Patient</Label>
                <Select onValueChange={(value) => setFormData(prev => ({ ...prev, patientId: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a patient" />
                  </SelectTrigger>
                  <SelectContent>
                    {patients.map((patient) => (
                      <SelectItem key={patient.userId} value={patient.userId}>
                        {patient.name} - {patient.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="medication">Medication Name</Label>
                  <Input
                    id="medication"
                    placeholder="e.g., Amoxicillin"
                    value={formData.medication}
                    onChange={(e) => setFormData(prev => ({ ...prev, medication: e.target.value }))}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    placeholder="e.g., 500mg twice daily"
                    value={formData.dosage}
                    onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="instructions">Instructions</Label>
                <Input
                  id="instructions"
                  placeholder="e.g., Take with food, complete full course"
                  value={formData.instructions}
                  onChange={(e) => setFormData(prev => ({ ...prev, instructions: e.target.value }))}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Input
                  id="duration"
                  placeholder="e.g., 7 days"
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: e.target.value }))}
                />
              </div>
              
              <div className="flex gap-3">
                <Button type="submit">Create Prescription</Button>
                <Button type="button" variant="outline" onClick={() => setShowPrescriptionForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {prescriptions.length > 0 ? (
          <div className="space-y-4">
            {prescriptions.map((prescription, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border rounded-lg p-4"
              >
                <div className="flex justify-between items-start">
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="font-medium">{prescription.patientName}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <FileText className="h-4 w-4 text-blue-600" />
                      <span className="font-medium">{prescription.medication}</span>
                      <span className="text-sm text-gray-600">({prescription.dosage})</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      <strong>Instructions:</strong> {prescription.instructions}
                    </p>
                    {prescription.duration && (
                      <p className="text-sm text-gray-600">
                        <strong>Duration:</strong> {prescription.duration}
                      </p>
                    )}
                    <div className="flex items-center space-x-2 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      <span>Prescribed: {new Date(prescription.createdAt).toLocaleDateString()}</span>
                    </div>
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
                      variant="outline" 
                      size="sm"
                      onClick={() => toast({
                        title: "🚧 This feature isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
                      })}
                    >
                      Print
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No prescriptions created yet</p>
            <p className="text-sm text-gray-400">Create your first prescription to get started</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PrescriptionManager;