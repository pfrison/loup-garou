package com.sfeir.loupgarou.repositories;

import org.springframework.data.repository.CrudRepository;

import com.sfeir.loupgarou.entities.UserLogin;

public interface UserLoginRepository extends CrudRepository<UserLogin, String> { }
