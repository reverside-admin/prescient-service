package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.Setup;
import za.co.prescient.model.TouchPoint;

import java.util.List;

@Repository
public interface SetupRepository extends JpaRepository<Setup, Long> {

    List<Setup> findByTouchPoint(TouchPoint touchPoint);

    Setup findByTouchPointAndIndicator(TouchPoint touchPoint, Boolean indicator);
}
