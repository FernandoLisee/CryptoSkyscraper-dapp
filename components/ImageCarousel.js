import { Carousel } from 'react-bootstrap';
import style from '../styles/CryptoSkyscraper.module.css'

const ImageCarousel = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className={`d-block ${style.carouselImage}`}
          src="/images/pol2.jpg"
          alt="Banheiro luxuoso"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
         className={`d-block ${style.carouselImage}`}
          src="/images/salaa2.jpg"
          alt="Banheiro moderno"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block ${style.carouselImage}`}
          src="/images/quar2.jpg"
          alt="Quarto confortável"
        />
      </Carousel.Item>
    </Carousel>
  );
};



export default ImageCarousel;
