package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.co.prescient.model.Hotel;
import za.co.prescient.repository.local.HotelRepository;

import java.util.List;

@RestController
@Slf4j
public class HotelService {

    @Autowired
    HotelRepository hotelRepository;

    @RequestMapping(value = "api/hotels")
    public List<Hotel> getHotels() {
        log.info("Get All Hotel List service");
        List<Hotel> hotels = hotelRepository.findAll();
        return hotels;
    }

    @RequestMapping(value = "api/hotels/{hotelId}")
    public Hotel getHotel(@PathVariable("hotelId") Long hotelId) {
        log.info("Get A Hotel Detail by HotelId service");
        return hotelRepository.findOne(hotelId);
    }

}
