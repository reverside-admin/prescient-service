package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "guest_card_allocation")
@Data
public class GuestCard {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    Guest guest;

    @Column(name = "guest_card_returned_date")
    Date returnDate;


    @ManyToOne
    @JoinColumn(name = "guest_card_id")
    Card card;

    @Column(name = "guest_card_issued_date")
    Date issueDate;

    @Column(name = "status")
    Boolean status;

}
