package za.co.prescient.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "hotel_guest_profile_detail")
@Getter
@Setter
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

    @Column(name = "guest_photo_image_path")
    String guestImagePath;

    @Column(name = "guest_id_number")
    String idNumber;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    Hotel hotel;


      @OneToMany(cascade=CascadeType.ALL, mappedBy = "guest")
     List<GuestPreference> guestPreferences;
}