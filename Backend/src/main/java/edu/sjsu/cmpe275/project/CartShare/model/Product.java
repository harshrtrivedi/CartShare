package edu.sjsu.cmpe275.project.CartShare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import javax.persistence.*;
import java.io.Serializable;
import java.util.Optional;

@Entity
@Table (name = "product")
@EntityListeners(AuditingEntityListener.class)
public class Product implements Serializable{

	@EmbeddedId
	private ProductId id;
	
	@Column(name = "name", nullable = false)
	 private String name;
	
	@Column(name = "description", nullable = false)
	 private String description;

	@Column(name = "imageurl", nullable = false)
	 private String imageurl;

	@Column(name = "brand", nullable = false)
	 private String brand;
	
	@Column(name = "unit", nullable = false)
	 private String unit;
	
	@Column(name = "price", nullable = false)
	 private double price;
	
	//Seperate field needed or can we reuse the storeId present in this model
	@ManyToOne(fetch = FetchType.EAGER, optional=true)
	@JsonIgnoreProperties({"products", "orders"})
	@JoinColumn(name="store_id")
	private Store store;


//	public long getStoreId() {
//		return storeId;
//	}
//
//	public void setStoreId(long storeId) {
//		this.storeId = storeId;
//	}
//
//	public long getSku() {
//		return sku;
//	}
//
//	public void setSku(long sku) {
//		this.sku = sku;
//	}
	
	public Product()
	{
	}

	public Product(ProductId id, String name, String description, String imageurl, String brand, String unit,
				   double price, Store store) {
		this.id = id;
		this.name = name;
		this.description = description;
		this.imageurl = imageurl;
		this.brand = brand;
		this.unit = unit;
		this.price = price;
		this.setStore(store);
	}	
	
	public String toString(){
		try{

			String info = "";
			JSONObject jsonInfo = new JSONObject();
			jsonInfo.put("StoreId",this.id.getStoreId());
			jsonInfo.put("sku", this.id.getSku());
			jsonInfo.put("name", this.name);
			jsonInfo.put("description", this.description);
			jsonInfo.put("price", this.price);
			jsonInfo.put("brand", this.brand);
			jsonInfo.put("imageurl", this.imageurl);
			jsonInfo.put("store", this.getStore());
			jsonInfo.put("unit", this.unit);
			JSONArray orders = new JSONArray();
//		if(this.orderDetails != null){
//			this.orderDetails.forEach(order->{
//				JSONObject orderInfo = new JSONObject();
//				orderInfo.put("orderId-" + order.getOrderId() , order);
//				orders.put(orderInfo);
//			});
//		}

			info = jsonInfo.toString();
			return info;

		}catch(Exception e){
			System.out.println(e.toString());
			return e.toString();
		}
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}
	
	public String getImageurl() {
		return imageurl;
	}

	public void setImageurl(String imageurl) {
		this.imageurl = imageurl;
	}

	public String getBrand() {
		return brand;
	}

	public void setBrand(String brand) {
		this.brand = brand;
	}	
	
	public String getUnit() {
		return unit;
	}

	public void setUnit(String unit) {
		this.unit = unit;
	}

	public double getPrice() {
		return price;
	}

	public void setPrice(double price) {
		this.price = price;
	}	
	
//	public Store getStore() {
//		return store;
//	}
//
//	public void setStore(Store store) {
//		this.store = store;
//	}

	public ProductId getId() {
		return id;
	}

	public void setId(ProductId id) {
		this.id = id;
	}

	public Store getStore() {
		return store;
	}

	public void setStore(Store store) {
		this.store = store;
	}
}
