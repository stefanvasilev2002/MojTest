package com.finki.mojtest.web;

import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.service.MetadataService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/metadata")
public class MetadataController {

    private final MetadataService metadataService;

    public MetadataController(MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    @PostMapping
    public ResponseEntity<Metadata> createMetadata(@RequestBody Metadata metadata) {
        try {
            Metadata createdMetadata = metadataService.createMetadata(metadata);
            return ResponseEntity.status(HttpStatus.CREATED).body(createdMetadata);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Metadata> getMetadataById(@PathVariable Long id) {
        Metadata metadata = metadataService.getMetadataById(id);
        return ResponseEntity.status(HttpStatus.OK).body(metadata);
    }

    @GetMapping
    public ResponseEntity<List<Metadata>> getAllMetadata() {
        List<Metadata> metadataList = metadataService.getAllMetadata();
        return ResponseEntity.status(HttpStatus.OK).body(metadataList);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Metadata> updateMetadata(@PathVariable Long id, @RequestBody Metadata updatedMetadata) {
        Metadata updated = metadataService.updateMetadata(id, updatedMetadata);
        return ResponseEntity.status(HttpStatus.OK).body(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMetadata(@PathVariable Long id) {
        try {
            metadataService.deleteMetadata(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
    }

    @GetMapping("/key/{key}")
    public ResponseEntity<List<Metadata>> getMetadataByKey(@PathVariable String key) {
        List<Metadata> metadataList = metadataService.getMetadataByKey(key);
        return ResponseEntity.status(HttpStatus.OK).body(metadataList);
    }
}