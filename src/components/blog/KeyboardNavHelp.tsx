
import React from 'react';

const KeyboardNavHelp: React.FC = () => {
  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-terminal-navy/80 border border-terminal-text/30 rounded-lg px-4 py-2 text-xs text-terminal-text/70">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p className="mb-1">↑/↓/←/→: Navigate posts</p>
          <p>Enter: Open post</p>
        </div>
        <div>
          <p className="mb-1">V: Toggle view mode</p>
          <p>/: Focus search</p>
        </div>
      </div>
    </div>
  );
};

export default KeyboardNavHelp;

