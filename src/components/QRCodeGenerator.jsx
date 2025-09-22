import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/use-toast';
import { QrCode, Download, Share } from 'lucide-react';
import QRCode from 'qrcode';

const QRCodeGenerator = ({ patientId, patientName }) => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    generateQRCode();
  }, [patientId]);

  const generateQRCode = async () => {
    try {
      setLoading(true);
      const patientUrl = `${window.location.origin}/patient/${patientId}`;
      const qrUrl = await QRCode.toDataURL(patientUrl, {
        width: 256,
        margin: 2,
        color: {
          dark: '#1e40af',
          light: '#ffffff'
        }
      });
      setQrCodeUrl(qrUrl);
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast({
        title: "Error",
        description: "Failed to generate QR code",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const downloadQRCode = () => {
    if (!qrCodeUrl) return;
    
    const link = document.createElement('a');
    link.download = `${patientName}-health-id.png`;
    link.href = qrCodeUrl;
    link.click();
    
    toast({
      title: "QR Code Downloaded",
      description: "Your digital health ID has been saved to your device"
    });
  };

  const shareQRCode = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Digital Health ID',
          text: `Digital Health ID for ${patientName}`,
          url: `${window.location.origin}/patient/${patientId}`
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${window.location.origin}/patient/${patientId}`);
      toast({
        title: "Link Copied",
        description: "Patient profile link copied to clipboard"
      });
    }
  };

  return (
    <Card className="health-card">
      <CardHeader>
        <CardTitle className="flex items-center">
          <QrCode className="h-5 w-5 mr-2" />
          Digital Health ID
        </CardTitle>
        <CardDescription>
          Your unique QR code for quick medical record access
        </CardDescription>
      </CardHeader>
      <CardContent className="text-center">
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <div className="bg-white p-6 rounded-lg shadow-lg inline-block">
              <img 
                src={qrCodeUrl} 
                alt="Patient QR Code" 
                className="w-64 h-64 mx-auto"
              />
            </div>
            
            <div className="space-y-2">
              <h3 className="text-lg font-semibold">{patientName}</h3>
              <p className="text-sm text-gray-600">Patient ID: {patientId}</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={downloadQRCode} variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
              <Button onClick={shareQRCode} variant="outline">
                <Share className="h-4 w-4 mr-2" />
                Share Profile
              </Button>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <h4 className="font-medium text-blue-900 mb-2">How to use your QR code:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Show this QR code to healthcare providers</li>
                <li>• Doctors can scan it to access your medical history</li>
                <li>• Keep a screenshot on your phone for easy access</li>
                <li>• Print a copy to keep in your wallet</li>
              </ul>
            </div>
          </motion.div>
        )}
      </CardContent>
    </Card>
  );
};

export default QRCodeGenerator;