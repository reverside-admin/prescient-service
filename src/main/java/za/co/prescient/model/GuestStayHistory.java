package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

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

    /*@ManyToOne
    @JoinColumn(name = "room_id")
    Room room;*/

    //added now
    /*@OneToMany(mappedBy = "guestStayHistory")
    List<Room> rooms;*/


    @ManyToMany
    @JoinTable(joinColumns = @JoinColumn(name = "hid"),
            inverseJoinColumns = @JoinColumn(name = "rid"))
    List<Room> rooms;

    /*@ManyToOne
    @JoinColumn(name = "room_type_id")
    RoomType roomType;*/

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
