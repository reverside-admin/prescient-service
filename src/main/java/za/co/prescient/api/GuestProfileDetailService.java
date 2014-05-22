package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.co.prescient.model.Guest;
import za.co.prescient.model.GuestCard;
import za.co.prescient.repository.local.GuestCardRepository;
import za.co.prescient.repository.local.GuestRepository;
import za.co.prescient.repository.local.UserRepository;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
public class GuestProfileDetailService {

    @Autowired
    UserRepository userRepository;

    @Autowired
    GuestRepository guestRepository;


    @Autowired
    GuestCardRepository guestCardRepository;

    @RequestMapping(value = "api/users/{userId}/guestList")
    public List<Guest> getAllGuest(@PathVariable("userId") Long userId) {

        log.info("Allotted Departments : " + userRepository.findOne(userId).getTouchPoints());
        userRepository.findOne(userId).getHotel().getId();
        guestRepository.findByHotelId(userRepository.findOne(userId).getHotel().getId());

        log.info("GUEST LIST" + guestRepository.findByHotelId(userRepository.findOne(userId).getHotel().getId()));
        return guestRepository.findByHotelId(userRepository.findOne(userId).getHotel().getId());
    }

    @RequestMapping(value = "api/touchpoints/{touchpointId}/guestCards")
    public List<GuestCard> findCurrentlyPresentGuestCardsInTouchPoint(@PathVariable("touchpointId") String touchPointId) {
        String responseStr="";
        List<String> cardIdListInteger = null;
        List<String> cardIdListLong = null;
        try{
        URL url = new URL("http://localhost:9090/touchpoints/"+touchPointId+"/tags");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));

            System.out.println("Output from Server .... \n");
            String res;
            while ((res = br.readLine()) != null) {
                System.out.println(res);
                responseStr = responseStr + res;
            }
            log.info("O/P : "+responseStr);
            log.info("len : " + responseStr.length());
            String trimmedStr = responseStr.substring(1, responseStr.length()-1);
            String[] strArray = trimmedStr.split(",");

            log.info("array len: " + strArray.length);

            cardIdListLong  = new ArrayList<String>();
            for(String cardIdInteger : strArray){
                cardIdListLong.add(cardIdInteger.substring(1, cardIdInteger.length()-1 ));
            }

        }catch (Exception e){}
        List<GuestCard> guestCardList = guestCardRepository.findByCardIdListWithStatusActive(cardIdListLong);
        return guestCardList;
    }

    @RequestMapping(value="api/guests")
    public List<Guest> findGuests()
    {
        return guestRepository.findAll();
    }


}
