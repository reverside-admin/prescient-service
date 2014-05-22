package za.co.prescient.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "user")
@Data
@ToString
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long Id;

    @Column(name = "user_name") //(unique = true)
    String userName;

    @JsonIgnore
    @Column(name = "password") //(nullable = false)
    String password;

    @Column(name = "first_name") //(nullable = false)
    String firstName;

    @Column(name = "last_name") //(nullable = false)
    String lastName;

    @ManyToOne //(optional = false)
    @JoinColumn(name = "user_status_id")
    UserStatus userStatus;

    @ManyToOne //(optional = false)
    @JoinColumn(name = "user_type_id")
    UserType userType;

    @OneToOne //(optional = false)
    @JoinColumn(name = "hotel_id")
    Hotel hotel;

    @ManyToMany
    @JoinTable(joinColumns = @JoinColumn(name = "uid"),
            inverseJoinColumns = @JoinColumn(name = "did"))
    List<Department> departments;

    @ManyToMany
    @JoinTable(joinColumns = @JoinColumn(name = "uid"),
            inverseJoinColumns = @JoinColumn(name = "tid"))
    List<TouchPoint> touchPoints;
}
