package edu.sjsu.cmpe275.project.CartShare.controller;

import edu.sjsu.cmpe275.project.CartShare.model.Store;
import edu.sjsu.cmpe275.project.CartShare.repository.StoreRepository;
import edu.sjsu.cmpe275.project.CartShare.service.StoreService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.List;

@Transactional
@CrossOrigin(origins = "*", allowCredentials = "true")
@RestController
public class StoreController {
    @Autowired
    StoreService storeService;

    @Autowired
    StoreRepository storeRepository;

    @PostMapping(value="/addstore", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> addStore(@RequestBody Store store,
//            @RequestParam(value = "name") String name,
//                                      @RequestParam(value = "street") String street,
//                                      @RequestParam(value = "city") String city,
//                                      @RequestParam(value = "state") String state,
//                                      @RequestParam(value = "zip") String zip,
                                      HttpServletRequest request) throws JSONException {
        System.out.println("inside create store controller");
        return storeService.addStoreService(store);
    }

    @PutMapping(value="/editstore/{id}", produces = {MediaType.APPLICATION_JSON_VALUE, MediaType.APPLICATION_XML_VALUE})
    public ResponseEntity<?> editStore(@PathVariable Long id, @RequestBody Store store,
                                      HttpServletRequest request) throws JSONException {
        System.out.println("inside create store controller");
        return storeService.editStore(id, store);
    }



    @GetMapping("/getstores")
    public List<Store> getAllStores() {
        return storeRepository.findAll();
    }

    @GetMapping("/getstore/{id}")
    public ResponseEntity<?> getStoreById(@PathVariable Long id) {
        return storeService.getStoreById(id);
    }

    @RequestMapping(value="/deletestore/{id}", method=RequestMethod.DELETE)
    public ResponseEntity<?> deletStore(@PathVariable Long id){
        System.out.println("Inside delete store controller");

        return storeService.deleteStore(id);
    }
}
