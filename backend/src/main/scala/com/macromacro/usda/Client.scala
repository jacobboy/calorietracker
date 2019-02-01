package com.macromacro.usda

import com.softwaremill.sttp._
import com.softwaremill.sttp.json4s._

object UsdaClient {
  private val usdaUrl = "https://api.nal.usda.gov/ndb/V2/reports"

  private implicit val serialization = org.json4s.native.Serialization
  private implicit val backend = HttpURLConnectionBackend()

  trait USDAError

  case class IncompleteFoodFood(foodFood: FoodFood) extends USDAError
  case class ReportNotFound(ndbno: String) extends USDAError
  case class UsdaApiError(code: Int, errorMessage: String) extends USDAError

  def foodReport(ndbno: String): Either[USDAError, FoodFood] = {

    val apiKey = sys.env("GOV_API_KEY")
    val params = Map("api_key" -> apiKey, "ndbno" -> ndbno, "type" -> "b", "format" -> "json")
    val response = sttp.get(uri"$usdaUrl?$params").response(asJson[FoodReport]).send()

    response.body
      .left.map(errorMessage => UsdaApiError(response.code.toInt, errorMessage))
      .flatMap(report => {
        report.foods(0)
          .left.map(error => ReportNotFound(error.error.split(" ").last))
          .right.map(_.food)
      })
      .flatMap(f => {
        if (f.hasCompleteMacros) Right(f) else Left(IncompleteFoodFood(f))
      })
  }
}
