import React, { useState } from 'react';
import { GameSession, Challenge } from '../types';
import { X, ShoppingCart } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  gameSession: GameSession;
  onUpdateGame: (updates: Partial<GameSession>) => void;
}

const SupermarketModal: React.FC<Props> = ({ isOpen, onClose, gameSession, onUpdateGame }) => {
  if (!isOpen) return null;

  const { challenge, family_budget } = gameSession;
  const ingredients = challenge?.ingredients || [];

  const handleBuyIngredient = (ingredient: string, price: number) => {
    if (family_budget >= price) {
      const newPurchasedIngredients = [...(challenge?.purchased_ingredients || []), ingredient];
      const newChallenge = { ...challenge, purchased_ingredients: newPurchasedIngredients };
      onUpdateGame({
        family_budget: family_budget - price,
        challenge: newChallenge as Challenge
      });
    } else {
      alert("Not enough money!");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Supermarket</h2>
          <div className="text-right">
            <p className="text-sm text-gray-500">Family Budget</p>
            <p className="text-lg font-bold text-green-600">${family_budget}</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Challenge Ingredients:</h3>
          <ul>
            {ingredients.map((ingredient, index) => {
              const isPurchased = challenge?.purchased_ingredients?.includes(ingredient);
              return (
                <li key={index} className="flex justify-between items-center mb-2 p-2 rounded-lg bg-gray-50">
                  <span className={isPurchased ? 'line-through text-gray-500' : ''}>{ingredient}</span>
                  <button
                    onClick={() => handleBuyIngredient(ingredient, 10)} // Using a fixed price of $10 for now
                    className={`text-white px-4 py-2 rounded-lg ${isPurchased ? 'bg-gray-400' : 'bg-green-500 hover:bg-green-600'}`}
                    disabled={isPurchased}
                  >
                    {isPurchased ? 'Purchased' : 'Buy ($10)'}
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="mt-4 text-right">
          <button onClick={onClose} className="bg-kopi-500 text-white px-6 py-2 rounded-lg hover:bg-kopi-600">
            Done Shopping
          </button>
        </div>
      </div>
    </div>
  );
};

export default SupermarketModal;
