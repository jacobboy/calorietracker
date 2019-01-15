import com.example.app._
import org.scalatra._
import javax.servlet.ServletContext
import org.openapitools.app.OpenAPIApp

class ScalatraBootstrap extends LifeCycle {
  implicit val openapi = new OpenAPIApp
  override def init(context: ServletContext) {
    context.mount(new MyScalatraServlet, "/*")
  }
}
