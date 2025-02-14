import React, { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";

const FireworksComp = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        console.log("Fireworks Loaded")
        if (!containerRef.current) return;

        const fireworks = new Fireworks(containerRef.current, {
            speed: 2,
            acceleration: 5,
            particles: 15,
            intensity: 5,
            explosion: 3,      // Smaller explosions
            friction: 0.96,
        });

        fireworks.start();

        return () => fireworks.stop();
    }, []);

    return (
        <div 
            ref={containerRef} 
            style={{ 
                width: "100vw", 
                height: "100vh",
                position: "fixed",
                zIndex: 0,
                bottom: 0, 
                left: 0,
                pointerEvents: "none",
            }}
        />
    );
};

export default FireworksComp;
