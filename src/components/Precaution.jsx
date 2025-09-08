import React from 'react';
import { AlertTriangle, Flame, Eye, Shield } from 'lucide-react';

const FirecrackerSafety = () => {
  const safetyPrecautions = [
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Keep a bucket of water or sand nearby"
    },
    {
      icon: <Flame className="w-5 h-5" />,
      text: "Light firecrackers outdoors in open areas only"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      text: "Never hold firecrackers in your hands while lighting"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Supervise children at all times"
    },
    {
      icon: <Flame className="w-5 h-5" />,
      text: "Light one firecracker at a time"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      text: "Never try to relight a dud firecracker"
    },
    {
      icon: <Eye className="w-5 h-5" />,
      text: "Stand at a safe distance after lighting"
    },
    {
      icon: <Shield className="w-5 h-5" />,
      text: "Store firecrackers in a cool, dry place"
    },
    {
      icon: <AlertTriangle className="w-5 h-5" />,
      text: "Never make homemade firecrackers"
    }
  ];

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <Flame style={styles.headerIcon} />
        <h2 style={styles.title}>Firecracker Safety Precautions</h2>
      </div>
      
      <div style={styles.precautionsList}>
        {safetyPrecautions.map((precaution, index) => (
          <div key={index} style={styles.precautionItem}>
            <div style={styles.iconWrapper}>
              {precaution.icon}
            </div>
            <span style={styles.precautionText}>{precaution.text}</span>
          </div>
        ))}
      </div>
      
      <div style={styles.footer}>
        <p style={styles.footerText}>
          <strong>Remember:</strong> Safety first! Enjoy responsibly and follow local regulations.
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    backgroundColor: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '8px',
    padding: '20px',
    maxWidth: '100%',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: '16px',
    paddingBottom: '12px',
    borderBottom: '2px solid #fef3c7'
  },
  headerIcon: {
    width: '24px',
    height: '24px',
    color: '#f59e0b',
    marginRight: '8px'
  },
  title: {
    color: '#1f2937',
    fontSize: '1.25rem',
    fontWeight: '600',
    margin: '0'
  },
  precautionsList: {
    display: 'flex',
    flexDirection: 'row',
    gap: '12px',
    marginBottom: '16px'
  },
  precautionItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px',
    backgroundColor: '#fef3c7',
    borderRadius: '6px',
    border: '1px solid #fbbf24',
    minHeight: '80px'
  },
  iconWrapper: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px',
    height: '28px',
    backgroundColor: '#f59e0b',
    borderRadius: '50%',
    marginRight: '12px',
    flexShrink: 0,
    color: 'white'
  },
  precautionText: {
    color: '#92400e',
    fontSize: '0.9rem',
    lineHeight: '1.4',
    fontWeight: '500'
  },
  footer: {
    backgroundColor: '#fee2e2',
    border: '1px solid #fca5a5',
    borderRadius: '6px',
    padding: '12px',
    textAlign: 'center'
  },
  footerText: {
    color: '#991b1b',
    fontSize: '0.85rem',
    margin: '0',
    fontWeight: '500'
  }
};

export default FirecrackerSafety;