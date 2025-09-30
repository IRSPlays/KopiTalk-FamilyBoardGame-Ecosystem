import React, { useState } from 'react';
import { User, Mic, Video, ShoppingCart, Dices, Info, Flame } from 'lucide-react';

// --- Mock Data & Types (replace with your actual game state management) ---

type Player = {
  id: number;
  name: string;
  money: number;
  role: 'Grandparent' | 'Teenager';
};

const initialPlayers: Player[] = [
  { id: 1, name: 'Ah Gong', money: 150, role: 'Grandparent' },
  { id: 2, name: 'Brenda', money: 120, role: 'Teenager' },
];

const initialLog: string[] = [
  "Game started! Welcome to KopiTalk.",
  "Ah Gong is at the HDB Block (B2).",
  "Brenda is at the MRT Station (D4)."
];

// --- Reusable Sub-components for the Hub ---

const PlayerCard: React.FC<{ player: Player; isActive: boolean; onClick: () => void }> = ({ player, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`p-4 rounded-lg cursor-pointer transition-all duration-300 ${
      isActive
        ? 'bg-blue-100 dark:bg-blue-900 ring-2 ring-blue-500'
        : 'bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700'
    }`}
  >
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-3">
        <User className={`w-6 h-6 ${player.role === 'Grandparent' ? 'text-orange-500' : 'text-blue-500'}`} />
        <span className="font-bold text-lg">{player.name}</span>
      </div>
      <span className="text-xl font-semibold text-green-600 dark:text-green-400">${player.money}</span>
    </div>
  </div>
);

const ActionButton: React.FC<{ icon: React.ElementType; label: string; onClick: () => void; disabled?: boolean }> = ({ icon: Icon, label, onClick, disabled }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="flex flex-col items-center justify-center gap-2 p-4 bg-white dark:bg-gray-700 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
  >
    <Icon className="w-8 h-8 text-gray-700 dark:text-gray-200" />
    <span className="text-sm font-medium text-center">{label}</span>
  </button>
);

const GameLog: React.FC<{ logs: string[] }> = ({ logs }) => (
  <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg h-48 overflow-y-auto">
    <h3 className="font-bold mb-2 flex items-center gap-2"><Info className="w-5 h-5" /> Game Log</h3>
    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
      {logs.map((log, index) => (
        <li key={index} className="animate-fade-in">{log}</li>
      ))}
    </ul>
  </div>
);

const BoardState: React.FC = () => (
    <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg text-center">
        <h3 className="font-bold mb-2 flex items-center justify-center gap-2"><Flame className="w-5 h-5 text-red-500" /> Live Board State</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
            Point the ESP32-CAM at the board. The latest state will appear here.
        </p>
        {/* This is where you would render the digital twin of the board */}
        <div className="mt-4 p-4 border-2 border-dashed rounded-lg h-32 flex items-center justify-center">
            <p className="text-gray-500">Awaiting data from server...</p>
        </div>
    </div>
);

// --- Main GameHub Component ---

