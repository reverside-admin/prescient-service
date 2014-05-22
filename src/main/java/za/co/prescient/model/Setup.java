package za.co.prescient.model;

import lombok.Data;

import javax.persistence.*;

@Entity
@Table(name = "setup")
@Data
public class Setup {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    @Column(name = "id")
    Long id;

    //TODO:name is changed to setupName bcoz form does not bind name attribute bcoz name is a build in property of form
    @Column(name = "setup_name")
    String setupName;

    @Column(name = "description")
    String description;

    @Column(name = "indicator")
    Boolean indicator;

    @Column(name = "image_name")
    String imageName;

    @Column(name = "file_name")
    String fileName;

    @Column(name = "length_x")
    Double lengthX;

    @Column(name = "length_y")
    Double lengthY;

    @Column(name = "file_path")
    String filePath;

    @ManyToOne
    @JoinColumn(name = "touch_point_id")
    TouchPoint touchPoint;

}
