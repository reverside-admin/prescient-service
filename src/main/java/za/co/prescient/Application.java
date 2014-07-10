package za.co.prescient;

import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.ImportResource;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.jdbc.datasource.DriverManagerDataSource;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

@Configuration
@ComponentScan
@EnableAutoConfiguration
@ImportResource("classpath:security-context.xml")
@EnableJpaRepositories
public class Application extends WebMvcConfigurerAdapter {


    //Comment the below Bean when using In-Memory Database and add HSQLDB deppendency and change in application.properties to "spring.jpa.hibernate.ddl-auto=create"
    @Bean(name = "dataSource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://192.168.1.10:3306/prescientdemo");
        driverManagerDataSource.setUsername("itcs");
        driverManagerDataSource.setPassword("itcs");
        return driverManagerDataSource;
    }

    /*@Bean(name = "dataSource")
    public DriverManagerDataSource dataSource() {
        DriverManagerDataSource driverManagerDataSource = new DriverManagerDataSource();
        driverManagerDataSource.setDriverClassName("com.mysql.jdbc.Driver");
        driverManagerDataSource.setUrl("jdbc:mysql://localhost:3306/prescientdemo");
        driverManagerDataSource.setUsername("root");
        driverManagerDataSource.setPassword("root");
        return driverManagerDataSource;
    }*/
    public static void main(String[] args) {
        new SpringApplicationBuilder(Application.class).run(args);
    }

}
