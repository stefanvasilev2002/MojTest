//package com.finki.mojtest.model.mappers;
//
//import com.finki.mojtest.model.Metadata;
//import com.finki.mojtest.model.Question;
//import com.finki.mojtest.model.Test;
//import com.finki.mojtest.model.dtos.MetadataDTO;
//import org.mapstruct.IterableMapping;
//import org.mapstruct.Mapper;
//import org.mapstruct.Mapping;
//import org.mapstruct.Named;
//import org.mapstruct.factory.Mappers;
//
//import java.util.Collections;
//import java.util.List;
//import java.util.stream.Collectors;
//
//@Mapper(componentModel = "spring")
//public interface MetadataMapper {
//
//    MetadataMapper INSTANCE = Mappers.getMapper(MetadataMapper.class);
//
//    // Metadata to MetadataDTO mapping
//    @Mapping(target = "questionIds", source = "questions", qualifiedByName = "questionsToIds") // Map questions list to questionIds
//    @Mapping(target = "testIds", source = "tests", qualifiedByName = "testsToIds") // Map tests list to testIds
//    MetadataDTO metadataToMetadataDTO(Metadata metadata);
//
//    // MetadataDTO to Metadata mapping
//    @Mapping(target = "questions", ignore = true)  // Ignore the relationship when mapping back
//    @Mapping(target = "tests", ignore = true)
//    Metadata metadataDTOToMetadata(MetadataDTO metadataDTO);
//
//    // Mapping method to convert a list of Question entities to a list of Longs (question IDs)
//    @IterableMapping(elementTargetType = Long.class)
//    @Named("questionsToIds")
//    default List<Long> questionsToIds(List<Question> questions) {
//        if (questions == null) {
//            return Collections.emptyList();
//        }
//        return questions.stream()
//                .map(Question::getId) // Extract the ID from each Question
//                .collect(Collectors.toList());
//    }
//
//    // Mapping method to convert a list of Test entities to a list of Longs (test IDs)
//    @IterableMapping(elementTargetType = Long.class)
//    @Named("testsToIds")
//    default List<Long> testsToIds(List<Test> tests) {
//        if (tests == null) {
//            return Collections.emptyList();
//        }
//        return tests.stream()
//                .map(Test::getId) // Extract the ID from each Test
//                .collect(Collectors.toList());
//    }
//}
//
