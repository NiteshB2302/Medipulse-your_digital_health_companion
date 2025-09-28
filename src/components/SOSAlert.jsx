import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { AlertTriangle, Phone, MapPin, Check } from 'lucide-react';

const SOSAlert = ({ patientId, patientName }) => {
  const [isAlertSending, setIsAlertSending] = useState(false);
  const [alertSent, setAlertSent] = useState(false);

  const handleSOSClick = async () => {
    setIsAlertSending(true);
    setAlertSent(false);

    // Simulated API call delay
    setTimeout(() => {
      setIsAlertSending(false);
      setAlertSent(true);
      
      // Reset alert status after 10 seconds
      setTimeout(() => {
        setAlertSent(false);
      }, 10000);
    }, 2500);
  };

  return (
    <div className="space-y-6">
      {/* Main SOS Button Card */}
      <Card className="health-card bg-red-50 border-red-200">
        <CardHeader className="text-center">
          <CardTitle className="text-red-800 flex items-center justify-center">
            <AlertTriangle className="h-6 w-6 mr-2" />
            Emergency Alert System
          </CardTitle>
          <CardDescription className="text-red-600">
            Press the button below to send an immediate emergency alert
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-6">
          {/* Main SOS Button */}
          <div className="flex flex-col items-center space-y-4">
            <Button
              onClick={handleSOSClick}
              disabled={isAlertSending || alertSent}
              className={`
                w-32 h-32 rounded-full text-white font-bold text-xl
                ${isAlertSending ? 'bg-orange-500' : alertSent ? 'bg-green-500' : 'bg-red-500 hover:bg-red-600 animate-pulse'}
                transition-all duration-300 transform hover:scale-105
                disabled:opacity-90 disabled:cursor-not-allowed
              `}
            >
              {isAlertSending ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mb-2"></div>
                  <span className="text-sm">Sending...</span>
                </div>
              ) : alertSent ? (
                <div className="flex flex-col items-center">
                  <Check className="h-8 w-8 mb-2" />
                  <span className="text-sm">Sent!</span>
                </div>
              ) : (
                'SOS'
              )}
            </Button>
            
            <p className="text-sm text-gray-600 text-center max-w-md">
              {alertSent 
                ? "Emergency alert has been sent successfully!"
                : "In case of medical emergency, press the SOS button to alert your emergency contacts and nearby medical facilities"
              }
            </p>
          </div>

          {/* Success Message */}
          {alertSent && (
            <div className="w-full max-w-md p-4 bg-green-100 border border-green-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <Check className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800">Alert sent successfully!</h4>
                  <p className="text-sm text-green-700 mt-1">
                    Help is on the way. Your emergency contacts and nearby medical facilities have been notified.
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Information Cards */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card className="health-card">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Phone className="h-4 w-4 mr-2 text-blue-600" />
              Alert Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Patient:</span>
              <span className="font-medium">{patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium flex items-center">
                <MapPin className="h-3 w-3 mr-1" />
                Thane, Maharashtra, India
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Message:</span>
              <span className="font-medium text-red-600">Medical Emergency</span>
            </div>
          </CardContent>
        </Card>

        <Card className="health-card">
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <AlertTriangle className="h-4 w-4 mr-2 text-orange-600" />
              Emergency Instructions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-gray-600">
            <p>• Stay calm and remain in a safe location</p>
            <p>• If conscious, try to provide details to responders</p>
            <p>• Keep your phone nearby for contact</p>
            <p>• Emergency services are being notified</p>
          </CardContent>
        </Card>
      </div>

      {/* Disclaimer */}
      <Card className="health-card bg-yellow-50 border-yellow-200">
        <CardContent className="pt-6">
          <p className="text-sm text-yellow-800 text-center">
            <AlertTriangle className="h-4 w-4 inline mr-1" />
            This is a simulated emergency alert system. In a real emergency, please call local emergency services directly.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOSAlert;