package com.macromacro.schema

import java.util.UUID.randomUUID

/* TODO make this shared by UsdaId, used instead of (uid: String) */
sealed abstract class MacroMacroId(name: String, version: String) {
  def apply(uid: String): String = s"${name}::${version}::${uid}"
  def apply(): String = apply(randomUUID.toString)
  def unapply(uid: String): Boolean = isId(s"${name}")(uid)

  protected def isId(prefix: String)(id: String): Boolean = {
    val stringArray: Array[String] = id.split("::")
    (stringArray.length == 3) & (stringArray.head == prefix)
  }
}

object IngredientId extends MacroMacroId("ingredient", "v1") {}

object RecipeId extends MacroMacroId("recipe", "v1") {}

object UsdaId {
  def apply(ndbno: String) = s"ndbno::v1::${ndbno}"
  def unapply(usdaId: String): Option[String] = {
    val stringArray: Array[String] = usdaId.split("::")
    if ((stringArray.length == 3) & (stringArray.head == "ndbno")) Some(stringArray.last) else None
  }
}
