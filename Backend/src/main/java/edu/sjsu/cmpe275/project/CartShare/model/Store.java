package edu.sjsu.cmpe275.project.CartShare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.List;

@Entity
@Table (name = "stores")
@EntityListeners(AuditingEntityListener.class)
public class Store implements Serializable{
	
	 @Id
     @GeneratedValue(strategy=GenerationType.IDENTITY)
     @Column(name = "id", nullable = false)
     private long id;
	 
	 @Column(name = "name", nullable = false)
	 private String name;

	 @Embedded
	 private Address address;

	 @JsonIgnoreProperties({"store"})
	 @OneToMany(fetch = FetchType.EAGER, mappedBy = "store", orphanRemoval = true, cascade = CascadeType.PERSIST)
	 private List<Product> products;

	 @OneToMany(fetch = FetchType.LAZY, mappedBy = "store")
	 private List<Order> orders;
	 
	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}

	public List<Product> getProducts() {
		return products;
	}

	public void setProducts(List<Product> products) {
		this.products = products;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}


}
