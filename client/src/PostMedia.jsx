/* eslint-disable react/prop-types */
import { useState } from "react";
import './css files/Home.css';

function PostMedia({ post }) {
    const [slideIndex, setSlideIndex] = useState(0);

    function plusSlides(n) {
        const newIndex = slideIndex + n;
        if (newIndex < 0) {
            setSlideIndex(post.pics.length - 1);
        } else if (newIndex >= post.pics.length) {
            setSlideIndex(0);
        } else {
            setSlideIndex(newIndex);
        }
    }

    function currentSlide(index) {
        setSlideIndex(index);
    }

    return (
        <>
            {post.pics && post.pics.length > 0 && (
                <div className="slideshow-container">
                    {post.pics.map((pic, index) => (
                        <div className="mySlides fade" key={index} style={{ display: index === slideIndex ? 'block' : 'none' }}>
                            <img src={`/api${pic.media}`} alt={`Slide ${index + 1}`} style={{ width: '100%' }} />
                        </div>
                    ))}
                    {post.pics.length > 1 && (
                        <div className="arrows">
                            <a className="prev" onClick={() => plusSlides(-1)}>&#10094;</a>
                            <a className="next" onClick={() => plusSlides(1)}>&#10095;</a>
                        </div>
                    )}
                    {post.pics.length > 1 && (<div className="dots">
                        {post.pics.map((_, index) => (
                            <span key={index} className={`dot ${index === slideIndex ? 'active' : ''}`} onClick={() => currentSlide(index)}></span>
                        ))}
                    </div>)}
                </div>
            )}
        </>
    );
}

export default PostMedia;