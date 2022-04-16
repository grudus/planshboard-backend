package com.grudus.planshboard.commons.jooq

import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import com.grudus.planshboard.commons.Id
import java.util.Collections
import org.jooq.DSLContext
import org.jooq.Field
import org.jooq.InsertSetStep
import org.jooq.JSONB
import org.jooq.Record
import org.jooq.Table
import org.jooq.exception.DataAccessException
import org.jooq.impl.DSL


object JooqCommons {
    private val objectMapper = jacksonObjectMapper()

    fun <R : Record> insertMultipleAndReturnIds(dslContext: DSLContext, table: Table<R>, records: List<R>): List<Id> {
        if (records.isEmpty()) {
            return Collections.emptyList()
        }

        val idField: Field<*> =
            table.field("id") ?: throw DataAccessException("Cannot find 'id' field in table ${table.qualifiedName}")
        val maxIndex = dslContext.select(DSL.max(idField)).from(table).fetchOneInto(Id::class.java) ?: 0

        @Suppress("UNCHECKED_CAST")
        val withId = { record: R, id: Id -> record.set(idField as Field<Id>, maxIndex + id); record }

        var insertStep: InsertSetStep<R> = dslContext.insertInto(table)

        for (i in 0 until records.size - 1) {
            withId(records[i], i + 1L)
            insertStep = insertStep.set(records[i]).newRecord()
        }

        val lastRecord = records.last()

        return insertStep.set(withId(lastRecord, records.size.toLong()))
            .returning(idField)
            .fetch()
            .map { it.get(idField) as Id }

    }

    fun <T> parseJsonBArray(record: Record, field: Field<Array<JSONB>>, aClass: Class<T>): List<T> {
        return field[record]
            ?.map { singleRow -> objectMapper.readValue(singleRow.data(), aClass) }
            ?: emptyList()
    }

}
