package org.openapitools.server.api

import com.macromacro.settings.Settings
import com.typesafe.config.ConfigFactory
import org.openapitools.app.OpenAPIApp
import org.scalatra.test.scalatest._
import scala.collection.JavaConversions.mapAsScalaMap
import scala.collection.JavaConversions._

class DefaultApiServletTests extends ScalatraFunSuite {

  implicit val openapi = new OpenAPIApp
  val config = ConfigFactory.parseMap(Map("govApiKey" -> "test_api_key"))
  implicit val settings = new Settings(config)

  addServlet(new DefaultApi, "/*")

  test("GET / on DefaultApi should return status 200") {
    get("/") {
      status should equal(200)
    }
  }

}
