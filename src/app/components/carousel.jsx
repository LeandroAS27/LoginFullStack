import {Swiper, SwiperSlide} from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Navigation, Pagination} from "swiper/modules";
import Image from "next/image";
import Image1 from '../../../public/Image1.jpg';
import Image2 from '../../../public/Image2.jpg';
import Image3 from '../../../public/Image3.jpg';

const Carousel = () => {    
    return(
            <Swiper
                navigation
                pagination={{clickable: true}}
                modules={[Navigation, Pagination]}
                className="w-full h-full rounded-md"
            >
                <style>
                    {`
                        .swiper-button-prev, .swiper-button-next{
                            color: white !important
                        }
                        .swiper-pagination-bullet{
                            background-color: white !important
                        }
                        .swiper-pagination-bullet-active{
                            background-color: white !important
                        }
                    `}
                </style>
                <SwiperSlide>
                    <Image
                        src={Image1}
                        alt="Imagem da natureza 1"
                        className="w-full h-full object-cover rounded-md"
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <Image
                        src={Image2}
                        alt="Imagem da natureza 2"
                        className="w-full h-full object-cover rounded-md"
                    />
                </SwiperSlide>

                <SwiperSlide>
                    <Image
                        src={Image3}
                        alt="Imagem da natureza 3"
                        className="w-full h-full object-cover rounded-md"
                    />
                </SwiperSlide>
            </Swiper>
    )
}

export default Carousel;