package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "hotel_room_type")
@Data
public class RoomType {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name = "room_type_name")
    String name;

}
