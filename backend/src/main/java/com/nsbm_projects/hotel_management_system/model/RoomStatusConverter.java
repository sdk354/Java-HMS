package com.nsbm_projects.hotel_management_system.model;

import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class RoomStatusConverter implements AttributeConverter<RoomStatus, String> {

    @Override
    public String convertToDatabaseColumn(RoomStatus status) {
        if (status == null) return null;
        return status.getDbValue();
    }

    @Override
    public RoomStatus convertToEntityAttribute(String dbData) {
        if (dbData == null) return null;
        return RoomStatus.fromDbValue(dbData);
    }
}