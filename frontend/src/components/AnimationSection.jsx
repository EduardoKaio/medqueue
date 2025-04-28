import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

function AnimatedSection({ children, direction = "up", ...props }) {
    const controls = useAnimation();
    const { ref, inView } = useInView({ triggerOnce: false });
  
    const distance = 50; // distância para animação
  
    useEffect(() => {
      if (inView) {
        controls.start({
          opacity: 1,
          x: direction === "left" ? 0 : direction === "right" ? 0 : undefined,
          y: direction === "up" ? 0 : undefined,
          transition: { duration: 1, ease: "easeOut" }
        });
      } else {
        controls.start({
          opacity: 0,
          x: direction === "left" ? -distance : direction === "right" ? distance : undefined,
          y: direction === "up" ? distance : undefined,
          transition: { duration: 1, ease: "easeOut" }
        });
      }
    }, [controls, inView, direction]);
  
    return (
      <motion.section
        ref={ref}
        animate={controls}
        initial={{ opacity: 0, x: direction === "left" ? -distance : direction === "right" ? distance : 0, y: direction === "up" ? distance : 0 }}
        {...props}
      >
        {children}
      </motion.section>
    );
  }
export default AnimatedSection;