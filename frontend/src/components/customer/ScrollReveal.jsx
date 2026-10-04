import { useEffect, useRef, useState } from "react";

const ScrollReveal = ({
  children,
  className = "",
  animation = "up",
  delay = 0,
  duration = 500,
  threshold = 0.1,
  once = true,
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const element = elementRef.current;

    if (!element) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);

          if (once) {
            observer.unobserve(element);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
      },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [once, threshold]);

  const animations = {
    up: {
      hidden: "translate-y-6 opacity-0",
      visible: "translate-y-0 opacity-100",
    },
    down: {
      hidden: "-translate-y-6 opacity-0",
      visible: "translate-y-0 opacity-100",
    },
    left: {
      hidden: "translate-x-6 opacity-0",
      visible: "translate-x-0 opacity-100",
    },
    right: {
      hidden: "-translate-x-6 opacity-0",
      visible: "translate-x-0 opacity-100",
    },
    fade: {
      hidden: "opacity-0",
      visible: "opacity-100",
    },
    zoom: {
      hidden: "scale-95 opacity-0",
      visible: "scale-100 opacity-100",
    },
  };

  const selectedAnimation = animations[animation] || animations.up;

  const animationClass = isVisible
    ? selectedAnimation.visible
    : selectedAnimation.hidden;

  return (
    <div
      ref={elementRef}
      className={`transform transition-all ease-out ${animationClass} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
      }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
