package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.Card;
import za.co.prescient.repository.local.CardRepository;

import java.util.LinkedHashMap;
import java.util.List;

@RestController
@Slf4j
public class GuestCardService {

    @Autowired
    CardRepository cardRepository;

    @RequestMapping(value = "api/guestcards/{msn}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable("msn") String msn, @RequestBody Card guestCard)throws Exception {

        Card gCard = cardRepository.findByMagStripeNo(msn);
        log.info("guestcard1 : " + gCard);
        if(gCard != null)
        {
           Card card=cardRepository.findByRFIDTagNo(guestCard.getRfidTagNo());
            if(card == null)
            {
                gCard.setRfidTagNo(guestCard.getRfidTagNo());
                cardRepository.save(gCard);
            }
            else
            {
                // new Exception("RFIDTag is in use");

                if(card.getMagStripeNo().equals(msn.trim()))
                {
                    gCard.setRfidTagNo(guestCard.getRfidTagNo());
                    cardRepository.save(gCard);
                }
                else throw new Exception("No card found with this MagStripeNo");

             }
        }
        else throw new Exception("No card found with this MagStripeNo");
    }

    @RequestMapping(value = "api/guestcards/{msn}/detail")
    public Card get(@PathVariable("msn") String msn) {
        return cardRepository.findByMagStripeNo(msn);
    }

    @RequestMapping(value = "api/guestcards", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void importCards(@RequestBody LinkedHashMap linkedHashMap) {
        log.info("file data::" + linkedHashMap.get("fileData"));
        String str = linkedHashMap.get("fileData").toString();
        log.info("str::" + str);
        String resultStr[] = str.split(",");
        log.info("No of cards::" + resultStr.length);
        Card guestCard;
        for(String obj:resultStr)
        {
            guestCard= cardRepository.findByMagStripeNo(obj.trim());
            if(guestCard==null){
                guestCard=new Card();
                guestCard.setMagStripeNo(obj.trim());
                cardRepository.save(guestCard);
            }
        }
    }

    @RequestMapping(value = "api/guestcards/all")
    public List<Card> getall() {
        return cardRepository.findAll();
    }

    @RequestMapping(value = "api/guestcards/withRFID")
    public List<Card> getAllCardsWithRFIDTagNO() {

        List<Card> cards=cardRepository.findWithRFIDTagNo();
        return cards;
    }

    @RequestMapping(value = "api/guestcards/withoutRFID")
    public List<Card> getAllCardsWithoutRFIDTagNO() {
        List<Card> cards=cardRepository.findWithoutRFIDTagNo();
        return cards;
    }



}
