package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "user_status")
@Data
public class UserStatus {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    @Column(name = "value")
    String value;
}
