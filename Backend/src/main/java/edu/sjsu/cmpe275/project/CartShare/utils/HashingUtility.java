package edu.sjsu.cmpe275.project.CartShare.utils;

import java.nio.charset.StandardCharsets;
import com.google.common.hash.Hashing;

public class HashingUtility {
    public static String createHashedCode(String rawString) {
        return Hashing.sha256().hashString(rawString, StandardCharsets.UTF_8).toString();
    }
}