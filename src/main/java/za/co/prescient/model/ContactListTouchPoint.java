package za.co.prescient.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Getter;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Table(name = "contact_list_touchpoint")
@Getter
@Setter
public class ContactListTouchPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "contact_list_id")
    ContactList contactList;

    @ManyToOne
    @JoinColumn(name = "touch_point_id")
    TouchPoint touchPoint;
}