package za.co.prescient.repository.local;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import za.co.prescient.model.Room;

import java.util.List;


@Repository
public interface RoomRepository extends JpaRepository<Room,Long> {

    @Query("select rm from Room rm where rm.hotel.id=?1 and rm.roomStatusInd=false")
    public List<Room> getRooms(Long hotelId);

    @Query("select rm from Room  rm where rm.roomNumber=?1")
    public Room getRoom(String roomNumber);
}
