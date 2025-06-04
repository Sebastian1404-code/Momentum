// DotTrail.jsx
import { useEffect } from "react";

export default function DotTrail() {
    useEffect(() => {
        const trailContainer = document.createElement("div");
        trailContainer.style.position = "fixed";
        trailContainer.style.top = 0;
        trailContainer.style.left = 0;
        trailContainer.style.pointerEvents = "none";
        trailContainer.style.zIndex = "9999";
        document.body.appendChild(trailContainer);

        const createDot = (x, y) => {
            const dot = document.createElement("div");
            dot.style.position = "absolute";
            dot.style.width = "8px";
            dot.style.height = "8px";
            dot.style.borderRadius = "50%";
            dot.style.background = "rgba(0, 217, 255, 0.7)";
            dot.style.boxShadow = "0 0 8px #00d9ff";
            dot.style.left = `${x}px`;
            dot.style.top = `${y}px`;
            trailContainer.appendChild(dot);

            setTimeout(() => {
                dot.style.transition = "opacity 0.5s ease-out";
                dot.style.opacity = 0;
                setTimeout(() => {
                    trailContainer.removeChild(dot);
                }, 500);
            }, 10);
        };

        const handleMouseMove = (e) => {
            createDot(e.clientX, e.clientY);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return null;
}
