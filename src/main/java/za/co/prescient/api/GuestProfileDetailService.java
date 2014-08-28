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
    //list parameter is changed to Guest.earlier it was GuestCard.26-8-2014
    public List<Guest> findCurrentlyPresentGuestCardsInTouchPoint(@PathVariable("touchpointId") String touchPointId) {
        String responseStr="";
        //List<String> cardIdListInteger = null;
        List<String> cardIdListLong = null;
        try{
        URL url = new URL("http://localhost:9090/touchpoints/"+touchPointId+"/tags");
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
            conn.setRequestMethod("GET");
            conn.setRequestProperty("Accept", "application/json");

            BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));

            System.out.println("Output from Server .... \n");
            log.info("Output from Server  logger.... \n");
            String res;
            while ((res = br.readLine()) != null) {
                System.out.println("res::"+res);
                responseStr = responseStr + res;
            }
            log.info("O/P : "+responseStr);
            log.info("len : " + responseStr.length());
            String trimmedStr = responseStr.substring(1, responseStr.length()-1);
            log.info("trimmed str::"+trimmedStr);
            log.info("trimmed str length::"+trimmedStr.length());

            //if trimmedStr length is zero then we need not split it by comma.
            //added if block 27-8-2014
            String[] strArray=trimmedStr.split(",");

            log.info("array element[0]::"+strArray[0]);
            log.info("array element[0] length::"+strArray[0].length());
            log.info("array len:: " + strArray.length);

            //log.info("array len after if block: " + strArray.length);


            cardIdListLong  = new ArrayList<String>();
            //Below loop variable changed the card.earlier it was cardIdInteger as local String variable.
            log.info("before each for loop.......");

            //below if block is added. 27-8-2014
            if(strArray[0].length()!=0)
            {
                for(String card : strArray){
                      log.info("cards::"+card+"\n");
                      cardIdListLong.add(card.substring(1, card.length() - 1));
                   }
            }
            log.info("cardIdListLong length after all::"+cardIdListLong.size());
            log.info("end of try block");

        }catch (Exception e){
            log.info("exception in display guest list");
        }
        //list paremeter is changed to Guest earlier it was GuestCard.26-8-2014
        //below variable changed to huestList.earlier it was guestCardList.26-8-2014
        List<Guest> guestList=new ArrayList<Guest>();
        if(cardIdListLong.size()!=0)
        {
            guestList = guestCardRepository.findByCardIdListWithStatusActive(cardIdListLong);
            log.info("guest card list return size::"+guestList.size());
            log.info("guest card list return toString::"+guestList.toString());
        }

        return guestList;
    }

    @RequestMapping(value="api/guests")
    public List<Guest> findGuests()
    {
        return guestRepository.findAll();
    }


}
