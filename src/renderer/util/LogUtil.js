import { Notification } from 'element-ui';

let defaultTextColor = 'green';

function consoleLogText(text, color) {
    let textColor = defaultTextColor;
    if (color) {
        textColor = color;
    }
    console.log('%c ' + text, 'color: ' + textColor + '; font-weight: bold;');
}

function consoleLogSavingObject(text, obj) {
    consoleLogText(text);
    console.log({ ...obj });
}

function showNotification(text) {
    Notification.closeAll();
    Notification.success({
        message: text,
        position: 'bottom-right',
        customClass: 'success-text-notification'
    });
}
export { consoleLogText, consoleLogSavingObject, showNotification };
