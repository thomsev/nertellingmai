import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";

const pad = (value) => String(value).padStart(2, "0");

const createCountdown = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  const totalMs = Math.max(target.getTime() - now.getTime(), 0);
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return {
    totalSeconds,
    days,
    hours,
    minutes,
    seconds,
  };
};

const Countdown = ({ targetDate }) => {
  const [timeLeft, setTimeLeft] = useState(() => createCountdown(targetDate));

  const units = useMemo(
    () => [
      { label: "Daga", value: timeLeft.days },
      { label: "Timar", value: timeLeft.hours },
      { label: "Minutt", value: timeLeft.minutes },
      { label: "Sekund", value: timeLeft.seconds },
    ],
    [timeLeft]
  );

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft(createCountdown(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  useEffect(() => {
    gsap.fromTo(
      ".countdown-card",
      { y: 12, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08 }
    );
  }, []);

  return (
    <div className="countdown">
      {units.map((unit) => (
        <article className="countdown-card" key={unit.label}>
          <p className="countdown-value">{pad(unit.value)}</p>
          <p className="countdown-label">{unit.label}</p>
        </article>
      ))}
      {timeLeft.totalSeconds === 0 && (
        <div className="countdown-complete">
          <h3>No e det gjort.</h3>
          <p>Sender siste farvel-emojien, så kan dokke kosa dokke.</p>
        </div>
      )}
    </div>
  );
};

export default Countdown;
