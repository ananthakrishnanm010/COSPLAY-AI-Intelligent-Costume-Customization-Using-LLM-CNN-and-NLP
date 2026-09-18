import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';

const slides = [
    {
        image: '/images/hero/hero_banner_01.png',
        eyebrow: "Autumn'26",
        heading: 'Express your individuality with effortless style.',
        ctaText: 'Shop The Collection',
        ctaLink: '/products',
    },
    {
        image: '/images/hero/hero_banner_02.png',
        eyebrow: 'Cosplay AI',
        heading: 'Design your own fit, down to the last measurement.',
        ctaText: 'Try the AI Design Studio',
        ctaLink: '/ai-design',
    },
    {
        image: '/images/hero/hero_banner_03.png',
        eyebrow: 'New Season',
        heading: 'Cut from 14oz Japanese selvedge denim.',
        ctaText: 'Read Our Story',
        ctaLink: '/products',
    },
];

const AUTOPLAY_INTERVAL = 5000;

function HeroCarousel() {
    const [current, setCurrent] = useState(0);

    const goTo = useCallback((index) => {
        setCurrent((index + slides.length) % slides.length);
    }, []);

    const next = useCallback(() => goTo(current + 1), [current, goTo]);
    const prev = useCallback(() => goTo(current - 1), [current, goTo]);

    useEffect(() => {
        const timer = setInterval(next, AUTOPLAY_INTERVAL);
        return () => clearInterval(timer);
    }, [next]);

    return (
        <section className="hero-carousel">
            <div className="hero-carousel-track">
                {slides.map((slide, index) => (
                    <div
                        key={index}
                        className={`hero-carousel-slide ${index === current ? 'active' : ''}`}
                    >
                        <img src={slide.image} alt={slide.heading} />
                        <div className="hero-caption">
                            <div className="hero-eyebrow">{slide.eyebrow}</div>
                            <h1>{slide.heading}</h1>
                            <Link to={slide.ctaLink} className="hero-btn">
                                {slide.ctaText}
                            </Link>
                        </div>
                    </div>
                ))}
            </div>

            <button className="hero-carousel-arrow prev" onClick={prev} aria-label="Previous slide">
                ‹
            </button>
            <button className="hero-carousel-arrow next" onClick={next} aria-label="Next slide">
                ›
            </button>

            <div className="hero-carousel-dots">
                {slides.map((_, index) => (
                    <button
                        key={index}
                        className={`hero-carousel-dot ${index === current ? 'active' : ''}`}
                        onClick={() => goTo(index)}
                        aria-label={`Go to slide ${index + 1}`}
                    />
                ))}
            </div>
        </section>
    );
}

export default HeroCarousel;