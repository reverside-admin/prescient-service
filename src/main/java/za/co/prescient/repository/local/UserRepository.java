package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.User;

import java.util.List;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    public User findByUserName(String userName);

    public User findByUserNameAndPassword(String userName, String password);

    @Query("select user.userName from User user")
    List<String> findAllUserByUserName();

    @Query("select user from User user order by user.id desc")
    List<User> findAllUser();

    @Query("select user from User user where user.userStatus.id=2")
    List<User> getAllEnabledUsers();

    @Query("select user from User user where user.userStatus.id=1")
    List<User> getAllDisabledUsers();


}

