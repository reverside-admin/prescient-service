package za.co.prescient.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "hotel_room")
@Data
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "hotel_id")
    Hotel hotel;

    @Column(name = "room_number")
    String roomNumber;

    @ManyToOne
    @JoinColumn(name = "room_type_id")
    RoomType roomType;

    /*@Column(name = "room_status_ind")
    Boolean roomStatusInd;
*/
   /* @ManyToOne
    //@JoinColumn(name="guest_stay_id")
    @JoinTable(name="GUEST_ROOMS")
     GuestStayHistory guestStayHistory;*/

}
