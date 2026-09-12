import './App.css'

interface CoursePartBase {
  name: string
  exerciseCount: number
}

interface CoursePartDescription extends CoursePartBase {
  description: string
}

interface CoursePartBasic extends CoursePartDescription {
  kind: 'basic'
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number
  kind: 'group'
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string
  kind: 'background'
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[]
  kind: 'special'
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial

const courseParts: CoursePart[] = [
  {
    name: 'Fundamentals',
    exerciseCount: 10,
    description: 'This is an awesome course part',
    kind: 'basic',
  },
  {
    name: 'Using props to pass data',
    exerciseCount: 7,
    groupProjectCount: 3,
    kind: 'group',
  },
  {
    name: 'Basics of type Narrowing',
    exerciseCount: 7,
    description: 'How to go from unknown to string',
    kind: 'basic',
  },
  {
    name: 'Deeper type usage',
    exerciseCount: 14,
    description: 'Confusing description',
    backgroundMaterial: 'https://type-level-typescript.com/template-literal-types',
    kind: 'background',
  },
  {
    name: 'Backend development',
    exerciseCount: 21,
    description: 'Typing the backend',
    requirements: ['nodejs', 'jest'],
    kind: 'special',
  },
]

const assertNever = (value: never): never => {
  throw new Error(`Unhandled course part: ${JSON.stringify(value)}`)
}

const Header = ({ name }: { name: string }) => <h1>{name}</h1>

const Part = ({ part }: { part: CoursePart }) => {
  switch (part.kind) {
    case 'basic':
      return <p>{part.description}</p>
    case 'group':
      return <p>Group projects: {part.groupProjectCount}</p>
    case 'background':
      return <p>Background material: {part.backgroundMaterial}</p>
    case 'special':
      return <p>Requirements: {part.requirements.join(', ')}</p>
    default:
      return assertNever(part)
  }
}

const Content = ({ parts }: { parts: CoursePart[] }) => (
  <section>
    {parts.map((part) => (
      <article key={part.name}>
        <h2>{part.name}</h2>
        <p>Exercises: {part.exerciseCount}</p>
        <Part part={part} />
      </article>
    ))}
  </section>
)

const Total = ({ parts }: { parts: CoursePart[] }) => (
  <p className="total">
    Number of exercises {parts.reduce((sum, part) => sum + part.exerciseCount, 0)}
  </p>
)

const App = () => (
  <main>
    <Header name="Half Stack application development" />
    <Content parts={courseParts} />
    <Total parts={courseParts} />
  </main>
)

export default App
