import { useEffect, useRef, useState } from "react";
import BackgroundTimer from "react-native-background-timer";

export const useBackgroundTimer = (timeInSeconds?: number) => {
  const [timer, setTimer] = useState(timeInSeconds || 3);

  const otpTimer = useRef<ReturnType<typeof BackgroundTimer.setInterval> | undefined>(undefined);
  const clearTimerInterval = () => {
    if (otpTimer.current) {
      BackgroundTimer.clearInterval(otpTimer.current);
    }
  };

  useEffect(() => {
    if (timer > 0) {
      otpTimer.current = BackgroundTimer.setInterval(() => {
        setTimer(timer - 1);
      }, 1000);
    }
    return () => clearTimerInterval();
  }, [timer]);

  return { timer: timer, setTimer: setTimer, clearTimerInterval: clearTimerInterval };
};
