import { useEffect } from 'react';
import { useLocation } from 'react-router';
import Popup from '@/components/popup';
import Toast from '@/components/toast';

export function RouteListener() {
  const location = useLocation();

  useEffect(() => {
    Toast.clear();
    Popup.clear();
  }, [location.key]);

  return null;
}
