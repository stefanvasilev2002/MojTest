package com.finki.mojtest.service.impl;

import com.finki.mojtest.model.Answer;
import com.finki.mojtest.model.File;
import com.finki.mojtest.model.Question;
import com.finki.mojtest.model.Test;
import com.finki.mojtest.service.FileStorageService;
import com.finki.mojtest.service.TestExportService;
import com.itextpdf.io.font.PdfEncodings;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.element.Paragraph;
import com.itextpdf.layout.properties.TextAlignment;
import org.apache.poi.util.IOUtils;
import org.apache.poi.util.Units;
import org.apache.poi.xwpf.usermodel.*;
import org.scilab.forge.jlatexmath.TeXConstants;
import org.scilab.forge.jlatexmath.TeXFormula;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.imageio.ImageIO;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Service
public class TestExportServiceImpl implements TestExportService {

    private static final String FONT_PATH = "classpath:fonts/FreeSans.ttf";
    private static final String CHECKBOX = "▢";
    private static final float TITLE_SIZE = 20f;
    private static final float HEADER_SIZE = 14f;
    private static final float NORMAL_SIZE = 12f;
    private static final float SMALL_SIZE = 10f;
    private static final int INDENT = 40;

    private final FileStorageService fileStorageService;

    @Autowired
    private ResourceLoader resourceLoader;

    public TestExportServiceImpl(FileStorageService fileStorageService) {
        this.fileStorageService = fileStorageService;
    }

    private PdfFont loadUnicodeFont() throws IOException {
        try {
            Resource fontResource = resourceLoader.getResource(FONT_PATH);
            return PdfFontFactory.createFont(
                    IOUtils.toByteArray(fontResource.getInputStream()),
                    PdfEncodings.IDENTITY_H
            );
        } catch (Exception e) {
            throw new IOException("Failed to load font from classpath. Make sure FreeSans.ttf is in the resources/fonts directory", e);
        }
    }

