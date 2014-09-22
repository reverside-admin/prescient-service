package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.Card;

import java.util.List;

@Repository
public interface CardRepository extends JpaRepository<Card, Long> {

    @Query("select c from Card c where c.magStripeNo = ?1")
    Card findByMagStripeNo(String magStripeNo);

    @Query("select c from Card c where c.rfidTagNo = ?1")
    Card findByRFIDTagNo(String rfidTagNo);

    //below two methods are written for filter the cards by their rfid tag association.

    @Query("select c from Card c where c.rfidTagNo is not null ")
    List<Card> findWithRFIDTagNo();

    @Query("select c from Card c where c.rfidTagNo is null ")
    List<Card> findWithoutRFIDTagNo();


}
