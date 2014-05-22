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
import za.co.prescient.model.TouchPoint;
import za.co.prescient.repository.local.TouchPointRepository;

import javax.sql.DataSource;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)
public class TouchPointRepositoryTest {

    @Autowired
    TouchPointRepository touchPointRepository;

    @Autowired
    DataSource dataSource;

    @Before
    public void setup() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);


        jdbcTemplate.execute("insert into hotel(id,name) values(1,'Orion')");
        jdbcTemplate.execute("insert into hotel(id,name) values(2,'Taj')");

        jdbcTemplate.execute("insert into department(id,name,hotel_id) values(1,'Travel',1)");
        jdbcTemplate.execute("insert into department(id,name,hotel_id) values(2,'Hospitality',2)");


        jdbcTemplate.execute("insert into touch_point(id,name,department_id) values(1,'dinind',1)");
        jdbcTemplate.execute("insert into touch_point(id,name,department_id) values(2,'parking',1)");
        jdbcTemplate.execute("insert into touch_point(id,name,department_id) values(3,'reception',1)");
    }

    @Test
    public void shouldReturnTheListOfTouchPointsIfDepartmentIdIsValid()
    {
        List<TouchPoint> touchPoints=touchPointRepository.findTouchPointByDepartmentId(1L);
        assertNotNull(touchPoints);
    }

    @Test
    public void shouldReturnEmptyListIfDepartmentIdIsInvalid()
    {
        List<TouchPoint> touchPoints=touchPointRepository.findTouchPointByDepartmentId(3L);
        int listSize=touchPoints.size();
        assertEquals(0,listSize);
    }

    @After
    public void clear()
    {
        JdbcTemplate jdbcTemplate=new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from touch_point");
        jdbcTemplate.execute("delete from department");
        jdbcTemplate.execute("delete from hotel");
    }

}
