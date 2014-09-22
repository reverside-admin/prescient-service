package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.ContactList;

import java.util.List;


@Repository
public interface ContactListRepository extends JpaRepository<ContactList,Long> {
    @Query("select cl from ContactList cl where cl.owner.id=?1")
    List<ContactList> findContactsByOwner(Long userId);

    @Query("select cl from ContactList cl where cl.id=?1")
    ContactList getGuestContactDetails(Long id);

   /* @Query("select cl.name from ContactList cl where cl.owner.id=?1")
    List<String> getContactListName(Long userId);*/

    @Query("select cl from ContactList cl where cl.owner.id=?1 and cl.name=?2")
    ContactList getContactList(Long userId,String name);




}
