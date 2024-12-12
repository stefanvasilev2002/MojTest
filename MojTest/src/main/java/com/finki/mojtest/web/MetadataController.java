package com.finki.mojtest.web;

import com.finki.mojtest.model.Metadata;
import com.finki.mojtest.model.dtos.MetadataDTO;
import com.finki.mojtest.model.mappers.MetadataMapper;
import com.finki.mojtest.service.MetadataService;
import org.springframework.data.jpa.repository.Meta;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/metadata")
public class MetadataController {

    private final MetadataService metadataService;

    public MetadataController(MetadataService metadataService) {
        this.metadataService = metadataService;
    }

    @PostMapping
    public ResponseEntity<MetadataDTO> createMetadata(@RequestBody MetadataDTO metadata) {
        try {
            Metadata createdMetadata = metadataService.createMetadataByDTO(metadata);
            return ResponseEntity.status(HttpStatus.CREATED).body(MetadataMapper.toDTO(createdMetadata));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<MetadataDTO> getMetadataById(@PathVariable Long id) {
        Metadata metadata = metadataService.getMetadataById(id);
        return ResponseEntity.status(HttpStatus.OK).body(MetadataMapper.toDTO(metadata));
    }

    @GetMapping
    public ResponseEntity<List<MetadataDTO>> getAllMetadata() {
        List<Metadata> metadataList = metadataService.getAllMetadata();
        List<MetadataDTO> metadataDTOS = metadataList.stream()
                .map(MetadataMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(metadataDTOS);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MetadataDTO> updateMetadata(@PathVariable Long id, @RequestBody Metadata updatedMetadata) {
        Metadata updated = metadataService.updateMetadata(id, updatedMetadata);
        return ResponseEntity.status(HttpStatus.OK).body(MetadataMapper.toDTO(updated));
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
    public ResponseEntity<List<MetadataDTO>> getMetadataByKey(@PathVariable String key) {
        List<Metadata> metadataList = metadataService.getMetadataByKey(key);
        List<MetadataDTO> metadataDTOS = metadataList.stream()
                .map(MetadataMapper::toDTO)
                .collect(Collectors.toList());
        return ResponseEntity.status(HttpStatus.OK).body(metadataDTOS);
    }
}