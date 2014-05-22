package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.UserStatus;

@Repository
public interface UserStatusRepository extends JpaRepository<UserStatus, Long> {
}
