package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.GuestStayHistory;

import java.util.Date;
import java.util.List;

@Repository
public interface GuestStayHistoryRepository extends JpaRepository<GuestStayHistory, Long> {

    // TODO: Add filter to get latest history
    @Query("select gsh from GuestStayHistory gsh where gsh.currentStayIndicator = true and gsh.guest.id= ?1")
    public GuestStayHistory findByGuest(Long guestId );

    @Query("select gsh from GuestStayHistory gsh where current_date <= gsh.departureTime and gsh.guest.id=?1")
    GuestStayHistory getGuestLastStay(Long guestId);


    @Query("select gsh from GuestStayHistory gsh where gsh.currentStayIndicator = true and gsh.hotel.id= ?1 ")
    public List<GuestStayHistory> findCheckedInByHotelId(Long hotelId);


    @Query("select gsh from GuestStayHistory gsh where  gsh.guest.id= ?1 ")
    public List<GuestStayHistory> findGuests(Long GuestId);

    @Query("select gsh from GuestStayHistory gsh where gsh.currentStayIndicator = true and gsh.guest.id = " +
            "(select gc.guest.id from GuestCard gc where gc.card.rfidTagNo = ?1 and gc.status = true)")
    GuestStayHistory findGuestByTagId(String tagId);

    @Query("select count(*) from GuestStayHistory gsh where gsh.guest.id=?1")
    Long getGuestPreviousStays(Long guestId);

    @Query("select gsh from GuestStayHistory gsh where gsh.hotel.id=?1 and gsh.guest.id <> ?4 and (gsh.departureTime > ?2 and  gsh.arrivalTime < ?3)")
    List<GuestStayHistory> getGuestHistoryBasedOnDate(Long hotelId,Date arrivalDate,Date departureDate,Long guestId);


}
