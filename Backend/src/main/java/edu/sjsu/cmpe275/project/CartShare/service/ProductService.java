package edu.sjsu.cmpe275.project.CartShare.service;

import edu.sjsu.cmpe275.project.CartShare.model.Order_Items;
import edu.sjsu.cmpe275.project.CartShare.model.Product;
import edu.sjsu.cmpe275.project.CartShare.model.ProductId;
import edu.sjsu.cmpe275.project.CartShare.model.Store;
import edu.sjsu.cmpe275.project.CartShare.repository.OrderItemsRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.ProductRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.StoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.persistence.EntityManager;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class ProductService {

    private static final String FETCH_PROPERTY_DETAILS_EXCEPTION_MESSAGE = "No product details found for the store";
    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderItemsRepository orderItemsRepository;

    @Autowired
    private StoreRepository storeRepository;
    @Autowired
    private EntityManager entityManager;

//    public ResponseEntity<?> addProduct(Product product){
//        ProductId id = product.getId();
//
//        Optional<Store> store = storeRepository.findById(id.getStoreId());
//        product.setStore(store.get());
//        System.out.println(productRepository.getMaxSku());
////        id.setSku(productRepository.getMaxSku()); Not needed
//        productRepository.saveAndFlush(product);
//        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(product);
//    }

    public Product addProduct(Product prop) {
        System.out.println("product: "+ prop.toString());
        ProductId id = prop.getId();
        System.out.println(id.getStoreId());
        Optional<Store> store = storeRepository.findById(id.getStoreId());
        prop.setStore(store.get());
        System.out.println(productRepository.getMaxSku());
//        id.setSku(productRepository.getMaxSku());
        return productRepository.saveAndFlush(prop);
    }

    public Product editProduct(Product product) {
        System.out.println("product: "+ product.toString());
        ProductId id = product.getId();
//        System.out.println(id.getStoreId());
        Optional<Store> store = storeRepository.findById(id.getStoreId());
        product.setStore(store.get());
        System.out.println(productRepository.getMaxSku());
//        id.setSku(productRepository.getMaxSku());
        return productRepository.saveAndFlush(product);
    }

    public ResponseEntity<?> getproducts(Long id) {
        System.out.printf("inside getProduct : ", id);
        Optional<Store> store = storeRepository.findById(id);
        List<Product> products =store.get().getProducts();
        System.out.println(products);
        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(products);
    }
    public ResponseEntity<?> getMaxSku() {
//        System.out.printf("inside getMaxSku");
        try{
            Optional<Long> maxSku = Optional.ofNullable(productRepository.getMaxSku());
            if(maxSku.isPresent()){
                Long newMaxSku = maxSku.get() +1;
                return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(newMaxSku);
            }else{
                return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(1);
            }
        }catch(NullPointerException e){
            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(1);
        }
    }

    public ResponseEntity<?> deleteProduct(Product product) {
        System.out.println("inside delete Product service");

        System.out.println(product.toString());
        productRepository.deleteById(product.getId());
        return ResponseEntity.status(HttpStatus.OK).body("Successfully Deleted");

    }

    public ResponseEntity<?> deleteProductById(ProductId product) {
        System.out.println("inside delete Product service");
        Optional<List<Order_Items>> orderitems = orderItemsRepository.findByProductId(product.getStoreId(),product.getSku());
        if(!orderitems.isPresent()){
            Optional<Product> existingProduct = productRepository.findById(product);
            System.out.println(existingProduct.get().toString());
            System.out.println(product.getSku()+"sku, storeId"+product.getStoreId());
            Optional<Store> store = storeRepository.findById(product.getStoreId());

            if(store.isPresent()&&existingProduct.isPresent()){
                System.out.println("store.get().toString()"+store.get().getName());
                store.get().getProducts().remove(existingProduct.get());
                storeRepository.saveAndFlush(store.get());
                return ResponseEntity.status(HttpStatus.OK).body("Successfully Deleted");
            }else{
                return ResponseEntity.status(HttpStatus.OK).body("Not Deleted");
            }
        }else{
            System.out.println("There are some unfulfilled orders");
           return ResponseEntity.status(HttpStatus.CONFLICT).body("There are some unfulfilled orders ");
        }

    }



//    public ResponseEntity<?> searchproduct(String text) {
////        System.out.println(text.substring(1,text.length()-1));
//        Optional<List<Product>> products = Optional.ofNullable(productRepository.findByName(text));
//        System.out.println(products.toString());
//        List<Store> store = new ArrayList<>();
//        if (products.get().size() == 0) {
//            return ResponseEntity.status(HttpStatus.CONFLICT).contentType(MediaType.APPLICATION_JSON).body("Product Not Found");
//            }
//            for (Product p : products.get()) {
//
//                store.add(p.getStore());
//            }
//            System.out.println(store.toString());
//
//            return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(store);
//
//    }

    public ResponseEntity<?> searchproductBySku (Long sku) {
        System.out.println("inside delete Product service");
        System.out.println("sku"+sku);
        Optional<List<Product>> products = Optional.ofNullable(productRepository.findProductBySku(sku));
//        Optional<Store> id = storeRepository.findById(store.getId());

//        Optional<List<Product>> products = Optional.ofNullable(id.get().getProducts());
        if (products.isPresent()) {
        return ResponseEntity.status(HttpStatus.OK).body(products);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No Products Found for this  store");
        }
    }

    public ResponseEntity<?> searchproduct (String name) {
        System.out.println("inside Search Product service");
        System.out.println("name"+name);
        Optional<List<Product>> products = Optional.ofNullable(productRepository.findByName(name));
//        Optional<Store> id = storeRepository.findById(store.getId());

//        Optional<List<Product>> products = Optional.ofNullable(id.get().getProducts());
        List<Store> store = new ArrayList<>();
        if (products.get().size() == 0) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).contentType(MediaType.APPLICATION_JSON).body("Product Not Found");
        }
        for (Product p : products.get()) {

            store.add(p.getStore());
        }
        System.out.println(store.toString());

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(store);
    }


    public ResponseEntity<?> searchproductbystore(Long storeid) {
//        System.out.println(text.substring(1,text.length()-1));
        Optional<Store> store = storeRepository.findById(storeid);
        System.out.println("sent:" + store.toString());
        Optional<List<Product>> products = Optional.ofNullable(productRepository.findProductByStore(store.get().getId()));
        System.out.println(products.get().size());
        List<Store> storenew = new ArrayList<>();
        if (products.get().size() == 0) {
            return ResponseEntity.status(HttpStatus.CONFLICT).contentType(MediaType.APPLICATION_JSON).body("Product Not Found");
        }
//        for (Product p : products.get()) {
//
//            storenew.add(p.getStore());
//        }
//        System.out.println(store.toString());

        return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(products);

    }
}
