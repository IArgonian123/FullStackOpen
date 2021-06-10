import React, { useState } from 'react'

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blod tests when dianosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Array(anecdotes.length).fill(0))

  const nextHandler = () => {
    const getRandomInt = max => Math.floor(Math.random() * max)

    let newSelected
    do {
      newSelected = getRandomInt(anecdotes.length - 1)
    } while (newSelected === selected)

    setSelected(newSelected)
  }

  const voteHandler = () => {
    const copy = [...votes]
    copy[selected]++

    setVotes(copy)
  }

  let mostVoted = votes.indexOf(Math.max(...votes))


  return (
    <div>
      <SectionTitle text= "Anecdote of the day"/>
      <SectionBody text={anecdotes[selected]} value={votes[selected]} />
      <Button text="vote" clickHandler={voteHandler} />
      <Button text="next anecdote" clickHandler={nextHandler} />
      <SectionTitle text= "Anecdote with most votes"/>
      <SectionBody text={anecdotes[mostVoted]} value={votes[mostVoted]} />
    </div>
  )
}

const SectionTitle = ({ text }) => (
  <h1>
    {text}
  </h1>
)

const SectionBody = ({ text, value }) => (
  <> 
    {text} <br/>
    has {value} votes <br/>
  </>
)


const Button = ({ text, clickHandler }) => (
  <button onClick={clickHandler}>
    {text}
  </button>
)

export default App