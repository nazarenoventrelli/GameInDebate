import React, { useState } from 'react';
import CardDisplay from './CardDisplay';
import { CARD_DECKS } from '../constants/cards';

interface GroupCardProps {
  name: string;
  color: string;
  bgColor: string;
  cards: Array<{
    id: number;
    agree: boolean;
    originalColor?: string;
    originalBgColor?: string;
    isFromPreviousGroup?: boolean;
    previousGroupIndex?: number;
  }>;
  showCards?: boolean;
  colorKey: string;
  onCardClick?: (cardId: number) => void;
}

const GroupCard: React.FC<GroupCardProps> = ({
  name,
  color,
  bgColor,
  cards,
  showCards = true,
  colorKey,
  onCardClick
}) => {
  const [selectedCard, setSelectedCard] = useState<{
    id: number;
    text: string;
    color: string;
    bgColor: string;
    agree: boolean;
    isFromPreviousGroup?: boolean;
  } | null>(null);

  const handleCardClick = (cardId: number, agree: boolean) => {
    if (onCardClick) {
      onCardClick(cardId);
      return;
    }

    const card = CARD_DECKS[colorKey].cards.find(c => c.id === cardId);
    if (card) {
      const cardData = [...cards].reverse().find(card => card.id === cardId);

      let textToAssign = card.text;
      if (cardData?.isFromPreviousGroup) {
        const previousColor: string = cardData.originalColor ?? '';
        const deck = Object.values(CARD_DECKS).find(deck => deck.color === previousColor);
        textToAssign = deck?.cards.find(c => c.id === cardId)?.text ?? textToAssign;
      }

      setSelectedCard({
        id: cardId,
        text: textToAssign,
        color: cardData?.originalColor || color,
        bgColor: cardData?.originalBgColor || bgColor,
        agree,
        isFromPreviousGroup: cardData?.isFromPreviousGroup
      });
    }
  };

  const agreeCards = cards.filter(card => card.agree);
  const disagreeCards = cards.filter(card => !card.agree);

  return (
    <>
      <div
        className="p-6 rounded-lg shadow-lg"
        style={{ backgroundColor: bgColor, borderLeft: `6px solid ${color}` }}
      >
        <h3 className="text-xl font-semibold mb-4" style={{ color }}>
          {name}
        </h3>
        {showCards && (
          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-green-700">De Acuerdo:</h4>
              <div className="flex flex-wrap gap-2">
                {agreeCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id, card.agree)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity cursor-pointer ${card.isFromPreviousGroup ? 'ring-2 ring-white' : ''
                      }`}
                    style={{
                      backgroundColor: card.originalColor || color
                    }}
                    title={card.isFromPreviousGroup ? 'Carta del grupo anterior' : undefined}
                  >
                    {card.id}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-2 text-red-700">En Desacuerdo:</h4>
              <div className="flex flex-wrap gap-2">
                {disagreeCards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card.id, card.agree)}
                    className={`w-8 h-8 rounded flex items-center justify-center text-white font-bold hover:opacity-80 transition-opacity cursor-pointer ${card.isFromPreviousGroup ? 'ring-2 ring-white' : ''
                      }`}
                    style={{
                      backgroundColor: card.originalColor || color
                    }}
                    title={card.isFromPreviousGroup ? 'Carta del grupo anterior' : undefined}
                  >
                    {card.id}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {selectedCard && (
        <CardDisplay
          text={selectedCard.text}
          color={selectedCard.color}
          bgColor={selectedCard.bgColor}
          show={true}
          onClose={() => setSelectedCard(null)}
          showResponseButtons={false}
          isFromPreviousGroup={selectedCard.isFromPreviousGroup}
          mode="review"
          timer={null}
        />
      )}
    </>
  );
};

export default GroupCard;