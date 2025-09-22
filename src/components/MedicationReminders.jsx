import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { Pill, Clock, Plus, Bell } from 'lucide-react';

const MedicationReminders = ({ patientId }) => {
  const [reminders, setReminders] = useState([]);
  const [showReminderForm, setShowReminderForm] = useState(false);
  const [formData, setFormData] = useState({
    medication: '',
    dosage: '',
    frequency: '',
    time: '',
    notes: ''
  });

  useEffect(() => {
    // Load reminders
    const allReminders = JSON.parse(localStorage.getItem('medipulse_reminders') || '[]');
    const patientReminders = allReminders.filter(reminder => reminder.patientId === patientId);
    setReminders(patientReminders);
  }, [patientId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.medication || !formData.dosage || !formData.frequency || !formData.time) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    const newReminder = {
      id: Date.now().toString(),
      patientId,
      medication: formData.medication,
      dosage: formData.dosage,
      frequency: formData.frequency,
      time: formData.time,
      notes: formData.notes,
      active: true,
      createdAt: new Date().toISOString()
    };

    // Save reminder
    const allReminders = JSON.parse(localStorage.getItem('medipulse_reminders') || '[]');
    allReminders.push(newReminder);
    localStorage.setItem('medipulse_reminders', JSON.stringify(allReminders));

    // Update local state
    setReminders(prev => [...prev, newReminder]);
    
    // Reset form
    setFormData({
      medication: '',
      dosage: '',
      frequency: '',
      time: '',
      notes: ''
    });
    setShowReminderForm(false);

    toast({
      title: "Reminder Added",
      description: "Your medication reminder has been set up"
    });
  };

  const toggleReminder = (reminderId) => {
    const allReminders = JSON.parse(localStorage.getItem('medipulse_reminders') || '[]');
    const updatedReminders = allReminders.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, active: !reminder.active }
        : reminder
    );
    localStorage.setItem('medipulse_reminders', JSON.stringify(updatedReminders));
    
    setReminders(prev => prev.map(reminder => 
      reminder.id === reminderId 
        ? { ...reminder, active: !reminder.active }
        : reminder
    ));

    toast({
      title: "Reminder Updated",
      description: "Medication reminder status changed"
    });
  };

  const deleteReminder = (reminderId) => {
    const allReminders = JSON.parse(localStorage.getItem('medipulse_reminders') || '[]');
    const updatedReminders = allReminders.filter(reminder => reminder.id !== reminderId);
    localStorage.setItem('medipulse_reminders', JSON.stringify(updatedReminders));
    
    setReminders(prev => prev.filter(reminder => reminder.id !== reminderId));

    toast({
      title: "Reminder Deleted",
      description: "Medication reminder has been removed"
    });
  };

  return (
    <div className="space-y-6">
      <Card className="health-card">
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center">
                <Pill className="h-5 w-5 mr-2" />
                Medication Reminders
              </CardTitle>
              <CardDescription>
                Set up reminders for your medications
              </CardDescription>
            </div>
            <Button onClick={() => setShowReminderForm(!showReminderForm)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Reminder
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {showReminderForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-4 border rounded-lg bg-gray-50"
            >
              <h3 className="text-lg font-semibold mb-4">Add New Reminder</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="medication">Medication Name</Label>
                    <Input
                      id="medication"
                      placeholder="e.g., Aspirin"
                      value={formData.medication}
                      onChange={(e) => setFormData(prev => ({ ...prev, medication: e.target.value }))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dosage">Dosage</Label>
                    <Input
                      id="dosage"
                      placeholder="e.g., 100mg"
                      value={formData.dosage}
                      onChange={(e) => setFormData(prev => ({ ...prev, dosage: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <Select onValueChange={(value) => setFormData(prev => ({ ...prev, frequency: value }))}>
                      <SelectTrigger>
                        <SelectValue placeholder="How often?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="once-daily">Once daily</SelectItem>
                        <SelectItem value="twice-daily">Twice daily</SelectItem>
                        <SelectItem value="three-times-daily">Three times daily</SelectItem>
                        <SelectItem value="four-times-daily">Four times daily</SelectItem>
                        <SelectItem value="as-needed">As needed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="time">Reminder Time</Label>
                    <Input
                      id="time"
                      type="time"
                      value={formData.time}
                      onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Input
                    id="notes"
                    placeholder="Additional instructions"
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  />
                </div>
                
                <div className="flex gap-3">
                  <Button type="submit">Add Reminder</Button>
                  <Button type="button" variant="outline" onClick={() => setShowReminderForm(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div>
          )}

          {reminders.length > 0 ? (
            <div className="space-y-4">
              {reminders.map((reminder, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`border rounded-lg p-4 ${reminder.active ? 'bg-white' : 'bg-gray-50 opacity-75'}`}
                >
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <Pill className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">{reminder.medication}</span>
                        <span className="text-sm text-gray-600">({reminder.dosage})</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-gray-500" />
                        <span className="text-sm text-gray-600">
                          {reminder.time} - {reminder.frequency.replace('-', ' ')}
                        </span>
                      </div>
                      {reminder.notes && (
                        <p className="text-sm text-gray-700 mt-2">{reminder.notes}</p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleReminder(reminder.id)}
                      >
                        {reminder.active ? 'Disable' : 'Enable'}
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => deleteReminder(reminder.id)}
                      >
                        Delete
                      </Button>
                    </div>
                  </div>
                  {reminder.active && (
                    <div className="mt-3 flex items-center space-x-2 text-green-600">
                      <Bell className="h-4 w-4" />
                      <span className="text-sm">Active reminder</span>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Pill className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No medication reminders set</p>
              <p className="text-sm text-gray-400">Add your first reminder to stay on track</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MedicationReminders;