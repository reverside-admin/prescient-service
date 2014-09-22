package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.*;
import za.co.prescient.repository.local.*;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
public class GuestContactService {

    @Autowired
    ContactListRepository contactListRepository;

    @Autowired
    ContactListTouchPointRepository contactListTouchPointRepository;

    @Autowired
    ContactListGuestRepository contactListGuestRepository;

    @Autowired
    GuestRepository guestRepository;

    @Autowired
    UserRepository userRepository;



    @RequestMapping(value = "api/users/{userId}/guest/contacts")
    public List<ContactList> getContacts(@PathVariable("userId") Long userId) {
        log.info("Get All guest contact List service");
        List<ContactList> contacts = contactListRepository.findContactsByOwner(userId);
        return contacts;
    }


    @RequestMapping(value = "api/guest/contact/create", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)

    public void createContact(@RequestBody ContactList contactList) {
        log.info("Get All guest contact List service");
        contactListRepository.save(contactList);
    }

    @RequestMapping(value = "api/manager/contacts/touchpoints")
    public List<ContactListTouchPoint> findTouchPoints() {
        log.info("Get All guest contact List touch point service");
        return contactListTouchPointRepository.findAll();
    }

    @RequestMapping(value = "api/manager/contacts/guests")
    public List<ContactListGuest> findGuests() {
        log.info("Get All guest contact List guest service");
        return contactListGuestRepository.findAll();
    }

    @RequestMapping(value = "api/guest/contacts/{id}")
    public ContactList getContactDetails(@PathVariable("id") Long id){
        log.info("Get All contacts service");
        ContactList contactList=contactListRepository.getGuestContactDetails(id);

        return contactList;
    }

    @RequestMapping(value = "api/guest/contacts/{id}/delete",method = RequestMethod.PUT)
    @ResponseStatus(HttpStatus.OK)
    public void deletecontacts(@PathVariable("id") Long id){
        ContactList contactList=contactListRepository.findOne(id);
        contactListRepository.delete(id);

    }



    //guests in contacts

    @RequestMapping(value = "api/guest/contactguests/{id}")
    public List<Guest> getContactGuests(@PathVariable("id") Long id){
        List<Guest> allGuests = guestRepository.findAll();

        ContactList contactList = contactListRepository.getGuestContactDetails(id);

        List<Guest> guestsInContact=new ArrayList<Guest>();


        List<ContactListGuest> contactListGuests=contactList.getContactListGuests();


        for(ContactListGuest contact:contactListGuests)
        {
            guestsInContact.add(contact.getGuest());
        }

        log.info("No of Guests in this list is::"+guestsInContact.size());
        //allGuests.removeAll(guestsInContact);
        log.info("No of Guests  not in this list is::"+allGuests.size());


        return guestsInContact;
    }



//guests not in contacts

    @RequestMapping(value = "api/guest/notincontacts/{id}")
    public List<Guest> getAllContacts(@PathVariable("id") Long id){
        List<Guest> allGuests = guestRepository.findAll();

        ContactList contactList = contactListRepository.getGuestContactDetails(id);

        List<Guest> guestsInContact=new ArrayList<Guest>();


        List<ContactListGuest> contactListGuests=contactList.getContactListGuests();


        for(ContactListGuest contact:contactListGuests)
        {
            guestsInContact.add(contact.getGuest());
        }

        log.info("No of Guests in this list is::"+guestsInContact.size());
        allGuests.removeAll(guestsInContact);

        log.info("No of Guests  not in this list is::"+allGuests.size());


        return allGuests;
    }

//touch points in contacts

    @RequestMapping(value = "api/guest/contacttp/{id}")
    public List<TouchPoint> getContactTP(@PathVariable("id") Long id,Principal principal) {
        List<TouchPoint> touchPoints = userRepository.findByUserName(principal.getName()).getTouchPoints();

        ContactList contactList = contactListRepository.getGuestContactDetails(id);

        List<TouchPoint> touchPointsInContacts = new ArrayList<TouchPoint>();

        List<ContactListTouchPoint> contactListTouchPoints = contactList.getContactListTouchPoints();

        for (ContactListTouchPoint contact:contactListTouchPoints){

            touchPointsInContacts.add(contact.getTouchPoint());
        }

        log.info("No of TouchPoints in this list is::"+touchPointsInContacts.size());
        //touchPoints.removeAll(touchPointsInContacts);
        log.info("No of TouchPoints  not in this list is::"+touchPoints.size());

        return touchPointsInContacts;
    }



//touch points not in contacts

