package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.Hotel;
@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long>{
}
