import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Phone, Plus, Trash2, UserPlus } from 'lucide-react';

const EmergencyContacts = ({ patientId }) => {
  const [contacts, setContacts] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    // Load emergency contacts from localStorage
    const savedContacts = JSON.parse(localStorage.getItem(`emergency_contacts_${patientId}`) || '[]');
    
    // Also check if there's an initial emergency contact from registration
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const profile = profiles.find(p => p.userId === patientId);
    
    // If profile has emergencyContact and it's not already in saved contacts, add it
    if (profile?.emergencyContact && !savedContacts.some(contact => contact.phone === profile.emergencyContact)) {
      const initialContact = {
        id: Date.now(),
        name: 'Emergency Contact',
        phone: profile.emergencyContact
      };
      const updatedContacts = [initialContact, ...savedContacts];
      setContacts(updatedContacts);
      localStorage.setItem(`emergency_contacts_${patientId}`, JSON.stringify(updatedContacts));
    } else {
      setContacts(savedContacts);
    }
  }, [patientId]);

  const handleAddContact = (e) => {
    e.preventDefault();
    if (newContact.name.trim() && newContact.phone.trim()) {
      const contact = {
        id: Date.now(),
        name: newContact.name.trim(),
        phone: newContact.phone.trim()
      };
      const updatedContacts = [...contacts, contact];
      setContacts(updatedContacts);
      localStorage.setItem(`emergency_contacts_${patientId}`, JSON.stringify(updatedContacts));
      
      // Reset form
      setNewContact({ name: '', phone: '' });
      setShowAddForm(false);
    }
  };

  const handleRemoveContact = (contactId) => {
    const updatedContacts = contacts.filter(contact => contact.id !== contactId);
    setContacts(updatedContacts);
    localStorage.setItem(`emergency_contacts_${patientId}`, JSON.stringify(updatedContacts));
  };

  const handleCancelAdd = () => {
    setNewContact({ name: '', phone: '' });
    setShowAddForm(false);
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Phone className="h-5 w-5 mr-2" />
          Emergency Contacts
        </CardTitle>
        <CardDescription>
          Manage your emergency contacts for SOS alerts
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current Contacts List */}
        {contacts.length > 0 ? (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.phone}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveContact(contact.id)}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No emergency contacts added yet</p>
        )}

        {/* Add New Contact Form */}
        {showAddForm ? (
          <form onSubmit={handleAddContact} className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                placeholder="Enter contact name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contactPhone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="contactPhone"
                  placeholder="Enter phone number"
                  value={newContact.phone}
                  onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button type="submit" size="sm" className="flex-1">
                <Plus className="h-4 w-4 mr-2" />
                Add Contact
              </Button>
              <Button type="button" variant="outline" size="sm" onClick={handleCancelAdd}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <Button
            onClick={() => setShowAddForm(true)}
            variant="outline"
            className="w-full"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Add Emergency Contact
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default EmergencyContacts;