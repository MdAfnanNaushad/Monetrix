import React, { useEffect, useState } from 'react';

const CountUp = ({ end = 0, duration = 1200, prefix = '', suffix = '', decimals = 0 }) => {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const target = Number(end) || 0;
    const start = 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      // Ease out cubic
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      setValue(start + (target - start) * easeProgress);

      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setValue(target);
      }
    };

    window.requestAnimationFrame(step);
  }, [end, duration]);

  const formatted = value.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
};

export default CountUp;
