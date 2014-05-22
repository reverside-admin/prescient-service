/*
package za.co.prescient.repository.itcs;

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
import za.co.prescient.model.itcs.ItcsTagRead;
import za.co.prescient.model.itcs.ItcsTagReadHistory;
import za.co.prescient.repository.itcs.ItcsTagReadRepository;

import javax.sql.DataSource;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)

public class ItcsTagReadHistoryRepositoryTest {

    @Autowired
    DataSource dataSource;

    @Autowired
    ItcsTagReadHistoryRepository itcsTagReadHistoryRepository;

    @Before
    public void setup()
    {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSource);

        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (1,'mag001','rfid001')");


        jdbcTemplate.execute("insert into hotel(id,name) values(1,'Orion')");
        jdbcTemplate.execute("insert into hotel(id,name) values(2,'Taj')");

        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(100,'INDPSNO001','santosh','k','kunnath','Male','Mr','Indian','1982-04-01 00:00:00',1)");
        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(101,'INDPSNO002','subhash','subha','Goel','Male','Mr','Indian','1983-04-01 00:00:00',1)");
        jdbcTemplate.execute("insert into guest(id,passport_number,first_name,preferred_name,surname,gender,title,nationality_id,dob,hotel_id) values(102,'INDPSNO003','suman','sumi','Goel','Female','Mrs','Indian','1984-04-01 00:00:00',1)");




        jdbcTemplate.execute("insert into guest_card (id, card_id, guest_id,issue_date,status) values (1,1, 100,'2010-04-01 00:08:21',true)");

        jdbcTemplate.execute("insert into itcs_tag_read_history (id, guest_card, zone_id, x_coord_read, y_coord_read, tag_read_datetime) values (1, 1004, 2, 1.88, 1.29, '2010-04-01 00:08:21')");
        jdbcTemplate.execute("insert into itcs_tag_read_history (id, guest_card, zone_id, x_coord_read, y_coord_read, tag_read_datetime) values (2, 1005, 3, 1.88, 1.29, '2010-04-01 00:09:26')");
    }

    @Test
    public void shouldReturnGuestHistoryIfGuestCardIdIsValid()
    {
        List<ItcsTagReadHistory> itcsTagReadHistories=itcsTagReadHistoryRepository.findGuestHistory(1004);

    }


    @After
    public void clear()
    {

    }

}
*/
