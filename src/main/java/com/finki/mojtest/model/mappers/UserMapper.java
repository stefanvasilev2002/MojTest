package com.finki.mojtest.model.mappers;

import com.finki.mojtest.model.dtos.UserDTO;
import com.finki.mojtest.model.users.User;

import org.mapstruct.Mapper;
import org.mapstruct.factory.Mappers;


@Mapper(componentModel = "spring")
public interface UserMapper {

    UserMapper INSTANCE = Mappers.getMapper(UserMapper.class);

    UserDTO userToUserDTO(User user);

    User userDTOToUser(UserDTO userDTO);
}
