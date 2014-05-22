package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.Department;
import za.co.prescient.model.TouchPoint;
import za.co.prescient.repository.local.TouchPointRepository;
import za.co.prescient.repository.local.UserRepository;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
public class TouchPointService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TouchPointRepository touchPointRepository;

    @RequestMapping(value = "api/login/touchpoints", method = RequestMethod.GET, produces = "application/json")
    public List<TouchPoint> getTouchPointsAssignedToLoggedInUser(Principal principal) {
        List<TouchPoint> touchPoints = userRepository.findByUserName(principal.getName()).getTouchPoints();
        return touchPoints;
    }

    @RequestMapping(value = "api/departments/{departmentId}/touchpoints")
    public List<TouchPoint> getTouchPointsOfDepartment(@PathVariable("departmentId") Long departmentId) {
        log.info("Get All Touch Points by DepartmentId service");
        return touchPointRepository.findTouchPointByDepartmentId(departmentId);
    }

    //TODO : change POST Method to GET Method
    @RequestMapping(value = "api/departments/touchpoints", method = RequestMethod.POST, consumes = "application/json")
    public List<TouchPoint> getAllTouchPointsByDepts(@RequestBody List<Department> departments) {
        log.info("Get All Touchpoint List by DeptID List");
        List<TouchPoint> touchPoints;
        List<TouchPoint> allTouchPoints = new ArrayList<TouchPoint>();
        for (Department obj : departments) {
            touchPoints = touchPointRepository.findTouchPointByDepartmentId(obj.getId());
            allTouchPoints.addAll(touchPoints);
        }
        return allTouchPoints;
    }

}
