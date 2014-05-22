package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.TouchPoint;

import java.util.List;

@Repository
public interface TouchPointRepository extends JpaRepository<TouchPoint, Long> {

    @Query("select tp from TouchPoint tp where tp.department.id=?1")
    public List<TouchPoint> findTouchPointByDepartmentId(Long departmentId);

}
