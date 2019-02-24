package com.macromacro.usda

import com.softwaremill.sttp.testing._
import com.macromacro.usda.UsdaClient._
import org.scalatest.{ BeforeAndAfterEach, FunSuite }

class UsdaClientSpec extends FunSuite with BeforeAndAfterEach {

  test("handles missing value") {
    val missing = """ {
          "foods": [
            {
              "error": "No data for ndbno 40"
            }
          ],
          "count": 1,
          "notfound": 1,
          "api": 2.0
        }
    """
    val backend = SttpBackendStub.synchronous
      .whenRequestMatches(_ => true)
      .thenRespond(missing)
    assert(foodReport("40")(backend).isLeft)
  }

}
