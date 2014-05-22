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
import za.co.prescient.repository.local.GuestCardRepository;

import javax.sql.DataSource;
import java.util.List;

import static java.util.Arrays.asList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)
public class GuestCardRepositoryTest {

    @Autowired
    GuestCardRepository guestCardRepository;

    @Autowired
    DataSource dataSource;

    @Before
    public void setup() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        jdbcTemplate.execute("insert into hotel (id, name) values (1, 'Orion')");

        jdbcTemplate.execute("insert into guest (id, hotel_id, first_name) values (1, 1, 'guest1')");
        jdbcTemplate.execute("insert into guest (id, hotel_id, first_name) values (2, 1, 'guest2')");
        jdbcTemplate.execute("insert into guest (id, hotel_id, first_name) values (3, 1, 'guest3')");

        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (1, 'mag1', 'rfid1')");
        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (2, 'mag2', 'rfid2')");
        jdbcTemplate.execute("insert into card (id, mag_stripe_no, rfid_tag_no) values (3, 'mag3', 'rfid3')");

        jdbcTemplate.execute("insert into guest_card (id, card_id, guest_id) values (1, 1, 1)");
        jdbcTemplate.execute("insert into guest_card (id, card_id, guest_id) values (2, 2, 2)");
        jdbcTemplate.execute("insert into guest_card (id, card_id, guest_id) values (3, 3, 3)");
    }

    @Test
    public void shouldReturnGuestsAllocatedWithTagIds() {
        assertNotNull(guestCardRepository);
        List<Guest> guests = guestCardRepository.findGuestsWithTags(asList(1L, 2L));
        assertEquals(2, guests.size());
    }

    @Test
    public void shouldNotReturnAnyGuestIfTagIsNotAllocated() {
        assertNotNull(guestCardRepository);
        List<Guest> guests = guestCardRepository.findGuestsWithTags(asList(1L, 3L));
        assertEquals(2, guests.size());
    }

    @Test
    public void shouldReturnAGuestNameAllocatedWithTagId() {
        assertNotNull(guestCardRepository);
        List<Guest> guests = guestCardRepository.findGuestsWithTags(asList(1L));
        assertEquals("guest1", guests.get(0).getFirstName());
    }

    @Test
    public void shouldReturnGuestNamesAllocatedWithTagIds() {
        assertNotNull(guestCardRepository);
        List<Guest> guests = guestCardRepository.findGuestsWithTags(asList(1L, 2L, 4L));
        assertEquals("guest1", guests.get(0).getFirstName());
        assertEquals("guest2", guests.get(1).getFirstName());
    }

    @After
    public void clean() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from guest_card");
        jdbcTemplate.execute("delete from card");
        jdbcTemplate.execute("delete from guest");
        jdbcTemplate.execute("delete from hotel");
    }


}
