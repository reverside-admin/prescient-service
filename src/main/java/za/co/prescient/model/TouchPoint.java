package za.co.prescient.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.Data;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "guest_touch_point")
@Data
public class TouchPoint {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name = "guest_touchpoint_name")
    String name;


    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "hotel_department_id")
    Department department;

    @JsonIgnore
    @OneToMany(mappedBy = "touchPoint")
    List<Setup> setups;
}
