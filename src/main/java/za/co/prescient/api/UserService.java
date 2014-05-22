package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.User;
import za.co.prescient.model.UserStatus;
import za.co.prescient.repository.local.UserRepository;
import za.co.prescient.repository.local.UserStatusRepository;

import java.security.Principal;
import java.util.List;

@RestController
@Slf4j
public class UserService {

    private static final Logger LOGGER = Logger.getLogger(UserService.class);

    @Autowired
    UserRepository userRepository;

    @Autowired
    UserStatusRepository userStatusRepository;

    @RequestMapping(value = "api/users", method = RequestMethod.GET, produces = "application/json")
    public List<User> get() {
        log.info("Get All UserDetails service");
        return userRepository.findAll();
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

}
