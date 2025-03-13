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
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export default async function DeckPage({ params, searchParams }: Props) {
  const [{ deckId }] = await Promise.all([params, searchParams]);
  return <DeckContent deckId={deckId} />;
} 
