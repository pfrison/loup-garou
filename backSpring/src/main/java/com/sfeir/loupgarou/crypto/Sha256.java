package com.sfeir.loupgarou.crypto;

import java.security.MessageDigest;

import org.apache.commons.codec.binary.Hex;

import lombok.SneakyThrows;

public class Sha256 {
	private static MessageDigest digest = null;
	
	@SneakyThrows
	private static MessageDigest getMessageDigest() {
		if ( digest == null )
			digest = MessageDigest.getInstance("SHA-256");
		return digest;
	}
	
	public static byte[] digest(byte[] content) {
		return getMessageDigest().digest(content);
	}
	
	public static String digestToHex(Object object) {
		return Hex.encodeHexString(digest(object.toString().getBytes()));
	}
}
