import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string, initialValue = '') => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });
  const setValue = (value: string | ((str: string) => string)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const onEvent = (e: StorageEvent) => {
      if (e.key === key) {
        setStoredValue(e.newValue);
      }
    };
    window.addEventListener('storage', (e) => {
      onEvent(e);
    });
    return () => {
      window.removeEventListener('storage', onEvent);
    };
  }, []);

  return [storedValue, setValue];
};
