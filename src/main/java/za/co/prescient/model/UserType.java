package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "user_type")
@Data
public class UserType {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name = "value")
    String value;
}
