package com.macromacro.settings

import com.typesafe.config.{ Config, ConfigFactory }

class Settings(config: Config) {

  // TODO should I do this?
  // validate vs. reference.conf
  // config.checkValid(ConfigFactory.defaultReference(), "macromacro")

  // non-lazy fields, we want all exceptions at construct time
  val govApiKey = config.getString("govApiKey")
}
