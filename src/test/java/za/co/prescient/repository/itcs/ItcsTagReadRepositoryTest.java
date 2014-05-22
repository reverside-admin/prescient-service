/*
package za.co.prescient.repository.itcs;

import org.junit.Ignore;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.SpringApplicationContextLoader;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import za.co.prescient.Application;
import za.co.prescient.model.itcs.ItcsTagRead;

import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotNull;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)

public class ItcsTagReadRepositoryTest {

//    @Autowired
//    ItcsTagReadRepository itcsTagReadRepository;

    @Ignore("No set up method to setup test data available")
    @Test
    public void shouldFindTagsByZone() {
        assertNotNull(itcsTagReadRepository);
        List<ItcsTagRead> result = itcsTagReadRepository.findAll();
        assertEquals(10, result.size());

//        result = itcsTagReadRepository.findTagsInZone(1);
        assertEquals(3, result.size());

//        result = itcsTagReadRepository.findTagsInZone(2);
        assertEquals(2, result.size());
    }


}
*/
