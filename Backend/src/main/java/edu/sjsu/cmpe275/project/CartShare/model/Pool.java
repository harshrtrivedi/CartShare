package edu.sjsu.cmpe275.project.CartShare.model;

import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pool")
@EntityListeners(AuditingEntityListener.class)
public class Pool implements Serializable {

	@Id
	@Column(name = "poolid", nullable = false)
	private String poolId;

	@Column(name = "name", nullable = false)
	private String name;

	@Column(name = "neighbourhood", nullable = false)
	private String neighbourhood;

	@Column(name = "description", nullable = false)
	private String description;

	@Column(name = "zipcode", nullable = false)
	private int zipcode;

	@OneToOne
	@JoinColumn(name = "pool_leader", referencedColumnName = "id")
	private User poolLeader;

	// @OneToMany(cascade = CascadeType.ALL)
	// @JoinColumn(name="order")
	// private List<Order> orders;
	//

	@OneToMany(fetch = FetchType.EAGER, mappedBy = "pool")
	private List<Order> orders;

	@OneToMany(fetch = FetchType.EAGER, mappedBy = "pool")
	private List<User> poolers = new ArrayList<>();

	public Pool() {

	}

	public Pool(String poolId, String name, String neighbourhood, String description, int zipcode, User poolLeader,
			List<Order> orders, List<User> poolers) {
		super();
		this.poolId = poolId;
		this.name = name;
		this.neighbourhood = neighbourhood;
		this.description = description;
		this.zipcode = zipcode;
		this.poolLeader = poolLeader;
		this.orders = orders;
		this.poolers = poolers;
	}

	public String getPoolId() {
		return poolId;
	}

	public void setPoolId(String poolId) {
		this.poolId = poolId;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getNeighbourhood() {
		return neighbourhood;
	}

	public void setNeighbourhood(String neighbourhood) {
		this.neighbourhood = neighbourhood;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public int getZipcode() {
		return zipcode;
	}

	public void setZipcode(int zipcode) {
		this.zipcode = zipcode;
	}

	public User getPoolLeader() {
		return poolLeader;
	}

	public void setPoolLeader(User poolLeader) {
		this.poolLeader = poolLeader;
	}

	public List<Order> getOrders() {
		return orders;
	}

	public void setOrders(List<Order> orders) {
		this.orders = orders;
	}

	public List<User> getPoolers() {
		return poolers;
	}

	public void setPoolers(List<User> poolers) {
		this.poolers = poolers;
	}

}
