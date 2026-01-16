import { useEffect, useState } from 'react';

const CountdownSession = () => {
  const [timeLeft, setTimeLeft] = useState('00:00:00');

  useEffect(() => {
    const expiredAt = localStorage.getItem('expiredAt');
    if (!expiredAt) {
      setTimeLeft('—');
      return;
    }

    const expiredTime = new Date(expiredAt).getTime();

    const interval = setInterval(() => {
      const diff = expiredTime - Date.now();

      if (diff <= 0) {
        setTimeLeft('Expired');
        clearInterval(interval);
        return;
      }

      const hours = Math.floor(diff / 3600000);
      const minutes = Math.floor((diff % 3600000) / 60000);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft(
        `${hours.toString().padStart(2, '0')}:` +
          `${minutes.toString().padStart(2, '0')}:` +
          `${seconds.toString().padStart(2, '0')}`,
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return timeLeft;
};

export default CountdownSession;
