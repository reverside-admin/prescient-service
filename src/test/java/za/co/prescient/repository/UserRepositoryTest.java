package za.co.prescient.repository;

import org.junit.Test;
import org.junit.After;
import org.junit.Before;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationContextLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import za.co.prescient.Application;
import za.co.prescient.model.User;
import za.co.prescient.repository.local.UserRepository;

import javax.sql.DataSource;

import static org.junit.Assert.assertNotNull;
import static org.junit.Assert.assertNull;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)
public class UserRepositoryTest {

    @Autowired
    UserRepository userRepository;

    @Autowired
    DataSource dataSource;

    @Before
    public void setup() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("insert into user_status(id,value) values(1,'Enable')");
        jdbcTemplate.execute("insert into user_status(id,value) values(2,'Disable')");

        jdbcTemplate.execute("insert into user_type(id,value) values(1,'admin')");
        jdbcTemplate.execute("insert into user_type(id,value) values(2,'manager')");
        jdbcTemplate.execute("insert into user_type(id,value) values(3,'staff')");


        jdbcTemplate.execute("insert into hotel(id,name) values(1,'Orion')");
        jdbcTemplate.execute("insert into hotel(id,name) values(2,'Taj')");


        jdbcTemplate.execute("insert into user(id,user_name,password,first_name,last_name,user_status_id,user_type_id,hotel_id) values(1,'mrunmay','secret','mrunmay','mohanty',1,1,1)");


    }

    @Test
    public void shouldFindUserByUserName() {
        User user = userRepository.findByUserName("mrunmay");
        assertNotNull(user);
    }

    @Test
    public void shouldReturnNullIfNoUserWithSuchNameIsExist()
    {
        User user=userRepository.findByUserName("invalidname");
        assertNull(user);
    }

    @Test
    public void shouldFindUserByUserNameAndPassword()
    {
        User user=userRepository.findByUserNameAndPassword("mrunmay","secret");
        assertNotNull(user);
    }


    @Test
    public void shouldReturnNullIfUserNameIsInvalidButPasswordIsValid()
    {
     User user=userRepository.findByUserNameAndPassword("invalid","secret");
        assertNull(user);
    }


    @Test
    public void shouldReturnNullIfUserNameIsValidButPasswordIsInvalid()
    {
        User user=userRepository.findByUserNameAndPassword("mrunmay","invalid");
        assertNull(user);
    }

    @Test
    public void shouldReturnNullWhenBothTheUserNameAndPasswordIsInvalid()
    {
        User user=userRepository.findByUserNameAndPassword("invalid","invalid");
        assertNull(user);
    }

    @After
    public void clean()
    {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from user");
        jdbcTemplate.execute("delete from hotel");
        jdbcTemplate.execute("delete from user_status");
        jdbcTemplate.execute("delete from user_type");

    }
}
