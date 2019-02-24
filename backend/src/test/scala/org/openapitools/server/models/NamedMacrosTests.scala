package org.openapitools.server.model
import org.scalatest.FunSuite

class NamedMacrosSpec extends FunSuite {

  test("IncompleteNamedMacros missing fat returns correct NamedMacros") {
    val (f, c, p, kc) = (2, 3, 4, 2 * 9 + 3 * 4 + 4 * 4)
    val macros = IncompleteNamedMacros(
      "uid", "name", None, Some(c), Some(p), Some(kc), 100, "g")
    val completeOption = macros.toComplete
    assert(completeOption.isDefined, "Macros could not be completed")
    val complete = completeOption.getOrElse(null)
    assert(complete.fat === f)
  }

  test("IncompleteNamedMacros missing carbs returns correct NamedMacros") {
    val (f, c, p, kc) = (2, 3, 4, 2 * 9 + 3 * 4 + 4 * 4)
    val macros = IncompleteNamedMacros(
      "uid", "name", Some(f), None, Some(p), Some(kc), 100, "g")
    val completeOption = macros.toComplete
    assert(completeOption.isDefined, "Macros could not be completed")
    val complete = completeOption.getOrElse(null)
    assert(complete.carbs === c)
  }

  test("IncompleteNamedMacros missing protein returns correct NamedMacros") {
    val (f, c, p, kc) = (2, 3, 4, 2 * 9 + 3 * 4 + 4 * 4)
    val macros = IncompleteNamedMacros(
      "uid", "name", Some(f), Some(c), None, Some(kc), 100, "g")
    val completeOption = macros.toComplete
    assert(completeOption.isDefined, "Macros could not be completed")
    val complete = completeOption.getOrElse(null)
    assert(complete.protein === p)
  }

  test("IncompleteNamedMacros missing calories returns correct NamedMacros") {
    val (f, c, p, kc) = (2, 3, 4, 2 * 9 + 3 * 4 + 4 * 4)
    val macros = IncompleteNamedMacros(
      "uid", "name", Some(f), Some(c), Some(p), None, 100, "g")
    val completeOption = macros.toComplete
    assert(completeOption.isDefined, "Macros could not be completed")
    val complete = completeOption.getOrElse(null)
    assert(complete.calories === kc)
  }

  test("IncompleteNamedMacros missing multiple macros returns Left") {
    val (f, c, p, kc) = (2, 3, 4, 2 * 9 + 3 * 4 + 4 * 4)
    val macros = IncompleteNamedMacros(
      "uid", "name", None, Some(c), Some(p), None, 100, "g")
    val completeOption = macros.toComplete
    assert(completeOption.isEmpty, "Macros could not be completed")
  }

}
