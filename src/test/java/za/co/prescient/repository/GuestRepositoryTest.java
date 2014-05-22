package za.co.prescient.repository;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationContextLoader;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import za.co.prescient.Application;
import za.co.prescient.model.Guest;
import za.co.prescient.repository.local.GuestRepository;

import javax.sql.DataSource;
import java.util.List;

import static org.junit.Assert.assertEquals;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)

public class GuestRepositoryTest {
    @Autowired
    DataSource dataSource;

    @Autowired
    GuestRepository guestRepository;

    @Before
    public void setup()
    {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSource);
        jdbcTemplate.execute("insert into hotel(id,name) values(1,'Orion')");
        jdbcTemplate.execute("insert into hotel(id,name) values(2,'Taj')");

        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(100,'INDPSNO001','santosh','k','kunnath','Male','Mr','Indian','1982-04-01 00:00:00',1)");
        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(101,'INDPSNO002','subhash','subha','Goel','Male','Mr','Indian','1983-04-01 00:00:00',1)");
        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(102,'INDPSNO003','suman','sumi','Goel','Female','Mrs','Indian','1984-04-01 00:00:00',1)");
    }

    @Test
    public void shouldReturnAllGuestsOfAHotel()
    {
        List<Guest> guests=guestRepository.findByHotelId(1L);
        assertEquals(3,guests.size());
    }

    @After
    public void clear()
    {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from guest");
        jdbcTemplate.execute("delete from hotel");
    }

}
