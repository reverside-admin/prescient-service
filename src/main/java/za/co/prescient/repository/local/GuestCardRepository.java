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

    @Query("select gca.guest from GuestCard gca where gca.card.rfidTagNo in (?1) and gca.status = true")
    public List<GuestCard> findByCardIdListWithStatusActive(List<String> cardIdList);

    @Query("select gca from GuestCard gca where gca.guest.id = ?1 and gca.status = true")
    public GuestCard findGuestCardByGuestId(Long guestId);


}
