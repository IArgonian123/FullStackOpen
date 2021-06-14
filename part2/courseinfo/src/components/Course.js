const Course = ({ course }) => {
    return (
    <div>
        <Header course={course} />
        <Content course={course} />
        <Total course={course} />
    </div>
    )    
}

const Header = ({ course }) => {
  return (
    <h1>{course.name}</h1>
  )
}
  
const Total = ({ course }) => {
  const sum = course.parts.reduce((s, c) => s + c.exercises, 0)

  return(
    <h3>total of {sum} exercises</h3>
  ) 
}

const Part = (props) => {
  return (
    <p>
      {props.part.name} {props.part.exercises}
    </p>    
  )
}

const Content = ({ course }) => {
  return (
    <div>
      {course.parts.map(part => <Part part={part} key={part.id} />)}
    </div>
  )
}

export default Course