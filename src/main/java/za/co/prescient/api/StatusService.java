package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import za.co.prescient.model.UserStatus;
import za.co.prescient.repository.local.UserStatusRepository;

import java.util.List;

@RestController
@Slf4j
public class StatusService {

    @Autowired
    UserStatusRepository userStatusRepository;

    @RequestMapping(value = "api/status")
    public List<UserStatus> getAllUserStatus() {
        log.info("Get All Available Status List Service");
        List<UserStatus> userStatuses = userStatusRepository.findAll();
        return userStatuses;
    }
}
