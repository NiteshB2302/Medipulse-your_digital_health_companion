import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const storedUser = localStorage.getItem('medipulse_user');
    const storedRole = localStorage.getItem('medipulse_role');
    
    if (storedUser && storedRole) {
      setUser(JSON.parse(storedUser));
      setUserRole(storedRole);
    }
    
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      // Mock authentication - replace with Supabase auth
      const mockUsers = [
        { id: '1', email: 'patient@test.com', password: 'password', role: 'patient', name: 'John Doe' },
        { id: '2', email: 'doctor@test.com', password: 'password', role: 'doctor', name: 'Dr. Smith' },
        { id: '3', email: 'admin@test.com', password: 'password', role: 'admin', name: 'Admin User' }
      ];
      
      const foundUser = mockUsers.find(u => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Invalid credentials');
      }
      
      const userData = { id: foundUser.id, email: foundUser.email, name: foundUser.name };
      
      setUser(userData);
      setUserRole(foundUser.role);
      
      localStorage.setItem('medipulse_user', JSON.stringify(userData));
      localStorage.setItem('medipulse_role', foundUser.role);
      
      toast({
        title: "Login Successful",
        description: `Welcome back, ${foundUser.name}!`,
      });
      
      return { user: userData, role: foundUser.role };
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      // Mock registration - replace with Supabase auth
      const newUser = {
        id: Date.now().toString(),
        email: userData.email,
        name: userData.name
      };
      
      setUser(newUser);
      setUserRole(userData.role);
      
      localStorage.setItem('medipulse_user', JSON.stringify(newUser));
      localStorage.setItem('medipulse_role', userData.role);
      
      // Store additional profile data
      const profiles = JSON.parse(localStorage.getItem('medipulse_profiles') || '[]');
      profiles.push({
        userId: newUser.id,
        ...userData,
        createdAt: new Date().toISOString()
      });
      localStorage.setItem('medipulse_profiles', JSON.stringify(profiles));
      
      toast({
        title: "Registration Successful",
        description: `Welcome to MediPulse, ${userData.name}!`,
      });
      
      return { user: newUser, role: userData.role };
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setUserRole(null);
    localStorage.removeItem('medipulse_user');
    localStorage.removeItem('medipulse_role');
    
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const value = {
    user,
    userRole,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};