package com.macromacro.usda

sealed abstract class USDAError

case class ReportNotFound(ndbno: String) extends USDAError
case class UsdaApiError(code: Int, errorMessage: String) extends USDAError
