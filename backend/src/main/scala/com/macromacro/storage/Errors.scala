package com.macromacro.storage

// TODO where should this be raised? from com.macromacro.usda?
// should the report function return an Either[IncompleteReport, CompleteReport] ?
case class IncompleteUsdaNutrient(ndbno: String)
