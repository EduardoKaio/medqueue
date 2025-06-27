//package com.queueflow.queueflow.mapper;
//
//import com.queueflow.queueflow.models.User;
//import org.modelmapper.ModelMapper;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//
//import com.queueflow.queueflow.dto.UserDTO;
//import com.queueflow.queueflow.models.User;
//
//
//@Service
//public class UserMapper {
//
//    @Autowired
//    private ModelMapper modelMapper;
//
//    public UserDTO toDTO(User user) {
//        return modelMapper.map(user, UserDTO.class);
//    }
//
//    public User toEntity(UserDTO userDTO) {
//        return modelMapper.map(userDTO, User.class);
//    }
//}
