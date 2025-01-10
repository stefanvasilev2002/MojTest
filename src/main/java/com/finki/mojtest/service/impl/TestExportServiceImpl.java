package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.service.TestExportService;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.element.Text;
import com.itextpdf.layout.properties.TextAlignment;
import org.apache.poi.xwpf.usermodel.*;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class TestExportServiceImpl implements TestExportService {

    private static final int TITLE_FONT_SIZE = 20;
    private static final int HEADER_FONT_SIZE = 14;
    private static final int NORMAL_FONT_SIZE = 12;
    private static final int MARGIN_BOTTOM = 20;
    private static final int ANSWER_INDENT = 20;

    @Override
    public ByteArrayResource generatePDF(Test test) {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {
            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            addPDFHeader(document, test);
            addPDFInstructions(document, test);
            addPDFQuestions(document, test);
            addPDFFooter(document);

            document.close();
            return new ByteArrayResource(baos.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF", e);
        }
    }

    private void addPDFHeader(Document document, Test test) {
        // Add title
        document.add(new Paragraph(test.getTitle())
                .setFontSize(TITLE_FONT_SIZE)
                .setBold()
                .setTextAlignment(TextAlignment.CENTER)
                .setMarginBottom(MARGIN_BOTTOM));

        // Add test description if exists
        if (test.getDescription() != null && !test.getDescription().isEmpty()) {
            document.add(new Paragraph(test.getDescription())
                    .setFontSize(NORMAL_FONT_SIZE)
                    .setItalic()
                    .setMarginBottom(10));
        }

        // Add test metadata
        Paragraph metadata = new Paragraph()
                .setFontSize(NORMAL_FONT_SIZE)
                .setMarginBottom(MARGIN_BOTTOM);

        metadata.add(new Text("Time limit: " + test.getTimeLimit() + " minutes\n"));
        metadata.add(new Text("Total points: " + calculateTotalPoints(test) + "\n"));
        metadata.add(new Text("Number of questions: " + test.getNumQuestions()));

        document.add(metadata);
    }

    private void addPDFInstructions(Document document, Test test) {
        document.add(new Paragraph("Instructions:")
                .setFontSize(HEADER_FONT_SIZE)
                .setBold()
                .setMarginBottom(10));

        Paragraph instructions = new Paragraph()
                .setFontSize(NORMAL_FONT_SIZE)
                .setMarginBottom(MARGIN_BOTTOM);

        instructions.add("- Read each question carefully before answering\n");
        instructions.add("- Multiple choice questions: Select the best answer\n");
        instructions.add("- True/False questions: Mark your choice clearly\n");
        instructions.add("- Fill-in-the-blank: Write your answer in the space provided\n");
        if (hasNegativePoints(test)) {
            instructions.add("- Note: Some questions may have negative points for incorrect answers\n");
        }

        document.add(instructions);
    }

    private void addPDFQuestions(Document document, Test test) {
        for (int i = 0; i < test.getQuestionBank().size(); i++) {
            Question question = test.getQuestionBank().get(i);

            // Add question text with points
            String questionText = String.format("%d. %s [%d points]",
                    (i + 1), question.getDescription(), question.getPoints());
            if (question.getNegativePointsPerAnswer() > 0) {
                questionText += String.format(" [-%d points per wrong answer]",
                        question.getNegativePointsPerAnswer());
            }

            document.add(new Paragraph(questionText)
                    .setFontSize(NORMAL_FONT_SIZE)
                    .setMarginBottom(5));

            // Add hint if exists
            if (question.getHint() != null && !question.getHint().isEmpty()) {
                document.add(new Paragraph("Hint: " + question.getHint())
                        .setFontSize(NORMAL_FONT_SIZE)
                        .setItalic()
                        .setFontColor(ColorConstants.GRAY)
                        .setMarginLeft(ANSWER_INDENT)
                        .setMarginBottom(5));
            }

            addPDFAnswers(document, question);
        }
    }

    private void addPDFAnswers(Document document, Question question) {
        switch (question.getQuestionType()) {
            case MULTIPLE_CHOICE -> {
                for (Answer answer : question.getAnswers()) {
                    document.add(new Paragraph("□ " + answer.getAnswerText())
                            .setMarginLeft(ANSWER_INDENT)
                            .setMarginBottom(2));
                }
            }
            case TRUE_FALSE -> {
                document.add(new Paragraph("□ True")
                        .setMarginLeft(ANSWER_INDENT));
                document.add(new Paragraph("□ False")
                        .setMarginLeft(ANSWER_INDENT));
            }
            case NUMERIC -> {
                if (question.getFormula() != null && !question.getFormula().isEmpty()) {
                    document.add(new Paragraph("Formula: " + question.getFormula())
                            .setMarginLeft(ANSWER_INDENT)
                            .setItalic());
                }
                document.add(new Paragraph("Answer: _________________")
                        .setMarginLeft(ANSWER_INDENT));
            }
            case ESSAY -> {
                document.add(new Paragraph("Answer:")
                        .setMarginLeft(ANSWER_INDENT));
                // Add multiple lines for essay response
                for (int i = 0; i < 5; i++) {
                    document.add(new Paragraph("_________________________________")
                            .setMarginLeft(ANSWER_INDENT));
                }
            }
            default -> document.add(new Paragraph("Answer: _________________")
                    .setMarginLeft(ANSWER_INDENT));
        }
        document.add(new Paragraph().setMarginBottom(10));
    }

    private void addPDFFooter(Document document) {
        document.add(new Paragraph("Generated on: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")))
                .setFontSize(10)
                .setTextAlignment(TextAlignment.RIGHT)
                .setMarginTop(MARGIN_BOTTOM));
    }

    @Override
    public ByteArrayResource generateWord(Test test) {
        try (XWPFDocument document = new XWPFDocument()) {
            addWordHeader(document, test);
            addWordInstructions(document);
            addWordQuestions(document, test);
            addWordFooter(document);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.write(baos);
            return new ByteArrayResource(baos.toByteArray());
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Word document", e);
        }
    }

    private void addWordHeader(XWPFDocument document, Test test) {
        // Add title
        XWPFParagraph titleParagraph = document.createParagraph();
        titleParagraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = titleParagraph.createRun();
        titleRun.setText(test.getTitle());
        titleRun.setBold(true);
        titleRun.setFontSize(16);
        titleRun.addBreak();

        // Add description if exists
        if (test.getDescription() != null && !test.getDescription().isEmpty()) {
            XWPFParagraph descParagraph = document.createParagraph();
            XWPFRun descRun = descParagraph.createRun();
            descRun.setText(test.getDescription());
            descRun.setItalic(true);
            descRun.addBreak();
        }

        // Add metadata
        XWPFParagraph metadataParagraph = document.createParagraph();
        XWPFRun metadataRun = metadataParagraph.createRun();
        metadataRun.setText("Time limit: " + test.getTimeLimit() + " minutes");
        metadataRun.addBreak();
        metadataRun.setText("Total points: " + calculateTotalPoints(test));
        metadataRun.addBreak();
        metadataRun.setText("Number of questions: " + test.getNumQuestions());
        metadataRun.addBreak();
        metadataRun.addBreak();
    }

    private void addWordInstructions(XWPFDocument document) {
        XWPFParagraph instructionsParagraph = document.createParagraph();
        XWPFRun instructionsRun = instructionsParagraph.createRun();
        instructionsRun.setText("Instructions:");
        instructionsRun.setBold(true);
        instructionsRun.addBreak();

        String[] instructions = {
                "- Read each question carefully before answering",
                "- Multiple choice questions: Select the best answer",
                "- True/False questions: Mark your choice clearly",
                "- Fill-in-the-blank: Write your answer in the space provided"
        };

        for (String instruction : instructions) {
            instructionsRun.setText(instruction);
            instructionsRun.addBreak();
        }
        instructionsRun.addBreak();
    }

    private void addWordQuestions(XWPFDocument document, Test test) {
        for (int i = 0; i < test.getQuestionBank().size(); i++) {
            Question question = test.getQuestionBank().get(i);

            XWPFParagraph questionParagraph = document.createParagraph();
            XWPFRun questionRun = questionParagraph.createRun();

            // Add question text with points
            String questionText = String.format("%d. %s [%d points]",
                    (i + 1), question.getDescription(), question.getPoints());
            if (question.getNegativePointsPerAnswer() > 0) {
                questionText += String.format(" [-%d points per wrong answer]",
                        question.getNegativePointsPerAnswer());
            }
            questionRun.setText(questionText);

            // Add hint if exists
            if (question.getHint() != null && !question.getHint().isEmpty()) {
                XWPFParagraph hintParagraph = document.createParagraph();
                hintParagraph.setIndentationLeft(720);
                XWPFRun hintRun = hintParagraph.createRun();
                hintRun.setText("Hint: " + question.getHint());
                hintRun.setItalic(true);
                hintRun.setColor("808080");
            }

            addWordAnswers(document, question);
        }
    }

    private void addWordAnswers(XWPFDocument document, Question question) {
        switch (question.getQuestionType()) {
            case MULTIPLE_CHOICE -> {
                for (Answer answer : question.getAnswers()) {
                    XWPFParagraph answerParagraph = document.createParagraph();
                    answerParagraph.setIndentationLeft(720);
                    XWPFRun answerRun = answerParagraph.createRun();
                    answerRun.setText("□ " + answer.getAnswerText());
                }
            }
            case TRUE_FALSE -> {
                XWPFParagraph trueParagraph = document.createParagraph();
                trueParagraph.setIndentationLeft(720);
                trueParagraph.createRun().setText("□ True");

                XWPFParagraph falseParagraph = document.createParagraph();
                falseParagraph.setIndentationLeft(720);
                falseParagraph.createRun().setText("□ False");
            }
            case NUMERIC -> {
                if (question.getFormula() != null && !question.getFormula().isEmpty()) {
                    XWPFParagraph formulaParagraph = document.createParagraph();
                    formulaParagraph.setIndentationLeft(720);
                    XWPFRun formulaRun = formulaParagraph.createRun();
                    formulaRun.setText("Formula: " + question.getFormula());
                    formulaRun.setItalic(true);
                }
                XWPFParagraph answerParagraph = document.createParagraph();
                answerParagraph.setIndentationLeft(720);
                answerParagraph.createRun().setText("Answer: _________________");
            }
            case ESSAY -> {
                XWPFParagraph labelParagraph = document.createParagraph();
                labelParagraph.setIndentationLeft(720);
                labelParagraph.createRun().setText("Answer:");

                // Add multiple lines for essay response
                for (int i = 0; i < 5; i++) {
                    XWPFParagraph lineParagraph = document.createParagraph();
                    lineParagraph.setIndentationLeft(720);
                    lineParagraph.createRun().setText("_________________________________");
                }
            }
            default -> {
                XWPFParagraph answerParagraph = document.createParagraph();
                answerParagraph.setIndentationLeft(720);
                answerParagraph.createRun().setText("Answer: _________________");
            }
        }
        // Add spacing after question
        XWPFParagraph spacingParagraph = document.createParagraph();
        spacingParagraph.createRun().addBreak();
    }

    private void addWordFooter(XWPFDocument document) {
        XWPFParagraph footerParagraph = document.createParagraph();
        footerParagraph.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun footerRun = footerParagraph.createRun();
        footerRun.setText("Generated on: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        footerRun.setFontSize(10);
    }

    private int calculateTotalPoints(Test test) {
        return test.getQuestionBank().stream()
                .mapToInt(Question::getPoints)
                .sum();
    }

    private boolean hasNegativePoints(Test test) {
        return test.getQuestionBank().stream()
                .anyMatch(q -> q.getNegativePointsPerAnswer() > 0);
    }
}