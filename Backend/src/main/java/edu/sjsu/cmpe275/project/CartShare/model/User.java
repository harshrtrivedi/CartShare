package edu.sjsu.cmpe275.project.CartShare.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;
import javax.persistence.*;
import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;

@Entity
@JsonIgnoreProperties({ "pool" })
@Table(name = "users")
@EntityListeners(AuditingEntityListener.class)
public class User implements Serializable {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private long id;

	@Column(name = "screen_name", nullable = false, unique = true)
	private String screenName;

	@Column(name = "nick_name", nullable = false, unique = true)
	private String nickName;

	@Column(name = "email", nullable = false, unique = true)
	private String email;

	@Column(name = "password")
	private String password;

	@Column(name = "role")
	private String role;

	@Column(name = "request_status")
	private String requestStatus;

	@Column(name = "contribution_credit")
	private int contributionCredit;

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "pool_id")
	private Pool pool;

	@Column
	private Boolean oauthFlag;

	@Column
	private boolean verified;

	@OneToOne
	@JoinColumn(name = "reference", referencedColumnName = "screen_name")
	private User reference;

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "approver")
	private List<Request> requests = new ArrayList<>();

	@OneToMany(fetch = FetchType.LAZY, mappedBy = "pickupPerson")
	private List<Pickup> pickup_orders;

	@Embedded
	private Address address;

	public User() {
	}

	public User(String screenName, String nickName, String email, String password, String role, String requestStatus,
			int contributionCredit, Pool pool, User reference) {
		this.screenName = screenName;
		this.nickName = nickName;
		this.email = email;
		this.password = password;
		this.role = role;
		this.requestStatus = requestStatus;
		this.contributionCredit = contributionCredit;
		this.pool = pool;
		this.reference = reference;
	}

	public String getScreenName() {
		return screenName;
	}

	public void setScreenName(String screenName) {
		this.screenName = screenName;
	}

	public String getNickName() {
		return nickName;
	}

	public void setNickName(String nickName) {
		this.nickName = nickName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	public String getRole() {
		return role;
	}

	public void setRole(String role) {
		this.role = role;
	}

	public String getRequestStatus() {
		return requestStatus;
	}

	public void setRequestStatus(String requestStatus) {
		this.requestStatus = requestStatus;
	}

	public int getContributionCredit() {
		return contributionCredit;
	}

	public void setContributionCredit(int contributionCredit) {
		this.contributionCredit = contributionCredit;
	}

	public Pool getPool() {
		return pool;
	}

	public void setPool(Pool pool) {
		this.pool = pool;
	}

	public User getReference() {
		return reference;
	}

	public void setReference(User reference) {
		this.reference = reference;
	}

	public long getID() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public Boolean getOauthFlag() {
		return oauthFlag;
	}

	public void setOauthFlag(Boolean oauthFlag) {
		this.oauthFlag = oauthFlag;
	}

	public boolean isVerified() {
		return verified;
	}

	public void setVerified(boolean verified) {
		this.verified = verified;
	}

	public List<Request> getRequests() {
		return requests;
	}

	public void setRequests(List<Request> requests) {
		this.requests = requests;
	}

	public Address getAddress() {
		return address;
	}

	public void setAddress(Address address) {
		this.address = address;
	}
}
