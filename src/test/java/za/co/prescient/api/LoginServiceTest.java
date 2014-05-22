package za.co.prescient.api;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.mockito.Mock;
import org.mockito.runners.MockitoJUnitRunner;
import za.co.prescient.model.User;
import za.co.prescient.repository.local.UserRepository;

import static org.junit.Assert.assertEquals;
import static org.mockito.Mockito.*;
import static org.springframework.test.util.ReflectionTestUtils.setField;

@RunWith(MockitoJUnitRunner.class)
public class LoginServiceTest {

    @Mock
    UserRepository userRepository;

    LoginService loginService;
    String userName ;
    String password ;

    @Before
    public void setup() {
        userName = "testUserName";
        password = "testPassword";
        loginService = new LoginService();
        setField(loginService, "userRepository", userRepository);
    }

    @Test
    public void shouldCallUserRepositoryForLogin() {
        User user = mock(User.class);
        when(userRepository.findByUserNameAndPassword(userName, password)).thenReturn(user);
        loginService.login(userName, password);
        verify(userRepository, times(1)).findByUserNameAndPassword(userName, password);
    }


    @Test(expected = RuntimeException.class)
    public void shouldThrowExceptionWhenUserRepositoryReturnsNullForLogin() {
        when(userRepository.findByUserNameAndPassword(userName, password)).thenReturn(null);
        loginService.login(userName, password);
    }


    @Test
    public void shouldReturnSameObjectWhenUserRepositoryReturnsNotNullForLogin() {
        User user = mock(User.class);
        when(userRepository.findByUserNameAndPassword(userName, password)).thenReturn(user);
        User result = loginService.login(userName, password);
        assertEquals(result, user);
    }


}
