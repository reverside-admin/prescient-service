package za.co.prescient.api;


import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.test.SpringApplicationContextLoader;
import org.springframework.context.annotation.Profile;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.junit4.SpringJUnit4ClassRunner;
import org.springframework.test.context.web.WebAppConfiguration;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import za.co.prescient.Application;
import za.co.prescient.model.Hotel;
import za.co.prescient.repository.local.HotelRepository;

import java.util.Arrays;
import java.util.List;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@RunWith(SpringJUnit4ClassRunner.class)
@ContextConfiguration(classes = Application.class, loader = SpringApplicationContextLoader.class)
@WebAppConfiguration
@ConfigurationProperties("classpath:/application-test.properties")
@Profile("test")
@Slf4j
public class ServicesIT {

    @Autowired
    private WebApplicationContext context;


    private MockMvc mvc;

    @Autowired
    HotelRepository hotelRepository;

//    @Autowired
//    ItcsTagReadRepository itcsTagReadRepository;

    @Before
    public void setUp() {
        log.info(">>>>>>" +         this.context.getEnvironment()        );
        this.mvc = MockMvcBuilders.webAppContextSetup(this.context).build();
    }

    @Test
    public void testGetHotelsWhenNoHotelExist() throws Exception {
        this.mvc.perform(get("/api/hotels"))
                .andExpect(status().isOk())
                .andExpect(content().string("[]"));
    }

    @Test
    public void testGetHotelsWhenHotelsExist() throws Exception {
        List<Hotel> hotels = Arrays.asList(new Hotel(null, "hotel1"), new Hotel(null, "hotel2"), new Hotel(null, "hotel3"));
        hotelRepository.save(hotels);

        this.mvc.perform(get("/api/hotels"))
                .andExpect(status().isOk())
                .andExpect(content().string("[{\"id\":1,\"name\":\"hotel1\"},{\"id\":2,\"name\":\"hotel2\"},{\"id\":3,\"name\":\"hotel3\"}]"));
//                .andExpect(content().string("[{\"id\":1,\"name\":\"orion\"},{\"id\":2,\"name\":\"taj\"},{\"id\":3,\"name\":\"hotel1\"},{\"id\":4,\"name\":\"hotel2\"},{\"id\":5,\"name\":\"hotel3\"}]"));
    }

    @Test
    public void testGetTags() throws Exception {
        this.mvc.perform(get("/api/touchpoints/guestCardIds/all"))
                .andExpect(status().isOk())
                .andExpect(content().string("[]"));
    }


}
