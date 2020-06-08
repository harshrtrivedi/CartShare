package edu.sjsu.cmpe275.project.CartShare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
@Table(name = "orders")
@EntityListeners(AuditingEntityListener.class)
public class Order {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "orderid", nullable = false, unique = true)
	private long orderid;

	@ManyToOne
	@JoinColumn(name = "buyer_id", nullable = true)
	private User buyerId;

	@Column(name = "price", nullable = true)
	private float price;

	@Column(name = "pickup_option", nullable = true)
	private String pickupOption;

	@Column(name = "status", nullable = true)
	private String status;

	@OneToMany(cascade = CascadeType.ALL, fetch = FetchType.LAZY, mappedBy = "order")
	@JsonIgnoreProperties({ "order" })
	private List<Order_Items> order_items;

	@ManyToOne
	@JsonIgnoreProperties({ "orders" })
	@JoinColumn(name = "store_id", nullable = true)
	private Store store;

	@ManyToOne
	@JsonIgnoreProperties({ "orders" })
	@JoinColumn(name = "pool_id", nullable = true)
	private Pool pool;

	@Column(name = "delivery_address", nullable = true)
	private String deliveryAddress;
//
//	 @ManyToOne(mappedBy = "pickup_orders")
//	 private User pickupperson_Id;
	@ManyToOne
	@JsonIgnoreProperties({ "orders" })
	@JoinColumn(name = "pickup_id", nullable = true)
	private Pickup pickup;

	@Column(name = "ORDER_TIME")
	@Temporal(TemporalType.TIMESTAMP)
	private java.util.Date orderTime;

	public Order() {
	}

	public Order(long orderid, User buyerId, float price, String pickupOption, String status,
			List<Order_Items> order_items, Store store, Pool pool, String deliveryAddress, Date orderTime) {
		super();
		this.orderid = orderid;
		this.buyerId = buyerId;
		this.price = price;
		this.pickupOption = pickupOption;
		this.status = status;
		this.order_items = order_items;
		this.store = store;
		this.pool = pool;
		this.deliveryAddress = deliveryAddress;
		this.orderTime = orderTime;
	}

	public String getPickupOption() {
		return pickupOption;
	}

	public void setPickupOption(String pickupOption) {
		this.pickupOption = pickupOption;
	}

	public List<Order_Items> getOrder_items() {
		return order_items;
	}

	public void setOrder_items(List<Order_Items> order_items) {
		this.order_items = order_items;
	}

	public Pool getPool() {
		return pool;
	}

	public void setPool(Pool pool) {
		this.pool = pool;
	}

	public long getOrderid() {
		return orderid;
	}

	public void setOrderid(long orderid) {
		this.orderid = orderid;
	}

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}

	public User getBuyerId() {
		return buyerId;
	}

	public void setBuyerId(User buyerId) {
		this.buyerId = buyerId;
	}

	public float getPrice() {
		return price;
	}

	public void setPrice(float price) {
		this.price = price;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getDeliveryAddress() {
		return deliveryAddress;
	}

	public void setDeliveryAddress(String deliveryAddress) {
		this.deliveryAddress = deliveryAddress;
	}

	public java.util.Date getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(java.util.Date orderTime) {
		this.orderTime = orderTime;
	}

	public Pickup getPickup() {
		return pickup;
	}

	public void setPickup(Pickup pickup) {
		this.pickup = pickup;
	}

	// public void addOrderItem(Order_Items item)
	// {
	// order_items.add(item);
	// item.setOrder(this);
	// }
	//
	// public void removeOrderItem(Order_Items item)
	// {
	// order_items.remove(item);
	// item.setOrder(null);
	// }
	//

}
