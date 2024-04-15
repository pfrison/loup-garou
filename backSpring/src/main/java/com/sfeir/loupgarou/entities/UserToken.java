package com.sfeir.loupgarou.entities;

import com.sfeir.loupgarou.crypto.Token;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotBlank;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity(name = "userToken")
@Data
@NoArgsConstructor(access = AccessLevel.PUBLIC)
@AllArgsConstructor(access = AccessLevel.PUBLIC)
@Builder(toBuilder = true)
public class UserToken {
	@Id
	@NotBlank
	String username;
	@NotBlank
	String token;
	
	public UserToken(String username) {
		this.username = username;
		this.token = Token.generate();
	}
}
