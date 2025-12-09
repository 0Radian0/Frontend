//LoginSlider
import { useState, useEffect, useRef } from "react";
import slide1 from "../../assets/images/b_1.jpg";
import slide2 from "../../assets/images/hema.jpg";
import slide3 from "../../assets/images/pht1.webp";
import slide4 from "../../assets/images/gear.jpg";


import './login-slider.css'


const slides = [slide1, slide2, slide3, slide4];


export default function LoginSlider() {
const [index, setIndex] = useState(0);
const [isPlaying, setIsPlaying] = useState(true);
const [direction, setDirection] = useState("next");
const intervalRef = useRef(null);


const prev = () => {
setDirection("prev");
setIndex((prev) => (prev - 1 + slides.length) % slides.length);
};


const next = () => {
setDirection("next");
setIndex((prev) => (prev + 1) % slides.length);
};


useEffect(() => {
if (isPlaying) {
intervalRef.current = setInterval(() => {
setDirection("next");
setIndex((prev) => (prev + 1) % slides.length);
}, 5000);
}
return () => clearInterval(intervalRef.current);
}, [isPlaying]);


return (
<div className="login-slider">
<img
key={index}
src={slides[index]}
alt="slide"
className={`login-slide-img slide-${direction}`}
/>


<div className="login-slider-controls">
<button onClick={prev}>{"<"}</button>
<button onClick={next}>{">"}</button>
<button onClick={() => setIsPlaying(!isPlaying)}>
{isPlaying ? "⏸️" : "▶️"}
</button>
</div>
</div>
);
}