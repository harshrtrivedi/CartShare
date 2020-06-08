package edu.sjsu.cmpe275.project.CartShare.service;

import edu.sjsu.cmpe275.project.CartShare.model.Order;
import edu.sjsu.cmpe275.project.CartShare.model.Store;
import edu.sjsu.cmpe275.project.CartShare.repository.OrderItemsRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.OrderRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.ProductRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class StoreService {

    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ProductRepository productRepository;

    public ResponseEntity<?> addStoreService(Store store) {
        System.out.println("Inside add store service");
        Optional<Store> validStore;
        validStore = Optional.ofNullable(storeRepository.findByName(store.getName()));
        if (validStore.isPresent()) {
           return ResponseEntity.status(HttpStatus.CONFLICT).body("Bad Parameter | Store with this name already exists.");
        }
        storeRepository.saveAndFlush(store);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(store);
    }


    public ResponseEntity<?> getStoreById(Long id) {
        System.out.printf("inside getProduct : ", id);
        Optional<Store> store = storeRepository.findById(id);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(store.get());
    }

    public ResponseEntity<?> deleteStore(Long id) {
        System.out.println("inside delete store service");
        System.out.println("id"+id);
        Optional<Store> newstore = storeRepository.findById(id);
        System.out.println(newstore.get().getName());
        Optional<List<Order>> orders = orderRepository.findOrdersByStore(id);
//        System.out.println(orders.get().size());
        if (orders.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Error : Unfulfilled Orders");
        }
        storeRepository.delete(newstore.get());

        return ResponseEntity.status(HttpStatus.OK).body("SuccessFully Deleted");
    }
    public ResponseEntity<?> editStore(Long id, Store store) {
        System.out.println("product: "+ store.toString());
//        ProductId id = store.getId();
//        System.out.println(id.getStoreId());
        Optional<Store> validStore;
        validStore = Optional.ofNullable(storeRepository.findByName(store.getName()));
        if (validStore.isPresent()) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body("Bad Parameter | Store with this name already exists.");
        }
        System.out.println(store.getId());
        Optional<Store> newstore = storeRepository.findById(id);
        System.out.println("city: "+store.getAddress().getCity());

        if(newstore.isPresent()){
            System.out.println("Inside new store: "+newstore.get().getId());
//            newstore.get().setId(store.getId());
            newstore.get().setName(store.getName());
            newstore.get().getAddress().setStreet(store.getAddress().getStreet());
            newstore.get().getAddress().setCity(store.getAddress().getCity());
            newstore.get().getAddress().setState(store.getAddress().getState());
            newstore.get().getAddress().setZip(store.getAddress().getZip());
            storeRepository.saveAndFlush(newstore.get());
            return ResponseEntity.status(HttpStatus.OK).body(newstore.get());
        }

        return ResponseEntity.status(HttpStatus.CONFLICT).body("Error in Updatng Store");
    }
}