export const GameHub: React.FC = () => {
  const [players, setPlayers] = useState<Player[]>(initialPlayers);
  const [activePlayerId, setActivePlayerId] = useState<number | null>(1);
  const [logs, setLogs] = useState<string[]>(initialLog);

  const activePlayer = players.find(p => p.id === activePlayerId);

  // --- Action Handlers (to be implemented) ---
  const handleRecordConversation = () => {
    if (!activePlayer) return;
    console.log(`${activePlayer.name} is recording a conversation.`);
    // TODO: Open conversation recording modal
    setLogs(prev => [...prev, `${activePlayer.name} started a conversation.`]);
  };

  const handleFilmTikTok = () => {
    if (!activePlayer) return;
    console.log(`${activePlayer.name} is filming a TikTok.`);
    // TODO: Open TikTok recording modal
    setLogs(prev => [...prev, `${activePlayer.name} is filming a TikTok.`]);
  };

  const handleGoShopping = () => {
    if (!activePlayer) return;
    console.log(`${activePlayer.name} is going shopping.`);
    // TODO: Open market selection modal
    setLogs(prev => [...prev, `${activePlayer.name} went to the market.`]);
  };

  const handleRollDice = () => {
    if (!activePlayer) return;
    const roll = Math.floor(Math.random() * 6) + 1;
    console.log(`${activePlayer.name} rolled a ${roll}.`);
    // TODO: Update game state based on roll
    setLogs(prev => [...prev, `${activePlayer.name} rolled a ${roll}! The physical piece should be moved.`]);
    
    // Example of automatically passing the turn
    const currentIndex = players.findIndex(p => p.id === activePlayerId);
    const nextPlayer = players[(currentIndex + 1) % players.length];
    setActivePlayerId(nextPlayer.id);
    setLogs(prev => [...prev, `It's now ${nextPlayer.name}'s turn.`]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold">KopiTalk Game Hub</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">Your companion for the physical board game.</p>
        </header>

        {/* Player Selection */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">Players</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {players.map(player => (
              <PlayerCard
                key={player.id}
                player={player}
                isActive={player.id === activePlayerId}
                onClick={() => setActivePlayerId(player.id)}
              />
            ))}
          </div>
           <p className="text-center text-sm mt-2 text-gray-500">Tap a player to select them for an action.</p>
        </section>

        {/* Player Actions */}
        <section>
          <h2 className="text-2xl font-semibold mb-3">
            {activePlayer ? `${activePlayer.name}'s Actions` : 'Select a Player'}
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <ActionButton icon={Mic} label="Record Convo" onClick={handleRecordConversation} disabled={!activePlayer} />
            <ActionButton icon={Video} label="Film TikTok" onClick={handleFilmTikTok} disabled={!activePlayer} />
            <ActionButton icon={ShoppingCart} label="Go Shopping" onClick={handleGoShopping} disabled={!activePlayer} />
            <ActionButton icon={Dices} label="Roll Dice & End Turn" onClick={handleRollDice} disabled={!activePlayer} />
          </div>
        </section>

        {/* Game State & Log */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <BoardState />
            <GameLog logs={logs} />
        </section>

      </div>
    </div>
  );
};

export default GameHub;

```

### How This Design Works

1.  **Player-Centric, Not Turn-Centric**: Players are displayed in cards. A player can be tapped to become "active". This manual selection is perfect for a companion app, as it allows the family to control who is taking an action, reflecting the state of the physical game.
2.  **Centralized Actions**: All core features (`Record Convo`, `Film TikTok`, `Go Shopping`, `Roll Dice`) are available as large, clear buttons. They are only enabled when a player is selected.
3.  **Live Game State**: It includes dedicated panels for a `Game Log` (to show a history of actions) and a `Live Board State` display. The board state panel is where you would render the JSON data received from your FastAPI server, giving players a digital confirmation of the physical board.
4.  **Scalable & Responsive**: The layout uses CSS Grid and is fully responsive, looking great on a phone, tablet, or laptop placed next to the board game.

### New Feature Suggestions to Enhance the Game

Here are some new, non-hallucinatory features you could add to make the game even more engaging, building on your existing AI and hardware foundation:

1.  **AI-Generated "KopiTalk" Event Cards**:
    *   **Concept**: After analyzing a family conversation, the Gemini API could generate a unique "Event Card" text. This could be a new conversation prompt, a mini-challenge, or a story starter related to the topic just discussed.
    *   **Implementation**: Send the conversation transcript (or a summary) to Gemini with a prompt like: `"Based on this family conversation about school, create a fun, one-sentence 'Event Card' that asks a follow-up question or presents a silly challenge."` The app would then display this card to the players.

2.  **"Secret Mission" Module**:
    *   **Concept**: At the start of the game, each player is privately assigned a secret mission via the app (e.g., "Get another player to say the word 'holiday'" or "Successfully buy 'Kopi O' from the market").
    *   **Implementation**: This would be managed entirely within the React app's state. You'd create a list of missions and assign one to each player. A button in their player card could reveal their secret mission only to them. When they complete it, they tap a button to reveal their success and earn a bonus.

3.  **Dynamic Market Pricing**:
    *   **Concept**: Make the in-game economy more interesting. Prices at the four markets could fluctuate based on game events. For example, after a "Roll Dice" action, you could randomly trigger a "market event".
    *   **Implementation**: In the `handleRollDice` function, add a small chance (e.g., `if (Math.random() < 0.2)` ) to trigger an event. The event could be `"Heavy rain! Wet Market prices are up 10%"` or `"RedMart has a flash sale! All items 20% off for the next turn."` This state would be managed in your app and reflected in the shopping UI.

This new UI structure and these feature ideas should give you a fantastic roadmap for evolving your KopiTalk project into an even more interactive and memorable family experience.

<!--
[PROMPT_SUGGESTION]Show me how to integrate the `GameHub` component into the main `App.tsx`.[/PROMPT_SUGGESTION]
[PROMPT_SUGGESTION]Let's implement the "Secret Mission" feature. Help me write the logic for it.[/PROMPT_SUGGESTION]
-->
