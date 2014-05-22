/*package za.co.prescient.api;

import lombok.extern.slf4j.Slf4j;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import za.co.prescient.model.*;
import za.co.prescient.repository.*;

import java.util.ArrayList;
import java.util.List;

import static java.util.Arrays.asList;
import static junit.framework.Assert.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.util.ReflectionTestUtils.setField;

@RunWith(MockitoJUnitRunner.class)
@Slf4j
public class ServicesTest {

    @Mock
    UserStatusRepository userStatusRepository;

    @Mock
    UserTypeRepository userTypeRepository;

    @Mock
    HotelRepository hotelRepository;

    @Mock
    DepartmentRepository departmentRepository;

    @Mock
    TouchPointRepository touchPointRepository;

    @Mock
    UserDetailRepository userDetailRepository;

    Services services;
    StatusService statusService;
    UserTypeService userTypeService;
    HotelService hotelService;
    DepartmentService departmentService;
    TouchPointService touchPointService;
    Long hotelId;

    List<UserStatus> userStatusList;
    List<UserType> userTypeList;
    List<Hotel> hotelList;
    List<Department> departmentList;
    List<TouchPoint> touchPointList;
    List<UserDetail> userDetailList;

    @Before
    public void setup() {
        services = new Services();
        statusService = new StatusService();
        userTypeService = new UserTypeService();
        hotelService = new HotelService();
        departmentService = new DepartmentService();
        touchPointService = new TouchPointService();

        hotelId = 1L;

        setField(statusService, "userStatusRepository", userStatusRepository);
        setField(userTypeService, "userTypeRepository", userTypeRepository);
        setField(hotelService, "hotelRepository", hotelRepository);
        setField(departmentService, "departmentRepository", departmentRepository);
        setField(touchPointService, "touchPointRepository", touchPointRepository);
        setField(services, "userDetailRepository", userDetailRepository);


        userStatusList =  asList(mock(UserStatus.class), mock(UserStatus.class), mock(UserStatus.class));
        userTypeList = asList(mock(UserType.class), mock(UserType.class), mock(UserType.class));
        hotelList = asList(mock(Hotel.class), mock(Hotel.class), mock(Hotel.class));
        departmentList = asList(mock(Department.class), mock(Department.class), mock(Department.class));
        touchPointList = asList(mock(TouchPoint.class), mock(TouchPoint.class), mock(TouchPoint.class));
        userDetailList = asList(mock(UserDetail.class), mock(UserDetail.class), mock(UserDetail.class));
    }

    @Test
    public void shouldCallUserStatusRepositoryForGetAllUserStatus() {
        when(userStatusRepository.findAll()).thenReturn(userStatusList);

        statusService.getAllUserStatus();

        verify(userStatusRepository, times(1)).findAll();
    }

    @Test
    public void shouldReturnNonEmptyListWhenUserStatusRepositoryReturnsNonEmptyListForGetAllUserStatus() {
        when(userStatusRepository.findAll()).thenReturn(userStatusList);

        List<UserStatus> result = statusService.getAllUserStatus();

        assertEquals(result.size(), userStatusList.size());
        assertEquals(result.get(0), userStatusList.get(0));
        assertEquals(result.get(1), userStatusList.get(1));
        assertEquals(result.get(2), userStatusList.get(2));
    }

    @Test
    public void shouldReturnEmptyListWhenUserStatusRepositoryReturnsEmptyListForGetAllUserStatus() {
        when(userStatusRepository.findAll()).thenReturn(new ArrayList<UserStatus>());

        List<UserStatus> result = statusService.getAllUserStatus();

        assertEquals(0, result.size());
    }

    @Test
    public void shouldCallUserRoleRepositoryForGetAllUserRole() {
        when(userTypeRepository.findAll()).thenReturn(userTypeList);

        userTypeService.getAllUserRoles();

        verify(userTypeRepository, times(1)).findAll();
    }

    @Test
    public void shouldReturnNonEmptyListWhenUserTypeRepositoryReturnsNonEmptyListForGetAllUserRoles() {
        when(userTypeRepository.findAll()).thenReturn(userTypeList);

        List<UserType> result = userTypeService.getAllUserRoles();

        assertEquals(result.size(), userTypeList.size());
        assertEquals(result.get(0), userTypeList.get(0));
        assertEquals(result.get(1), userTypeList.get(1));
        assertEquals(result.get(2), userTypeList.get(2));
    }

    @Test
    public void shouldReturnEmptyListWhenUserTypesRepositoryReturnsEmptyListForGetAllUserRoles() {
        when(userTypeRepository.findAll()).thenReturn(new ArrayList<UserType>());

        List<UserType> result = userTypeService.getAllUserRoles();

        assertEquals(0, result.size());
    }

    @Test
    public void shouldCallHotelRepositoryForGetAllHotels() {
        when(hotelRepository.findAll()).thenReturn(hotelList);

        hotelService.getHotels();

        verify(hotelRepository, times(1)).findAll();
    }

    @Test
    public void shouldReturnNonEmptyListWhenHotelRepositoryReturnsNonEmptyListForGetAllHotels() {
        when(hotelRepository.findAll()).thenReturn(hotelList);

        List<Hotel> result = hotelService.getHotels();

        assertEquals(result.size(), hotelList.size());
        assertEquals(result.get(0), hotelList.get(0));
        assertEquals(result.get(1), hotelList.get(1));
        assertEquals(result.get(2), hotelList.get(2));
    }

    @Test
    public void shouldReturnEmptyListWhenHotelRepositoryReturnsEmptyListForGetAllHotels() {
        when(hotelRepository.findAll()).thenReturn(new ArrayList<Hotel>());

        List<Hotel> result = hotelService.getHotels();

        assertEquals(0, result.size());
    }

    @Test
    public void shouldCallDepartmentRepositoryForGetDepartments() {

        when(departmentRepository.findByHotelId(hotelId)).thenReturn(departmentList);

        departmentService.getAllDepartmentsByHotel(hotelId);

        verify(departmentRepository, times(1)).findByHotelId(hotelId);
    }

    @Test
    public void shouldReturnNonEmptyListWhenDepartmentRepositoryReturnsNonEmptyListForGetDepartments() {
        when(departmentRepository.findByHotelId(hotelId)).thenReturn(departmentList);

        List<Department> result = departmentService.getAllDepartmentsByHotel(hotelId);

        assertEquals(result.size(), departmentList.size());
        assertEquals(result.get(0), departmentList.get(0));
        assertEquals(result.get(1), departmentList.get(1));
        assertEquals(result.get(2), departmentList.get(2));
    }

    @Test
    public void shouldReturnEmptyListWhenDepartmentRepositoryReturnsEmptyListForGetDepartments() {
        when(departmentRepository.findAll()).thenReturn(new ArrayList<Department>());

        List<Department> result = departmentService.getAllDepartmentsByHotel(hotelId);

        assertEquals(0, result.size());
    }

    @Captor
    ArgumentCaptor<Long> departmentIdCaptor;

    @Test
    public void shouldCallTouchPointRepositoryForGetAllTouchPointsByDepts() {
        Department department1 = mock(Department.class);
        when(department1.getId()).thenReturn(1L);
        when(touchPointRepository.findTouchPointByDepartmentId(1L)).thenReturn(asList(mock(TouchPoint.class), mock(TouchPoint.class)));

        Department department2 = mock(Department.class);
        when(department2.getId()).thenReturn(2L);
        when(touchPointRepository.findTouchPointByDepartmentId(2L)).thenReturn(asList(mock(TouchPoint.class)));

        touchPointService.getAllTouchPointsByDepts(asList(department1, department2));

        verify(touchPointRepository, times(2)).findTouchPointByDepartmentId(departmentIdCaptor.capture());

        assertEquals(2, departmentIdCaptor.getAllValues().size());
        assertEquals(1L, departmentIdCaptor.getAllValues().get(0).longValue());
        assertEquals(2L, departmentIdCaptor.getAllValues().get(1).longValue());
    }

    @Test
    public void shouldReturnNonEmptyListWhenTouchPointRepositoryReturnsNonEmptyListForGetAllTouchPointsByDepts() {
        Department department1 = mock(Department.class);
        when(department1.getId()).thenReturn(1L);
        when(touchPointRepository.findTouchPointByDepartmentId(1L)).thenReturn(asList(mock(TouchPoint.class), mock(TouchPoint.class)));

        Department department2 = mock(Department.class);
        when(department2.getId()).thenReturn(2L);
        when(touchPointRepository.findTouchPointByDepartmentId(2L)).thenReturn(asList(mock(TouchPoint.class)));

        List<TouchPoint> result = touchPointService.getAllTouchPointsByDepts(asList(department1, department2));

        assertEquals(3, result.size());
    }

    @Test
    public void shouldReturnEmptyListWhenTouchPointRepositoryReturnsEmptyListForGetAllTouchPointsByDepts() {
        Department department1 = mock(Department.class);
        when(department1.getId()).thenReturn(1L);
        when(touchPointRepository.findTouchPointByDepartmentId(1L)).thenReturn(new ArrayList<TouchPoint>());

        List<TouchPoint> result = touchPointService.getAllTouchPointsByDepts(asList(department1));

        assertEquals(0, result.size());
    }

}
*/
