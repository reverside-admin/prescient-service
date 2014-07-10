package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table(name = "current_resident_guest_stay_detail")
@Data
public class GuestStayHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @ManyToOne
    @JoinColumn(name = "guest_id")
    Guest guest;

//    @Column(name = "room_id")
//    String roomId;

    @ManyToOne
    @JoinColumn(name = "room_id")
    Room room;

    @ManyToOne
    @JoinColumn(name = "room_type_id")
    RoomType roomType;

    @Column(name = "arrival_time")
    Date arrivalTime;

    @Column(name = "departure_time")
    Date departureTime;

    @Column(name="no_of_previous_stays")
    Long noOfPreviousStays;

    @Column(name = "current_stay_ind")
    Boolean currentStayIndicator;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    Hotel hotel;

}
