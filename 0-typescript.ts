// normal javascript is typescript
const example1 = () => {
  const greeter = name => `Hello, ${name}`
  greeter("Dan")
  greeter(5)
  greeter({ name: "Dan" })
}

// enhance javascript with type annotations
// this is equivalent to the above code
const example2 = () => {
  const greeter = (name: any) => `Hello, ${name}`
  greeter("Dan")
  greeter(5)
  greeter({ name: "Dan" })
}

// enhance with meaningful types
const example3 = () => {
  const greeter = (name: string) => `Hello, ${name}`
  greeter("Dan")
  greeter(5)
  greeter({ name: "Dan" })
}

// define your own types
const example4 = () => {
  type GreeterInput = { firstName: string }
  const greeter = (name: GreeterInput) => `Hello, ${name.firstName}`
  greeter({ firstName: "Dan" })
  greeter({ firstName: "Dan", lastName: "Taylor" }) // cannot have extra fields
}

// a better way to define a type
const example5 = () => {
  interface GreeterInput { firstName: string }
  const greeter = (name: GreeterInput) => `Hello, ${name.firstName}`
  greeter({ firstName: "Dan" })
  greeter({ firstName: "Dan", lastName: "Taylor" }) // cannot have extra fields
}

// extending interfaces
const example6 = () => {
  interface A { firstName: string }
  interface B extends A { lastName: string }
}

// type aliases
const example7 = () => {
  type GreeterInput = string
  const greeter = (name: GreeterInput) => `Hello, ${name}`
  greeter("Dan")
}

// optional fields
const example8 = () => {
  interface GreeterInput { firstName: string, lastName?: string }
  const greeter = (name: GreeterInput) => {
    const fullName = name.lastName !== undefined ? `${name.firstName} ${name.lastName}` : name.firstName
    return `Hello, ${fullName}`
  }
  greeter({ firstName: "Dan" })
  greeter({ firstName: "Dan", lastName: "Taylor" }) // cannot have extra fields
}

// readonly fields
{
  interface Name { readonly firstName: string }
  const name: Name = { firstName: "Dan" }
  name.firstName = "test"
}

// function types
{
  interface Name { firstName: string, lastName?: string }
  type NameFactory = (firstName: string, lastName?: string) => Name
  const createName: NameFactory = (firstName, lastName) => ({ firstName, lastName })
  const createName2 = (firstName: string, lastName: string): Name => ({ firstName, lastName })
  const name: Name = createName("Dan", "Taylor")
}

// keys are compared, not explicit type names
{
  interface A { firstName: string }
  interface B { firstName: string, lastName: string }
  const myB: B = { firstName: "Dan", lastName: "Taylor" }
  const fn = (a: A) => console.log(a)
  fn(myB)

  // delete B.firstName and it won't compile
}

// class types
{
  interface IName {
    getName: () => string
    setName: (name: string) => void
  }

  class Name implements IName {
    constructor(private name: string = "") {}

    public getName() { return name }

    public setName = (newName: string) => {
      this.name = newName
    }
  }

  const Dan: IName = new Name("Dan")

  const createName = (name: string): IName => {
    let innerName = name

    return {
      getName: () => innerName,
      setName: (newName: string) => innerName = newName,
    }
  }

  const OtherDan: IName = createName("Dan")

  // typescript compares keys, not explicit type names
  // these are both IName because they have the same
  // properties and operations
}

// union types
{
  type Input = string | number
  const fn = (count: Input) => { console.log(count) }
}

// enums
{
  enum Direction {
    Up = 1,
    Down,
    Left,
    Right,
  }

  const dir: Direction = Direction.Up

  enum Orientation {
    Left = "LEFT",
    Right = "RIGHT",
  }
}

// implicit typing
{
  const createThing = () => ({ thing: "stuff" })
  console.log(createThing().stuff)
  console.log(createThing().thing)
}

// Not going into defintion files, ambients, modules, namespaces, etc
