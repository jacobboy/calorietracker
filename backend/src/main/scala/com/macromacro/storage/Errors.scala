package com.macromacro.storage

sealed abstract class StorageError

case class MissingIngredientError(uid: String) extends StorageError

// TODO expand this to handle USDAClient errors
case class ConnectionError(message: String) extends StorageError
