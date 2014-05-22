package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.co.prescient.model.UserType;
import za.co.prescient.repository.local.UserTypeRepository;

import java.util.List;

@RestController
@Slf4j
public class UserTypeService {

    @Autowired
    UserTypeRepository userTypeRepository;

    @RequestMapping(value = "api/roles")
    public List<UserType> getAllUserRoles() {
        log.info("Get All Available Role List Service");
        List<UserType> userTypes = userTypeRepository.findAll();
        return userTypes;
    }

}
