//package com.finki.mojtest.model.mappers;
//
//import com.finki.mojtest.model.dtos.UserDTO;
//import com.finki.mojtest.model.users.User;
//
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.factory.Mappers;
//
//
//@Mapper(componentModel = "spring")
//public interface UserMapper {
//
//    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);
//
//    // MapStruct will generate the implementation automatically for this method
//
//    UserDTO userToUserDTO(User user);
//
//
//    User userDTOToUser(UserDTO userDTO);
//}
