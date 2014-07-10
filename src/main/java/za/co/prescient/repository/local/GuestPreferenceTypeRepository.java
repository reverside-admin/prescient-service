package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
 import za.co.prescient.model.GuestPreferenceType;


@Repository
public interface GuestPreferenceTypeRepository extends JpaRepository<GuestPreferenceType, Long> {


}
