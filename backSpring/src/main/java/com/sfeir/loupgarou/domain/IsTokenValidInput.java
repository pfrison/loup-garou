package com.sfeir.loupgarou.domain;

import jakarta.validation.constraints.NotBlank;
import lombok.Value;

@Value
public class IsTokenValidInput {
	@NotBlank(message = "token is required")
	String token;
}
