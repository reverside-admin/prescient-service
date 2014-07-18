package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.Guest;
import za.co.prescient.model.GuestCard;
import za.co.prescient.model.GuestPreference;

import java.util.List;

@Repository


public interface GuestPreferenceRepository extends JpaRepository<GuestPreference,Long>{

    @Query("select gp from GuestPreference gp where gp.guest.id=?1 and gp.guestPreferenceType.id=?2")
    public List<GuestPreference> findGuestPreference(Long guestId, Long guestPreferenceTypeId);


    @Query("delete  from GuestPreference gp where gp.guest.id=?1 and gp.guestPreferenceType.id=?2")
    public GuestPreference deleteGuestPreference(Long guestId, Long guestPreferenceTypeId);

}
