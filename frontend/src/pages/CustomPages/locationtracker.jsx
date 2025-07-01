import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

const LocationTracker = () => {
  const location = useLocation();
  const prevLocationRef = useRef(null);

  useEffect(() => {
    const currentPath = location.pathname;

    if (currentPath !== '/login') {
      if (prevLocationRef.current && prevLocationRef.current !== '/login') {
        localStorage.setItem('lastToLastVisited', prevLocationRef.current);
      }

      localStorage.setItem('lastVisited', currentPath);
      prevLocationRef.current = currentPath;
    }
  }, [location]);

  return null;
};

export default LocationTracker;
