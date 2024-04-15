package com.sfeir.loupgarou.crypto;

import java.util.Random;

public class Token {
	private static final int LENGTH = 32;
	
	public static String generate() {
		Random r = new Random();
		StringBuilder sb = new StringBuilder();
		while ( sb.length() < LENGTH )
			sb.append("%08x".formatted(r.nextInt()));
		return sb.substring(0, LENGTH);
	}
}
