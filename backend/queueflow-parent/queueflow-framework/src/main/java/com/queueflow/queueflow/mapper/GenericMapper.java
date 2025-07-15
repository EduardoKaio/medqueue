package com.queueflow.queueflow.mapper;

public interface GenericMapper<E, D> {
    D toDTO(E entity);
}
