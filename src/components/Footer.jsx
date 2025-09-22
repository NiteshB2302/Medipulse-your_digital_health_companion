import React from 'react';
import { Heart, Twitter, Facebook, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const socialLinks = [
    { icon: <Twitter className="h-5 w-5" />, href: '#' },
    { icon: <Facebook className="h-5 w-5" />, href: '#' },
    { icon: <Linkedin className="h-5 w-5" />, href: '#' },
  ];

  const footerLinks = [
    { title: 'About Us', href: '#' },
    { title: 'Contact', href: '#' },
    { title: 'Privacy Policy', href: '#' },
    { title: 'Terms of Service', href: '#' },
  ];

  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="h-8 w-8 text-blue-500" />
              <span className="text-2xl font-bold">MediPulse</span>
            </div>
            <p className="text-gray-400">
              Your trusted partner in digital healthcare.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link, index) => (
                <a
                  key={index}
                  href={link.href}
                  className="text-gray-400 hover:text-white transition-colors"
                  aria-label={`Follow us on ${link.href}`}
                >
                  {link.icon}
                </a>
              ))}
            </div>
          </div>

          <div className="md:col-span-2 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <p className="font-semibold mb-4">Quick Links</p>
              <ul className="space-y-2">
                {footerLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      to={link.href}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      {link.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">For Patients</p>
              <ul className="space-y-2">
                <li><Link to="/patient-dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Find a Doctor</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Book Appointment</Link></li>
              </ul>
            </div>
            <div>
              <p className="font-semibold mb-4">For Doctors</p>
              <ul className="space-y-2">
                <li><Link to="/doctor-dashboard" className="text-gray-400 hover:text-white">Dashboard</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Patient Records</Link></li>
                <li><Link to="#" className="text-gray-400 hover:text-white">Join Our Network</Link></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} MediPulse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;