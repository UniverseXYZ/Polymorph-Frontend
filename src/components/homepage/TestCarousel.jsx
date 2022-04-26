


const TestCarousel = () => {
    return (
        <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel" data-bs-pause="true">
            <div className="carousel-indicators">
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1">
                <span></span>
                </button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="1" aria-label="Slide 2">
                <span></span>
                </button>
                <button type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide-to="2" aria-label="Slide 3">
                <span></span>
                </button>
            </div>
            <div className="carousel-inner">
                <div className="carousel-item active">
                <img src="https://assets.codepen.io/162656/bs-carousel1.jpg" className="d-block w-100" alt="..."/>
                </div>
                <div className="carousel-item">
                <img src="https://assets.codepen.io/162656/bs-carousel2.jpg" className="d-block w-100" alt="..."/>
                </div>
                <div className="carousel-item">
                <img src="https://assets.codepen.io/162656/bs-carousel3.jpg" className="d-block w-100" alt="..."/>
                </div>
            </div>
            <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Previous</span>
            </button>
            <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                <span className="visually-hidden">Next</span>
            </button>
        </div>
    )
}

export default TestCarousel;