package edu.sjsu.cmpe275.project.CartShare.model;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;

@Entity
@Table (name = "order_items")
@EntityListeners(AuditingEntityListener.class)
public class Order_Items {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	@Column(name = "id", nullable = false, unique = true)    
	private long id;	
	
	@ManyToOne
	@JoinColumn(name="orderid",nullable=true)
	private Order order;
	
	@OneToOne
	@JoinColumns({
			@JoinColumn(name="store_composit_id",  referencedColumnName="store_composit_id"),
			@JoinColumn(name="sku",  referencedColumnName="sku")
	})
	private Product product;

//	@JoinColumns({
//		@JoinColumn(name="product_id",referencedColumnName = "store_id"),
//		@JoinColumn(name="product_sku",referencedColumnName = "sku")
//	})

	
	@Column(name = "quantity", nullable = true)
    private int quantity;

	@Column(name = "price", nullable = true)
    private float price;

	@Column(name = "status", nullable = true)
    private String status;

	@Column(name = "order_time")
	@Temporal(TemporalType.TIMESTAMP)
    private java.util.Date orderTime;
	
	public Order_Items()
	{
		
	}	

	public Order_Items(long id, Order order, Product product, int quantity, float price, String status,
			Date orderTime) {
		super();
		this.id = id;
		this.order = order;
		this.product = product;
		this.quantity = quantity;
		this.price = price;
		this.status = status;
		this.orderTime = orderTime;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Order getOrder() {
		return order;
	}

	public void setOrder(Order order) {
		this.order = order;
	}

	public Product getProduct() {
		return product;
	}

	public void setProduct(Product product) {
		this.product = product;
	}

	public int getQuantity() {
		return quantity;
	}

	public void setQuantity(int quantity) {
		this.quantity = quantity;
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

	public java.util.Date getOrderTime() {
		return orderTime;
	}

	public void setOrderTime(java.util.Date orderTime) {
		this.orderTime = orderTime;
	}

	@Override
	public String toString() {
		return "Order_Items [id=" + id + " , itemName=" + product.getName() + ", itemimage=" + product.getImageurl() + ", quantity=" + quantity
				+ ", price=" + price + "]";
	}
	
	 @Override
	    public boolean equals(Object o) {
	        if (this == o)
	            return true;
	             
	        if (!(o instanceof Order))
	            return false;
	             
	        return
	        		
	            (id != 0L) && id == (((Order_Items) o).getId());
	    }
	 
	    @Override
	    public int hashCode() {
	        return 31;
	    }
	
	
	

}
