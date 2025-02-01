import React, { useEffect, useRef } from "react";
import { Fireworks } from "fireworks-js";

const FireWorks = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        const fireworks = new Fireworks(containerRef.current, {
            speed: 3,
            acceleration: 10,
            particles: 40,
            intensity: 17,
        });

        fireworks.start();

        return () => fireworks.stop();
    }, []);

    return (
        <div ref={containerRef} style={{ width: "100vw", 
        height: "100vh",
        position: "fixed",
        zIndex:0,
        bottom: "700px",
        pointerEvents:"none", 
        left: 0 }}>
        </div>
    );
};

export default FireWorks;
