package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "hotel_guest_profile_detail")
@Data
// TODO : Make it unique (add hotel id to constraint if necessary) (confirm from business)
public class Guest {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name = "guest_passport_number")
    String passportNumber;

    @Column(name = "guest_first_name")
    String firstName;

    @Column(name = "guest_preferred_name")
    String preferredName;

    @Column(name = "guest_surname")
    String surname;

    @Column(name = "guest_gender")
    String gender;

    @Column(name = "guest_title")
    String title;

    @Column(name = "guest_nationality")
    String nationalityId;

    @Column(name = "guest_date_of_birth")
    Date dob;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    Hotel hotel;
}