package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.UserType;

@Repository
public interface UserTypeRepository extends JpaRepository<UserType, Long> {
}
