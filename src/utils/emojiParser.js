// For typing emoji shortcats and to convert Custom Emojis to images in the Send Message Input
import emoji from 'node-emoji';

export function emojiParser(text, customEmojis) {
  const parts = text.split(/(:[a-zA-Z0-9_+-]+:)/g); // splits on :emoji: patterns

  return parts.map((part, index) => {
    if (/^:[a-zA-Z0-9_+-]+:$/.test(part)) {
      const shortcode = part.slice(1, -1); // remove colons

      // First try to match custom emoji
      const customEmoji = customEmojis.find(e => e.shortcodes.includes(shortcode));
      if (customEmoji) {
        return (
          <img
            key={index}
            src={customEmoji.skins[0]?.src}
            alt={part}
            title={shortcode}
            style={{ width: 20, height: 20, verticalAlign: 'middle' }}
          />
        );
      }

      // Then check if it's a known Unicode emoji
      const unicodeEmoji = emoji.get(shortcode);
      if (unicodeEmoji !== `:${shortcode}:`) {
        return <span key={index}>{unicodeEmoji}</span>;
      }
    }

    // Otherwise just return plain text
    return <span key={index}>{part}</span>;
  });
}