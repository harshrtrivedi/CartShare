package edu.sjsu.cmpe275.project.CartShare.model;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.List;

@Entity
@Table (name = "pickup")
@EntityListeners(AuditingEntityListener.class)
public class Pickup {
	
	@Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private long id;


	@ManyToOne(fetch = FetchType.EAGER, optional=true)
//	@JsonIgnoreProperties({"products", "orders"})
	@JoinColumn(name="buyer_id")
	private User pickupPerson;

//	@OneToMany
//	@JoinColumn(name="pickup_id",nullable=true)
//	private List<Order> orders;

//	@OneToMany(fetch = FetchType.EAGER, mappedBy = "pickup", orphanRemoval = true, cascade = CascadeType.PERSIST)
	@OneToMany(fetch = FetchType.EAGER, mappedBy = "pickup")
	private List<Order> orders;
	
	@Column(name = "status", nullable = false)
	private String status;
	
	public Pickup()
	{		
	}

	public Pickup(User pickupPerson, List<Order> orders, String status) {
		super();
//		this.id = id;
		this.pickupPerson = pickupPerson;
		this.orders = orders;
		this.status = status;
	}

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public User getPickupPerson() {
		return pickupPerson;
	}

	public void setPickupPerson(User pickupPerson) {
		this.pickupPerson = pickupPerson;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}
	
	
	
}
