val ScalatraVersion = "2.6.4"
val JettyVersion = "9.4.14.v20181114"
val AppEngineVersion = "1.9.71"

organization := "com.macromacro"

name := "Macro Macro"

version := "0.1.0-SNAPSHOT"

scalaVersion := "2.12.6"

resolvers += Classpaths.typesafeReleases


libraryDependencies ++= Seq(
  "ch.qos.logback"         % "logback-classic"        % "1.2.3"            % "runtime",
  "com.google.appengine"   % "appengine-api-1.0-sdk"  % AppEngineVersion,
  "javax.servlet"          % "javax.servlet-api"      % "3.1.0"            % "provided",
  "org.scalatra"          %% "scalatra"               % ScalatraVersion,
  "org.scalatra"          %% "scalatra-json"          % ScalatraVersion,
  "org.scalatra"          %% "scalatra-swagger"       % ScalatraVersion,
  "org.eclipse.jetty"      % "jetty-webapp"           % JettyVersion       % "container",
  "org.json4s"            %% "json4s-jackson"         % "3.6.3",
  "org.json4s"            %% "json4s-ext"             % "3.6.3",
  "org.scalatra"          %% "scalatra-scalatest"     % ScalatraVersion    % "test",
  "com.google.appengine"   % "appengine-testing"      % AppEngineVersion   % "test"
)

enablePlugins(ScalatraPlugin)
