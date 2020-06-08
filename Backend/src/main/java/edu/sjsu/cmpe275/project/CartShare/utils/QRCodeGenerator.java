package edu.sjsu.cmpe275.project.CartShare.utils;

import com.amazonaws.util.Base64;
import com.google.zxing.BarcodeFormat;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;

import java.io.ByteArrayOutputStream;


public class QRCodeGenerator {
    public static byte[] getQRCodeImage(String text, int width, int height) {
        try {
//            QRCodeWriter qrCodeWriter = new QRCodeWriter();
//            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
//
//            Path path = FileSystems.getDefault().getPath(filePath);
//            MatrixToImageWriter.writeToPath(bitMatrix, "PNG", path);

            QRCodeWriter qrCodeWriter = new QRCodeWriter();
            BitMatrix bitMatrix = qrCodeWriter.encode(text, BarcodeFormat.QR_CODE, width, height);
            ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "png", byteArrayOutputStream);
            System.out.println(Base64.encode(byteArrayOutputStream.toByteArray()));
            return Base64.encode(byteArrayOutputStream.toByteArray());

        } catch (Exception e) {
            return null;
        }
    }
}
