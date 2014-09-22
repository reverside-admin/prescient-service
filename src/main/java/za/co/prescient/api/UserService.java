package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.*;
import za.co.prescient.repository.local.TouchPointRepository;
import za.co.prescient.repository.local.UserRepository;
import za.co.prescient.repository.local.UserStatusRepository;

import java.security.Principal;
import java.util.ArrayList;
import java.util.List;

@RestController
@Slf4j
public class UserService {

    private static final Logger LOGGER = Logger.getLogger(UserService.class);

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserStatusRepository userStatusRepository;

    @Autowired
    TouchPointRepository touchPointRepository;

    @RequestMapping(value = "api/users", method = RequestMethod.GET, produces = "application/json")
    public List<User> get() {
        log.info("Get All UserDetails service");
        return userRepository.findAllUser();
    }

    @RequestMapping(value = "api/users", method = RequestMethod.POST, consumes = "application/json")
    @ResponseStatus(HttpStatus.CREATED)
    public void create(@RequestBody User user) {
        LOGGER.info("request received to create user : " + user);
        user.setPassword("password");
        userRepository.save(user);
    }

    @RequestMapping(value = "api/users/{userId}", method = RequestMethod.GET, produces = "application/json")
    public User get(@PathVariable("userId") Long userId) {
        log.info("Get a single UserDetail service");
        return userRepository.findOne(userId);
    }

    @RequestMapping(value = "api/users/{userId}/update/status/{statusId}", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public void updateStatus(@PathVariable("userId") Long userId, @PathVariable("statusId")Long statusId, Principal principal) {
        User user = userRepository.findOne(userId);
        if ( user.getUserName().equals(principal.getName()) ) {
            throw new RuntimeException("User Can't delete himself");
        } else {
            UserStatus userStatus = userStatusRepository.findOne(statusId);
            user.setUserStatus(userStatus);
            log.info("status"+user.getUserStatus().getValue());
            userRepository.save(user);
        }
    }

    @RequestMapping(value = "api/users/{id}/reset/password", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public void updatePassword(@PathVariable("id") Long id) {
        User user = userRepository.findOne(id);
        user.setPassword("password");
        userRepository.save(user);
    }

    //return all not assigned touchpoints
    @RequestMapping(value = "api/users/{userId}/notAssignedTouchpoints")
    public List<TouchPoint> getAllTps(@PathVariable("userId") Long userId) {

        User user = userRepository.findOne(userId);
        List<Department> allAssignedDepartments = user.getDepartments();
        log.info("TPss : " + allAssignedDepartments.size());

        List<TouchPoint> allTouchPointsOfAllAssignedDepartments = new ArrayList<TouchPoint>();

        for (Department dept : allAssignedDepartments) {
            List<TouchPoint> temp =touchPointRepository.findTouchPointByDepartmentId(dept.getId());
            allTouchPointsOfAllAssignedDepartments.addAll(temp);
            log.info("All TP" + allTouchPointsOfAllAssignedDepartments.size());
        }
        List<TouchPoint> allAssignedTouchPoints = user.getTouchPoints();

        allTouchPointsOfAllAssignedDepartments.removeAll(allAssignedTouchPoints);
        log.info("after removal : " + allTouchPointsOfAllAssignedDepartments.size());

        return allTouchPointsOfAllAssignedDepartments;
        //after removal all  touchPoints that are  not assigned, are  returned

    }

    //user detail update
    @RequestMapping(value="api/users/update/{id}",method = RequestMethod.PUT, consumes = "application/json")
    @ResponseStatus(HttpStatus.OK)
    public void update(@PathVariable Long id, @RequestBody User user) {
        User userDetail = userRepository.findOne(id);
        UserStatus userStatus=new UserStatus();
        userStatus.setId(user.getUserStatus().getId());
        UserType userType=new UserType();
        userType.setId(user.getUserType().getId());
        List<Department> departments=user.getDepartments();
        List<TouchPoint> touchPoints=user.getTouchPoints();


        userDetail.setFirstName(user.getFirstName());
        userDetail.setLastName(user.getLastName());
        userDetail.setUserStatus(userStatus);
        userDetail.setUserType(userType);
        userDetail.setDepartments(departments);
        userDetail.setTouchPoints(touchPoints);
        userRepository.save(userDetail);
    }

    @RequestMapping(value = "api/username/{name}", method = RequestMethod.GET)
    public User getUserNames(@PathVariable String name) {
        User user=userRepository.findUserByUserName(name);
        return user;

    }

    @RequestMapping(value = "api/users/enabled", method = RequestMethod.GET)
    public List<User> getAllEnabledUsers() {
       List<User> users=userRepository.getAllEnabledUsers();
         return  users;

    }

    @RequestMapping(value = "api/users/disabled", method = RequestMethod.GET)
    public List<User> getAllDisabledUsers() {
       List<User> users= userRepository.getAllDisabledUsers();
        return  users;
    }



}
