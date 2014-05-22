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
import za.co.prescient.model.*;
import za.co.prescient.repository.local.DepartmentRepository;

import javax.sql.DataSource;

import java.util.List;

import static org.junit.Assert.*;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)

public class DepartmentRepositoryTest {
    @Autowired
    DataSource dataSource;

    @Autowired
    DepartmentRepository departmentRepository;

    @Before
    public void setup() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);

        jdbcTemplate.execute("insert into hotel(id,name) values(1,'Orion')");
        jdbcTemplate.execute("insert into hotel(id,name) values(2,'Taj')");

        jdbcTemplate.execute("insert into department(id,name,hotel_id) values(1,'Travel',1)");
        jdbcTemplate.execute("insert into department(id,name,hotel_id) values(2,'Hospitality',1)");
        jdbcTemplate.execute("insert into department(id,name,hotel_id) values(3,'Dining',1)");
        jdbcTemplate.execute("insert into department(id,name,hotel_id) values(4,'Food',2)");

    }

    @Test
    public void shouldReturnAllDepartmentsOfAHotel() {
        List<Department> departments = departmentRepository.findByHotelId(1L);
        assertEquals(3, departments.size());
    }

    @After
    public void clear() {
        JdbcTemplate jdbcTemplate = new JdbcTemplate(dataSource);
        jdbcTemplate.execute("delete from department");
        jdbcTemplate.execute("delete from hotel");
    }
}
