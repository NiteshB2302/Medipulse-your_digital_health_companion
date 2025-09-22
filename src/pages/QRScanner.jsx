import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Scan, Search } from 'lucide-react';

const QRScanner = () => {
  const [manualId, setManualId] = useState('');
  const [scanning, setScanning] = useState(false);
  const navigate = useNavigate();

  const handleManualSearch = () => {
    if (!manualId.trim()) {
      toast({
        title: "Error",
        description: "Please enter a patient ID",
        variant: "destructive"
      });
      return;
    }

    // Check if patient exists
    const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
    const patient = profiles.find(p => p.userId === manualId.trim());

    if (patient) {
      navigate(`/patient/${manualId.trim()}`);
    } else {
      toast({
        title: "Patient Not Found",
        description: "No patient found with this ID",
        variant: "destructive"
      });
    }
  };

  const handleQRScan = () => {
    setScanning(true);
    
    // Simulate QR scanning - in real implementation, this would use camera
    setTimeout(() => {
      setScanning(false);
      toast({
        title: "🚧 QR Scanner Feature",
        description: "Camera-based QR scanning isn't implemented yet—but don't worry! You can request it in your next prompt! 🚀"
      });
    }, 2000);
  };

  return (
    <>
      <Helmet>
        <title>QR Scanner - MediPulse</title>
        <meta name="description" content="Scan patient QR codes to access medical records" />
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
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Patient QR Scanner</h1>
              <p className="text-gray-600">Scan patient QR codes to quickly access their medical records</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* QR Scanner */}
              <Card className="health-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Scan className="h-5 w-5 mr-2" />
                    QR Code Scanner
                  </CardTitle>
                  <CardDescription>
                    Use your camera to scan patient QR codes
                  </CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6">
                    {scanning ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
                      />
                    ) : (
                      <Scan className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    )}
                    <p className="text-gray-600">
                      {scanning ? 'Scanning for QR code...' : 'Position QR code in camera view'}
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleQRScan} 
                    disabled={scanning}
                    className="w-full"
                  >
                    {scanning ? 'Scanning...' : 'Start QR Scan'}
                  </Button>
                </CardContent>
              </Card>

              {/* Manual Search */}
              <Card className="health-card">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Search className="h-5 w-5 mr-2" />
                    Manual Patient Search
                  </CardTitle>
                  <CardDescription>
                    Enter patient ID manually if QR code is not available
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="patientId">Patient ID</Label>
                    <Input
                      id="patientId"
                      placeholder="Enter patient ID"
                      value={manualId}
                      onChange={(e) => setManualId(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && handleManualSearch()}
                    />
                  </div>
                  
                  <Button onClick={handleManualSearch} className="w-full">
                    Search Patient
                  </Button>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-800 font-medium mb-2">Demo Patient IDs:</p>
                    <div className="text-xs text-blue-700 space-y-1">
                      <div>Patient ID: 1 (John Doe)</div>
                      <div>Patient ID: 2 (Jane Smith)</div>
                      <div>Patient ID: 3 (Bob Johnson)</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Instructions */}
            <Card className="health-card mt-8 max-w-4xl mx-auto">
              <CardHeader>
                <CardTitle>How to Use QR Scanner</CardTitle>
                <CardDescription>Step-by-step guide for scanning patient QR codes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">1</span>
                    </div>
                    <h3 className="font-medium mb-2">Position QR Code</h3>
                    <p className="text-sm text-gray-600">
                      Ask the patient to show their digital health ID QR code
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">2</span>
                    </div>
                    <h3 className="font-medium mb-2">Scan Code</h3>
                    <p className="text-sm text-gray-600">
                      Click "Start QR Scan" and position the code in the camera view
                    </p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-blue-600 font-bold">3</span>
                    </div>
                    <h3 className="font-medium mb-2">Access Records</h3>
                    <p className="text-sm text-gray-600">
                      Automatically navigate to the patient's medical profile
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default QRScanner;