import {World} from "./engine/world.js"
import {parseJava} from "./compiler/javaParser.js"
import {Mario} from "./domain/mario.js"
import {loadSprite} from "./engine/spriteLoader.js"

const world = new World("world")
let mario

async function init() {
  const sprites = {
    small: await loadSprite("./assets/sprites/mario/mario_small.png"),
    big: await loadSprite("./assets/sprites/mario/mario_big.png"),
    cape: await loadSprite("./assets/sprites/mario/mario_power-up.png")
  }

  const animationConfig = await fetch("./assets/sprites/mario/mario.animations.json")
    .then(r => r.json())

  mario = new Mario(sprites, animationConfig)
  world.spawn(mario)
}

init()

document.getElementById("compile").onclick = () => {
  if (!mario) return

  const code = document.getElementById("javaCode").value
  const classModel = parseJava(code)

  mario.applyClassModel(classModel)
}

const translations = {
  pt: {
    title: "Mario OOP Playground",
    compile: "Compilar Mario",
    subTitle: "Descrição",
    text: `
      Esta demo tem como proposta mostrar, de forma visual e interativa, os conceitos de <b>herança</b> e <b>interface</b> utilizando o tema Mario, como uma iniciativa do <b>Colab Team @SouJava</b> para o <b>#MarioDay</b>.
      <br><br>
      Neste exemplo, o Mario é inicialmente um <b>personagem</b> e, por isso, recebe como herança todas as características de um tipo <b>Character</b>. Isso significa que ele pode <b>andar, correr e pular</b>, além de se comportar como uma entidade ativa dentro do cenário.
      <br><br>
      Por outro lado, ao adicionar a característica de <b>objeto</b>, ele deixa de se comportar como um personagem e passa a assumir as propriedades de um tipo <b>Object</b>. Com isso, ele perde as ações de movimento, fica estático e passa a ser representado como uma entidade passiva no ambiente.
      <br><br>
      A demo também mostra como as <b>interfaces</b> podem adicionar novos elementos e capacidades sem alterar a herança principal da classe. Esse é o caso dos <b>power-ups do Mario</b>, que acrescentam habilidades e modificações visuais sem mudar sua base principal na hierarquia.
      <br><br>
      Mas existe um detalhe a mais: esta demo possui <b>três poderes</b>. Dois deles aparecem de forma mais evidente. O terceiro foi deixado como uma pequena surpresa e pode ser usado <b>em conjunto com os outros, por meio da concatenação de interfaces</b>.
      <br><br>
      <b>Boa sorte para descobrir qual é.</b>
    `
  },

  en: {
    title: "Mario OOP Playground",
    compile: "Compile Mario",
    subTitle: "Description",
    text: `
      This demo aims to visually and interactively present the concepts of <b>inheritance</b> and <b>interfaces</b> using the Mario theme, as an initiative by <b>Colab Team @SouJava</b> for <b>#MarioDay</b>.
      <br><br>
      In this example, Mario is initially a <b>character</b>, and because of that, he inherits all the characteristics of a <b>Character</b> type. This means he can <b>walk, run, and jump</b>, behaving as an active entity in the scene.
      <br><br>
      On the other hand, when the <b>object</b> characteristic is added, he no longer behaves like a character and starts assuming the properties of an <b>Object</b> type. As a result, he loses his movement actions, becomes static, and is represented as a passive entity in the environment.
      <br><br>
      The demo also shows how <b>interfaces</b> can add new elements and capabilities without changing the main inheritance of the class. This is the case with <b>Mario’s power-ups</b>, which add abilities and visual changes without modifying his main place in the class hierarchy.
      <br><br>
      But there is one more detail: this demo contains <b>three powers</b>. Two of them are shown more explicitly. The third was left as a small surprise and can be used <b>together with the others through interface concatenation</b>.
      <br><br>
      <b>Good luck figuring out which one it is.</b>
    `
  }
}

let currentLang = "en"

function applyLanguage(lang) {
  document.getElementById("title").innerText = translations[lang].title
  document.getElementById("compile").innerText = translations[lang].compile
  document.getElementById("subTitle").innerText = translations[lang].subTitle
  document.getElementById("text").innerHTML = translations[lang].text
  document.getElementById("langToggle").innerText = lang === "pt" ? "EN" : "PT"
}

document.getElementById("langToggle").addEventListener("click", () => {
  currentLang = currentLang === "pt" ? "en" : "pt"
  applyLanguage(currentLang)
})

applyLanguage(currentLang)