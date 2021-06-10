import React, { useState } from 'react'

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const feedbackSection = "give feedback"
  const statisticsSection = "statistics"

  const goodHandler = () => {
    setGood(good + 1)
  }

  const neutralHandler = () => {
    setNeutral(neutral + 1)
  }

  const badHandler = () => {
    setBad(bad + 1)
  }

  return (
    <div>
      <SectionTitle text={feedbackSection} />
      <FeedbackButton text="good" handleClick={goodHandler} />
      <FeedbackButton text="neutral" handleClick={neutralHandler} />
      <FeedbackButton text="bad" handleClick={badHandler} />
      <SectionTitle text={statisticsSection} />
      <Statistics values={[good, neutral, bad]} />
    </div>
  )
}

const SectionTitle = ({ text }) => <h1>{text}</h1>

const FeedbackButton = ({ text, handleClick }) => (
  <button onClick={handleClick}> 
    {text} 
  </button>
)

const Statistics = ({ values }) => {

  const [good, neutral, bad] = values
  let total = good + neutral + bad

  if (total === 0) {
    return <p> No feedback given </p>
  }

  let avg = (good - bad) / total
  let pos = (good / total) * 100

  return (
  <table>
    <tbody>
      <Statistic text="good" value={good} />
      <Statistic text="neutral" value={neutral} />
      <Statistic text="bad" value={bad} />
      <Statistic text="all" value={total} />
      <Statistic text="average" value={avg} />
      <Statistic text="positive" value={pos + " %"} /> 
    </tbody>
  </table>
  )
}

const Statistic = ({ text, value }) => (
  <tr> 
    <td>{text}</td>
    <td>{value}</td>
  </tr>
)

export default App