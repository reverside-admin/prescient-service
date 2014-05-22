package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.Department;
import za.co.prescient.model.GuestCard;
import za.co.prescient.model.GuestStayHistory;
import za.co.prescient.model.User;
import za.co.prescient.model.itcs.ItcsTagRead;
import za.co.prescient.model.itcs.ItcsTagReadHistory;
import za.co.prescient.repository.local.*;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.*;

@RestController
@Slf4j
@RequestMapping(value = "api")
public class Services {
    private static final Logger LOGGER = Logger.getLogger(Services.class);

    @Autowired
    HotelRepository hotelRepository;

    @Autowired
    DepartmentRepository departmentRepository;

    @Autowired
    TouchPointRepository touchPointRepository;

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserStatusRepository userStatusRepository;

    @Autowired
    UserTypeRepository userTypeRepository;

    @Autowired
    GuestRepository guestRepository;

//    @Autowired
//    ItcsTagReadRepository itcsTagReadRepository;

    @Autowired
    GuestCardRepository guestCardRepository;

    @Autowired
    GuestStayHistoryRepository guestStayHistoryRepository;

    @Autowired
    SetupRepository setupRepository;

    @Autowired
    CardRepository cardRepository;

//    @Autowired
//    ItcsTagReadHistoryRepository itcsTagReadHistoryRepository;

