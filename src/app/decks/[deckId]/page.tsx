import DeckContent from './DeckContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deck Details - FlashCardPro',
  description: 'View and manage your flashcard deck',
};

interface PageProps {
  params: {
    deckId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function DeckPage({ params }: PageProps) {
  return <DeckContent deckId={params.deckId} />;
} 
