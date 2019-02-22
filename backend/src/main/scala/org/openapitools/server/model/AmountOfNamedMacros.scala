package org.openapitools.server.model

case class AmountOfNamedMacros(

  amount: BigDecimal,

  namedMacros: NamedMacros) {
  private def multiplier = amount / namedMacros.amount
  def fat = namedMacros.fat * multiplier
  def carbs = namedMacros.carbs * multiplier
  def protein = namedMacros.protein * multiplier
  def calories = namedMacros.calories * multiplier
}
