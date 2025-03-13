import DeckContent from './DeckContent';

interface PageProps {
  params: {
    deckId: string;
  };
}

export default function DeckPage({ params }: PageProps) {
  return <DeckContent deckId={params.deckId} />;
} 
