package edu.example.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {

        Dotenv dotenv = Dotenv.configure()
                .directory("./backend") // path relative to working directory
                .load();

        // Example: set a system property so Spring can pick it up
        System.setProperty("GROQ_API_KEY", dotenv.get("GROQ_API_KEY"));
        SpringApplication.run(BackendApplication.class, args);
    }

}
