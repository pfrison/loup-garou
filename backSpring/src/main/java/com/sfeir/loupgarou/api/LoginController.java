package com.sfeir.loupgarou.api;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import com.sfeir.loupgarou.crypto.Sha256;
import com.sfeir.loupgarou.domain.IsTokenValidInput;
import com.sfeir.loupgarou.domain.IsTokenValidOutput;
import com.sfeir.loupgarou.domain.LoginInput;
import com.sfeir.loupgarou.domain.LoginOutput;
import com.sfeir.loupgarou.domain.RegisterInput;
import com.sfeir.loupgarou.entities.UserLogin;
import com.sfeir.loupgarou.entities.UserToken;
import com.sfeir.loupgarou.repositories.UserLoginRepository;
import com.sfeir.loupgarou.repositories.UserSessionRepository;

import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;

@RestController
public class LoginController {
	@Autowired
	private UserLoginRepository userLoginRepository;
	@Autowired
	private UserSessionRepository userSessionRepository;

	@PostMapping("/login")
	public ResponseEntity<LoginOutput> login(@Valid @RequestBody LoginInput loginInput, HttpServletResponse response) {
		Optional<UserLogin> userLogin = userLoginRepository.findById(loginInput.getUsername());
		if ( userLogin.isEmpty() || !userLogin.get().getHashedPassword().equals(Sha256.digestToHex(loginInput.getPassword())) )
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		UserToken session = new UserToken(userLogin.get().getUsername());
		userSessionRepository.save(session);
		return ResponseEntity.ok(new LoginOutput(session.getToken()));
	}

	@PostMapping("/register")
	public ResponseEntity<Void> register(@Valid @RequestBody RegisterInput registerInput) {
		Optional<UserLogin> userLogin = userLoginRepository.findById(registerInput.getUsername());
		if ( userLogin.isPresent() )
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		userLoginRepository.save(UserLogin.builder()
				.username(registerInput.getUsername())
				.hashedPassword(Sha256.digestToHex(registerInput.getPassword()))
				.build());
		return ResponseEntity.ok(null);
	}

	@PostMapping("/isTokenValid")
	public ResponseEntity<IsTokenValidOutput> isTokenValid(@Valid @RequestBody IsTokenValidInput isTokenValidInput) {
		Optional<UserToken> userToken = userSessionRepository.findFirstByToken(isTokenValidInput.getToken());
		if ( userToken.isEmpty() )
			return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
		return ResponseEntity.ok(new IsTokenValidOutput(userToken.get().getUsername()));
	}
}
