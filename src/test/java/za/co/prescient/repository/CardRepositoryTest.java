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
import za.co.prescient.model.Card;
import za.co.prescient.repository.local.CardRepository;

import javax.sql.DataSource;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)
public class CardRepositoryTest {

    @Autowired
    CardRepository cardRepository;

    @Autowired
    DataSource dataSource;

    String magStripeNo = "test_mag_stripe_no";
    String rfidTagNo = "test_rfid_tag_no";

    @Before
    public void setup() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (1, '" + magStripeNo + "', '" + rfidTagNo + "')");
    }

    @Test
    public void shouldFindCardByMagStripeNoWhenCardWithSuchMagStripeNoExists() {
        Card result = cardRepository.findByMagStripeNo(magStripeNo);
        assertNotNull(result);
        assertEquals(magStripeNo, result.getMagStripeNo());
        assertEquals(rfidTagNo, result.getRfidTagNo());
    }

    @Test
    public void shouldReturnNullIfNoCardWithSuchMagStripeNoExists() {
        Card result = cardRepository.findByMagStripeNo("invalid_mag_stripe_no");
        assertNull(result);
    }

    @After
    public void clean() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from card where id=1");
    }


}
