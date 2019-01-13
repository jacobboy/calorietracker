package com.macromacro.storage

import com.google.appengine.api.search.Document;
import com.google.appengine.api.search.Index;
import com.google.appengine.api.search.IndexSpec;
import com.google.appengine.api.search.Facet;
import com.google.appengine.api.search.Field;
import com.google.appengine.api.search.PutException;
import com.google.appengine.api.search.SearchServiceFactory;
import com.google.appengine.api.search.StatusCode;
import org.openapitools.server.model.Ingredient

object Storage {

  def indexIngredient(ingredient: Ingredient) = {
    val indexName = "ingredients"
    val document = Document.newBuilder.setId("documentid")
      .addField(Field.newBuilder()
        .setName("subject")
        .setText("going for dinner"))
      .addField(Field.newBuilder()
        .setName("body")
        .setHTML("<html>I found a restaurant.</html>"))
      .addFacet(Facet.withAtom("tag", "food"))
      .addFacet(Facet.withNumber("priority", 5.0))
      .build()

    val indexSpec = IndexSpec.newBuilder().setName(indexName).build()
    val index = SearchServiceFactory.getSearchService().getIndex(indexSpec)

    index.put(document)

    "Hi this is indexShit"
  }
}
