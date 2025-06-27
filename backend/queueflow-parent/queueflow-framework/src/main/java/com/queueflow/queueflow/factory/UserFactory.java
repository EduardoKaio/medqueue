package com.queueflow.queueflow.factory;

import com.queueflow.queueflow.dto.UserDTO;
import com.queueflow.queueflow.models.User;

public interface UserFactory {
    UserDTO toDTO(User user);
    User fromDTO(UserDTO dto);
    void updateFromDTO(UserDTO dto, User user);
}
