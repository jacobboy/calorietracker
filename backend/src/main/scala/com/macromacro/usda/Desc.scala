/**
 * USDA Report API
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * OpenAPI spec version: 2
 *
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

package com.macromacro.usda

case class Desc(
  // NDB food number
  ndbno: String,
  // food name
  name: String,
  // short description
  sd: Option[Any] = None,
  // food group
  group: Option[Any] = None,
  // scientific name
  sn: Option[Any] = None,
  // commercial name
  cn: Option[Any] = None,
  // manufacturer
  manu: Option[String] = None,
  // nitrogen to protein conversion factor
  nf: Option[Any] = None,
  // carbohydrate factor
  cf: Option[Any] = None,
  // fat factor
  ff: Option[Any] = None,
  // protein factor
  pf: Option[Any] = None,
  // refuse %
  r: Option[Any] = None,
  // refuse description
  rd: Option[Any] = None,
  // database source: 'Branded Food Products' or 'Standard Reference'
  ds: String,
  // reporting unit: nutrient values are reported in this unit, usually gram (g) or milliliter (ml)
  ru: String)
