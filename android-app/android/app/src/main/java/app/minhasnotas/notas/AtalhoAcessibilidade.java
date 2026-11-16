package app.minhasnotas.notas;

import android.accessibilityservice.AccessibilityButtonController;
import android.accessibilityservice.AccessibilityService;
import android.content.Intent;
import android.os.Build;
import android.view.accessibility.AccessibilityEvent;

/**
 * Coloca o Minhas Notas no botão/menu de acessibilidade do Android.
 * Não lê nada da tela: só abre o app quando o botão é tocado.
 */
public class AtalhoAcessibilidade extends AccessibilityService {

    private AccessibilityButtonController.AccessibilityButtonCallback callback;

    @Override
    protected void onServiceConnected() {
        super.onServiceConnected();
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            callback = new AccessibilityButtonController.AccessibilityButtonCallback() {
                @Override
                public void onClicked(AccessibilityButtonController controller) {
                    abrirApp();
                }
            };
            getAccessibilityButtonController().registerAccessibilityButtonCallback(callback);
        }
    }

    private void abrirApp() {
        Intent i = new Intent(this, MainActivity.class);
        i.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_REORDER_TO_FRONT | Intent.FLAG_ACTIVITY_SINGLE_TOP);
        startActivity(i);
    }

    @Override
    public void onAccessibilityEvent(AccessibilityEvent event) { }

    @Override
    public void onInterrupt() { }

    @Override
    public boolean onUnbind(Intent intent) {
        if (callback != null && Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            getAccessibilityButtonController().unregisterAccessibilityButtonCallback(callback);
        }
        return super.onUnbind(intent);
    }
}
