
package com.youteach;
import android.os.Bundle; 
import com.facebook.react.ReactActivity;
import org.devio.rn.splashscreen.SplashScreen; 

public class MainActivity extends ReactActivity {

  /**
   * Returns the name of the main component registered from JavaScript. This is used to schedule
   * rendering of the component.
   */
  @Override
  protected String getMainComponentName() {
    return "YouTeach";
  }

   /**
    * 设置启动页
    */
      @Override
      protected void onCreate(Bundle savedInstanceState) {
          SplashScreen.show(this);  // 展示启动页设置代码
          super.onCreate(savedInstanceState);
      }
}
