package org.openapitools.server.api

import com.macromacro.storage.StorageError
import com.macromacro.usda.USDAError

sealed abstract class AppError
object AppError {
  final case class Storage(error: StorageError) extends AppError
  final case class USDA(error: USDAError) extends AppError
}
