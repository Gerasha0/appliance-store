package com.epam.rd.autocode.assessment.appliances.model;

import jakarta.persistence.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
public class Orders {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "employee_id")
    private Employee employee;

    @NotNull(message = "Client is required")
    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "client_id", nullable = false)
    private Client client;

    @Valid
    @NotNull(message = "Order items are required")
    @Size(min = 1, message = "Order must contain at least one item")
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private Set<OrderRow> orderRowSet = new HashSet<>();

    @NotNull(message = "Approved status is required")
    @Column(nullable = false)
    private Boolean approved = false;

    // Helper method to add order row and maintain bidirectional relationship
    public void addOrderRow(OrderRow orderRow) {
        orderRowSet.add(orderRow);
        orderRow.setOrder(this);
    }

    // Helper method to remove order row and maintain bidirectional relationship
    public void removeOrderRow(OrderRow orderRow) {
        orderRowSet.remove(orderRow);
        orderRow.setOrder(null);
    }
}