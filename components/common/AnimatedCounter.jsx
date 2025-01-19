'use client';

import { animate, useInView, useIsomorphicLayoutEffect } from 'framer-motion';
import { useRef } from 'react';

export default function AnimatedCounter({ from, to, animationOptions }) {
    const ref = useRef(null); // Reference to the span element
    const inView = useInView(ref, { once: true }); // Hook to check if the element is in view

    useIsomorphicLayoutEffect(() => {
        const element = ref.current;

        if (!element) return;
        if (!inView) return;

        // Set initial value
        element.textContent = String(from);

        // Check if reduced motion is enabled in the user's system
        if (window.matchMedia('(prefers-reduced-motion)').matches) {
            element.textContent = String(to);
            return;
        }

        const controls = animate(from, to, {
            duration: 2,
            ease: 'easeOut',
            ...animationOptions,
            onUpdate(value) {
                element.textContent = value?.toFixed(0); // Update element text content
            },
        });

        // Cleanup: stop animation on component unmount
        return () => {
            controls.stop();
        };
    }, [ref, inView, from, to]);

    return <span ref={ref} />;
}
