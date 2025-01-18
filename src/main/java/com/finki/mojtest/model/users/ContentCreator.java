package com.finki.mojtest.model.users;

import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;

import java.util.List;

public interface ContentCreator {
    Long getId();
    List<Test> getCreatedTests();
    List<Question> getCreatedQuestions();
    void setCreatedTests(List<Test> tests);
    void setCreatedQuestions(List<Question> questions);
}