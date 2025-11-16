import React, { useState } from "react";

export const Carousel = ({ children: images }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    if (!images || images.length === 0) {
        return <div>No images</div>;
    }

    const nextSlide = () => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
    };

    const prevSlide = () => {
        setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
    };

    return (
        <div
            style={{
                position: "relative",
                width: "100%",
                height: "auto",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                overflow: "hidden",
            }}
        >
            <div
                style={{
                    display: "flex",
                    transition: "transform 0.5s ease-in-out",
                    transform: `translateX(-${currentIndex * 100}%)`,
                }}
            >
                {React.Children.map(images, (child, i) => (
                    <div
                        style={{
                            flex: "0 0 100%",
                            display: "flex",
                            padding: "10px",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        {child}
                    </div>
                ))}
            </div>

            {/* Navigation buttons */}
            {images.length > 1 && (
                <>
                    <button
                        onClick={prevSlide}
                        style={{
                            position: "absolute",
                            left: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.5)",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "50%",
                            cursor: "pointer",
                        }}
                    >
                        ❮
                    </button>

                    <button
                        onClick={nextSlide}
                        style={{
                            position: "absolute",
                            right: "10px",
                            top: "50%",
                            transform: "translateY(-50%)",
                            background: "rgba(0,0,0,0.5)",
                            color: "white",
                            border: "none",
                            padding: "8px 12px",
                            borderRadius: "50%",
                            cursor: "pointer",
                        }}
                    >
                        ❯
                    </button>
                </>
            )}

            {/* Dot indicators */}
            <div
                style={{
                    position: "absolute",
                    bottom: "10px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    display: "flex",
                    gap: "8px",
                }}
            >
                {images.map((_, i) => (
                    <div
                        key={i}
                        onClick={() => setCurrentIndex(i)}
                        style={{
                            width: "10px",
                            height: "10px",
                            borderRadius: "50%",
                            background:
                                i === currentIndex ? "white" : "rgba(255,255,255,0.5)",
                            cursor: "pointer",
                        }}
                    ></div>
                ))}
            </div>
        </div>
    );
};
