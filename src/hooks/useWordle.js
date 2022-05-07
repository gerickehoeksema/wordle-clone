import { useState } from 'react';

const useWordle = (solution) => {
    const [turn, setTurn] = useState(0);
    const [currentGuess, setCurrentGuess] = useState('');
    const [guesses, setGuesses] = useState([...Array(6)]);
    const [history, setHistory] = useState([]);
    const [isCorrect, setIsCorrect] = useState(false);
    const [usedKeys, setUsedKeys] = useState({}) // {a: 'grey', b: 'green', c: 'yellow'} etc

    const formatGuess = () => {
        let solutionArray = [...solution];
        let formattedGuess = [...currentGuess].map((l) => {
            return {key: l, color: 'grey'};
        });

        // Find correct letters - Green
        formattedGuess.forEach((l, i) => {
            if(solutionArray[i] ===  l.key) {
                formattedGuess[i].color = 'green';
                solutionArray[i] = null;
            }
        })

        // Find matching letters - Yellow
        formattedGuess.forEach((l, i) => {
            if(solutionArray.includes(l.key) && l.color !== 'green') {
                formattedGuess[i].color = 'yellow';
                solutionArray[solutionArray.indexOf(l.key)] = null;
            }
        })

        return formattedGuess;
    }

    const addNewGuess = (formattedGuess) => {
        if(currentGuess === solution){
            setIsCorrect(true);
        }

        setGuesses(prev => {
            let newGuesses = [...prev];
            newGuesses[turn] = formattedGuess
            return newGuesses;
        });

        setHistory(prev => {
            return [...prev, currentGuess]
        })

        setTurn(prev => {
            return prev + 1;
        })

        setUsedKeys(prevUsedKeys => {
            formattedGuess.forEach(l => {
              const currentColor = prevUsedKeys[l.key]
      
              if (l.color === 'green') {
                prevUsedKeys[l.key] = 'green'
                return
              }
              if (l.color === 'yellow' && currentColor !== 'green') {
                prevUsedKeys[l.key] = 'yellow'
                return
              }
              if (l.color === 'grey' && currentColor !== ('green' || 'yellow')) {
                prevUsedKeys[l.key] = 'grey'
                return
              }
            })
      
            return prevUsedKeys
          })

        setCurrentGuess('');
    }

    const handleKeyup = ({key}) => {
        if (isCorrect)
            return;

        if(key === 'Backspace') {
            setCurrentGuess((prev) => {
                return prev.slice(0, -1);
            });
            return;
        }

        if(/^[A-Za-z]$/.test(key)) {
            if(currentGuess.length < 5) {
                setCurrentGuess((prev) => {
                    return prev + key.toUpperCase();
                });
            }
        }

        if(key === 'Enter') {
            if(turn > 5) {
                return;
            }

            // Don't allow duplicate words
            if(history.includes(currentGuess)) {
                return;
            }

            if(currentGuess.length !== 5) {
                return;
            }

            const guess = formatGuess();
            addNewGuess(guess);
        }
    }

    return {
        turn,
        currentGuess,
        guesses,
        isCorrect,
        usedKeys,
        handleKeyup
    }
}

export default useWordle;