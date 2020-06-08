package edu.sjsu.cmpe275.project.CartShare.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.DeserializationFeature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import edu.sjsu.cmpe275.project.CartShare.model.Product;
import edu.sjsu.cmpe275.project.CartShare.model.ProductId;
import edu.sjsu.cmpe275.project.CartShare.repository.ProductRepository;
import edu.sjsu.cmpe275.project.CartShare.repository.StoreRepository;
import edu.sjsu.cmpe275.project.CartShare.service.AmazonClient;
import edu.sjsu.cmpe275.project.CartShare.service.ProductService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

//import edu.sjsu.cmpe275.project.CartShare.service.AmazonClient;

@Transactional
@CrossOrigin(origins = "*", allowCredentials = "true")
@RestController
public class ProductController {
    @Autowired
    ProductService productService;
    @Autowired
    ProductRepository productRepository;

    private AmazonClient amazonClient;
    @Autowired
    StoreRepository storeRepository;

    @Autowired
    ProductController(AmazonClient amazonClient) {
        this.amazonClient = amazonClient;
    }

//    @PostMapping(value="/addproduct", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
//    public ResponseEntity<?> addProduct(@RequestBody Product product,
//                                      HttpServletRequest request) throws JSONException {
//        System.out.println("inside create product controller: "+product.toString());
//
//        return productService.addProduct(product);
//    }

@PostMapping(value="/addproduct", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> addProduct(@RequestPart(value = "data") String data,@RequestPart(value = "files") MultipartFile[] files) throws JsonMappingException, JsonProcessingException{
        String response = "";
        ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
        Product prop;

        try {
            prop = mapper.readValue(data, Product.class);

            for (MultipartFile file : files) {
                System.out.println("started upload");
                response += this.amazonClient.uploadFile(file);
                System.out.println("ended upload : " + response);
            }
            String image = "https://myawscartshare.s3.amazonaws.com/1590540461284-Product.png";
            if (!response.isEmpty()){
                prop.setImageurl(response);
            }else{
                prop.setImageurl(image);
            }

            System.out.println("Images sting: " + prop.getImageurl());
        }
        catch (JsonMappingException e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }
        catch (Exception e){
            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
        }

        productService.addProduct(prop);
        return ResponseEntity.ok(prop);
    }



    @GetMapping("/getproducts/{id}")
        public ResponseEntity<?> getProducts(@PathVariable Long id) {
        return productService.getproducts(id);
    }


    @GetMapping("/getproducts/{storeId}/{sku}")
    public ResponseEntity<?> getProductsBySku(@PathVariable Long id) {
        return productService.getproducts(id);
    }

    @GetMapping("/getproducts")
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @GetMapping("/getmaxsku")
    public ResponseEntity<?> getMaxSku() {
        return productService.getMaxSku();
    }

    @DeleteMapping("/deleteproduct")
    public ResponseEntity<?> deleteProduct(@RequestBody Product product) {
        System.out.println("Inside deleteproduct: "+ product.toString());
        return productService.deleteProduct(product);
    }

    @DeleteMapping("/deleteproductbyid/{storeId}/{sku}")
    public ResponseEntity<?> deleteProductbyid(@PathVariable Long storeId, @PathVariable Long sku) {
        ProductId id = new ProductId(storeId, sku);
        System.out.println("Inside deleteproduct: ");
        return productService.deleteProductById(id);
    }


//    @PostMapping(value="/searchproduct",
//            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
//    public ResponseEntity<?> searchproduct(@RequestBody String text,
//                                    HttpServletRequest request) throws JSONException {
//        System.out.println("inside create product controller: "+text);
//        ObjectMapper mapper = new ObjectMapper();
//        JsonNode actualObj =null;
//
//        try {
//            actualObj= mapper.readTree(text);
//            System.out.println(actualObj.get("text"));
//
//        } catch (JsonProcessingException e) {
//            e.printStackTrace();
//        }
//        return productService.searchproduct(actualObj.get("text").textValue());
//
////        return productService.searchproduct(text);
//    }

    @PutMapping("/editproduct")
    public ResponseEntity<?> editProduct(@RequestPart(value = "data") String data, @RequestPart(value = "files") MultipartFile[] files, HttpServletRequest request) throws JSONException {
            String response = "";
            ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);

//        ProductId id = new ProductId(storeId, sku);
//        Optional<Product> product = productRepository.findById(id);
        Product prop;
            try {
                prop = mapper.readValue(data, Product.class);
//                ProductId id = new ProductId(storeId,sku);
//                Optional<Product> product = productRepository.findById(id);
//                System.out.println(product.get().toString());
                for (MultipartFile file : files) {
                    System.out.println("started upload");
                    response += this.amazonClient.uploadFile(file);
                    System.out.println("ended upload : " + response);
                }
                String image = "https://cartsharebucket.s3.amazonaws.com/1590003936941-Product.png";
                if (!response.isEmpty()){
                    prop.setImageurl(response);
                }else{
                    prop.setImageurl(image);
                }

                System.out.println("Images sting: " + prop.getImageurl());
            }
            catch (JsonMappingException e){
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }
            catch (Exception e){
                return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
            }

            productService.editProduct(prop);
            return ResponseEntity.ok(prop);
    }


//    @PutMapping(value="/editproduct", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
//    public ResponseEntity<?> editProduct(@RequestPart(value = "data") String data,@RequestPart(value = "files") MultipartFile[] files) throws JsonMappingException, JsonProcessingException{
//        String response = "";
//        ObjectMapper mapper = new ObjectMapper().configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false);
//        Product prop;
//
//        try {
//            prop = mapper.readValue(data, Product.class);
//            for(MultipartFile file : files)
//            {
//                System.out.println("started upload");
//                response += this.amazonClient.uploadFile(file);
//                System.out.println("ended upload : " + response );
//            }
//            if(!response.isEmpty()){
//                prop.setImageurl(response);
//            }else{
//                prop.setImageurl("https://cartsharebucket.s3.amazonaws.com/1590003936941-Product.png");
//            }
//
//
//            System.out.println("Images sting: " + prop.getImageurl());
//        }
//        catch (JsonMappingException e){
//            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
//        }
//        catch (Exception e){
//            return new ResponseEntity<>(null, HttpStatus.BAD_REQUEST);
//        }
//
//        productService.editProduct(prop);
//        return ResponseEntity.ok(prop);
//    }


    @PostMapping("/searchproductbysku")
    public ResponseEntity<?> searchProductBySku(@RequestParam Long sku){
//        ProductId id = new ProductId(storeId);
        System.out.println("Inside Search Product: "+sku);
        return productService.searchproductBySku(sku);
    }

    @PostMapping(value="/searchproductbystore",
            produces = {MediaType.APPLICATION_ATOM_XML_VALUE, MediaType.APPLICATION_JSON_VALUE})
    public ResponseEntity<?> searchproductbystore(@RequestParam Long storeid
                                           )  {
        System.out.println("inside search product controller: "+storeid);
        return productService.searchproductbystore(storeid);

//        return productService.searchproduct(text);
    }

    @PostMapping("/searchproduct")
    public ResponseEntity<?> searchProduct(@RequestParam String name) {
//        ProductId id = new ProductId(storeId);
        System.out.println("Inside Search Product: " + name);
        return productService.searchproduct(name);
    }


}
