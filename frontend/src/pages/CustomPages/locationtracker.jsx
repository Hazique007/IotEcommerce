import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LocationTracker = () => {
  const location = useLocation();
  const prevLocationRef = useRef(null);

  useEffect(() => {
    if (prevLocationRef.current) {
      localStorage.setItem('lastToLastVisited', prevLocationRef.current);
    }
    prevLocationRef.current = location.pathname;
  }, [location]);

  return null;
};

export default LocationTracker;
