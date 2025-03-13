import DeckContent from './DeckContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deck Details - FlashCardPro',
  description: 'View and manage your flashcard deck',
};

type Props = {
  params: {
    deckId: string;
  };
  searchParams: { [key: string]: string | string[] | undefined };
};

export default function DeckPage({ params }: Props) {
  return <DeckContent deckId={params.deckId} />;
} 
