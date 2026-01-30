import { useEffect, useMemo, useState } from "react";
import { gsap } from "gsap";

const QuoteTicker = ({ notes }) => {
  const [index, setIndex] = useState(0);
  const safeNotes = useMemo(() => notes ?? [], [notes]);

  useEffect(() => {
    if (safeNotes.length === 0) {
      return undefined;
    }

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % safeNotes.length);
    }, 3500);

    return () => clearInterval(interval);
  }, [safeNotes.length]);

  useEffect(() => {
    gsap.fromTo(
      ".ticker-card",
      { y: 10, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
    );
  }, [index]);

  if (!safeNotes.length) {
    return <p className="ticker-card">Ingen spydige påminningar i dag, overraskande nok.</p>;
  }

  return (
    <div className="ticker">
      <div className="ticker-card">{safeNotes[index]}</div>
      <p className="ticker-sub">Runde: {index + 1}</p>
    </div>
  );
};

export default QuoteTicker;
