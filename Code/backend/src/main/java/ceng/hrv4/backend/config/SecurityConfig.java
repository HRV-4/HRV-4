package ceng.hrv4.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.CsrfConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

import ceng.hrv4.backend.filter.JWTFilter;

@Configuration
@EnableWebSecurity //to make our app run with our security configuration
public class SecurityConfig {

    private final String[] WHITELIST;

    public SecurityConfig() {
        WHITELIST = new String[]
                {
                        "/api/v1/user/register",
                        "/api/v1/user/login",
                        "/api/v1/user/refresh",
                        "/api/v1/test",
                };
    }

    @Bean //we say to Spring: don't go for default, this is the security chain you have to go for
    public SecurityFilterChain securityFilterChain(HttpSecurity http, JWTFilter jwtFilter) throws Exception {
        return http
                .cors(Customizer.withDefaults())
                .csrf(CsrfConfigurer::disable) //disable csrf token protection
                .authorizeHttpRequests(request -> request
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        .requestMatchers(WHITELIST).permitAll()
                        .anyRequest().authenticated()) //enforce authentication for all incoming requests
                //.formLogin(Customizer.withDefaults()) //enable the spring security's login page
                //.httpBasic(Customizer.withDefaults()) //enable http basic authentication with default settings, I make use of this config in postman
                //.logout(Customizer.withDefaults()) //what are you doing?
                .sessionManagement(session -> session
                        .sessionCreationPolicy(SessionCreationPolicy.STATELESS)) //set session to stateless
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class) //add the JWT filter before the UsernamePasswordAuthenticationFilter
                .build();
    }

    @Bean
    /*
        The AuthenticationManager returned by this method becomes a managed Spring bean.
        This means any other class that needs an AuthenticationManager can have it injected by Spring.
        The @Autowired annotation in UserService tells Spring to inject the returned AuthenticationManager bean into the service.

        This function is called only ONCE, when Spring starts:
        It finds the @Bean-annotated method authenticationManager() and calls it once to get the AuthenticationManager instance.
        It then injects the pre-existing AuthenticationManager bean to any @Autowired-annotated field.
    */
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration) throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        //put Metro's IP, mine was 192.168.0.27
        configuration.setAllowedOrigins(List.of("http://localhost:3000", "http://localhost:8081", "http://192.168.0.27:8081"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
