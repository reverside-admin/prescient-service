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
import za.co.prescient.model.GuestStayHistory;
import za.co.prescient.repository.local.GuestStayHistoryRepository;

import javax.sql.DataSource;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)

public class GuestStayHistoryRepositoryTest {

    @Autowired
    DataSource dataSource;
    @Autowired
    GuestStayHistoryRepository guestStayHistoryRepository;

    @Before
    public void setup() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        jdbcTemplate.execute("insert into hotel(id,name) values(1,'Orion')");
        jdbcTemplate.execute("insert into hotel(id,name) values(2,'Taj')");

        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(100,'INDPSNO001','santosh','k','kunnath','Male','Mr','Indian','1982-04-01 00:00:00',1)");
        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(101,'INDPSNO002','subhash','subha','Goel','Male','Mr','Indian','1983-04-01 00:00:00',1)");
        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(102,'INDPSNO003','suman','sumi','Goel','Female','Mrs','Indian','1984-04-01 00:00:00',1)");

        jdbcTemplate.execute("insert into guest_stay_history(id,guest_id,room_id,arrival_time,departure_time,current_stay_indicator,hotel_id) values(1,100,134,'2010-04-01 00:00:00', '2010-04-05 00:00:00',true,1)");
        jdbcTemplate.execute("insert into guest_stay_history(id,guest_id,room_id,arrival_time,departure_time,current_stay_indicator,hotel_id) values(2,101,139,'2010-04-02 00:00:00', '2010-04-05 00:00:00',true,1)");
        jdbcTemplate.execute("insert into guest_stay_history(id,guest_id,room_id,arrival_time,departure_time,current_stay_indicator,hotel_id) values(3,102,214,'2010-04-03 00:00:00', '2010-04-05 00:00:00',false,2)");

    }

    @Test
    public void shouldReturnAllCheckedInGuestsOfAHotel()
    {
      List<GuestStayHistory> guestStayHistories=guestStayHistoryRepository.findCheckedInByHotelId(1L);
      assertEquals(2,guestStayHistories.size());
    }

    @After
    public void clear()
    {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from guest_stay_history");
        jdbcTemplate.execute("delete from guest");
        jdbcTemplate.execute("delete from hotel");
    }


}
