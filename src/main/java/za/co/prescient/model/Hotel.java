package za.co.prescient.model;

import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.*;

@Entity
@Table(name= "hotel")
@Data
@NoArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name = "name")
    String name;

    /*@OneToMany(cascade = CascadeType.ALL, mappedBy = "hotel")
    List<Room> rooms;*/

    public Hotel(Long id, String name) {
        this.id = id;
        this.name = name;
    }

}
