package com.sfeir.loupgarou.repositories;

import java.util.Optional;

import org.springframework.data.repository.CrudRepository;

import com.sfeir.loupgarou.entities.UserToken;

public interface UserSessionRepository extends CrudRepository<UserToken, String> {
	Optional<UserToken> findFirstByToken(String token);
}
