import { Carousel } from 'react-bootstrap';
import style from '../styles/CryptoSkyscraper.module.css'

const ImageCarousel2 = () => {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className={`d-block ${style.carouselImage}`}
          src="/images/pol1.jpg"
          alt="Banheiro luxuoso"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block ${style.carouselImage}`}
          src="/images/salaa1.jpg"
          alt="Banheiro moderno"
        />
      </Carousel.Item>
      <Carousel.Item>
        <img
          className={`d-block ${style.carouselImage}`}
          src="/images/quar1.jpg"
          alt="Quarto confortável"
        />
      </Carousel.Item>
    </Carousel>
  );
};



export default ImageCarousel2;
