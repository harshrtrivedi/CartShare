package edu.sjsu.cmpe275.project.CartShare.utils;

import edu.sjsu.cmpe275.project.CartShare.model.Order;
import edu.sjsu.cmpe275.project.CartShare.model.Order_Items;
import edu.sjsu.cmpe275.project.CartShare.model.Pickup;
import edu.sjsu.cmpe275.project.CartShare.repository.PickupRepository;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

public class EmailUtility {
    @Autowired
    PickupRepository pickupRepository;
    
    public static final String URL = "http://localhost:3000";
    public static String URL_PREFIX = URL + "/verifyaccount/";
    public static final String VERIFICATION_SUCCESS_MESSAGE = "Congratulations.!! Account verified successfully";

    public static String createVerificationMsg(Long verificationcode) {
        String verificationMessage = "Thank you for registration with Cartshare !!!\nPlease verify your account"
                + " by clicking the url.\n" + "\nUrl : " + URL_PREFIX + verificationcode
                + "\n\nRegards\nTeam Cartshare";
        System.out.println("verificationMessage : " + verificationMessage);
        return verificationMessage;
    }

    public static String createPoolRequestReceived(String initiater, String approver) {
        String notifyMessage = "Hi " + approver + ",\n\nYou have received a request from " + initiater
                + " to join the pool!!! \nPlease go to the Request Dashboard in your cartshare account to respond to the request." + "\n\nRegards,\nTeam Cartshare";
        System.out.println("notifyMessage : " + notifyMessage);
        return notifyMessage;
    }

    public static String messageNotification(String sender, String receiver, String msg) {
        String notifyMessage = "Hi " + receiver + ",\n\nYou have received below message from your fellow pooler "
                + sender + ":\n\n" + msg + "\n\nRegards,\nTeam Cartshare";
        System.out.println("notifyMessage : " + notifyMessage);
        return notifyMessage;
    }

    public static String pickupnotification(Long msg) {
        String notifyMessage = "Hi " + ",\n\nYour order has been picked up with order id:" + msg + "\n\nRegards,\nTeam Cartshare";
        System.out.println("notifyMessage : " + notifyMessage);
        return notifyMessage;
    }

    public static String selfOrdernotification(Order ord) {
        StringBuilder notifyMessage = new StringBuilder("Hi " + ",\n\nYour order with order id:" + ord.getOrderid() + "has been placed!\n\n");
        System.out.println("notifyMessage : " + notifyMessage);
        List<Order_Items> items = ord.getOrder_items();
        for (Order_Items item : items) {
            notifyMessage.append("    Item id: " + item.getId() + "\n");
            notifyMessage.append("    Quantity: " + item.getQuantity() + "\n");
            notifyMessage.append("    Price: " + item.getPrice() + "\n\n");
        }
        notifyMessage.append("\n\nRegards,\nTeam Cartshare");
        return notifyMessage.toString();
    }

    public static String deliverynotification(Long msg) {
        String notifyMessage = "Hi " + ",\n\nYour order with order id:" + msg + " has been delivered"+"\n\nRegards,\nTeam Cartshare";
        System.out.println("notifyMessage : " + notifyMessage);
        return notifyMessage;
    }

    public static String notdeliverednotify(Long msg,String itemName) {
        String notifyMessage = "Hi " + ",\n\n order item " + itemName + "with id :" + msg + " hasn't been delivered"+"\n\nRegards,\nTeam Cartshare";
        System.out.println("notifyMessage : " + notifyMessage);
        return notifyMessage;
    }

    public static String pickupself(Pickup pickup) {
        StringBuilder notifyMessage = new StringBuilder();
        notifyMessage.append("Hi " + ",\n\nThank you for picking up the orders! Please find below the order details with Pickup ID:" + pickup.getId() + "\n\n");

        List<Order> orders = pickup.getOrders();
        for(Order order: orders) {
            if (!order.getPickupOption().equals("self")) {
                List<Order_Items> items = order.getOrder_items();

                notifyMessage.append("    \n\n    Pooler Name: " + order.getBuyerId().getScreenName() + "\n\n");
                notifyMessage.append("    Address: \n");
                notifyMessage.append("        Street: " + order.getBuyerId().getAddress().getStreet() + "\n");
                notifyMessage.append("        City: " + order.getBuyerId().getAddress().getCity() + "\n");
                notifyMessage.append("        State: " + order.getBuyerId().getAddress().getState() + "\n");
                notifyMessage.append("        Zip code: " + order.getBuyerId().getAddress().getZip() + "\n\n");
                for (Order_Items item : items) {
                    notifyMessage.append("    Item id: " + item.getProduct().getName() + "\n");
                    notifyMessage.append("    Quantity: " + item.getQuantity() + "\n");
                    notifyMessage.append("    Price: " + item.getPrice() + "\n");
                }
                System.out.println("notifyMessage : " + notifyMessage);
            }

        }
        notifyMessage.append("Regards,\nTeam Cartshare");
        return notifyMessage.toString();
    }


    public static String ordernotification(List<Order> orders) {
        StringBuilder notifyMessage = new StringBuilder();
        notifyMessage.append("Hi " + ",\n\nThank you for Placing the order! Please find below the order " + "\n\n");
//        Optional<List<Order>> orders = Optional.ofNullable(pickup.getOrders());
        for(Order order: orders) {
            System.out.println("pcikup option"+order.getPickupOption());
            if(!order.getPickupOption().equals("self")) {
                List<Order_Items> items = order.getOrder_items();
                notifyMessage.append("    \n\n    Pooler Order details: "+ "\n\n");
                notifyMessage.append("        Order ID: " + order.getOrderid() + "\n");
                for (Order_Items item : items) {
                    notifyMessage.append("    Items name: " + item.getProduct().getName() + "\n");
                    notifyMessage.append("    Quantity: " + item.getQuantity() + "\n");
                    notifyMessage.append("    Price: " + item.getPrice() + "\n\n");
                }
                System.out.println("notifyMessage : " + notifyMessage);
            }else{
                List<Order_Items> items = order.getOrder_items();
                for (Order_Items item : items) {
                    notifyMessage.append("    Items id: " + item.getId() + "\n");
                    notifyMessage.append("    Quantity: " + item.getQuantity() + "\n");
                    notifyMessage.append("    Price: " + item.getPrice() + "\n");
                }
            }

        }
        notifyMessage.append("Regards,\nTeam Cartshare");
        return notifyMessage.toString();
    }
}