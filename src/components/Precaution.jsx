import React from 'react';
import { AlertTriangle, Flame, Eye, Shield } from 'lucide-react';
import './FirecrackerSafety.css';

const FirecrackerSafety = () => {
  const safetyPrecautions = [
    {
      icon: <Shield className="icon" />,
      text: "Keep a bucket of water or sand nearby"
    },
    {
      icon: <Flame className="icon" />,
      text: "Light firecrackers outdoors in open areas only"
    },
    {
      icon: <AlertTriangle className="icon" />,
      text: "Never hold firecrackers in your hands while lighting"
    },
    {
      icon: <Shield className="icon" />,
      text: "Supervise children at all times"
    },
    {
      icon: <Flame className="icon" />,
      text: "Light one firecracker at a time"
    },
    {
      icon: <AlertTriangle className="icon" />,
      text: "Never try to relight a dud firecracker"
    },
    {
      icon: <Eye className="icon" />,
      text: "Stand at a safe distance after lighting"
    },
    {
      icon: <Shield className="icon" />,
      text: "Store firecrackers in a cool, dry place"
    },
    {
      icon: <AlertTriangle className="icon" />,
      text: "Never make homemade firecrackers"
    }
  ];

  return (
    <div className="safety-container">
      <div className="header">
        <Flame className="header-icon" />
        <h2 className="header-title">
          Firecracker Safety Precautions
        </h2>
      </div>
      
      <div className="precautions-grid">
        {safetyPrecautions.map((precaution, index) => (
          <div key={index} className="precaution-card">
            <div className="icon-container">
              {precaution.icon}
            </div>
            <span className="precaution-text">
              {precaution.text}
            </span>
          </div>
        ))}
      </div>
      
      <div className="warning-footer">
        <p className="warning-text">
          <strong>Remember:</strong> Safety first! Enjoy responsibly and follow local regulations.
        </p>
      </div>
    </div>
  );
};

export default FirecrackerSafety;