    @RequestMapping(value = "users/assignDept/{Userid}", method = RequestMethod.PUT, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void assignDept(@PathVariable Long id, @RequestBody List<Department> departments) {
        User user = userRepository.findOne(id);
        user.setDepartments(departments);
        userRepository.save(user);
    }

//    Test
    /*@RequestMapping(value = "touchpoints/guestCardIds/all")
    public List<ItcsTagRead> getGuestIds() {
        return itcsTagReadRepository.findAll();
    }*/

    @RequestMapping(value = "guest/{guestId}")
    public GuestStayHistory getGuestDetailByGuestId(@PathVariable("guestId") Long guestId) {
        log.info("guest detail service is invoked");
        return guestStayHistoryRepository.findByGuest(guestId);
    }


    @RequestMapping(value = "hotels/{hotelId}/guests/checkedIn")
    public List<GuestStayHistory> getAllCheckedInGuests(@PathVariable("hotelId") Long hotelId) {

        log.info("find checked in guest list service is invoked");
        return guestStayHistoryRepository.findCheckedInByHotelId(hotelId);
    }

    ItcsTagRead itcsTagRead;
    @RequestMapping(value = "guests/{guestId}/locations")
    public ItcsTagRead getGuestCardHistory(@PathVariable("guestId") Long guestId) {
        log.info("guestcard by guest id service is called");
         GuestCard guestCardAllocation = guestCardRepository.findGuestCardByGuestId(guestId);
        log.info("guest card---------------"+guestCardAllocation);
//        ItcsTagRead itc=itcsTagReadRepository.findGuestCardHistory(guestCardAllocation.getCard().getId().intValue());

        String guestCardRFIDTagNo = guestCardAllocation.getCard().getRfidTagNo();

        String responseStr="";
        try{
            URL url = new URL("http://localhost:9090/tags/"+guestCardRFIDTagNo+"/now");
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

            JSONObject obj = new JSONObject(responseStr);
            System.out.println(obj.getDouble("xcoordRead"));

            itcsTagRead = new ItcsTagRead();
            itcsTagRead.setId(obj.getLong("id"));
            itcsTagRead.setGuestCard(obj.getString("guestCard"));
            itcsTagRead.setZoneId(obj.getString("zoneId"));
            itcsTagRead.setXCoordRead(obj.getDouble("xcoordRead"));
            itcsTagRead.setYCoordRead(obj.getDouble("ycoordRead"));
            itcsTagRead.setTagReadDatetime(new Date(obj.getLong("tagReadDatetime")));

        }catch (Exception e){
            itcsTagRead = null;
            e.getMessage();
        }
        return itcsTagRead;
    }


    ItcsTagReadHistory itcsTagReadHistory;
    List<ItcsTagReadHistory> itc ;

    @RequestMapping(value = "guests/{guestId}/location/history")
    public List<ItcsTagReadHistory> getGuestHistory(@PathVariable("guestId") Long guestId) {
        log.info("guestcard history service is called");
        GuestCard guestCardAllocation = guestCardRepository.findGuestCardByGuestId(guestId);

//        List<ItcsTagReadHistory> itc= itcsTagReadHistoryRepository.findGuestHistory(guestCardAllocation.getCard().getId().intValue());

        String guestCardId = guestCardAllocation.getCard().getRfidTagNo();
        System.out.println("guestCardId >>>"+guestCardId);
        String responseStr="";
//        List<ItcsTagReadHistory> itc = new ArrayList<ItcsTagReadHistory>();
        itc = new ArrayList<ItcsTagReadHistory>();
        try{
            URL url = new URL("http://localhost:9090/tags/"+guestCardId+"/history");
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
            JSONArray obj = new JSONArray(responseStr);
            System.out.println("obj length "+obj.length());


            for(int i=0; i<obj.length(); i++){
                JSONObject jObj = (JSONObject)obj.get(i);
                System.out.println(jObj.get("zoneId").getClass().getName());
                if(!(jObj.isNull("zoneId"))){
                    itcsTagReadHistory = new ItcsTagReadHistory();
                    itcsTagReadHistory.setId(jObj.getLong("id"));
                    System.out.println("i : "+i);
                    itcsTagReadHistory.setGuestCard(jObj.getString("guestCard"));
                    itcsTagReadHistory.setZoneId(jObj.getString("zoneId"));
                    itcsTagReadHistory.setXCoordRead(jObj.getDouble("xcoordRead"));
                    itcsTagReadHistory.setYCoordRead(jObj.getDouble("ycoordRead"));
                    itcsTagReadHistory.setTagReadDatetime(new Date(jObj.getLong("tagReadDatetime")));
                    itc.add(itcsTagReadHistory);
                }

            }
        }catch (Exception e){
            log.info(e.getMessage());
        }

        log.info("return list size::"+itc.size());
        return itc;
    }


    List<ItcsTagRead> itr;
    @RequestMapping(value = "touchpoints/{touchpointId}/guestCards/latest/{maxX}/{maxY}")
    public Collection<ItcsTagRead> findLocationOfCurrentlyPresentGuestCardsInTouchPoint(@PathVariable("touchpointId") String touchPointId,
                                                                                        @PathVariable("maxX") int maxX,
                                                                                        @PathVariable("maxY") int maxY) {
        String responseStr="";
        itr = new ArrayList<ItcsTagRead>();
        try{
            URL url = new URL("http://localhost:9090/touchpoints/"+touchPointId+"/tags/now/"+maxX+"/"+maxY);
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
            JSONArray obj = new JSONArray(responseStr);
            System.out.println("obj length "+obj.length());

            for(int i=0; i<obj.length(); i++){
                JSONObject jObj = obj.getJSONObject(i);
                itcsTagRead = new ItcsTagRead();
                itcsTagRead.setId(jObj.getLong("id"));
                System.out.println("i : "+i);
                itcsTagRead.setGuestCard(jObj.getString("guestCard"));
                itcsTagRead.setZoneId(jObj.getString("zoneId"));
                itcsTagRead.setXCoordRead(jObj.getDouble("xcoordRead"));
                itcsTagRead.setYCoordRead(jObj.getDouble("ycoordRead"));
//            itcsTagReadHistory.setTagReadDatetime(obj.getDouble());

                itr.add(itcsTagRead);
            }
        }catch (Exception e){}


        return itr;
    }

    @RequestMapping(value = "tags/{tagId}/guest")
    public GuestStayHistory getGuestDetailByTagId(@PathVariable("tagId") String tagId) {
        return guestStayHistoryRepository.findGuestByTagId(tagId.toUpperCase());
    }


}
