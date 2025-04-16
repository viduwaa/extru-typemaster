import React from "react";
import { motion, useTransform, useTime } from "framer-motion";

interface GlowingLogoProps {
  src: string;
  alt: string;
}

const GlowingLogo: React.FC<GlowingLogoProps> = ({ src, alt }) => {
  const glowIntensity = useTransform(
    useTime(),
    [0, Infinity],
    [0.5, 1.5],
  );

  return (
    <motion.img
      src={src}
      alt={alt}
      style={{
        height: "100%",
        width: "auto",
        maxWidth: "100%",
        objectFit: "cover",
        filter: useTransform(
          glowIntensity,
          [0.5, 5.4],
          [
            "drop-shadow(0 0 15px rgba(0, 123, 255, 0.8))",
            "drop-shadow(0 0 30px rgba(0, 123, 255, 1))",
          ],
        ),
      }}
      transition={{
        duration: 2,
        ease: "easeInOut",
        repeat: Infinity,
        repeatType: "reverse",
      }}
    />
  );
};

export default GlowingLogo;
