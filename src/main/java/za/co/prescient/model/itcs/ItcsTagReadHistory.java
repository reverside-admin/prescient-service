package za.co.prescient.model.itcs;

import lombok.Getter;
import lombok.Setter;
import org.apache.commons.codec.binary.Hex;

import java.util.Date;


@Getter
@Setter
public class ItcsTagReadHistory {

    @Getter
    @Setter
    private Long id;

//    @Column(name = "tag_id")
//    private String guestCard;

    private byte[] guestCard;

    public String getGuestCard() {
        return new String(Hex.encodeHex(guestCard));
    }

    public void setGuestCard(String guestCard) {
        try{
            this.guestCard = Hex.decodeHex(guestCard.toCharArray());
        } catch (Exception e) {
            this.guestCard = new byte[0];
        }
    }

    @Getter
    @Setter
    private String zoneId;

    @Getter
    @Setter
    private Double xCoordRead;

    @Getter
    @Setter
    private Double yCoordRead;

    @Getter
    @Setter
    private Date tagReadDatetime;

}
