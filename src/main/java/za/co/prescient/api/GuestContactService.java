package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.ContactList;
import za.co.prescient.model.ContactListGuest;
import za.co.prescient.model.ContactListTouchPoint;
import za.co.prescient.repository.local.ContactListGuestRepository;
import za.co.prescient.repository.local.ContactListTouchPointRepository;
import za.co.prescient.repository.local.ContactListRepository;

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



}