    @Override
    public ResponseEntity<ByteArrayResource> generatePDF(Test test) {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfDocument pdf = null;
        Document document = null;

        try {
            PdfWriter writer = new PdfWriter(baos);
            pdf = new PdfDocument(writer);
            document = new Document(pdf);

            // Load font when needed
            PdfFont unicodeFont = loadUnicodeFont();

            addPDFHeader(document, test, unicodeFont);
            addPDFInstructions(document, unicodeFont);
            addPDFQuestions(document, test, unicodeFont);
            addPDFFooter(document, unicodeFont);

            document.close();
            pdf.close();

            ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());
            return buildResponse(resource, test.getTitle(), "pdf");
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate PDF: " + e.getMessage(), e);
        } finally {
            try {
                if (document != null) {
                    document.close();
                }
                if (pdf != null) {
                    pdf.close();
                }
                baos.close();
            } catch (IOException e) {
                System.err.println("Error closing resources: " + e.getMessage());
            }
        }
    }

    private void addPDFHeader(Document document, Test test, PdfFont font) {
        try {
            document.add(new Paragraph(test.getTitle())
                    .setFont(font)
                    .setFontSize(TITLE_SIZE)
                    .setBold()
                    .setTextAlignment(TextAlignment.CENTER)
                    .setMarginBottom(20));

            if (test.getDescription() != null && !test.getDescription().isEmpty()) {
                document.add(new Paragraph(test.getDescription())
                        .setFont(font)
                        .setFontSize(NORMAL_SIZE)
                        .setItalic()
                        .setMarginBottom(10));
            }

            document.add(new Paragraph()
                    .setFont(font)
                    .setFontSize(NORMAL_SIZE)
                    .add("Времетраење: " + test.getTimeLimit() + " минути")
                    .setMarginBottom(5));

            document.add(new Paragraph()
                    .setFont(font)
                    .setFontSize(NORMAL_SIZE)
                    .add("Вкупно поени: " + calculateTotalPoints(test))
                    .setMarginBottom(20));
        } catch (Exception e) {
            throw new RuntimeException("Failed to add PDF header", e);
        }
    }

    private void addPDFInstructions(Document document, PdfFont font) {
        try {
            document.add(new Paragraph("Инструкции:")
                    .setFont(font)
                    .setFontSize(HEADER_SIZE)
                    .setBold()
                    .setMarginBottom(10));

            String[] instructions = {
                    "• Внимателно прочитајте го секое прашање",
                    "• За прашања со повеќе избори: Одберете ЕДЕН точен одговор",
                    "• За точно/неточно прашања: Означете ја вашата одлука",
                    "• За нумерички прашања: Запишете го одговорот во дадениот простор"
            };

            for (String instruction : instructions) {
                document.add(new Paragraph(instruction)
                        .setFont(font)
                        .setFontSize(NORMAL_SIZE)
                        .setMarginLeft(INDENT)
                        .setMarginBottom(5));
            }
            document.add(new Paragraph().setMarginBottom(20));
        } catch (Exception e) {
            throw new RuntimeException("Failed to add PDF instructions", e);
        }
    }

    private void addPDFQuestions(Document document, Test test, PdfFont font) {
        try {
            int questionNum = 1;
            for (Question question : test.getQuestionBank()) {
                String questionText = String.format("%d. %s", questionNum++, question.getDescription());
                Paragraph questionParagraph = new Paragraph(questionText)
                        .setFont(font)
                        .setFontSize(NORMAL_SIZE)
                        .setMarginBottom(10);

                String pointsText = String.format(" [%d поени]", question.getPoints());
                if (question.getNegativePointsPerAnswer() > 0) {
                    pointsText += String.format(" [-%d за неточен одговор]",
                            question.getNegativePointsPerAnswer());
                }
                questionParagraph.add(pointsText);
                document.add(questionParagraph);

                // Add question image if present
                if (question.getImage() != null) {
                    addPDFImage(document, question.getImage());
                }

                // Add formula if present
                if (question.getFormula() != null && !question.getFormula().isEmpty()) {
                    try {
                        addPDFFormula(document, question.getFormula(), font);
                    } catch (Exception e) {
                        // Fallback to text if formula rendering fails
                        document.add(new Paragraph("Formula: " + question.getFormula())
                                .setFont(font)
                                .setFontSize(NORMAL_SIZE)
                                .setItalic()
                                .setMarginLeft(INDENT));
                    }
                }

                addPDFAnswers(document, question, font);
                document.add(new Paragraph().setMarginBottom(15));
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to add PDF questions", e);
        }
    }

    private void addPDFImage(Document document, File imageFile) {
        try {
            Resource imageResource = fileStorageService.loadFileAsResource(imageFile.getFileName());
            byte[] imageData = imageResource.getContentAsByteArray();

            ImageData imgData = ImageDataFactory.create(imageData);
            Image pdfImage = new Image(imgData)
                    .setMarginLeft(INDENT)
                    .setMarginBottom(10)
                    .scaleToFit(400, 300);

            document.add(pdfImage);
        } catch (Exception e) {
            System.err.println("Failed to add image: " + e.getMessage());
        }
    }

    private void addPDFFormula(Document document, String formula, PdfFont font) {
        try {
            TeXFormula texFormula = new TeXFormula(formula);
            BufferedImage image = (BufferedImage) texFormula.createBufferedImage(TeXConstants.STYLE_DISPLAY,
                    16, Color.BLACK, Color.WHITE);

            ByteArrayOutputStream imgBytes = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", imgBytes);

            ImageData imgData = ImageDataFactory.create(imgBytes.toByteArray());
            Image pdfImage = new Image(imgData)
                    .setMarginLeft(INDENT)
                    .setMarginBottom(10)
                    .scaleToFit(300, 100);

            document.add(pdfImage);
            imgBytes.close();
        } catch (Exception e) {
            System.err.println("Failed to add formula: " + e.getMessage());
            try {
                document.add(new Paragraph("Formula: " + formula)
                        .setFont(font)
                        .setFontSize(NORMAL_SIZE)
                        .setItalic()
                        .setMarginLeft(INDENT));
            } catch (Exception ex) {
                System.err.println("Failed to add formula fallback text: " + ex.getMessage());
            }
        }
    }

    private void addPDFAnswers(Document document, Question question, PdfFont font) {
        try {
            switch (question.getQuestionType()) {
                case MULTIPLE_CHOICE -> {
                    for (Answer answer : question.getAnswers()) {
                        document.add(new Paragraph(CHECKBOX + " " + answer.getAnswerText())
                                .setFont(font)
                                .setFontSize(NORMAL_SIZE)
                                .setMarginLeft(INDENT)
                                .setMarginBottom(5));
                    }
                }
                case TRUE_FALSE -> {
                    document.add(new Paragraph(CHECKBOX + " Точно")
                            .setFont(font)
                            .setFontSize(NORMAL_SIZE)
                            .setMarginLeft(INDENT));
                    document.add(new Paragraph(CHECKBOX + " Неточно")
                            .setFont(font)
                            .setFontSize(NORMAL_SIZE)
                            .setMarginLeft(INDENT));
                }
                case NUMERIC -> {
                    document.add(new Paragraph("Одговор: ________________________")
                            .setFont(font)
                            .setFontSize(NORMAL_SIZE)
                            .setMarginLeft(INDENT));
                }
                case ESSAY -> {
                    document.add(new Paragraph("Одговор:")
                            .setFont(font)
                            .setFontSize(NORMAL_SIZE)
                            .setMarginLeft(INDENT));
                    for (int i = 0; i < 5; i++) {
                        document.add(new Paragraph("_________________________________")
                                .setFont(font)
                                .setMarginLeft(INDENT)
                                .setMarginBottom(10));
                    }
                }
                case FILL_IN_THE_BLANK -> {
                    document.add(new Paragraph("Празно место: ________________________")
                            .setFont(font)
                            .setFontSize(NORMAL_SIZE)
                            .setMarginLeft(INDENT));
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to add PDF answers", e);
        }
    }

    private void addPDFFooter(Document document, PdfFont font) {
        try {
            document.add(new Paragraph()
                    .setFont(font)
                    .setFontSize(SMALL_SIZE)
                    .setTextAlignment(TextAlignment.RIGHT)
                    .add("Генерирано на: " +
                            LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm"))));
        } catch (Exception e) {
            throw new RuntimeException("Failed to add PDF footer", e);
        }
    }

    @Override
    public ResponseEntity<ByteArrayResource> generateWord(Test test) {
        try (XWPFDocument document = new XWPFDocument()) {
            addWordHeader(document, test);
            addWordInstructions(document);
            addWordQuestions(document, test);
            addWordFooter(document);

            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            document.write(baos);
            ByteArrayResource resource = new ByteArrayResource(baos.toByteArray());

            return buildResponse(resource, test.getTitle(), "docx");
        } catch (Exception e) {
            throw new RuntimeException("Failed to generate Word document", e);
        }
    }

    private void addWordHeader(XWPFDocument document, Test test) {
        XWPFParagraph titleParagraph = document.createParagraph();
        titleParagraph.setAlignment(ParagraphAlignment.CENTER);
        XWPFRun titleRun = titleParagraph.createRun();
        titleRun.setText(test.getTitle());
        titleRun.setBold(true);
        titleRun.setFontSize((int) TITLE_SIZE);
        titleRun.setFontFamily("Arial");
        titleRun.addBreak();

        if (test.getDescription() != null && !test.getDescription().isEmpty()) {
            XWPFParagraph descParagraph = document.createParagraph();
            XWPFRun descRun = descParagraph.createRun();
            descRun.setText(test.getDescription());
            descRun.setItalic(true);
            descRun.addBreak();
        }

        XWPFParagraph metaParagraph = document.createParagraph();
        XWPFRun metaRun = metaParagraph.createRun();
        metaRun.setText("Времетраење: " + test.getTimeLimit() + " минути");
        metaRun.addBreak();
        metaRun.setText("Вкупно поени: " + calculateTotalPoints(test));
        metaRun.addBreak();
        metaRun.addBreak();
    }

    private void addWordInstructions(XWPFDocument document) {
        XWPFParagraph titleParagraph = document.createParagraph();
        XWPFRun titleRun = titleParagraph.createRun();
        titleRun.setText("Инструкции:");
        titleRun.setBold(true);
        titleRun.setFontSize((int) HEADER_SIZE);
        titleRun.addBreak();

        String[] instructions = {
                "• Внимателно прочитајте го секое прашање",
                "• За прашања со повеќе избори: Одберете ЕДЕН точен одговор",
                "• За точно/неточно прашања: Означете ја вашата одлука",
                "• За нумерички прашања: Запишете го одговорот во дадениот простор"
        };

        for (String instruction : instructions) {
            XWPFParagraph instrParagraph = document.createParagraph();
            instrParagraph.setIndentationLeft(INDENT * 20);
            XWPFRun instrRun = instrParagraph.createRun();
            instrRun.setText(instruction);
        }

        document.createParagraph().createRun().addBreak();
    }
    private void addWordQuestions(XWPFDocument document, Test test) {
        int questionNum = 1;
        for (Question question : test.getQuestionBank()) {
            XWPFParagraph questionParagraph = document.createParagraph();
            XWPFRun questionRun = questionParagraph.createRun();

            String questionText = String.format("%d. %s", questionNum++, question.getDescription());
            String pointsText = String.format(" [%d поени]", question.getPoints());
            if (question.getNegativePointsPerAnswer() > 0) {
                pointsText += String.format(" [-%d за неточен одговор]",
                        question.getNegativePointsPerAnswer());
            }

            questionRun.setText(questionText + pointsText);
            questionRun.addBreak();

            // Add image if present
            if (question.getImage() != null) {
                addWordImage(document, question.getImage());
            }

            // Add formula if present
            if (question.getFormula() != null && !question.getFormula().isEmpty()) {
                addWordLatexFormula(document, question.getFormula());
            }

            addWordAnswers(document, question);
            document.createParagraph().createRun().addBreak();
        }
    }

    private void addWordImage(XWPFDocument document, File imageFile) {
        try {
            Resource imageResource = fileStorageService.loadFileAsResource(imageFile.getFileName());
            byte[] imageBytes = imageResource.getContentAsByteArray();

            // Create buffered image to get dimensions
            BufferedImage bimg = ImageIO.read(new ByteArrayInputStream(imageBytes));
            int width = bimg.getWidth();
            int height = bimg.getHeight();

            // Scale dimensions while maintaining aspect ratio
            double aspectRatio = (double) width / height;
            int targetWidth = 400;  // Max width in points
            int targetHeight = (int) (targetWidth / aspectRatio);

            // Ensure height is not too large
            if (targetHeight > 300) {  // Max height in points
                targetHeight = 300;
                targetWidth = (int) (targetHeight * aspectRatio);
            }

            XWPFParagraph imageParagraph = document.createParagraph();
            imageParagraph.setIndentationLeft(INDENT * 20);
            XWPFRun imageRun = imageParagraph.createRun();

            imageRun.addPicture(
                    new ByteArrayInputStream(imageBytes),
                    XWPFDocument.PICTURE_TYPE_PNG,  // Adjust based on actual image type
                    imageFile.getFileName(),
                    Units.toEMU(targetWidth),
                    Units.toEMU(targetHeight)
            );
            imageRun.addBreak();
        } catch (Exception e) {
            System.err.println("Failed to add image: " + e.getMessage());
        }
    }

    private void addWordLatexFormula(XWPFDocument document, String latex) {
        try {
            TeXFormula formula = new TeXFormula(latex);
            BufferedImage image = (BufferedImage) formula.createBufferedImage(TeXConstants.STYLE_DISPLAY,
                    16, Color.BLACK, Color.WHITE);

            double aspectRatio = (double) image.getWidth() / image.getHeight();
            int targetWidth = 150;
            int targetHeight = (int) (targetWidth / aspectRatio);

            ByteArrayOutputStream imgBytes = new ByteArrayOutputStream();
            ImageIO.write(image, "PNG", imgBytes);

            XWPFParagraph formulaParagraph = document.createParagraph();
            formulaParagraph.setIndentationLeft(INDENT * 20);

            XWPFRun formulaRun = formulaParagraph.createRun();
            formulaRun.addPicture(
                    new ByteArrayInputStream(imgBytes.toByteArray()),
                    XWPFDocument.PICTURE_TYPE_PNG,
                    "formula.png",
                    Units.toEMU(targetWidth),
                    Units.toEMU(targetHeight)
            );
            formulaRun.addBreak();
            imgBytes.close();
        } catch (Exception e) {
            XWPFParagraph fallbackParagraph = document.createParagraph();
            fallbackParagraph.setIndentationLeft(INDENT * 20);
            XWPFRun fallbackRun = fallbackParagraph.createRun();
            fallbackRun.setText("Formula: " + latex);
            fallbackRun.setItalic(true);
        }
    }

    private void addWordAnswers(XWPFDocument document, Question question) {
        switch (question.getQuestionType()) {
            case MULTIPLE_CHOICE -> {
                for (Answer answer : question.getAnswers()) {
                    XWPFParagraph answerParagraph = document.createParagraph();
                    answerParagraph.setIndentationLeft(INDENT * 20);
                    XWPFRun answerRun = answerParagraph.createRun();
                    answerRun.setText(CHECKBOX + " " + answer.getAnswerText());
                }
            }
            case TRUE_FALSE -> {
                XWPFParagraph trueParagraph = document.createParagraph();
                trueParagraph.setIndentationLeft(INDENT * 20);
                trueParagraph.createRun().setText(CHECKBOX + " Точно");

                XWPFParagraph falseParagraph = document.createParagraph();
                falseParagraph.setIndentationLeft(INDENT * 20);
                falseParagraph.createRun().setText(CHECKBOX + " Неточно");
            }
            case NUMERIC -> {
                XWPFParagraph answerParagraph = document.createParagraph();
                answerParagraph.setIndentationLeft(INDENT * 20);
                answerParagraph.createRun().setText("Одговор: ________________________");
            }
            case ESSAY -> {
                XWPFParagraph labelParagraph = document.createParagraph();
                labelParagraph.setIndentationLeft(INDENT * 20);
                labelParagraph.createRun().setText("Одговор:");

                for (int i = 0; i < 5; i++) {
                    XWPFParagraph lineParagraph = document.createParagraph();
                    lineParagraph.setIndentationLeft(INDENT * 20);
                    lineParagraph.createRun().setText("_________________________________");
                }
            }
            case FILL_IN_THE_BLANK -> {
                XWPFParagraph blankParagraph = document.createParagraph();
                blankParagraph.setIndentationLeft(INDENT * 20);
                blankParagraph.createRun().setText("Празно место: ________________________");
            }
        }
    }

    private void addWordFooter(XWPFDocument document) {
        XWPFParagraph footerParagraph = document.createParagraph();
        footerParagraph.setAlignment(ParagraphAlignment.RIGHT);
        XWPFRun footerRun = footerParagraph.createRun();
        footerRun.setText("Генерирано на: " +
                LocalDateTime.now().format(DateTimeFormatter.ofPattern("dd.MM.yyyy HH:mm")));
        footerRun.setFontSize((int)SMALL_SIZE);
    }

    private ResponseEntity<ByteArrayResource> buildResponse(
            ByteArrayResource resource, String filename, String extension) {

        String safeFilename = filename.replaceAll("[^a-zA-Zа-яА-Я0-9.-]", "_")
                .replaceAll("\\s+", "_");

        String contentType = extension.equals("pdf")
                ? MediaType.APPLICATION_PDF_VALUE
                : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

        try {
            String encodedFilename = java.net.URLEncoder.encode(safeFilename + "." + extension, "UTF-8")
                    .replace("+", "%20");

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION,
                            "attachment; filename*=UTF-8''" + encodedFilename)
                    .contentType(MediaType.parseMediaType(contentType))
                    .body(resource);
        } catch (Exception e) {
            throw new RuntimeException("Failed to encode filename", e);
        }
    }

    private int calculateTotalPoints(Test test) {
        return test.getQuestionBank().stream()
                .mapToInt(Question::getPoints)
                .sum();
    }
}