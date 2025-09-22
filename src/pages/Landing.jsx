import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users, Calendar, QrCode, FileText } from 'lucide-react';

const Landing = () => {
  const features = [
    {
      icon: <QrCode className="h-8 w-8" />,
      title: "Digital Health ID",
      description: "Secure QR-based patient identification system"
    },
    {
      icon: <Calendar className="h-8 w-8" />,
      title: "Smart Appointments",
      description: "Easy booking and management of medical appointments"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Digital Records",
      description: "Secure storage and sharing of medical records"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Data Security",
      description: "End-to-end encryption for all medical data"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Multi-Role Access",
      description: "Tailored dashboards for patients, doctors, and admins"
    },
    {
      icon: <Heart className="h-8 w-8" />,
      title: "Health Monitoring",
      description: "Medication reminders and health tracking"
    }
  ];

  return (
    <>
      <Helmet>
        <title>MediPulse - Digital Healthcare Platform</title>
        <meta name="description" content="Revolutionary digital healthcare platform connecting patients, doctors, and medical professionals" />
      </Helmet>
      
      <div className="min-h-screen">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="relative container mx-auto px-4 py-20">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center text-white"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-8"
              >
                <Heart className="h-20 w-20 mx-auto text-red-400 pulse-animation" />
              </motion.div>
              
              <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                MediPulse
              </h1>
              
              <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto opacity-90">
                Revolutionary digital healthcare platform connecting patients, doctors, and medical professionals
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/register">
                  <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-3 text-lg">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600 px-8 py-3 text-lg">
                    Sign In
                  </Button>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 bg-white">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Comprehensive Healthcare Solutions
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Everything you need for modern healthcare management in one secure platform
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="health-card p-8 rounded-2xl text-center hover:shadow-xl transition-all duration-300"
                >
                  <div className="text-blue-600 mb-4 flex justify-center">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 medical-gradient">
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-white"
            >
              <h2 className="text-4xl font-bold mb-6">
                Ready to Transform Healthcare?
              </h2>
              <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
                Join thousands of healthcare professionals already using MediPulse
              </p>
              <Link to="/register">
                <Button size="lg" className="bg-white text-purple-600 hover:bg-gray-100 px-8 py-3 text-lg">
                  Start Your Journey
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </>
  );
};

export default Landing;