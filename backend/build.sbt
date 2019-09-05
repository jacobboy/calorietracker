val ScalatraVersion = "2.6.4"
val JettyVersion = "9.4.14.v20181114"
val AppEngineVersion = "1.9.71"
val SttpVersion = "1.5.8"
val Json4sVersion = "3.6.7"

organization := "com.macromacro"

name := "Macro Macro"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.12.6"

resolvers += Classpaths.typesafeReleases

// needed for cats
// scalacOptions += "-Ypartial-unification"

libraryDependencies ++= Seq(
  "ch.qos.logback"              % "logback-classic"        % "1.2.3"            % "runtime",
  "com.google.appengine"        % "appengine-api-1.0-sdk"  % AppEngineVersion,
  "com.google.appengine"        % "appengine-testing"      % AppEngineVersion   % "test",
  "com.softwaremill.sttp"      %% "core"                   % SttpVersion,
  "com.softwaremill.sttp"      %% "json4s"                 % SttpVersion,
  "com.typesafe"                % "config"                 % "1.3.4",
  "com.typesafe.scala-logging" %% "scala-logging"          % "3.9.2",
  "javax.servlet"               % "javax.servlet-api"      % "3.1.0"            % "provided",
  "org.eclipse.jetty"           % "jetty-webapp"           % JettyVersion       % "container",
  "org.json4s"                 %% "json4s-ext"             % Json4sVersion,
  "org.json4s"                 %% "json4s-jackson"         % Json4sVersion,
  "org.json4s"                 %% "json4s-native"          % Json4sVersion,
  "org.scalatra"               %% "scalatra"               % ScalatraVersion,
  "org.scalatra"               %% "scalatra-json"          % ScalatraVersion,
  "org.scalatra"               %% "scalatra-scalatest"     % ScalatraVersion    % "test",
  "org.scalatra"               %% "scalatra-swagger"       % ScalatraVersion
  // "org.typelevel"           %% "cats-core"              % "1.6.0",

)

enablePlugins(ScalatraPlugin)
