package com.grudus.planshboard.commons.jooq

import com.grudus.planshboard.commons.Id
import org.jooq.*
import org.jooq.impl.DSL
import java.util.*


object JooqCommons {

    fun <R : Record> insertMultipleAndReturnIds(dslContext: DSLContext, table: Table<R>, records: List<R>): List<Id> {
        if (records.isEmpty()) {
            return Collections.emptyList()
        }

        val idField: Field<*> = table.field("id")
        val maxIndex = dslContext.select(DSL.max(idField)).from(table).fetchOneInto(Id::class.java) ?: 0
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
}
