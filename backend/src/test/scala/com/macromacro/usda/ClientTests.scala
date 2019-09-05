package com.macromacro.usda

import com.macromacro.settings.Settings
import com.softwaremill.sttp.testing._
import com.macromacro.usda.UsdaClient._
import com.typesafe.config.ConfigFactory
import org.scalatest.{ BeforeAndAfterEach, FunSuite }
import scala.collection.JavaConversions.mapAsScalaMap
import scala.collection.JavaConversions._

class UsdaClientSpec extends FunSuite with BeforeAndAfterEach {

  val config = ConfigFactory.parseMap(Map("govApiKey" -> "test_api_key"))
  implicit val settings = new Settings(config)

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
    assert(foodReport("40")(backend, settings).isLeft)
  }

}
