package za.co.prescient.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
public class GuestPreferenceType {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name="guest_preference_type_name")
    String name;

    @Column(name="last_update_date")
    Date lastUpdatedDate;
}
