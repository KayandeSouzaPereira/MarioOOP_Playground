# Mario OOP Playground

## About the Project

Mario OOP Playground is an interactive educational demo created to visually demonstrate Object-Oriented Programming concepts using the Mario universe.

Instead of showing only static code examples, this demo transforms Java-like class definitions into visible changes in Mario’s behavior, appearance, and abilities.

## Demo Proposal

This demo aims to visually and interactively present the concepts of inheritance and interfaces using the Mario theme, as an initiative by Colab Team @SouJava for #MarioDay.

In this example, Mario is initially a character, and because of that, he inherits all the characteristics of a Character type. This means he can walk, run, and jump, behaving as an active entity in the scene.

On the other hand, when the object characteristic is added, he no longer behaves like a character and starts assuming the properties of an Object type. As a result, he loses his movement actions, becomes static, and is represented as a passive entity in the environment.

The demo also shows how interfaces can add new elements and capabilities without changing the main inheritance of the class. This is the case with Mario’s power-ups, which add abilities and visual changes without modifying his main place in the class hierarchy.

But there is one more detail: this demo contains three powers. Two of them are shown more explicitly. The third was left as a small surprise and can be used together with the others through interface concatenation.


## Concepts Demonstrated

This project demonstrates:

- **Inheritance**
  - `Mario extends Character`
  - `Mario extends Object`

- **Interfaces**
  - `implements Cape`
  - `implements SuperMushroom`
  - `hidden extra interface`

- **Behavior changes based on type**
  - character behavior
  - object behavior

- **Visual state changes**
  - form transformation
  - temporary effects


## Tecnologies

- HTML5
- CSS3
- JavaScript (ES Modules)
- Canvas API
- Sprite-based animation


## How to Use

1. Open the project in the browser
2. Edit the Java example in the code area
3. Click **Compile Mario**
4. Observe how Mario changes visually and behaviorally

The demo interprets:
- the base class through `extends`
- extra capabilities through `implements`

## Credits

Created by **Kayan De Souza**.

Special thanks to **SouJava** for the theme and for the initiative that inspired this project during **#MarioDay**.