package za.co.prescient.api;


import com.sun.org.apache.xerces.internal.impl.dv.util.Base64;
import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.*;
import za.co.prescient.model.itcs.ItcsTagRead;
import za.co.prescient.model.itcs.ItcsTagReadHistory;
import za.co.prescient.repository.local.*;

import java.io.*;
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


    @Autowired
    GuestPreferenceRepository guestPreferenceRepository;

    @Autowired
    GuestPreferenceTypeRepository guestPreferenceTypeRepository;

    @Autowired
    RoomRepository roomRepository;


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
        log.info("guestcard by guest id service is called" + guestId);

        GuestCard guestCardAllocation;
        guestCardAllocation = guestCardRepository.findGuestCardByGuestId(guestId);


        log.info("guest card---------------" + guestCardAllocation);
//        ItcsTagRead itc=itcsTagReadRepository.findGuestCardHistory(guestCardAllocation.getCard().getId().intValue());

        String guestCardRFIDTagNo = guestCardAllocation.getCard().getRfidTagNo();
        log.info("String value of guestCardRFIDTagNo : " + guestCardRFIDTagNo);

        String responseStr = "";
        try {
            URL url = new URL("http://localhost:9090/tags/" + guestCardRFIDTagNo + "/now");
            log.info("guestCardRFIDTagNo : " + guestCardRFIDTagNo);
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

        } catch (Exception e) {
            itcsTagRead = new ItcsTagRead();
            log.info("guestCardRFIDTagNo Exp : " + guestCardRFIDTagNo);
            e.getMessage();
        }
        return itcsTagRead;
    }


    ItcsTagReadHistory itcsTagReadHistory;
    List<ItcsTagReadHistory> itc;

    @RequestMapping(value = "guests/{guestId}/location/history")
    public List<ItcsTagReadHistory> getGuestHistory(@PathVariable("guestId") Long guestId) {
        log.info("guestcard history service is called");
        GuestCard guestCardAllocation = guestCardRepository.findGuestCardByGuestId(guestId);

//        List<ItcsTagReadHistory> itc= itcsTagReadHistoryRepository.findGuestHistory(guestCardAllocation.getCard().getId().intValue());

        String guestCardId = guestCardAllocation.getCard().getRfidTagNo();
        System.out.println("guestCardId >>>" + guestCardId);
        String responseStr = "";
//        List<ItcsTagReadHistory> itc = new ArrayList<ItcsTagReadHistory>();
        itc = new ArrayList<ItcsTagReadHistory>();
        try {
            URL url = new URL("http://localhost:9090/tags/" + guestCardId + "/history");
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
            System.out.println("obj length " + obj.length());


            for (int i = 0; i < obj.length(); i++) {
                JSONObject jObj = (JSONObject) obj.get(i);
                System.out.println(jObj.get("zoneId").getClass().getName());
                if (!(jObj.isNull("zoneId"))) {
                    itcsTagReadHistory = new ItcsTagReadHistory();
                    itcsTagReadHistory.setId(jObj.getLong("id"));
                    System.out.println("i : " + i);
                    itcsTagReadHistory.setGuestCard(jObj.getString("guestCard"));
                    itcsTagReadHistory.setZoneId(jObj.getString("zoneId"));
                    itcsTagReadHistory.setXCoordRead(jObj.getDouble("xcoordRead"));
                    itcsTagReadHistory.setYCoordRead(jObj.getDouble("ycoordRead"));
                    itcsTagReadHistory.setTagReadDatetime(new Date(jObj.getLong("tagReadDatetime")));
                    itc.add(itcsTagReadHistory);
                }

            }
        } catch (Exception e) {
            log.info(e.getMessage());
        }

        log.info("return list size::" + itc.size());
        return itc;
    }


    List<ItcsTagRead> itr;

    @RequestMapping(value = "touchpoints/{touchpointId}/guestCards/latest/{maxX}/{maxY}")
    public Collection<ItcsTagRead> findLocationOfCurrentlyPresentGuestCardsInTouchPoint(@PathVariable("touchpointId") String touchPointId,
                                                                                        @PathVariable("maxX") int maxX,
                                                                                        @PathVariable("maxY") int maxY) {
        String responseStr = "";
        itr = new ArrayList<ItcsTagRead>();
        try {
            URL url = new URL("http://localhost:9090/touchpoints/" + touchPointId + "/tags/now/" + maxX + "/" + maxY);
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
            System.out.println("obj length " + obj.length());

            for (int i = 0; i < obj.length(); i++) {
                JSONObject jObj = obj.getJSONObject(i);
                itcsTagRead = new ItcsTagRead();
                itcsTagRead.setId(jObj.getLong("id"));
                System.out.println("i : " + i);
                itcsTagRead.setGuestCard(jObj.getString("guestCard"));
                itcsTagRead.setZoneId(jObj.getString("zoneId"));
                itcsTagRead.setXCoordRead(jObj.getDouble("xcoordRead"));
                itcsTagRead.setYCoordRead(jObj.getDouble("ycoordRead"));
//            itcsTagReadHistory.setTagReadDatetime(obj.getDouble());

                itr.add(itcsTagRead);
            }
        } catch (Exception e) {
        }


        return itr;
    }

    @RequestMapping(value = "tags/{tagId}/guest")
    public GuestStayHistory getGuestDetailByTagId(@PathVariable("tagId") String tagId) {
        return guestStayHistoryRepository.findGuestByTagId(tagId.toUpperCase());
    }


    @RequestMapping(value = "guest/photos")
    public String[] getGuestPhotographs() {

        /*FilenameFilter filenameFilter=new FilenameFilter() {
            private String ext=".jpg";

            @Override
            public boolean accept(File dir, String name) {
                return (name.endsWith(ext));
            }
        };*/

        //  ArrayList<String> imageList;
        File imageFileDir = new File("C:\\Prescient\\Images\\Guest Photographs\\");
        String listOfFiles[] = imageFileDir.list();
        for (int i = 0; i < listOfFiles.length; i++) {
            System.out.println(listOfFiles[i]);
        }
        //imageList = (ArrayList) Arrays.asList(listOfFiles);
        return listOfFiles;
    }

    //read the image from the image directory
    @RequestMapping(value = "guest/image/{imageName}/{imageExt}")
    public String getGuestImage(@PathVariable("imageName") String imageName,
                                @PathVariable("imageExt") String imageExt) {
        LOGGER.info("guest image service is invoked");
        LOGGER.info("Image name" + imageName);
        String targetDirectory = "C:\\Prescient\\Images\\Guest Photographs\\";
        String path = targetDirectory + imageName + "." + imageExt;
        LOGGER.info("URL path" + path);


        //read the file from the filepath
        FileInputStream fileInputStream = null;
        File file = new File(path);
        byte[] bFile = new byte[(int) file.length()];

        try {

            fileInputStream = new FileInputStream(file);
            fileInputStream.read(bFile);
            fileInputStream.close();

        } catch (Exception e) {
            e.getMessage();
            LOGGER.info("Error occurred during file read");
        }

        String imageData = Base64.encode(bFile);
        return imageData;
    }

    //associate an image to a guest
    @RequestMapping(value = "guest/{guestId}/image/{imageName}/{imageExt}/update")
    public void assignImageToGuest(@PathVariable("guestId") Long guestId,
                                   @PathVariable("imageName") String imageName,
                                   @PathVariable("imageExt") String imageExt) {
        String imagePath = imageName + "." + imageExt;

        GuestStayHistory guestStayHistory = guestStayHistoryRepository.findByGuest(guestId);
        guestStayHistory.getGuest().setGuestImagePath(imagePath);
        guestStayHistoryRepository.save(guestStayHistory);

    }


    //maintain guest starts here

    //view all guest list
    @RequestMapping(value = "guest/all", method = RequestMethod.GET, produces = "application/json")
    public List<Guest> get() {
        log.info("Get All UserDetails service");
        return guestRepository.findAll();
    }

    //view a guest  detail
    @RequestMapping(value = "guest/{guestId}/details", method = RequestMethod.GET, produces = "application/json")
    public Guest get(@PathVariable("guestId") Long guestId) {
        log.info("Get a single Guest Details service");
        Guest guest = guestRepository.findOne(guestId);
        log.info("Get guest birth day" + guest.getDob());

        return guest;
    }

    //create guest
    @RequestMapping(value = "guest/create", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@RequestBody Guest guest) {
        LOGGER.info("request received to create guest : " + guest);
        //GuestStayHistory guestStayHistory = new GuestStayHistory();
        //guestStayHistory.setGuest(guest);
        //guestStayHistory.setNoOfPreviousStays(0L);
        guestRepository.save(guest);
        //guestStayHistoryRepository.save(guestStayHistory);
    }

    //before creating a new guest,check the passport number of the guest.if it is already there then it
    // wonot create a guest otherwise it allow the user to create a guest with that passport number.

    @RequestMapping(value = "guest/passport/{passportNumber}/details", method = RequestMethod.GET, produces = "application/json")
    public Guest getGuestByPassportNo(@PathVariable("passportNumber") String passportNumber) {
        log.info("Get a single Guest Details by passport number service");
        Guest guest = guestRepository.getGuestByPassportNumber(passportNumber);
        log.info("guest with passport no::" + passportNumber + "  " + guest);

        return guest;
    }


    //before creating a guest ,check the guest unique id no,if it is already there then it wonot create a guest otherwise
    // it allow the user to create a guest with that user unique id no.

    @RequestMapping(value = "guest/uniqueid/{idNumber}/details", method = RequestMethod.GET, produces = "application/json")
    public Guest getGuestByIdNo(@PathVariable("idNumber") String idNumber) {
        log.info("Get a single Guest Details by passport number service");
        Guest guest = guestRepository.getGuestByIdNumber(idNumber);
        log.info("guest with passport no::" + idNumber + "  " + guest);

        return guest;
    }


    //update guest

    @RequestMapping(value = "guest/{guestId}/update", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void updateGuestDetails(@RequestBody Guest guest, @PathVariable("guestId") Long guestId) {
        log.info("update guest  service1");


        Guest currentGuest = guestRepository.findOne(guestId);

        currentGuest.setFirstName(guest.getFirstName());
        currentGuest.setGender(guest.getGender());
        currentGuest.setSurname(guest.getSurname());
        currentGuest.setPreferredName(guest.getPreferredName());
        currentGuest.setPassportNumber(guest.getPassportNumber());
        currentGuest.setTitle(guest.getTitle());
        currentGuest.setIdNumber(guest.getIdNumber());
        currentGuest.setDob(guest.getDob());
        currentGuest.setNationalityId(guest.getNationalityId());

        guestRepository.save(currentGuest);
    }

    //GUEST PREFERENCE SERVICE STARTS HERE
    //added to get the guest preference type data
    @RequestMapping(value = "guest/preference/types", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public List<GuestPreferenceType> getPreferences() {
        List<GuestPreferenceType> guestPreferenceTypes = guestPreferenceTypeRepository.findAll();
        return guestPreferenceTypes;

    }

    //store the guest preference and description against a guest
    @RequestMapping(value = "guest/{guestId}/preference/add", method = RequestMethod.POST, consumes = "application/json")
    public List<GuestPreference> addPreference(@RequestBody GuestPreference guestPreference, @PathVariable("guestId") Long guestId) {
        log.info("add guest preference service");
        Guest guest = guestRepository.findOne(guestId);
        guestPreference.setGuest(guest);
        guestPreference.setLastUpdateDate(new Date());
        guestPreferenceRepository.save(guestPreference);

        //this method return the preferences of the current guest of a particular  preference type.
        //get preference type id
        Long preferenceTypeId = guestPreference.getGuestPreferenceType().getId();
        //and we have the guest id passed from the client
        //get the preference of the guest with id(guestid) and preferenceTypeId.
        List<GuestPreference> guestPreferences = guestPreferenceRepository.findGuestPreference(guestId, preferenceTypeId);
        return guestPreferences;
    }

    //update guest preference
    @RequestMapping(value = "guest/preference/update", method = RequestMethod.POST, consumes = "application/json")
    public void updatePreference(@RequestBody GuestPreference guestPreference) {
        log.info("update guest preference service");
        GuestPreference guestPreference1 = guestPreferenceRepository.findOne(guestPreference.getId());
        guestPreference1.setDescription(guestPreference.getDescription());
        guestPreferenceRepository.save(guestPreference1);

    }

    //delete guest preference
    @RequestMapping(value = "guest/preference/delete", method = RequestMethod.POST)
    public List<GuestPreference> deletePreference(@RequestBody GuestPreference guestPreference) {
        log.info("delete preference service is called" + guestPreference.getId());

        //get guest id and preference type id then return all the rows having guestId=?1 and preferenceTypeId=?2;
        //delete the current record and return tje remaining records.


        GuestPreference guestPreference1 = guestPreferenceRepository.findOne(guestPreference.getId());
        Long guestId = guestPreference1.getGuest().getId();
        Long preferenceTypeId = guestPreference1.getGuestPreferenceType().getId();

        guestPreferenceRepository.delete(guestPreference.getId());
        log.info("delete preference service is called");

        //return the remaining records with that guest id and preference type id.

        List<GuestPreference> guestPreferences = guestPreferenceRepository.findGuestPreference(guestId, preferenceTypeId);
        return guestPreferences;
    }

    //get the guest preferences of a perticular type
    @RequestMapping(value = "guest/{guestId}/preference/{preferenceTypeId}")
    public List<GuestPreference> getGuestPreference(@PathVariable("guestId") Long guestId, @PathVariable("preferenceTypeId") Long preferenceTypeId) {
        log.info("show guest preference service");

        List<GuestPreference> guestPreferences = guestPreferenceRepository.findGuestPreference(guestId, preferenceTypeId);
        return guestPreferences;
    }
    //END OF GUEST PREFERENCE SERVICES


    //Guest Stay Details
    //get stay details of a guest
    @RequestMapping(value = "guest/{guestId}/gueststaydetails", method = RequestMethod.GET, produces = "application/json")
    public List<GuestStayHistory> getStayDetails(@PathVariable("guestId") Long guestId) {
        log.info("view guest stay detail  service");
        List<GuestStayHistory> guestStayHistories = guestStayHistoryRepository.findGuests(guestId);
        return guestStayHistories;
    }


    //get all rooms in the hotel(latter we should get all rooms that are not allotted to anyone.)

    @RequestMapping(value = "hotel/{hotelId}/rooms")
    public List<Room> getRooms(@PathVariable("hotelId") Long hotelId) {
        List<Room> rooms = roomRepository.getRooms(hotelId);
        return rooms;
    }

    //add stay details to the guest
    @RequestMapping(value = "guest/{guestId}/addstaydetails", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void addStayDetails(@RequestBody GuestStayHistory guestStayHistory, @PathVariable("guestId") Long guestId) {
        log.info("add guest stay details service");

        Hotel hotel = hotelRepository.findOne(guestStayHistory.getHotel().getId());
        Guest guest = guestRepository.findOne(guestId);
        GuestStayHistory gsh = new GuestStayHistory();

        gsh.setArrivalTime(guestStayHistory.getArrivalTime());
        gsh.setDepartureTime(guestStayHistory.getDepartureTime());
        gsh.setGuest(guest);

        List<Room> rooms = guestStayHistory.getRooms();
        List<Room> allRooms = new ArrayList<Room>();

        for (Room rm : rooms) {
            Room room = roomRepository.findOne(rm.getId());
            room.setRoomStatusInd(true);
            allRooms.add(room);
        }

        gsh.setRooms(allRooms);
        gsh.setHotel(hotel);
        //gsh.setNoOfPreviousStays(gsh.getNoOfPreviousStays() + 1);
        gsh.setCurrentStayIndicator(false);
        guestStayHistoryRepository.save(gsh);
    }

    //update the stay detail
    /*@RequestMapping(value = "guest/{guestId}/updatestaydetails", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public void updateStayDetails(@RequestBody GuestStayHistory guestStayHistory, @PathVariable("guestId") Long guestId) {
        log.info("add guest stay details service");

        //get the room no and find the room and then set the room object for that guest
        String roomNumber = guestStayHistory.getRoom().getRoomNumber();
        Room room = roomRepository.getRoom(roomNumber);

        //take the hotel id coming from the client and find the hotel object and assign to the guest.
        GuestStayHistory gsh = guestStayHistoryRepository.findByGuest(guestId);
        Hotel hotel = hotelRepository.findOne(guestStayHistory.getHotel().getId());

        gsh.setArrivalTime(guestStayHistory.getArrivalTime());
        gsh.setDepartureTime(guestStayHistory.getDepartureTime());


        gsh.setRoom(room);
        gsh.setRoomType(room.getRoomType());
        gsh.setHotel(hotel);
        //to increase the  No of previous stays we need to compare if the current guest stay indicator is false (In DB)and user change the indicator to true(from UI)
        //meaning the guest has come for the one more time so we need to increase the no of previous stays+1 but  if the current stay indicator is true (In DB) and update button is clicked by the user
        // then the user must get the request to change the room no of the guest so there is no need to increase the no of previous stays.


        *//*if (!gsh.getCurrentStayIndicator()) {
            log.info("current stay indicator status::" + gsh.getCurrentStayIndicator());
            gsh.setNoOfPreviousStays(gsh.getNoOfPreviousStays() + 1);
        }
        gsh.setCurrentStayIndicator(guestStayHistory.getCurrentStayIndicator());*//*
        guestStayHistoryRepository.save(gsh);
    }*/


    //manage room keycard for the guest
    //get guest issued room card details
    @RequestMapping(value = "guest/{guestId}/roomcarddetails", method = RequestMethod.GET, produces = "application/json")
    public GuestCard getCardDetails(@PathVariable("guestId") Long guestId) {
        log.info("view guest room card detail  service");
        return guestCardRepository.findGuestCardByGuestId(guestId);
    }


    //added to get the guest room key cards data
    @RequestMapping(value = "guest/roomkeycards", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public List<Card> getRoomKeyCards() {
        List<Card> cards = cardRepository.findAll();
        return cards;
    }

    //get room card details and stauts by passing the room key card
    @RequestMapping(value = "{cardId}/roomcarddetails", method = RequestMethod.GET, produces = "application/json")
    public GuestCard getRoomCardDetails(@PathVariable("cardId") Long cardId) {
        log.info("view st room card detail  service");
        GuestCard guestCard = guestCardRepository.findGuestCardByCardId(cardId);
        log.info("guest card...." + guestCard);
        return guestCard;

    }


   /* @RequestMapping(value = "guest/{guestId}/keycard/{cardId}/assign")
    public void assignKeyCard(@PathVariable("guestId") Long guestId, @PathVariable("cardId") Long cardId) {

        Card card = cardRepository.findOne(cardId);
        Guest guest = guestRepository.findOne(guestId);

        GuestCard guestCard = guestCardRepository.findGuest(guestId);

        if (guestCard == null) {
            guestCard = new GuestCard();
        }

        guestCard.setGuest(guest);
        guestCard.setCard(card);
        guestCard.setIssueDate(new Date());
        guestCard.setStatus(true);
        guestCard.setReturnDate(null);
        guestCardRepository.save(guestCard);


        //change the guest current stay indicator to true bcoz guest holds the guest card means he/she is staying in the hotel
        GuestStayHistory guestStayHistory = guestStayHistoryRepository.findByGuest(guest.getId());
        guestStayHistory.setCurrentStayIndicator(true);
        guestStayHistory.setNoOfPreviousStays(guestStayHistory.getNoOfPreviousStays() + 1);
        guestStayHistoryRepository.save(guestStayHistory);
    }
*/

   /* @RequestMapping(value = "guest/{guestId}/keycard/return")
    public void assignKeyCard(@PathVariable("guestId") Long guestId) {


        GuestCard guestCard = guestCardRepository.findGuest(guestId);
        guestCard.setStatus(false);
        guestCard.setReturnDate(new Date());
        guestCardRepository.save(guestCard);


        //change the guest current stay indicator to false bcoz guest is leaving the the hotel
        GuestStayHistory guestStayHistory = guestStayHistoryRepository.findByGuest(guestId);
        guestStayHistory.setCurrentStayIndicator(false);
        guestStayHistoryRepository.save(guestStayHistory);

    }*/


}
