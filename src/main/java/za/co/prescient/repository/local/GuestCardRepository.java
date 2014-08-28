package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.Guest;
import za.co.prescient.model.GuestCard;

import java.util.List;

@Repository
public interface GuestCardRepository extends JpaRepository<GuestCard, Long> {

    @Query("select gc.guest from GuestCard gc where gc.card.id in (?1)")
    public List<Guest> findGuestsWithTags(List<Long> tags);

    //list parameter changed to Guest earlier it was GuestCard.26-8-2014
    @Query("select gca.guest from GuestCard gca where gca.card.rfidTagNo in (?1) and gca.status = true")
    public List<Guest> findByCardIdListWithStatusActive(List<String> cardIdList);


    //return type changed to list
    @Query("select gca from GuestCard gca where gca.guest.id = ?1 and gca.status = true")
    public List<GuestCard> findGuestCardByGuestId(Long guestId);

    @Query("select gca from GuestCard gca where gca.card.id=?1 and gca.status=true")
    public GuestCard findGuestCardByCardId(Long cardId);


   /* @Query("select gca from GuestCard gca where gca.guest.id=?1")
    public GuestCard findGuest(Long guestId);*/

    @Query("select gca from GuestCard gca where gca.status=true")
    public List<GuestCard> findAllAllocatedCards();


    //get cards given to a guest.we have implemented a method doing the same thing here but currently we donot want to change that method
    //because it may hamper other functionality.we are dealing with guest card now after fixing this we will refactor the code.

    @Query("select gca from GuestCard gca where gca.guest.id = ?1 and gca.status = true")
    public List<GuestCard> findAllCardsOfAGuest(Long guestId);



}
