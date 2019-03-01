package org.openapitools.server.api

import com.macromacro.storage.{ ConnectionError, MissingIngredientError, StorageError }
import com.macromacro.usda.USDAError
import org.scalatra._

protected object ErrorResponse {
  def apply(code: Int, message: String) = {
    Map(
      // "error" -> Map(
      "code" -> code,
      "message" -> message)
    // )
  }
}

sealed abstract class AppError {
  def response: ActionResult
}

object AppError {
  object Storage {
    def apply(error: StorageError) = {
      error match {
        case MissingIngredientError(uid) => NotFound(ErrorResponse(404, uid))
        case ConnectionError(message) => InternalServerError(ErrorResponse(500, message))
      }
    }
  }
}
