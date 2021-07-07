import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { voteAnecdote } from '../reducers/anecdoteReducer' 
import { setMessage } from '../reducers/messageReducer'

const Anecdote = ({ anecdote, handleClick }) => {
  return (
    <div>
      <div>
        {anecdote.content}
      </div>
      <div>
        has {anecdote.votes}
        <button onClick={handleClick}>vote</button>
      </div>
    </div>
  )
}

const AnecdoteList = () => {
  const anecdotes = useSelector(({ anecdotes, filter }) => {
    const shownAnecdotes = filter 
      ? anecdotes.filter(anecdote => anecdote.content.toLowerCase().indexOf(filter.toLowerCase()) !== -1)
      : anecdotes

    return (shownAnecdotes.sort((anecdoteA, anecdoteB) => 
      anecdoteB.votes - anecdoteA.votes
    ))
  })
  const dispatch = useDispatch()
  
  const vote = anecdote => {
    dispatch(voteAnecdote(anecdote))
    dispatch(setMessage(`you voted '${anecdote.content}'`, 5))
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <Anecdote
          key={anecdote.id}
          anecdote={anecdote}
          handleClick={() => vote(anecdote)}
        />
      )}
    </div>
  )
}

export default AnecdoteList