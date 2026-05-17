import { useState, useEffect, useCallback } from "react";
import { config } from "../config";
import "./styles/AchievementCarousel.css";

const AchievementCarousel = () => {
  const { achievements, achievementCarousel } = config;
  const count = achievements.length;
  const [current, setCurrent] = useState(0);
  const [animating, setAnimating] = useState(false);

  const navigate = useCallback((dir: "left" | "right") => {
    if (animating) return;
    setAnimating(true);
    setTimeout(() => {
      setCurrent((prev) =>
        dir === "right" ? (prev + 1) % count : (prev - 1 + count) % count
      );
      setAnimating(false);
    }, 420);
  }, [animating, count]);

  // Auto-advance — interval driven by config
  useEffect(() => {
    const id = setInterval(() => navigate("right"), achievementCarousel.autoIntervalMs);
    return () => clearInterval(id);
  }, [navigate, achievementCarousel.autoIntervalMs]);

  const getOffset = (index: number) => {
    let offset = index - current;
    if (offset > count / 2) offset -= count;
    if (offset < -count / 2) offset += count;
    return offset;
  };

  return (
    <section className="achievement-carousel-section" id="achievements" aria-label="Achievements">
      <div className="achievement-carousel-container section-container">

        {/* Section heading — driven by config */}
        <h2 className="title">
          {achievementCarousel.sectionTitle.split(" ").map((word, i, arr) =>
            i === arr.length - 1
              ? <span key={i}>{word}</span>
              : <>{word} </>
          )}
        </h2>
        <p className="achievement-carousel-subtitle">
          {achievementCarousel.sectionSubtitle}
        </p>

        <div className="ac-stage">
          <div className="ac-track">
            {achievements.map((item, index) => {
              const offset = getOffset(index);
              if (Math.abs(offset) > 2) return null;
              return (
                <div
                  key={index}
                  className="ac-card-item"
                  data-offset={offset}
                  onClick={() => offset !== 0 && navigate(offset > 0 ? "right" : "left")}
                >
                  <div className="ac-image-wrap">
                    <img src={item.image.startsWith('http') ? item.image : `${import.meta.env.BASE_URL}${item.image}`} alt={item.title} loading="lazy" draggable={false} />
                    <div className="ac-image-overlay" />
                  </div>
                  {offset === 0 && <p className="ac-title">{item.title}</p>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default AchievementCarousel;
