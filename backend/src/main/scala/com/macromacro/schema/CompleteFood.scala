package com.macromacro.schema

import org.openapitools.server.model.NamedMacros

case class CompleteFood(
  uid: String, // TODO should only SavedNamedMacros have a uid?

  name: String,

  fat: BigDecimal,

  carbs: BigDecimal,

  protein: BigDecimal,

  calories: BigDecimal,

  amount: BigDecimal,

  unit: String) {

  def toNamedMacros: NamedMacros = {
    NamedMacros(this.uid, this.name, this.fat, this.carbs, this.protein, this.calories, this.amount, this.unit)
  }
}
