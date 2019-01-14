package com.macromacro.storage

import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Facet;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.PutException;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.StatusCode;
import java.util.Date
import java.util.UUID.randomUUID
import org.openapitools.server.model.NewIngredient
import org.openapitools.server.model.Ingredient
import org.json4s._
import org.json4s.ext.JavaTypesSerializers
import org.json4s.jackson.Serialization
import org.json4s.jackson.Serialization.{ read, write }

object Storage {

  private val ingredientIndexName = "ingredients"
  private implicit val jsonFormats = Serialization.formats(NoTypeHints) ++ JavaTypesSerializers.all

  def saveIngredient(newIngredient: NewIngredient) = {
    val uuid = randomUUID
    val ingredient = Ingredient(
      uuid,
      newIngredient.name,
      newIngredient.fat,
      newIngredient.carbs,
      newIngredient.protein,
      newIngredient.calories,
      newIngredient.amount,
      newIngredient.unit)

    val ingredientJson = write(ingredient)

    val document = Document.newBuilder.setId(uuid.toString)
      .addField(Field.newBuilder()
        .setName("name")
        .setText(ingredient.name))
      .addField(Field.newBuilder()
        .setName("body")
        .setText(ingredientJson))
      .addField(Field.newBuilder()
        .setName("created")
        .setDate(new Date()))
      // .addFacet(Facet.withAtom("tag", "food"))
      .build()

    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    val index = SearchServiceFactory.getSearchService().getIndex(indexSpec)

    index.put(document)
    // try {
    //   index.put(document);
    // } catch (PutException e) {
    //   if (StatusCode.TRANSIENT_ERROR.equals(e.getOperationResult().getCode())) {
    //     // retry putting document
    //   }
    // }

    ingredient
  }

  def getIngredient(uuid: String) = {
    val indexSpec = IndexSpec.newBuilder().setName(ingredientIndexName).build()
    val index = SearchServiceFactory.getSearchService().getIndex(indexSpec)

    val doc = index.get(uuid)
    val ingredientJson = doc.getOnlyField("body").getText

    val ingredient = read[Ingredient](ingredientJson)
    println(ingredient)
    ingredient
  }
}
