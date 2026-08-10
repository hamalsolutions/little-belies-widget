import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

// Retargeting 15% discount countdown. `exp` is a Unix epoch (seconds) carried in
// the resume link, so the countdown is authoritative from the SMS send time (it
// can't be reset by reopening the link). Renders nothing once expired — the
// booking still proceeds, just without the discount.
function DiscountBanner({ exp, percent, lang }) {
  const [remaining, setRemaining] = useState(() => exp * 1000 - Date.now());

  useEffect(() => {
    const id = setInterval(() => setRemaining(exp * 1000 - Date.now()), 1000);
    return () => clearInterval(id);
  }, [exp]);

  if (!exp || remaining <= 0) return null;

  const totalSec = Math.floor(remaining / 1000);
  const hh = String(Math.floor(totalSec / 3600)).padStart(2, "0");
  const mm = String(Math.floor((totalSec % 3600) / 60)).padStart(2, "0");
  const ss = String(totalSec % 60).padStart(2, "0");

  const es = lang === "Spanish" || lang === "es";
  const title = es
    ? `¡Tienes un ${percent}% de descuento!`
    : `You've unlocked ${percent}% off!`;
  const sub = es
    ? "Agenda antes de que termine el tiempo para conservarlo:"
    : "Book before the timer runs out to keep it:";

  return (
    <div
      className="text-center mt-3 mb-2 py-2 px-3 rounded mx-auto"
      style={{
        maxWidth: "28rem",
        background: "#fce8f1",
        border: "1px solid #e6a3c4",
        color: "#8a2b5f",
      }}
      data-cy="discount-banner"
    >
      <div style={{ fontWeight: 700 }}>{title}</div>
      <div style={{ fontSize: ".85rem" }}>{sub}</div>
      <div
        style={{
          fontSize: "1.5rem",
          fontWeight: 700,
          fontVariantNumeric: "tabular-nums",
          letterSpacing: ".05em",
        }}
      >
        {hh}:{mm}:{ss}
      </div>
    </div>
  );
}

DiscountBanner.propTypes = {
  exp: PropTypes.number.isRequired,
  percent: PropTypes.number,
  lang: PropTypes.string,
};

DiscountBanner.defaultProps = {
  percent: 15,
};

export default DiscountBanner;
