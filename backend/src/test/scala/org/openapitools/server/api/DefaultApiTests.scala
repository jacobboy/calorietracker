package org.openapitools.server.api

import org.openapitools.app.OpenAPIApp
import org.scalatra.test.scalatest._

class DefaultApiServletTests extends ScalatraFunSuite {

  implicit val openapi = new OpenAPIApp
  addServlet(new DefaultApi, "/*")

  test("GET / on DefaultApi should return status 200") {
    get("/") {
      status should equal(200)
    }
  }

}
