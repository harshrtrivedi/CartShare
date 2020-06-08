package edu.sjsu.cmpe275.project.CartShare.model;

import org.json.JSONArray;
import org.json.JSONObject;

import javax.persistence.Embeddable;
import java.io.Serializable;
import javax.persistence.*;

@Embeddable
public class ProductId implements Serializable
{
	
	@Column(name="store_composit_id")
	private long storeId;
	
	@Column(name="sku")
	private long sku;
	
	public ProductId()
	{		
	}

	public ProductId(long storeId, long sku)
	{		
		this.storeId = storeId;
		this.sku = sku;
	}

	public long getStoreId() {
		return storeId;
	}

	public void setStoreId(long storeId) {
		this.storeId = storeId;
	}

	public long getSku() {
		return sku;
	}

	public void setSku(long sku) {
		this.sku = sku;
	}




}
