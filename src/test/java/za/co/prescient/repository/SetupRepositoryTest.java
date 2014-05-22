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
import za.co.prescient.model.Setup;
import za.co.prescient.model.TouchPoint;
import za.co.prescient.repository.local.SetupRepository;
import za.co.prescient.repository.local.TouchPointRepository;

import javax.sql.DataSource;
import java.util.List;

import static org.hamcrest.CoreMatchers.equalTo;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertThat;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)
public class SetupRepositoryTest {

    @Autowired
    SetupRepository setupRepository;

    @Autowired
    TouchPointRepository touchPointRepository;

    @Autowired
    DataSource dataSource;


    @Before
    public void setup() {

        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        jdbcTemplate.execute("insert into hotel (id, name) values(1,'Orion')");

        jdbcTemplate.execute("insert into department (id, name, hotel_id) values (1, 'Travel', 1)");
        jdbcTemplate.execute("insert into department (id, name, hotel_id) values (2, 'Hospitality', 1)");

        jdbcTemplate.execute("insert into touch_point (id, name, department_id) values (1, 'dining', 1)");
        jdbcTemplate.execute("insert into touch_point (id, name, department_id) values (2, 'parking', 1)");
        jdbcTemplate.execute("insert into touch_point (id, name, department_id) values (3, 'reception', 1)");

        jdbcTemplate.execute("insert into setup (id, setup_name, description, indicator, image_name, file_name, length_x, length_y, file_path, touch_point_id) values (1, 'dining setup', 'dining setup desc', true, 'dining_image', 'dining.jpeg', 1500, 2000, 'c:\\images', 1)");
        jdbcTemplate.execute("insert into setup (id, setup_name, description, indicator, image_name, file_name, length_x, length_y, file_path, touch_point_id) values (2, 'dining evening setup', 'dining evening setup desc', false, 'dining_image', 'dining.jpeg', 1500, 2000, 'c:\\images', 1)");
    }


    @Test
    public void shouldReturnListOfSetupsWhenTouchPointHasSetups(){
        TouchPoint touchPoint=  touchPointRepository.findOne(1L);
        List<Setup> result = setupRepository.findByTouchPoint(touchPoint);
        assertThat(result.size(), equalTo(2));
    }

    @Test
    public void shouldReturnBlankListOfSetupsWhenTouchPointHasNoSetup(){
        TouchPoint touchPoint=  touchPointRepository.findOne(2L);
        List<Setup> result = setupRepository.findByTouchPoint(touchPoint);
        assertThat(result.size(), equalTo(0));
    }

    @Test
    public void shouldReturnSetupOfATouchPointByIndicator() {
        TouchPoint touchPoint = touchPointRepository.findOne(1L);
        Setup setup = setupRepository.findByTouchPointAndIndicator(touchPoint, true);
        assertEquals(1L, setup.getId().longValue());
    }

    @After
    public void clear() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from setup");
        jdbcTemplate.execute("delete from touch_point");
        jdbcTemplate.execute("delete from department");
        jdbcTemplate.execute("delete from hotel");

    }


}
