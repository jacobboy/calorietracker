organization := "org.openapitools"
name := "macromacro"
version := "0.1.0-SNAPSHOT"
scalaVersion := "2.12.4"

mainClass in assembly := Some("JettyMain")

val ScalatraVersion = "2.6.4"
val JettyVersion = "9.4.14.v20181114"

libraryDependencies ++= Seq(
  // "com.google.appengine" % "appengine-api"      % "1.3.5",
  "com.google.appengine" % "appengine-api-1.0-sdk"    % "1.9.71",
  "com.google.appengine" % "appengine-endpoints"      % "1.9.71",
  "org.scalatra"      %% "scalatra"             % ScalatraVersion,
  "org.scalatra"      %% "scalatra-swagger"     % ScalatraVersion,
  "org.scalatra"      %% "scalatra-scalatest"   % ScalatraVersion % Test,
  "org.json4s"        %% "json4s-jackson"       % "3.5.0",
  "org.eclipse.jetty" %  "jetty-server"         % JettyVersion,
  "org.eclipse.jetty" %  "jetty-webapp"         % JettyVersion,
  "javax.servlet"     %  "javax.servlet-api"    % "3.1.0",
  "ch.qos.logback"    %  "logback-classic"      % "1.2.3" % Provided
)

enablePlugins(JettyPlugin)
