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
            particles: 20,  // Slightly more particles for a better effect
            intensity: 6,   // Balanced intensity for smoother explosion
            trace: 0,       // Removes the bottom streaks completely
            explosion: 4,   // Keeps the explosion size visible
            friction: 0.96,
            opacity: 0.9,
            background: "transparent",
            lineWidth: {
                explosion: { min: 2, max: 3 },  // Keep explosion lines visible
                trace: { min: 0, max: 0 }       // Remove trail lines
            },
            lineColors: ["#FFD700", "#FFC107", "#FFDF00"],  // Gold shades
            
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
