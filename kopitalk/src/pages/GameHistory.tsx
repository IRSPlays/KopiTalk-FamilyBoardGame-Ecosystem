/**
 * @file This file defines the main landing page for the application, which displays
 * the user's game history.
 */

import React from 'react';
import EnhancedGameHistory from '../components/EnhancedGameHistory';

/**
 * The GameHistory page component.
 * It serves as a container for the `EnhancedGameHistory` component, which
 * handles the logic and presentation of the game history list.
 *
 * @returns {JSX.Element} The rendered EnhancedGameHistory component.
 */
const GameHistory: React.FC = () => {
  return <EnhancedGameHistory />;
};

export default GameHistory;