    @RequestMapping(value = "api/guest/notselecttp/{id}")
    public List<TouchPoint> getTouchPointsAssignedToLoggedInUser(@PathVariable("id") Long id,Principal principal) {
        List<TouchPoint> touchPoints = userRepository.findByUserName(principal.getName()).getTouchPoints();

        ContactList contactList = contactListRepository.getGuestContactDetails(id);

        List<TouchPoint> touchPointsInContacts = new ArrayList<TouchPoint>();

        List<ContactListTouchPoint> contactListTouchPoints = contactList.getContactListTouchPoints();

        for (ContactListTouchPoint contact:contactListTouchPoints){

            touchPointsInContacts.add(contact.getTouchPoint());
        }

        log.info("No of TouchPoints in this list is::"+touchPointsInContacts.size());
        touchPoints.removeAll(touchPointsInContacts);
        log.info("No of TouchPoints  not in this list is::"+touchPoints.size());

        return touchPoints;
    }


//update

    @RequestMapping(value = "api/guest/contact/{id}/update", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void updateContact(@RequestBody ContactList contactList,@PathVariable("id") Long id) {
        log.info("update guest contact List service");

        ContactList contactList1= contactListRepository.findOne(id);
        contactList1.setName(contactList.getName());
        contactList1.setContactListTouchPoints(contactList.getContactListTouchPoints());
        contactList1.setContactListGuests(contactList.getContactListGuests());
        contactListRepository.save(contactList1);
    }


   /* @RequestMapping(value = "api/manager/{userId}/contactlistname")
    public List<String> getContactListName(@PathVariable("userId") Long userId){
         log.info("get all contact list names of a manager");
        List<String> contactListNames=contactListRepository.getContactListName(userId);

        log.info("all contact list names::"+contactListNames.toString());
        return contactListNames;
    }*/



    @RequestMapping(value = "api/manager/{id}/contact/{name}")
    public ContactList getContactListObj(@PathVariable("id") Long id , @PathVariable("name") String name){
        ContactList allContactLists=contactListRepository.getContactList(id,name);
        //log.info("contact list size::"+allContactLists.size());
        return allContactLists;

    }

    //get all guests present in managers all contact list having specific touch point access

    @RequestMapping(value = "user/{ownerId}/contacts/{tagId}/guests")
    public List<Guest> getAllGuestInAllContactList(@PathVariable("ownerId") Long ownerId,@PathVariable("tagId") String tagId) {
        log.info("get guest list in all contact list");
        List<ContactList> allContactLists=contactListRepository.findContactsByOwner(ownerId);
        List<ContactList> contactList=new ArrayList<ContactList>();
        List<Guest> guests=new ArrayList<Guest>();
        for(ContactList contact:allContactLists)
        {
            List<ContactListTouchPoint> contactListTouchPoints=contact.getContactListTouchPoints();
            for(ContactListTouchPoint contactListTouchPoint:contactListTouchPoints)
            {
                if(contactListTouchPoint.getTouchPoint().getName().equals(tagId.trim()))
                {
                    contactList.add(contact);
                }
            }
        }

        for(ContactList contact:contactList )
        {
            List<ContactListGuest> contactListGuests=contact.getContactListGuests();
            for(ContactListGuest contactListGuest:contactListGuests)
            {
                guests.add(contactListGuest.getGuest());
            }
        }
        log.info("No of guests in this list:"+guests.size());
        return guests;
    }


    //get all guest  present in all contact list
    @RequestMapping(value = "api/manager/{id}/contacts/guests/ids")
    public List<Long> getContactListGuestIds(@PathVariable("id") Long id)
    {
        List<ContactList> allContactLists=contactListRepository.findContactsByOwner(id);
        List<Long> ids=new ArrayList<Long>();
        for(ContactList contactList:allContactLists)
        {
            List<ContactListGuest> contactListGuests=contactList.getContactListGuests();
            for(ContactListGuest contactListGuest:contactListGuests)
            {
                ids.add(contactListGuest.getGuest().getId());
            }

        }

        return ids;

    }


}
