let state

function getState() {
  return JSON?.parse(localStorage['state'])
}

function setState(state) {
  localStorage['state'] = JSON?.stringify(state)
}

function initState() {
  state = {
    domHasteInicial: null,
    domHasteAuxiliar: null,
    domHasteFinal: null,
    domTentatives: null,
    sourceId: null,
    hasteInicial: [],
    hasteAuxiliar: [],
    hasteFinal: [],
    tentatives: 0,
    selectedDisc: 3,
  }
  setState(state)
}

const colors = [
  'blue',
  'aqua',
  'blueviolet',
  'dodgerblue',
  'violet',
  'red',
  'gold',
  'green',
]

function getColorByIndex(index) {
  return colors[index]
}

function getWidthByIndex(index) {
  return 20 * (index + 1) + 'px'
}

function createDomItem(item) {
  const domItem = document.createElement('div')
  domItem.classList.add('item')
  domItem.id = item
  domItem.draggable = true
  domItem.ondragstart = drag
  domItem.ondragover = false
  domItem.style.backgroundColor = getColorByIndex(item)
  domItem.style.width = getWidthByIndex(item)
  return domItem
}

function getDomHastesRefs() {
  state.domHasteInicial = document.querySelector('#hasteInicial')
  state.domHasteAuxiliar = document.querySelector('#hasteAuxiliar')
  state.domHasteFinal = document.querySelector('#hasteFinal')
  state.domTentatives = document.querySelector('#tentatives')
  setState(state)
}

function cleanHastes() {
  state.domHasteInicial.innerHTML = ''
  state.domHasteAuxiliar.innerHTML = ''
  state.domHasteFinal.innerHTML = ''
  setState(state)
}

function prepareDom() {
  getDomHastesRefs()
  cleanHastes()
}

function render(hastes, domHaste) {
  hastes.forEach((item) => {
    const domItem = createDomItem(item)
    domHaste.appendChild(domItem)
  })
}

function allowDrop(ev) {
  ev.preventDefault()
}

function dragStart(ev) {
  state.sourceId = ev.srcElement.parentElement.id
  setState(state)
}

function drag(ev) {
  ev.dataTransfer.setData('text', ev?.target?.id)
}

function drop(ev) {
  state = getState()
  const targetId = ev.target.id
  const target = state[targetId]
  const source = state[state.sourceId]
  let data = ev.dataTransfer.getData('text')
  if (
    !ev ||
    ev.target.classList.value == 'item' ||
    data > target[target.length - 1]
  )
    return false
  ev.preventDefault()
  target.unshift(source.shift())
  state[targetId] = target
  state[state.sourceId] = source
  state.tentatives += 1
  setState(state)
  draw()
  playBonk()
  checkWinCondition()
}

function selectDisc({ target }) {
  const selected = target.value * 1
  state.selectedDisc = selected
  setState(state)
  onSelectedDrawContent()
}

function setAmountDiscsToHasteInicial() {
  const { selectedDisc } = state
  state.hasteInicial = [...Array(selectedDisc).keys()]
  setState(state)
}

function playBonk() {
  const audio = document.createElement('audio')
  audio.src = './bonk.mp3'
  audio.play()
}

function playWin() {
  const audio = document.createElement('audio')
  audio.src = './soufoda.mp3'
  audio.play()
}

function checkWinCondition() {
  const { selectedDisc } = state
  const maxLength = [...Array(selectedDisc).keys()].length
  const { hasteFinal } = state
  const allItemsInHasteFinalAreIncresing = hasteFinal.every(
    (item, i) => item > hasteFinal[i + 1] || hasteFinal.length == maxLength,
  )

  if (allItemsInHasteFinalAreIncresing && hasteFinal.length == maxLength) {
    winGame()
  }
}

function winGame() {
  const domGame = document.querySelector('.game')
  domGame.classList.add('game--hide')
  const domVictory = document.querySelector('.victory')
  domVictory.classList.add('victory--show')
  playWin()
}

function resetGame() {
  const domGame = document.querySelector('.game')
  domGame.classList.remove('game--hide')
  const domVictory = document.querySelector('.victory')
  domVictory.classList.remove('victory--show')
  init()
}

function onSelectedDrawContent() {
  setAmountDiscsToHasteInicial()
  draw()
}

function draw() {
  prepareDom()
  const {
    hasteInicial,
    domHasteInicial,
    hasteAuxiliar,
    domHasteAuxiliar,
    hasteFinal,
    domHasteFinal,
    domTentatives,
    tentatives,
  } = state
  render(hasteInicial, domHasteInicial)
  render(hasteAuxiliar, domHasteAuxiliar)
  render(hasteFinal, domHasteFinal)
  domTentatives.innerText = tentatives
}

function init() {
  initState()
  setAmountDiscsToHasteInicial()
  draw()
}
