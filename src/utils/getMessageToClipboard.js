// Copies Message Text to clipboard
export async function getMessageToClipboard(text){
    try {
      await navigator.clipboard.writeText(text);
    } 
    catch (err) {
      console.error("Failed to copy Message to Clipboard: ", err);
    }
}