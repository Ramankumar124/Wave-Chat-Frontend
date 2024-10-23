import React from 'react';

const TypingIndicator = () => {
  return (
    <div className="typing-indicator" style={styles.typingIndicator}>
      <span style={{ ...styles.span, ...styles.firstSpan }}></span>
      <span style={{ ...styles.span, ...styles.secondSpan }}></span>
      <span style={{ ...styles.span, ...styles.thirdSpan }}></span>
    </div>
  );
};

const styles = {
  typingIndicator: {
    backgroundColor: 'trasnparent',
    width: 'auto',
    borderRadius: '50px',
    padding: '15px',
    display: 'table',
    margin: '0 auto',
    position: 'relative',
    animation: '2s bulge infinite ease-out',
  },
  span: {
    height: '10px',
    width: '10px',
    float: 'left',
    margin: '0 1px',
    backgroundColor: '#9E9EA1',
    display: 'block',
    borderRadius: '50%',
    opacity: 0.4,
  },
  firstSpan: {
    animation: '1s blink infinite 0.3333s',
  },
  secondSpan: {
    animation: '1s blink infinite 0.6666s',
  },
  thirdSpan: {
    animation: '1s blink infinite 0.9999s',
  },
};

// Keyframes are necessary for animations, so you'll have to use CSS for them
const styleSheet = document.styleSheets[0];

const keyframesBlink = `
  @keyframes blink {
    50% {
      opacity: 1;
    }
  }
`;

const keyframesBulge = `
  @keyframes bulge {
    50% {
      transform: scale(1.05);
    }
  }
`;

// Inject the keyframes into the document stylesheet
styleSheet.insertRule(keyframesBlink, styleSheet.cssRules.length);
styleSheet.insertRule(keyframesBulge, styleSheet.cssRules.length);

export default TypingIndicator;
