package za.co.prescient.model;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;
import org.aspectj.internal.lang.annotation.ajcDeclareAnnotation;

import javax.persistence.*;
import java.util.Date;

@Entity
@Data
public class GuestPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long Id;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    Guest guest;

    @Column(name = "guest_preference_description")
    String description;

    @ManyToOne
    @JoinColumn(name="guest_preference_type_id")
    GuestPreferenceType guestPreferenceType;

    @Column(name = "last_update_date")
    Date lastUpdateDate;


}
