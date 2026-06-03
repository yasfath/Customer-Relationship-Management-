package com.example.demo.entity;

import com.example.demo.Configuration.TenantContext;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.Filter;

@Entity
@Table(name = "segment_contacts")
@Data
public class SegmentContact  {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "segment_id")
    private Segment segment;

    @ManyToOne
    @JoinColumn(name = "contact_id")
    private Contact contact;

	public SegmentContact(Long id, Segment segment, Contact contact) {
		super();
		this.id = id;
		this.segment = segment;
		this.contact = contact;
	}

	@Column(name = "profile_id", nullable = false)
	private String profileId;

	@PrePersist
	public void prePersist() {
		this.profileId = TenantContext.getCurrentTenant();
	}
	public SegmentContact() {
		super();
		// TODO Auto-generated constructor stub
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public Segment getSegment() {
		return segment;
	}

	public void setSegment(Segment segment) {
		this.segment = segment;
	}

	public Contact getContact() {
		return contact;
	}

	public void setContact(Contact contact) {
		this.contact = contact;
	}
}
