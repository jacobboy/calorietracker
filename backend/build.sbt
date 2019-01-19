val ScalatraVersion = "2.6.4"
val JettyVersion = "9.4.14.v20181114"

organization := "com.macromacro"

name := "Macro Macro"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.12.6"

resolvers += Classpaths.typesafeReleases


libraryDependencies ++= Seq(
  "com.google.appengine" % "appengine-api-1.0-sdk"    % "1.9.71",
  // "com.google.appengine" % "appengine-api-1.0-sdk"    % "1.9.71",
  // "com.google.appengine" % "appengine-api-1.0-sdk"    % "1.9.71",
  // "com.google.appengine" % "appengine-api-1.0-sdk"    % "1.9.71",
  // "com.google.appengine" % "appengine-endpoints"      % "1.9.71",
  "org.scalatra"        %% "scalatra"             % ScalatraVersion,
  "org.scalatra"        %% "scalatra-scalatest"   % ScalatraVersion   % "test",
  "org.scalatra"        %% "scalatra-json"        % ScalatraVersion,
  "org.scalatra"        %% "scalatra-swagger"     % ScalatraVersion,
  "ch.qos.logback"       % "logback-classic"      % "1.2.3"           % "runtime",
  "org.eclipse.jetty"    % "jetty-webapp"         % JettyVersion      % "container",
  "javax.servlet"        % "javax.servlet-api"    % "3.1.0"           % "provided",
  "org.json4s"          %% "json4s-jackson"       % "3.6.3",
  "org.json4s"          %% "json4s-ext"           % "3.6.3"
)

enablePlugins(ScalatraPlugin)
