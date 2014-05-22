package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name= "guest_card")
@Data
public class Card {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name="mag_stripe_no", unique = true)
    String magStripeNo;

    @Column(name="rfid_tag_no", unique = true)
    String rfidTagNo;

}
