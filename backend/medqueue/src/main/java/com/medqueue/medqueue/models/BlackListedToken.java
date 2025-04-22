package com.medqueue.medqueue.models;


import java.util.Date;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Builder;
import lombok.Data;

@Entity
@Table(name = "blackListedToken")
@Data
@Builder
public class BlackListedToken {

    @Id
    private String token;
    private Date expirationDate;

    public BlackListedToken() {}

    public BlackListedToken(String token, Date expirationDate) {
        this.token = token;
        this.expirationDate = expirationDate;
    }

    // Getters e setters
    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    public void setExpirationDate(Date expirationDate) {
        this.expirationDate = expirationDate;
    }
}

