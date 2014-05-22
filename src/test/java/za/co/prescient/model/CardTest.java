package za.co.prescient.model;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationContextLoader;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import za.co.prescient.Application;

import javax.sql.DataSource;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)
public class CardTest {

    @Autowired
    DataSource dataSource;

    String magStripeNo = "test_mag_stripe_no";
    String rfidTagNo = "test_rfid_tag_no";

    @Before
    public void setup() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (1, '" + magStripeNo + "', '" + rfidTagNo + "')");
    }


    @Test(expected = DuplicateKeyException.class)
    public void magStripeNoShouldBeUnique() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (2, '" + magStripeNo + "', 'new_rgid_tag_no')");
    }

    @Test(expected = DuplicateKeyException.class)
    public void ifidTagNoShouldBeUnique() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (2, 'new_mag_stripe_no', '" + rfidTagNo + "')");
    }

    @After
    public void clean(){
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from card where id=1");
    }

}
