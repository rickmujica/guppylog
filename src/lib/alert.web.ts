import type { AlertButton } from 'react-native';

/**
 * react-native-web's Alert does nothing, so on the web confirmations use the
 * browser's own dialogs. Every confirmation in the app is "cancel" plus one action.
 */
export function alert(title: string, message?: string, buttons?: AlertButton[]) {
  const text = message ? `${title}\n\n${message}` : title;
  const action = buttons?.find((b) => b.style !== 'cancel');
  if (!action) {
    window.alert(text);
    return;
  }
  if (window.confirm(text)) action.onPress?.();
}
