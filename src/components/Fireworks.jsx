import React, { useEffect, useRef } from 'react';
import Fireworks from 'react-fireworks';

const FireworksComp = () => {
  const containerRef = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      const fireworksInstance = new Fireworks({
        target: containerRef.current,
      });
      fireworksInstance.start();

      return () => {
        fireworksInstance.stop();
      };
    }
  }, []);

  return (
    <div>
      <h1>Celebrate!</h1>
      <div ref={containerRef} style={{ width: '100%', height: '100vh' }}></div>
    </div>
  );
};

export default FireworksComp;
