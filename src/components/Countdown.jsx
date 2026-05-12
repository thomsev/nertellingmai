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

const getHypePhase = (totalSeconds) => {
  const daysLeft = totalSeconds / 86400;

  if (totalSeconds <= 0) return "done";
  if (daysLeft <= 1) return "finale";
  if (daysLeft <= 3) return "wild";
  if (daysLeft <= 7) return "spicy";
  return "calm";
};

const getHypeMessage = (phase) => {
  switch (phase) {
    case "finale":
      return "Siste døgnet: full festivalmodus. Hold fast.";
    case "wild":
      return "Under tre dagar igjen: dette går frå kos til kaos.";
    case "spicy":
      return "Siste veka: no begynne trykket å bygga seg opp.";
    case "done":
      return "Tid ute. Gardina ned. Fyr laus confettien.";
    default:
      return "Rolig no... men ikkje lenge.";
  }
};

const random = (min, max) => Math.random() * (max - min) + min;

const createBits = (count) =>
  Array.from({ length: count }, (_, index) => ({
    id: `bit-${index}`,
    left: `${random(1, 99).toFixed(1)}%`,
    delay: `${random(0, 2.5).toFixed(2)}s`,
    duration: `${random(2.8, 5.2).toFixed(2)}s`,
    drift: `${random(-30, 30).toFixed(1)}px`,
    rotate: `${random(-240, 240).toFixed(0)}deg`,
    hue: `${random(0, 360).toFixed(0)}deg`,
    size: `${random(0.4, 1).toFixed(2)}rem`,
  }));

export default function Countdown({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(() => createCountdown(targetDate));
  const [confettiBits] = useState(() => createBits(70));

  const phase = useMemo(
    () => getHypePhase(timeLeft.totalSeconds),
    [timeLeft.totalSeconds],
  );

  const units = [
    { label: "Dagar", value: timeLeft.days },
    { label: "Timar", value: timeLeft.hours },
    { label: "Minutt", value: timeLeft.minutes },
    { label: "Sekund", value: timeLeft.seconds },
  ];

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
      { y: 0, opacity: 1, duration: 0.5, ease: "power3.out", stagger: 0.08 },
    );
  }, []);

  useEffect(() => {
    document.body.dataset.hypePhase = phase;
  }, [phase]);

  return (
    <>
      <div
        className={`hype-meter hype-meter--${phase}`}
        style={{ marginBottom: "1.25rem" }}
      >
        <p className="hype-meter-label">Stemning akkurat no</p>
        <p className="hype-meter-value">{getHypeMessage(phase)}</p>
      </div>

      <div className="countdown">
        {units.map((unit) => (
          <article className="countdown-card" key={unit.label}>
            <p className="countdown-value">{pad(unit.value)}</p>
            <p className="countdown-label">{unit.label}</p>
          </article>
        ))}

        {timeLeft.totalSeconds === 0 && (
          <div className="countdown-complete">
            <h3>Nå e det gjort.</h3>
            <p>Sender siste farvel-emojien, så kan dokke kosa dokke.</p>
          </div>
        )}

        {phase === "finale" && (
          <div className="confetti-rain" aria-hidden="true">
            {confettiBits.map((bit) => (
              <span
                className="confetti-bit"
                key={bit.id}
                style={{
                  left: bit.left,
                  animationDelay: bit.delay,
                  animationDuration: bit.duration,
                  "--drift": bit.drift,
                  "--rotate": bit.rotate,
                  "--hue": bit.hue,
                  "--size": bit.size,
                }}
              />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
