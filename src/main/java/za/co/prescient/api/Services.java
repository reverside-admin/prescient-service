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

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
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
    public List<ItcsTagRead> getGuestCardHistory(@PathVariable("guestId") Long guestId) {
        log.info("guestcard by guest id service is called" + guestId);

        List<GuestCard> guestCardAllocation;
        guestCardAllocation = guestCardRepository.findGuestCardByGuestId(guestId);


        log.info("guest card---------------" + guestCardAllocation);
//        ItcsTagRead itc=itcsTagReadRepository.findGuestCardHistory(guestCardAllocation.getCard().getId().intValue());
        List<ItcsTagRead> itcsTagReads = new ArrayList<ItcsTagRead>();
        for (int i = 0; i < guestCardAllocation.size(); i++) {

            log.info("start of for loop   >>>>>>>>>>>>>>>>>>>>>>>>>>>");
            String guestCardRFIDTagNo = guestCardAllocation.get(i).getCard().getRfidTagNo();
            log.info("String value of guestCardRFIDTagNo : " + guestCardRFIDTagNo);

            String responseStr = "";
            try {
                log.info("calling ITCS service*****************************");
                URL url = new URL("http://localhost:9090/tags/" + guestCardRFIDTagNo + "/now");
                log.info("guestCardRFIDTagNo : " + guestCardRFIDTagNo);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");

                BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));

                log.info("Reading Response from ITCS************************ \n");
                String res;

                while ((res = br.readLine()) != null) {
                    log.info("res------------>" + res);
                    responseStr = responseStr + res;
                }
                log.info("Response length from ITCS::" + responseStr.length());

                //added now 3:19 25-8-2014
                //if response come from the itcs then continue with following otherwise not

                if (responseStr.length() != 0) {
                    JSONObject obj = new JSONObject(responseStr);
                    log.info("xcoordRead" + obj.getDouble("xcoordRead"));

                    itcsTagRead = new ItcsTagRead();
                    itcsTagRead.setId(obj.getLong("id"));
                    log.info("set id");
                    itcsTagRead.setGuestCard(obj.getString("guestCard"));
                    log.info("set guestcard");


                    itcsTagRead.setZoneId(obj.getString("zoneId").toString());
                    log.info("set zoneid");

                    itcsTagRead.setXCoordRead(obj.getDouble("xcoordRead"));
                    log.info("set xcord");
                    itcsTagRead.setYCoordRead(obj.getDouble("ycoordRead"));
                    log.info("set ycord");
                    itcsTagRead.setTagReadDatetime(new Date(obj.getLong("tagReadDatetime")));
                    log.info("set date and time");

                    //moved from bottom added 26-8-2014
                    itcsTagReads.add(itcsTagRead);
                }


            } catch (Exception e) {
                itcsTagRead = new ItcsTagRead();
                log.info("guestCardRFIDTagNo Exp : " + guestCardRFIDTagNo);
                e.getMessage();
            }
            //itcsTagReads.add(itcsTagRead);
            log.info("End of for loop >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>");
        }
        return itcsTagReads;
    }


    ItcsTagReadHistory itcsTagReadHistory;
    List<ItcsTagReadHistory> itc;
    List<ItcsTagReadHistory> itcsTagReadHistories;

    //comment start
    @RequestMapping(value = "guests/{guestId}/location/history")
    public List<ItcsTagReadHistory> getGuestHistory(@PathVariable("guestId") Long guestId) {
        log.info("guestcard history service is called");
        List<GuestCard> guestCardAllocation;
        guestCardAllocation = guestCardRepository.findGuestCardByGuestId(guestId);
        log.info("guest card allocated to guest id:" + guestId + "  " + guestCardAllocation.size());

//        List<ItcsTagReadHistory> itc= itcsTagReadHistoryRepository.findGuestHistory(guestCardAllocation.getCard().getId().intValue());


        log.info("get guests arrival time.......");
        //get the arrival date of this guest (of the guest's latest stay) Added 1:50 PM 12-8-2014
        GuestStayHistory guestLatestStay = guestStayHistoryRepository.getGuestLastStay(guestId);
        Date arrivalDateinDate = guestLatestStay.getArrivalTime();
        Long arrivalDate = arrivalDateinDate.getTime();
        LOGGER.info("arrival time of the guest in prescient service is::" + arrivalDate);
        //

        itc = new ArrayList<ItcsTagReadHistory>();
        itcsTagReadHistories = new ArrayList<ItcsTagReadHistory>();

        for (int j = 0; j < guestCardAllocation.size(); j++) {
            String guestCardId = guestCardAllocation.get(j).getCard().getRfidTagNo();
            log.info("guestCardId : " + guestCardId);
            String responseStr = "";
//        List<ItcsTagReadHistory> itc = new ArrayList<ItcsTagReadHistory>();

            try {
                URL url = new URL("http://localhost:9090/tags/" + guestCardId + "/history/" + arrivalDate);
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("Accept", "application/json");

                BufferedReader br = new BufferedReader(new InputStreamReader((conn.getInputStream())));
                String res;
                while ((res = br.readLine()) != null) {
                    log.info("Response from Server : " + res);
                    responseStr = responseStr + res;
                }
                JSONArray obj = new JSONArray(responseStr);
                log.info("obj length " + obj.length());
                JSONObject jObj;
                for (int i = 0; i < obj.length(); i++) {
                    jObj = (JSONObject) obj.get(i);
                    log.info("jobj outer : " + i);
                    if (!(jObj.isNull("zoneId"))) {
                        log.info("jobj inner :" + i);
                        itcsTagReadHistory = new ItcsTagReadHistory();
                        itcsTagReadHistory.setId(jObj.getLong("id"));
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
            itcsTagReadHistories.addAll(itc);

        }
        log.info("return list size:" + itcsTagReadHistories.size());
        return itcsTagReadHistories;
    }
    //comment end

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

            log.info("Output from Server .... \n");
            String res;
            while ((res = br.readLine()) != null) {
                log.info(res);
                responseStr = responseStr + res;
            }
            JSONArray obj = new JSONArray(responseStr);
            log.info("obj length " + obj.length());

            for (int i = 0; i < obj.length(); i++) {
                JSONObject jObj = obj.getJSONObject(i);
                itcsTagRead = new ItcsTagRead();
                itcsTagRead.setId(jObj.getLong("id"));
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
            log.info("List of Files : " + listOfFiles[i]);
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

        /*GuestStayHistory guestStayHistory = guestStayHistoryRepository.findByGuest(guestId);
        guestStayHistory.getGuest().setGuestImagePath(imagePath);
        guestStayHistoryRepository.save(guestStayHistory);*/

         Guest guest=guestRepository.findOne(guestId);
         guest.setGuestImagePath(imagePath);
         guestRepository.save(guest);


    }


    //maintain guest starts here

    //view all guest list
    @RequestMapping(value = "guest/all", method = RequestMethod.GET, produces = "application/json")
    public List<Guest> get() {
        log.info("Get All UserDetails service");
        return guestRepository.getAllGuests();
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


    //get all rooms in the hotel( get all rooms that are not allotted to anyone.)
   /* @RequestMapping(value = "hotel/{hotelId}/rooms")
    public List<Room> getRooms(@PathVariable("hotelId") Long hotelId) {
        List<Room> rooms = roomRepository.getRooms(hotelId);
        return rooms;
    }*/


    //get all available rooms based on date
    /*@RequestMapping(value = "hotel/{hotelId}/rooms",method=RequestMethod.POST)
    public List<Room> getRooms(@RequestBody GuestStayHistory guestStayHistory,@PathVariable("hotelId") Long hotelId) {
        log.info("get all room service method is called");
        Date arrivalDate=guestStayHistory.getArrivalTime();
        Date departureDate=guestStayHistory.getDepartureTime();
        log.info("arrival date::" + arrivalDate);
        log.info("departure date::"+departureDate);
        List<GuestStayHistory> guestStayHistories=guestStayHistoryRepository.getGuestHistoryBasedOnDate(hotelId,arrivalDate,departureDate);
        log.info("no of records::"+guestStayHistories.size());
        List<Room> allottedRooms=new ArrayList<Room>();
        List<Room> allRooms=new ArrayList<Room>();
        List<Room> availableRooms=new ArrayList<Room>();
        for(GuestStayHistory gsh:guestStayHistories)
        {
            List<Room> rooms=gsh.getRooms();
            allottedRooms.addAll(rooms);
        }

        allRooms=roomRepository.findAll();
        allRooms.removeAll(allottedRooms);
        availableRooms=allRooms;
         return availableRooms;
    }*/


    @RequestMapping(value = "hotel/{hotelId}/rooms", method = RequestMethod.POST)
    public List<Room> getRooms(@RequestBody GuestStayHistory guestStayHistory, @PathVariable("hotelId") Long hotelId) {
        log.info("get all room service method is called");
        Date arrivalDate = guestStayHistory.getArrivalTime();
        Date departureDate = guestStayHistory.getDepartureTime();
        Long guestId = guestStayHistory.getGuest().getId();
        log.info("arrival date::" + arrivalDate);
        log.info("departure date::" + departureDate);
        List<GuestStayHistory> guestStayHistories = guestStayHistoryRepository.getGuestHistoryBasedOnDate(hotelId, arrivalDate, departureDate, guestId);
        log.info("no of records::" + guestStayHistories.size());
        List<Room> allottedRooms = new ArrayList<Room>();
        List<Room> allRooms = new ArrayList<Room>();
        List<Room> availableRooms = new ArrayList<Room>();
        for (GuestStayHistory gsh : guestStayHistories) {
            List<Room> rooms = gsh.getRooms();
            allottedRooms.addAll(rooms);
        }

        allRooms = roomRepository.findAll();
        allRooms.removeAll(allottedRooms);
        availableRooms = allRooms;
        return availableRooms;
    }


    //get guests latest stay record
    @RequestMapping(value = "guest/{guestId}/lateststay")
    public GuestStayHistory getlatestStayOfAGuest(@PathVariable("guestId") Long guestId) {
        GuestStayHistory guestStayHistory = guestStayHistoryRepository.getGuestLastStay(guestId);
        return guestStayHistory;
    }

    //add stay details to the guest
    @RequestMapping(value = "guest/{guestId}/addstaydetails", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void addStayDetails(@RequestBody GuestStayHistory guestStayHistory, @PathVariable("guestId") Long guestId) {
        log.info("add guest stay details service");

        /*String roomNumber = guestStayHistory.getRooms().get(0).getRoomNumber();
        Room room = roomRepository.getRoom(roomNumber);
        room.setRoomStatusInd(true);
        log.info("current guest stays in " + roomNumber);*/

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
            //room.setRoomStatusInd(true);
            allRooms.add(room);
        }

        gsh.setRooms(allRooms);
        gsh.setHotel(hotel);
        gsh.setCurrentStayIndicator(false);
        //set no of previous stays
        Long previousStays = guestStayHistoryRepository.getGuestPreviousStays(guestId);
        gsh.setNoOfPreviousStays(previousStays);

        guestStayHistoryRepository.save(gsh);
    }

    //update the stay detail
    @RequestMapping(value = "guest/{guestId}/updatestaydetails", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public void updateStayDetails(@RequestBody GuestStayHistory guestStayHistory, @PathVariable("guestId") Long guestId) {
        log.info("add guest stay details service");

        GuestStayHistory history = guestStayHistoryRepository.getGuestLastStay(guestId);
        LOGGER.info(history.getId());

        history.setArrivalTime(guestStayHistory.getArrivalTime());
        history.setDepartureTime(guestStayHistory.getDepartureTime());
        //List<Room> previouslyAllocatedRooms = history.getRooms();
        List<Room> newRoomsRequested = guestStayHistory.getRooms();
        List<Room> newRoomsToBeAllocated = new ArrayList<Room>();

        /*for (Room room : previouslyAllocatedRooms) {
            Room rm = roomRepository.findOne(room.getId());
            rm.setRoomStatusInd(false);

        }*/

        for (Room room : newRoomsRequested) {
            Room rm = roomRepository.findOne(room.getId());
            //rm.setRoomStatusInd(true);
            newRoomsToBeAllocated.add(rm);

        }
        history.setRooms(newRoomsToBeAllocated);
        guestStayHistoryRepository.save(history);
    }


    //manage room keycard for the guest

    //added to get the guest room key cards that are available
    @RequestMapping(value = "guest/roomkeycards", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public List<Card> getRoomKeyCards() {
        // List<Card> allCards = cardRepository.findAll();
        List<Card> allCards = cardRepository.findWithRFIDTagNo();
        List<GuestCard> guestCards = guestCardRepository.findAllAllocatedCards();
        LOGGER.info("card id::" + guestCards.get(0).getCard().getId() + "is given to::" + guestCards.get(0).getGuest().getFirstName());
        List<Card> allocatedCards = new ArrayList<Card>();
        for (GuestCard c : guestCards) {
            Card card = c.getCard();
            allocatedCards.add(card);
        }
        //now substract allocated cards from all cards to get the available cards
        allCards.removeAll(allocatedCards);
        return allCards;
    }


    //get all cards issued to a guest
    @RequestMapping(value = "guest/{guestId}/roomcarddetails", method = RequestMethod.GET, produces = "application/json")
    public List<GuestCard> getCardDetails(@PathVariable("guestId") Long guestId) {
        log.info("view guest room card detail  service");
        return guestCardRepository.findAllCardsOfAGuest(guestId);
    }


    @RequestMapping(value = "guest/{guestId}/cards/assign", method = RequestMethod.POST, produces = "application/json")
    public void saveCards(@RequestBody List<GuestCard> guestCards, @PathVariable("guestId") Long guestId) {
        LOGGER.info("service to assign multiple cards is called");
        LOGGER.info("get cards of length::" + guestCards.size());

        //if guest is staying in the hotel then we can give him the card.
        GuestStayHistory guestStayHistory = guestStayHistoryRepository.getGuestLastStay(guestId);
        if (guestStayHistory != null) {
            for (GuestCard guestCard : guestCards) {
                guestCard.setGuest(guestRepository.findOne(guestId));
                guestCard.setCard(guestCard.getCard());
                guestCard.setIssueDate(new Date());
                guestCard.setStatus(true);
                guestCard.setReturnDate(null);
                guestCardRepository.save(guestCard);

            }
            guestStayHistory.setCurrentStayIndicator(true);
            guestStayHistoryRepository.save(guestStayHistory);
        }

        //set current stay indicator of a guest to true;
        /*GuestStayHistory guestStayHistory = guestStayHistoryRepository.getGuestLastStay(guestId);
        guestStayHistory.setCurrentStayIndicator(true);
        guestStayHistoryRepository.save(guestStayHistory);*/
    }

    @RequestMapping(value = "guest/{cardId}/returncard")
    public void returnKeyCard(@PathVariable("cardId") Long cardId) {


        GuestCard guestCard = guestCardRepository.findGuestCardByCardId(cardId);
        guestCard.setStatus(false);
        guestCard.setReturnDate(new Date());
        guestCardRepository.save(guestCard);
        Long guestId = guestCard.getGuest().getId();

        //ckeck if the guest have any cards or not if guest donot have cards and he return all his card on the day of his/her departure date ,we can change its stay indicator status to false
        //and return all his room as well.

        List<GuestCard> guestCards = guestCardRepository.findAllCardsOfAGuest(guestId);
        if (guestCards.size() == 0) {
            GuestStayHistory guestStayHistory = guestStayHistoryRepository.getGuestLastStay(guestId);
            Date departureDate = guestStayHistory.getDepartureTime();

            Calendar calendar1 = Calendar.getInstance();
            calendar1.setTime(departureDate);
            Calendar calendar2 = Calendar.getInstance();
            calendar2.setTime(new Date());
            int departureDay = calendar1.get(Calendar.DAY_OF_MONTH);
            int todayDay = calendar2.get(Calendar.DAY_OF_MONTH);

            int departureMonth = calendar1.get(Calendar.MONTH);
            int todayMonth = calendar2.get(Calendar.MONTH);

            if (departureDay == todayDay && departureMonth == todayMonth) {
                /*List<Room> rooms = guestStayHistory.getRooms();

                for (Room rm : rooms) {
                    Room room = roomRepository.findOne(rm.getId());
                    room.setRoomStatusInd(false);
                }*/
                guestStayHistory.setCurrentStayIndicator(false);
                guestStayHistoryRepository.save(guestStayHistory);
            }
        }


    }

    @RequestMapping(value = "guest/{guestId}/returncards")
    public void returnAllKeyCards(@PathVariable("guestId") Long guestId) {

        LOGGER.info("return all key card service1");


        List<GuestCard> guestCards = guestCardRepository.findAllCardsOfAGuest(guestId);
        for (GuestCard guestCard : guestCards) {
            guestCard.setReturnDate(new Date());
            guestCard.setStatus(false);

        }
        guestCardRepository.save(guestCards);
        LOGGER.info("return all key card service2");


        //change the guest current stay indicator to false bcoz guest is leaving the the hotel
        GuestStayHistory guestStayHistory = guestStayHistoryRepository.getGuestLastStay(guestId);
        LOGGER.info("return all key card service3");

        Date departureDate = guestStayHistory.getDepartureTime();
        LOGGER.info("return all key card service4");


        Calendar calendar1 = Calendar.getInstance();
        LOGGER.info("return all key card service5");

        calendar1.setTime(departureDate);
        Calendar calendar2 = Calendar.getInstance();
        calendar2.setTime(new Date());
        int departureDay = calendar1.get(Calendar.DAY_OF_MONTH);
        int todayDay = calendar2.get(Calendar.DAY_OF_MONTH);

        int departureMonth = calendar1.get(Calendar.MONTH);
        int todayMonth = calendar2.get(Calendar.MONTH);

        if (departureDay == todayDay && departureMonth == todayMonth) {
            //List<Room> rooms = guestStayHistory.getRooms();

            /*for (Room rm : rooms) {
                Room room = roomRepository.findOne(rm.getId());
                room.setRoomStatusInd(false);
            }*/
            guestStayHistory.setCurrentStayIndicator(false);
            guestStayHistoryRepository.save(guestStayHistory);
        }
    }


    //get list of guests whose birth day is today(to be consumed by mobile)
    @RequestMapping(value = "hotel/{hotelId}/guest/birthday/list", method = RequestMethod.GET, produces = "application/json")
    public List<Guest> getGuestList(@PathVariable("hotelId") Long hotelId) {
        log.info("view guest room card detail  service");
        //find all checked in Guest(1)

        List<Guest> allBirthDayGuests = new ArrayList<Guest>();
        List<GuestStayHistory> guestStayHistories = guestStayHistoryRepository.findCheckedInByHotelId(hotelId);
        List<Long> guestIds = new ArrayList<Long>();
        for (GuestStayHistory guestStayHistory : guestStayHistories) {
            guestIds.add(guestStayHistory.getGuest().getId());
        }

        //get all guest whose guest whose bday is today
        List<Guest> allGuests = guestRepository.getAllGuestBornToday(guestIds);

        for (Guest guest : allGuests) {
            Date guestDOB = guest.getDob();
            Calendar cal = Calendar.getInstance();
            cal.setTime(guestDOB);

            Date currentDate = new Date();
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(currentDate);

            int guestDOBDay = cal.get(Calendar.DAY_OF_MONTH);
            int currentDay = calendar.get(Calendar.DAY_OF_MONTH);


            int guestDOBMonth = cal.get(Calendar.MONTH);
            int currentMonth = calendar.get(Calendar.MONTH);

            LOGGER.info("....................." + guest.getFirstName());

            LOGGER.info("guestDOBDay::" + guestDOBDay);
            LOGGER.info("currentDay::" + currentDay);

            LOGGER.info("guestDOBMonth::" + guestDOBMonth);

            LOGGER.info("currentMonth::" + currentMonth);

            LOGGER.info("..................................");


            if ((guestDOBDay == currentDay) && (guestDOBMonth == currentMonth)) {
                allBirthDayGuests.add(guest);
            }
        }

        return allBirthDayGuests;

    }


}
