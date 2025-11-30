// src/components/GridMotion.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import './GridMotion.css';

const GridMotion = ({ items = [] }) => {
  const gridRef = useRef(null);
  const rowRefs = useRef([]);
  const mouseXRef = useRef(window.innerWidth / 2);

  const totalItems = 28;
  const defaultItems = Array.from({ length: totalItems }, (_, index) => `Item ${index + 1}`);
  const combinedItems = items.length > 0 ? items.slice(0, totalItems) : defaultItems;

  useEffect(() => {
    gsap.ticker.lagSmoothing(0);

    const handleMouseMove = (e) => {
      mouseXRef.current = e.clientX;
    };

    const updateMotion = () => {
      const maxMoveAmount = 250;
      const baseDuration = 0.9;
      const inertiaFactors = [0.7, 0.5, 0.4, 0.3];

      rowRefs.current.forEach((row, index) => {
        if (row) {
          const direction = index % 2 === 0 ? 1 : -1;
          const moveAmount = ((mouseXRef.current / window.innerWidth) * maxMoveAmount - maxMoveAmount / 2) * direction;

          gsap.to(row, {
            x: moveAmount,
            duration: baseDuration + inertiaFactors[index % inertiaFactors.length],
            ease: 'power2.out',
            overwrite: 'auto'
          });
        }
      });
    };

    const removeAnimationLoop = gsap.ticker.add(updateMotion);
    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      removeAnimationLoop();
    };
  }, []);

  return (
    <div className="grid-motion-wrapper" ref={gridRef}>
      <div className="gridMotion-container">
        {[...Array(4)].map((_, rowIndex) => (
          <div
            key={rowIndex}
            className="grid-motion-row"
            ref={(el) => (rowRefs.current[rowIndex] = el)}
          >
            {[...Array(7)].map((_, itemIndex) => {
              const content = combinedItems[rowIndex * 7 + itemIndex];
              return (
                <div key={itemIndex} className="grid-motion-item">
                  <div className="grid-motion-item-inner">
                    {typeof content === 'string' && content.startsWith('http') ? (
                      <div
                        className="grid-motion-item-img"
                        style={{ backgroundImage: `url(${content})` }}
                      />
                    ) : (
                      <div className="grid-motion-item-content">{content}</div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default GridMotion;