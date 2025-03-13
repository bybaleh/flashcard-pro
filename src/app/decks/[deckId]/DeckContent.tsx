'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Database } from '@/lib/supabase';

type Card = Database['public']['Tables']['cards']['Row'];
type Deck = Database['public']['Tables']['decks']['Row'];

type Props = {
  deckId: string;
};

export default function DeckContent({ deckId }: Props) {
  const [deck, setDeck] = useState<Deck | null>(null);
  const [cards, setCards] = useState<Card[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newCardFront, setNewCardFront] = useState('');
  const [newCardBack, setNewCardBack] = useState('');
  const [isAddingCard, setIsAddingCard] = useState(false);

  useEffect(() => {
    async function fetchDeckAndCards() {
      try {
        // Fetch deck details
        const { data: deckData, error: deckError } = await supabase
          .from('decks')
          .select('*')
          .eq('id', deckId)
          .single();

        if (deckError) throw deckError;
        setDeck(deckData);

        // Fetch cards
        const { data: cardsData, error: cardsError } = await supabase
          .from('cards')
          .select('*')
          .eq('deck_id', deckId)
          .order('created_at', { ascending: false });

        if (cardsError) throw cardsError;
        setCards(cardsData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchDeckAndCards();
  }, [deckId]);

  const handleAddCard = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError(null);
      const { error } = await supabase.from('cards').insert([
        {
          deck_id: deckId,
          front: newCardFront,
          back: newCardBack,
          review_count: 0,
          ease_factor: 2.5,
        },
      ]);

      if (error) throw error;

      // Refresh cards list
      const { data: newCards, error: fetchError } = await supabase
        .from('cards')
        .select('*')
        .eq('deck_id', deckId)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setCards(newCards || []);

      // Reset form
      setNewCardFront('');
      setNewCardBack('');
      setIsAddingCard(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      setError(null);
      const { error } = await supabase.from('cards').delete().eq('id', cardId);

      if (error) throw error;

      setCards(cards.filter((card) => card.id !== cardId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">Deck not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{deck.title}</h1>
            <p className="mt-1 text-sm text-gray-600">{deck.description}</p>
          </div>
          <div className="flex space-x-4">
            <Link
              href={`/study/${deck.id}`}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Study Deck
            </Link>
            <button
              onClick={() => setIsAddingCard(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Add Card
            </button>
          </div>
        </div>

        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {isAddingCard && (
          <div className="mb-8 bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">Add New Card</h3>
              <form onSubmit={handleAddCard} className="mt-5 space-y-4">
                <div>
                  <label htmlFor="front" className="block text-sm font-medium text-gray-700">
                    Front
                  </label>
                  <textarea
                    id="front"
                    value={newCardFront}
                    onChange={(e) => setNewCardFront(e.target.value)}
                    required
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div>
                  <label htmlFor="back" className="block text-sm font-medium text-gray-700">
                    Back
                  </label>
                  <textarea
                    id="back"
                    value={newCardBack}
                    onChange={(e) => setNewCardBack(e.target.value)}
                    required
                    rows={2}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  />
                </div>
                <div className="flex justify-end space-x-4">
                  <button
                    type="button"
                    onClick={() => setIsAddingCard(false)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Add Card
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {cards.map((card) => (
              <li key={card.id} className="px-4 py-4 sm:px-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">{card.front}</div>
                    <div className="mt-1 text-sm text-gray-600">{card.back}</div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <button
                      onClick={() => handleDeleteCard(card.id)}
                      className="font-medium text-red-600 hover:text-red-500"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 