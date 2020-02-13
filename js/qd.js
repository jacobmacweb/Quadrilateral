function print (char) {
  // Print char to output box.
  document.getElementById('out').value += char
}

function sleep(milliseconds) {
  var start = new Date().getTime();
  while (!(new Date().getTime() - start) > milliseconds) {}
}

var INTERVAL = 100

function Interpreter (code) {
  this.stack = []
  this.token = ''
  this.direction = 'E'
  this.running = true
  this.x = -1
  this.y = 0
  this.goto = [0, 0]

  this.map = []
  var rows = code.replace(/\s*/g, '').split(/\r|\r\n|\n/)

  rows.forEach(row => {
    if (!row.startsWith('#')) {
      this.map.push(row.split(''))
    }
  })
}

Interpreter.prototype.execute = function () {
  this.move()
  this.token = this.map[this.y][this.x]
  document.getElementById('char').innerText = `${this.token} [${this.stack.join(', ')}]`
  this.run()
  var _this = this
  if (this.running) {
    setTimeout(function () { _this.execute() }, parseInt(document.getElementById('interval').value))
  }
}

Interpreter.prototype.move = function () {
  switch (this.direction) {
    case 'N':
      this.y -= 1
      break
    case 'NE':
      this.x += 1
      this.y -= 1
      break
    case 'E':
      this.x += 1
      break
    case 'SE':
      this.x += 1
      this.y += 1
      break
    case 'S':
      this.y += 1
      break
    case 'SW':
      this.x -= 1
      this.y += 1
      break
    case 'W':
      this.x -= 1
      break
    case 'NW':
      this.x -= 1
      this.y -= 1
      break
    default:
      break
  }

  if (this.x < 0 || this.y < 0 || this.x > this.map[0].length || this.y > this.map.length) {
    console.log('Fell off edge.')
    this.running = false
  }
}

Interpreter.prototype.run = function () {
  var char
  var item
  var a
  var b
  switch (this.token) {
    case '?':
      char = prompt('Input: ').charCodeAt(0)

      this.stack.push(char)
      break
    case '!':
      char = this.stack.pop()
      print(String.fromCharCode(char))
      break
    case '#':
      a = this.stack.pop()
      b = this.stack.pop()

      this.stack.push(b)
      this.stack.push(a)
      break
    case '&':
      item = this.stack.pop()

      this.stack.push(item)
      this.stack.push(item)
      break
    case '=':
      a = this.stack.pop()
      b = this.stack.pop()

      if (a === b) {
        this.stack.push(1)
      } else {
        this.stack.push(0)
      }
      break
    case '0':
    case '1':
    case '2':
    case '3':
    case '4':
    case '5':
    case '6':
    case '7':
    case '8':
    case '9':
      this.stack.push(parseInt(this.token))
      break
    case '+':
      a = this.stack.pop()
      b = this.stack.pop()

      this.stack.push(a + b)
      break
    case '-':
      a = this.stack.pop()
      b = this.stack.pop()

      this.stack.push(b - a)
      break
    case '*':
      a = this.stack.pop()
      b = this.stack.pop()

      this.stack.push(b * a)
      break
    case ':':
      a = this.stack.pop()
      b = this.stack.pop()

      this.stack.push(b / a)
      break
    case '$':
      this.stack.pop()
      break
    case '"':
      this.stack = this.stack.reverse()
      break
    case '~':
      if (this.stack.pop() === 0) {
        this.move()
      }
      break
    case ',':
      this.goto = [this.x, this.y]
      break
    case ';':
      this.x = this.goto[0]
      this.y = this.goto[1]
      break
    case '@':
      this.running = false
      break
    case '^':
      this.direction = 'N'
      break
    case '>':
      this.direction = 'E'
      break
    case 'v':
      this.direction = 'S'
      break
    case '<':
      this.direction = 'W'
      break
    case '\\':
      switch (this.direction) {
        case 'N':
        case 'E':
          this.direction = 'SE'
          break
        case 'S':
        case 'W':
          this.direction = 'NW'
          break
        default:
          break
      }
      break
    case '/':
      switch (this.direction) {
        case 'N':
        case 'E':
          this.direction = 'SW'
          break
        case 'S':
        case 'W':
          this.direction = 'NE'
          break
        default:
          break
      }
      break
    case '_':
      switch (this.direction) {
        case 'N':
          this.direction = 'S'
          break
        case 'NE':
          this.direction = 'SE'
          break
        case 'NW':
          this.direction = 'SW'
          break
        case 'S':
          this.direction = 'N'
          break
        case 'SE':
          this.direction = 'NE'
          break
        case 'SW':
          this.direction = 'NW'
          break
        default:
          break
      }
      break
    case '|':
      switch (this.direction) {
        case 'E':
          this.direction = 'W'
          break
        case 'NE':
          this.direction = 'NW'
          break
        case 'NW':
          this.direction = 'NE'
          break
        case 'W':
          this.direction = 'E'
          break
        case 'SE':
          this.direction = 'SW'
          break
        case 'SW':
          this.direction = 'SE'
          break
        default:
          break
      }
      break
    default:
      break
  }
}
