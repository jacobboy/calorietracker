package com.macromacro.usda

import com.softwaremill.sttp._
import com.softwaremill.sttp.json4s._

object UsdaClient {
  protected implicit val serialization = org.json4s.native.Serialization
  protected implicit val backend = HttpURLConnectionBackend()

  def report(ndbno: String) = {
    val apiKey = sys.env("GOV_API_KEY")
    val ndbno = "01009"
    val params = Map("api_key" -> apiKey, "ndbno" -> ndbno, "type" -> "b", "format" -> "json")
    val request = sttp.get(uri"https://api.nal.usda.gov/ndb/V2/reports?$params")
    request.send()
  }

  def reportAsJson() = {
    val apiKey = sys.env("GOV_API_KEY")
    val ndbno = "01009"
    val params = Map("api_key" -> apiKey, "ndbno" -> ndbno, "type" -> "b", "format" -> "json")
    val request = sttp.get(uri"https://api.nal.usda.gov/ndb/V2/reports?$params").response(asJson[FoodReport])
    request.send()
  }
}
