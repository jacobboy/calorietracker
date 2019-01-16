resolvers += Resolver.sonatypeRepo("snapshots")
addSbtCoursier

addSbtPlugin("com.eed3si9n" % "sbt-assembly" % "0.14.6")
addSbtPlugin("org.scalariform" % "sbt-scalariform" % "1.8.2")
addSbtPlugin("org.scalatra.sbt" % "sbt-scalatra" % "1.0.2")
