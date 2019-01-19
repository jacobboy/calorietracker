package org.openapitools.server.api

import org.scalatra.test.scalatest._

class DefaultApiServletTests extends ScalatraFunSuite {

  addServlet(classOf[DefaultApi], "/*")

  test("GET / on MyScalatraServlet should return status 200") {
    get("/") {
      status should equal(200)
    }
  }

}
