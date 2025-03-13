import DeckContent from './DeckContent';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Deck Details - FlashCardPro',
  description: 'View and manage your flashcard deck',
};

type Props = {
  params: Promise<{
    deckId: string;
  }>;
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function DeckPage({ params }: Props) {
  const { deckId } = await params;
  return <DeckContent deckId={deckId} />;
} 
