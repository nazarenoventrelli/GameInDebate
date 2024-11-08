import React, { useState, useRef, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Volume2, VolumeX } from 'lucide-react';
import SpinningWheel from './components/SpinningWheel';
import GroupCard from './components/GroupCard';
import AddGroupModal from './components/AddGroupModal';
import CardDisplay from './components/CardDisplay';
import Timer from './components/Timer';
import InstructionsModal from './components/InstructionsModal';
import IntroSection from './components/IntroSection';
import { CARD_DECKS } from './constants/cards';

const COLORS = ['red', 'green', 'purple', 'blue'];
const TOTAL_CARDS = 12;
const MIN_GROUPS = 4;
const BACKGROUND_MUSIC_URL = 'https://docs.google.com/uc?export=download&id=14xup8fgW1hkQDW9WMzZgwGrtoD6uCllZ';
const GAME_DURATION = 30 * 60; 

interface Group {
  id: number;
  name: string;
  colorKey: string;
  cards: Array<{
    id: number;
    agree: boolean;
    originalColor?: string;
    originalBgColor?: string;
    isFromPreviousGroup?: boolean;
    previousGroupIndex?: number;
  }>;
}

function App() {
  const [groups, setGroups] = useState<Group[]>([]);
  const [currentGroup, setCurrentGroup] = useState<number | null>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<number | null>(null);
  const [showNameModal, setShowNameModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [availableColors, setAvailableColors] = useState([...COLORS]);
  const [selectedColor, setSelectedColor] = useState(COLORS[0]);
  const [initialSpins, setInitialSpins] = useState<{index: number, roll: number}[]>([]);
  const [cardDecks, setCardDecks] = useState(CARD_DECKS);
  const [showCard, setShowCard] = useState(false);
  const [currentCard, setCurrentCard] = useState<{
    id: number;
    text: string;
    color: string;
    bgColor: string;
    isFromPreviousGroup?: boolean;
    previousGroupIndex?: number;
  } | null>(null);
  const [gameEnded, setGameEnded] = useState(false);
  const [showTimer, setShowTimer] = useState(false);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const [isClockwise, setIsClockwise] = useState(true);
  const [gameTimeUp, setGameTimeUp] = useState(false);
  const [extraTurnAvailable, setExtraTurnAvailable] = useState(false);
  const [showInstructionsModal, setShowInstructionsModal] = useState(false);
  const [setupStarted, setSetupStarted] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);
  const musicRef = useRef<HTMLAudioElement>(null);
  const buzzerRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (musicRef.current) {
      musicRef.current.src = BACKGROUND_MUSIC_URL;
      musicRef.current.loop = true;
      musicRef.current.volume = 0.5;
    }
  }, []);

  useEffect(() => {
    const audioElements = [audioRef.current, musicRef.current, buzzerRef.current];
    
    audioElements.forEach(audio => {
      if (audio) {
        audio.muted = !isSoundEnabled;
        if (!isSoundEnabled) {
          audio.pause();
        } else if (audio === musicRef.current) {
          audio.play().catch(() => {
            console.log('Music autoplay prevented');
          });
        }
      }
    });
  }, [isSoundEnabled]);

  useEffect(() => {
    if (isSpinning && audioRef.current && isSoundEnabled) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {
        console.log('Spin sound autoplay prevented');
      });
    }
  }, [isSpinning, isSoundEnabled]);

  const handleTimeUp = () => {
    if (buzzerRef.current && isSoundEnabled) {
      buzzerRef.current.currentTime = 0;
      buzzerRef.current.volume = 1;
      buzzerRef.current.play().catch(() => {
        console.log('Buzzer sound autoplay prevented');
      });
    }
    setShowCard(false);
    setCurrentCard(null);
    setShowTimer(false);
    nextTurn();
  };

  const handleGameTimeUp = () => {
    setGameTimeUp(true);
    setGameEnded(true);
  };

  const handleAddGroup = () => {
    if (groups.length >= 4) return;
    setShowNameModal(true);
  };

  const handleCreateGroup = () => {
    if (!groupName.trim()) return;
    
    const newGroup: Group = {
      id: Date.now(),
      name: groupName,
      colorKey: selectedColor,
      cards: []
    };

    setGroups([...groups, newGroup]);
    setGroupName('');
    setAvailableColors(availableColors.filter(c => c !== selectedColor));
    setSelectedColor(availableColors.filter(c => c !== selectedColor)[0]);
    setShowNameModal(false);
  };

  const handleCardResponse = (agree: boolean) => {
    if (!currentCard || currentGroup === null) return;

    const updatedGroups = [...groups];
    updatedGroups[currentGroup].cards.push({
      id: currentCard.id,
      agree,
      originalColor: currentCard.color,
      originalBgColor: currentCard.bgColor,
      isFromPreviousGroup: currentCard.isFromPreviousGroup,
      previousGroupIndex: currentCard.previousGroupIndex
    });

    const totalCards = updatedGroups[currentGroup].cards.length;
    if (totalCards >= TOTAL_CARDS) {
      setGameEnded(true);
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }

    setGroups(updatedGroups);
    setShowCard(false);
    setCurrentCard(null);
    setShowTimer(false);
    
    if (extraTurnAvailable) {
      setExtraTurnAvailable(false);
    } else {
      nextTurn();
    }
  };

  const getPreviousGroupIndex = () => {
    if (currentGroup === null) return null;
    return isClockwise 
      ? (currentGroup - 1 + groups.length) % groups.length
      : (currentGroup + 1) % groups.length;
  };

  const spinWheel = () => {
    if (isSpinning || groups.length < MIN_GROUPS) return;
    
    setIsSpinning(true);
    const maxNumber = gameStarted ? 16 : 12;
    const result = Math.floor(Math.random() * maxNumber) + 1;

    setTimeout(() => {
      setSpinResult(result);
      setIsSpinning(false);

      if (!gameStarted) {
        setInitialSpins(prev => [...prev, { index: groups.length - prev.length - 1, roll: result }]);
      } else if (currentGroup !== null) {
        if (result <= 12) {
          const group = groups[currentGroup];
          const deck = cardDecks[group.colorKey];
          const availableCards = deck.cards.filter(card => !card.used);
          
          if (availableCards.length > 0) {
            const card = availableCards[result % availableCards.length];
            
            const newDecks = { ...cardDecks };
            newDecks[group.colorKey].cards = deck.cards.map(c => 
              c.id === card.id ? { ...c, used: true } : c
            );
            setCardDecks(newDecks);

            setCurrentCard({
              id: card.id,
              text: card.text,
              color: deck.color,
              bgColor: deck.bgColor,
              isFromPreviousGroup: false
            });
            setShowCard(true);
            setShowTimer(true);
          }
        } else {
          switch (result) {
            case 13:
              setIsClockwise(!isClockwise);
              nextTurn();
              break;
            case 14: {
              const previousGroupIndex = getPreviousGroupIndex();
              if (previousGroupIndex !== null) {
                const previousGroup = groups[previousGroupIndex];
                const previousDeck = cardDecks[previousGroup.colorKey];
                const availableCards = previousDeck.cards.filter(card => 
                  !card.used && !previousGroup.cards.some(c => c.id === card.id)
                );

                if (availableCards.length > 0) {
                  const card = availableCards[Math.floor(Math.random() * availableCards.length)];
                  
                  const newDecks = { ...cardDecks };
                  newDecks[previousGroup.colorKey].cards = previousDeck.cards.map(c => 
                    c.id === card.id ? { ...c, used: true } : c
                  );
                  setCardDecks(newDecks);

                  setCurrentCard({
                    id: card.id,
                    text: card.text,
                    color: previousDeck.color,
                    bgColor: previousDeck.bgColor,
                    isFromPreviousGroup: true,
                    previousGroupIndex
                  });
                  setShowCard(true);
                  setShowTimer(true);
                } else {
                  nextTurn();
                }
              }
              break;
            }
            case 15:
              setExtraTurnAvailable(true);
              spinWheel();
              break;
            case 16:
              nextTurn();
              break;
            default:
              nextTurn();
          }
        }
      }
    }, 3000);
  };

  const startGame = () => {
    if (groups.length < MIN_GROUPS) return;
    
    const winner = initialSpins.reduce((prev, curr) => 
      curr.roll < prev.roll ? curr : prev
    );

    setCurrentGroup(winner.index);
    setGameStarted(true);
    setInitialSpins([]);
  };

  const nextTurn = () => {
    if (gameEnded) return;
    setCurrentGroup(prev => {
      if (prev === null) return 0;
      return isClockwise 
        ? (prev + 1) % groups.length
        : (prev - 1 + groups.length) % groups.length;
    });
  };

  const allGroupsHaveInitialRoll = groups.length === MIN_GROUPS && initialSpins.length === MIN_GROUPS;
  
  const getStartingGroup = () => {
    if (!allGroupsHaveInitialRoll) return null;
    const winner = initialSpins.reduce((prev, curr) => 
      curr.roll < prev.roll ? curr : prev
    );
    return groups[winner.index];
  };

  const startingGroup = getStartingGroup();

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col">
      <audio ref={audioRef} src="https://assets.mixkit.co/active_storage/sfx/2017/2017-preview.mp3" />
      <audio ref={musicRef} />
      <audio ref={buzzerRef} src="https://assets.mixkit.co/active_storage/sfx/2880/2880-preview.mp3" />
      
      <div className="fixed top-4 right-4 flex items-center gap-4">
        {gameStarted && !gameEnded && (
          <Timer seconds={GAME_DURATION} isActive={true} onTimeUp={handleGameTimeUp} />
        )}
        <button
          onClick={() => setIsSoundEnabled(!isSoundEnabled)}
          className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-100"
        >
          {isSoundEnabled ? <Volume2 /> : <VolumeX />}
        </button>
      </div>

      <div className="max-w-6xl mx-auto w-full px-8 py-8 flex-grow">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-indigo-900 mb-4">
            Juego en Debate
          </h1>
          
          {!setupStarted && (
            <IntroSection onStart={() => setSetupStarted(true)} />
          )}
        </div>

        {setupStarted && (
          <>
            {gameEnded ? (
              <div className="space-y-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-green-600 mb-4">
                    ¡{gameTimeUp ? 'Tiempo Agotado' : 'Juego Terminado'}!
                  </h2>
                  {gameTimeUp ? (
                    <p className="text-xl mb-4">
                      Se acabó el tiempo del juego (30 minutos)
                    </p>
                  ) : (
                    <p className="text-xl mb-4">
                      El grupo {groups.find(g => g.cards.length >= TOTAL_CARDS)?.name} ha completado todas sus tarjetas.
                    </p>
                  )}
                  <p className="text-lg text-gray-600">
                    Puede revisar las tarjetas de cada grupo haciendo clic en ellas para continuar el debate.
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groups.map((group) => (
                    <GroupCard
                      key={group.id}
                      name={group.name}
                      color={CARD_DECKS[group.colorKey].color}
                      bgColor={CARD_DECKS[group.colorKey].bgColor}
                      cards={group.cards}
                      showCards={true}
                      colorKey={group.colorKey}
                    />
                  ))}
                </div>
              </div>
            ) : !gameStarted ? (
              <div className="space-y-8">
                {!allGroupsHaveInitialRoll && (
                  <div className="flex justify-center">
                    <button
                      onClick={handleAddGroup}
                      className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                      disabled={groups.length >= 4}
                    >
                      Agregar Grupo
                    </button>
                  </div>
                )}

                {groups.length === MIN_GROUPS && !allGroupsHaveInitialRoll && (
                  <div className="flex justify-center">
                    <SpinningWheel
                      isSpinning={isSpinning}
                      result={spinResult}
                      onSpin={spinWheel}
                      gameStarted={false}
                    />
                  </div>
                )}

                {allGroupsHaveInitialRoll && startingGroup && (
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-center">
                      <h2 className="text-2xl font-bold mb-2">¡Comienza el juego!</h2>
                      <p className="text-xl">
                        Empieza el grupo{' '}
                        <span 
                          className="font-bold" 
                          style={{ color: CARD_DECKS[startingGroup.colorKey].color }}
                        >
                          {startingGroup.name}
                        </span>{' '}
                        con el número más bajo: {Math.min(...initialSpins.map(spin => spin.roll))}
                      </p>
                    </div>
                    <button
                      onClick={startGame}
                      className="bg-green-600 text-white px-8 py-4 rounded-lg text-lg hover:bg-green-700 transition"
                    >
                      Iniciar Juego
                    </button>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groups.map((group, index) => (
                    <div key={group.id} className="relative">
                      <GroupCard
                        name={group.name}
                        color={CARD_DECKS[group.colorKey].color}
                        bgColor={CARD_DECKS[group.colorKey].bgColor}
                        cards={group.cards}
                        showCards={false}
                        colorKey={group.colorKey}
                      />
                      {initialSpins.find(spin => spin.index === index) && (
                        <div className="absolute top-2 right-2 w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold">
                          {initialSpins.find(spin => spin.index === index)?.roll}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-bold">
                    Turno Actual: {currentGroup !== null ? groups[currentGroup].name : ''}
                  </h2>
                  <p className="text-gray-600">
                    Dirección: {isClockwise ? '→ Horario' : '← Antihorario'}
                  </p>
                </div>

                <div className="flex justify-center">
                  <SpinningWheel
                    isSpinning={isSpinning}
                    result={spinResult}
                    onSpin={spinWheel}
                    gameStarted={true}
                    extraTurn={extraTurnAvailable}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {groups.map((group) => (
                    <GroupCard
                      key={group.id}
                      name={group.name}
                      color={CARD_DECKS[group.colorKey].color}
                      bgColor={CARD_DECKS[group.colorKey].bgColor}
                      cards={group.cards}
                      showCards={true}
                      colorKey={group.colorKey}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <div className="w-full h-24 bg-cover bg-center bg-no-repeat mt-auto" style={{ backgroundImage: 'url(https://i.imgur.com/UMraDO3.jpeg)' }} />

      <AddGroupModal
        show={showNameModal}
        groupName={groupName}
        selectedColor={selectedColor}
        colors={availableColors}
        usedColors={COLORS.filter(c => !availableColors.includes(c))}
        onClose={() => setShowNameModal(false)}
        onNameChange={setGroupName}
        onColorSelect={setSelectedColor}
        onSubmit={handleCreateGroup}
      />

      {currentCard && (
        <CardDisplay
          text={currentCard.text}
          color={currentCard.color}
          bgColor={currentCard.bgColor}
          show={showCard}
          onClose={() => {
            setShowCard(false);
            setCurrentCard(null);
            setShowTimer(false);
            if (!gameEnded) {
              nextTurn();
            }
          }}
          onResponse={handleCardResponse}
          showResponseButtons={true}
          timer={showTimer && <Timer seconds={60} isActive={true} onTimeUp={handleTimeUp} />}
          isFromPreviousGroup={currentCard.isFromPreviousGroup}
          mode="game"
        />
      )}

      <InstructionsModal
        show={showInstructionsModal}
        onClose={() => setShowInstructionsModal(false)}
      />
    </div>
  );
}

export default App;