package edu.sjsu.cmpe275.project.CartShare.service;

import edu.sjsu.cmpe275.project.CartShare.model.Order;
import edu.sjsu.cmpe275.project.CartShare.model.Pickup;
import edu.sjsu.cmpe275.project.CartShare.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class PickupService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private PoolRepository poolRepository;

    @Autowired
    private StoreRepository storeRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PickupRepository pickupRepository;

    @Autowired
    private OrderItemsRepository orderItemsRepository;


    public ResponseEntity<?> getPickupnew(Long id) {
        System.out.println("inside getOrder : "+id);
//        Optional<List<Order>> orders = orderRepository.findPickupOrders(id, "SELECTED_FOR_PICKUP");
        Optional<List<Pickup>> pick = pickupRepository.findPickup(id);
//        List<Order> ornew = new ArrayList<Order>();
//
//        System.out.println(ornew.size());
        if(pick.isPresent())
        {
            System.out.println("PICKUPS are present");
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(pick);
        }

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("");

    }

    public ResponseEntity<?> getDelivery(Long id) {
        System.out.println("inside Delivery Menu : "+id);
        Optional<List<Order>> orders = orderRepository.findDeliveryById(id);

        if(orders.isPresent())
        {
            System.out.println("Orders are present");
            List<Order> neworder= new ArrayList<>();
            for(Order ord : orders.get()){
                neworder.addAll(getDeliveryPickUP(ord.getPickup().getId()));
            }
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(neworder);
        }
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("");
    }

    public List<Order> getDeliveryPickUP(Long id) {
        System.out.println("inside Delivery Menu : "+id);
        Optional<Pickup> pick = pickupRepository.findById(id);
        Optional<List<Order>> orders = Optional.ofNullable(pick.get().getOrders());

        List<Order> deliverorders = new ArrayList<>();
        if(orders.isPresent())
        {
            for(Order o : orders.get()){
                if(o.getPickupOption().equals("others") && o.getStatus().equals("PICKEDUP")){
                    deliverorders.add(o);
                }
            }
            System.out.println("Orders are present");
//            System.out.println(orders.get(0).getStatus());
            return deliverorders;
        }else{
            System.out.println("No orders present  for delivery");
        }
        return null;

    }

}
