package edu.sjsu.cmpe275.project.CartShare.service;

import edu.sjsu.cmpe275.project.CartShare.model.*;
import edu.sjsu.cmpe275.project.CartShare.repository.*;
import edu.sjsu.cmpe275.project.CartShare.utils.EmailUtility;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
public class OrderService {

	@Autowired
	private ProductRepository productRepository;

	@Autowired
	private EmailService emailService;

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

	public ResponseEntity<?> addOrder( Order order,Long userId, Optional<Long> numbOfOrdersToPcik){

		System.out.println("Inside addOrder Service");
		System.out.println("Inside addOrder Service"+order.getOrder_items().get(0).getProduct().getName());
		order.setOrderTime(new Date());
		Optional<User> user = userRepository.findById(userId);
		Optional<List<Order>> orders  = Optional.of(new ArrayList<Order>());

		if(user.isPresent() && user.get().getPool() !=null)
		{
			order.setBuyerId(user.get());
			order.setPool(user.get().getPool());
		}
		orderRepository.saveAndFlush(order);

		List<Order_Items> order_items =  order.getOrder_items();
		for(Order_Items item : order_items) {
			System.out.println("Inside for loop in addOrder Service");
			item.setOrderTime(new Date());
			item.setStatus("PENDING");
			item.setOrder(order);
			orderItemsRepository.saveAndFlush(item);
		}
		orderRepository.saveAndFlush(order);
		orders.get().add(order);
		if(order.getPickupOption().equals("self")){

			System.out.println("Total number of pickup: "+ numbOfOrdersToPcik.get());
			Optional<List<Order>> ordersToPick= orderRepository.findPoolOrdersById(user.get().getPool().getPoolId(), order.getStore().getId(), userId);
			if(ordersToPick.isPresent()){
				for(int i=0;i<numbOfOrdersToPcik.get();i++){
					orders.get().add(ordersToPick.get().get(i));
				}
			}

			System.out.println("Inside pickup other orders: ");
			Pickup newPickup = new Pickup();
			newPickup.setPickupPerson(user.get());
			newPickup.setStatus("AVAILABLE");
			pickupRepository.saveAndFlush(newPickup);
			for(int i=0;i<orders.get().size();i++){
				Order ord = orders.get().get(i);
				ord.setPickup(newPickup);
				ord.setStatus("SELECTED_FOR_PICKUP");
				List<Order_Items>  ord_items = ord.getOrder_items();

				for(Order_Items oi : ord_items){
					oi.setStatus("SELECTED_FOR_PICKUP");
					orderItemsRepository.saveAndFlush(oi);
				}
				orderRepository.saveAndFlush(ord);
			}
			String message = EmailUtility.ordernotification(orders.get());
			emailService.sendEmail(order.getBuyerId().getEmail(), message, " Order Placed with order id :"+order.getOrderid());

		}else{

			String message = EmailUtility.selfOrdernotification(order);
			emailService.sendEmail(order.getBuyerId().getEmail(), message, " Order Placed with order id :"+order.getOrderid());

		}



		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(order);
	}

	public ResponseEntity<?> getorders(Long id) {
		System.out.println("inside getOrder : "+id);
		Optional<List<Order>> orders = orderRepository.findOrdersById(id);

		if(orders.isPresent())
		{
			System.out.println("Orders are present");
			return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(orders);
		}

		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("");

	}

	public ResponseEntity<?> getPastOrders(Long id) {
		System.out.println("inside getOrder : "+id);
		Optional<List<Order>> orders = orderRepository.findPastOrders(id,"DELIVERED");

		System.out.println(orders.get());
		if(orders.isPresent())
		{
			System.out.println("Orders are present");
			return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(orders);
		}

		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("");

	}

	public ResponseEntity<?> getPoolOrders(Long storeId, Long userId) {

		System.out.println("inside get Pool Orders : "+userId);
		Optional<User> user = userRepository.findById(userId);

		if(user.isPresent())
		{
			Pool pool = user.get().getPool();
			Optional<List<Order>> poolOrders = orderRepository.findPoolOrdersById( pool.getPoolId(), storeId, userId);

			if(poolOrders.isPresent())
			{
//				for (Order poolOrder : poolOrders.get()) {
//					System.out.println(poolOrder.getBuyerId().getScreenName());
//				}
				List<Order> poolorders = poolOrders.get();
				return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(poolorders);
			}

		}

		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("");
	}

	public ResponseEntity<?> deliveryIssue(Long itemId) {

		System.out.println("inside issue with delivery : "+itemId);
//		Optional<Order> order = orderRepository.findById(itemId);
		Optional<Order_Items> item = orderItemsRepository.findById(itemId);

		if(item.isPresent()){

			item.get().setStatus("NOT_DELIVERED");
			Order ord = item.get().getOrder();
			Pickup pickup = ord.getPickup();

			orderItemsRepository.saveAndFlush(item.get());

			String message = EmailUtility.notdeliverednotify(item.get().getId(),item.get().getProduct().getName());
			emailService.sendEmail(pickup.getPickupPerson().getEmail(), message, " Missing order item for Order id :"+item.get().getOrder().getOrderid());

			return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(item.get());
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Item with item id: " + itemId + " not found");
		}
	}

	public ResponseEntity<?> orderDelivered(Long orderId) {

		System.out.println("inside get Pool Orders : "+orderId);
		Optional<Order> order = orderRepository.findById(orderId);

		if(order.isPresent()){

			//Reduce the CC for buyerid
			Optional<User> deliveryUser  = userRepository.findById(order.get().getBuyerId().getID());
			int credit  = deliveryUser.get().getContributionCredit();
			credit = credit-1;
			deliveryUser.get().setContributionCredit(credit);
			userRepository.saveAndFlush(deliveryUser.get());

			//
			Optional<User> pooler  = userRepository.findById(order.get().getPickup().getPickupPerson().getID());
			int creditAdd  = pooler.get().getContributionCredit();
			creditAdd = creditAdd+1;
			pooler.get().setContributionCredit(creditAdd);
			userRepository.saveAndFlush(pooler.get());


			List<Order_Items>  order_items = order.get().getOrder_items();
			for(Order_Items oi : order_items){
				oi.setStatus("DELIVERED");
				orderItemsRepository.saveAndFlush(oi);
			}
			order.get().setStatus("DELIVERED");
			orderRepository.saveAndFlush(order.get());


			List<Order> pickupOrders = order.get().getPickup().getOrders();
			boolean pickupStat = true;
			for(Order ord: pickupOrders){
				if(!ord.getPickupOption().equals("self")){
					String message = EmailUtility.deliverynotification(ord.getOrderid());
					emailService.sendEmail(ord.getBuyerId().getEmail(), message, " Your Order has been Delivered");
				}
				if(!ord.getStatus().equals("DELIVERED")){
					pickupStat=false;
				}
			}
			if(pickupStat){
				Pickup pickUp =order.get().getPickup();
				pickUp.setStatus("DELIVERED");
				pickupRepository.saveAndFlush(pickUp);
			}


			return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(order.get());
		}else {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Order with orderID: " + orderId + " not found");
		}
	}


//	public ResponseEntity<?> getPickup(Long id) {
//		System.out.println("inside getOrder : "+id);
//		Optional<List<Order>> orders = orderRepository.findPastOrders(id,"DELIVERED");
//
//		System.out.println(orders.get());
//		if(orders.isPresent())
//		{
//			System.out.println("Orders are present");
//			return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body(orders);
//		}
//
//		return ResponseEntity.status(HttpStatus.OK).contentType(MediaType.APPLICATION_JSON).body("");
//
//	}

}