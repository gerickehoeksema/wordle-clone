import React, { useEffect, useState } from 'react'

export default function Keypad({usedKeys }) {
    const [letters, setLetters] = useState(null);

    useEffect(() => {
        fetch('http://localhost:3001/letters')
        .then(resp => resp.json())
        .then(json => {
          setLetters(json)
        })
      }, [setLetters])

  return (
    <div className='keypad'>
        {letters && letters.map(l => {
            const color = usedKeys[l.key.toUpperCase()]

            return (
                <div key={l.key} className={color}>{l.key.toUpperCase()}</div>
            )
        })}
    </div>
  )
}
