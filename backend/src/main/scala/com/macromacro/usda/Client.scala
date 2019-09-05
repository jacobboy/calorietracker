package com.macromacro.usda

import com.macromacro.settings.Settings
import com.softwaremill.sttp._
import com.softwaremill.sttp.json4s._
import com.macromacro.schema.UsdaId

object UsdaClient {
  private val usdaUrl = "https://api.nal.usda.gov/ndb/V2/reports"

  private implicit val serialization = org.json4s.native.Serialization
  // TODO can this be lazy?
  private val httpBackend: SttpBackend[Id, Nothing] = HttpURLConnectionBackend()

  def foodReport(ndbnoOrUid: String)(
    implicit
    backend: SttpBackend[Id, Nothing] = httpBackend,
    settings: Settings): Either[USDAError, FoodFood] = {
    val ndbno = ndbnoOrUid match {
      case UsdaId(ndbno) => ndbno
      case ndbno => ndbno
    }

    val params = Map("api_key" -> settings.govApiKey, "ndbno" -> ndbno, "type" -> "b", "format" -> "json")
    val response = sttp.get(uri"$usdaUrl?$params").response(asJson[FoodReport]).send()

    response.body
      .left.map(errorMessage => UsdaApiError(response.code.toInt, errorMessage))
      .flatMap(report => {
        report.foods(0)
          .left.map(error => ReportNotFound(error.error.split(" ").last))
          .right.map(_.food)
      })
  }
}
