package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import za.co.prescient.model.User;
import za.co.prescient.repository.local.UserRepository;

import java.security.Principal;

@RestController
@Slf4j
public class LoginService {

    @Autowired
    private UserRepository userRepository;

    @RequestMapping(value = "login/{userName}/{password}", produces = "application/json")
    @ResponseBody
    public User login(@PathVariable("userName") String userName, @PathVariable("password") String password) {
        log.info("User Login -> userName:{}, password:{}", userName, password);
        User user = userRepository.findByUserNameAndPassword(userName, password);
        if (user == null) {
            throw new RuntimeException("User Not Found");
        }
        return user;
    }


    @RequestMapping(value = "api/login/reset/password/{newPassword}", method = RequestMethod.GET)
    @ResponseStatus(HttpStatus.OK)
    public void changePassword(@PathVariable("newPassword")String newPassword, Principal principal) {
        String userName = principal.getName();
        User user = userRepository.findByUserName(userName);
        user.setPassword(newPassword);
        userRepository.save(user);
    }
}
