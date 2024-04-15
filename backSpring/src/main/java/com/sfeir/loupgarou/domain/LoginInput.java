package com.sfeir.loupgarou.domain;

import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class LoginInput {
	@NotBlank(message = "username is required")
	String username;
	@NotBlank(message = "password is required")
	String password;
}
