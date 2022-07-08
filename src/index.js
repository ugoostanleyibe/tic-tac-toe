import PropTypes from 'prop-types'
import ReactDOM from 'react-dom'
import React from 'react'
import './index.css'

const Square = (props) => {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

Square.propTypes = {
  onClick: PropTypes.func.isRequired,
  value: PropTypes.string.isRequired
}

class Board extends React.Component {
  squarePad (i) {
    return (
      <Square
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    )
  }

  render () {
    return (
      <>
        <div className="board-row">
          {[0, 1, 2].map(i => this.squarePad(i))}
        </div>
        <div className="board-row">
          {[3, 4, 5].map(i => this.squarePad(i))}
        </div>
        <div className="board-row">
          {[6, 7, 8].map(i => this.squarePad(i))}
        </div>
      </>
    )
  }
}

Board.propTypes = {
  squares: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
}

class Game extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      history: [{ squares: Array(9).fill(null) }],
      stepNumber: 0,
      xIsNext: true
    }
  }

  getWinner (squares) {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],
      [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]
    ]

    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a]
      }
    }

    return null
  }

  handleClick (i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1)
    const current = history[history.length - 1]
    const squares = current.squares.slice()

    if (!this.getWinner(squares) && !squares[i]) {
      squares[i] = this.state.xIsNext ? 'X' : 'O'
      this.setState({
        history: [...history, { squares: squares }],
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length
      })
    }
  }

  jumpTo (step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    })
  }

  render () {
    const history = this.state.history
    const current = history[this.state.stepNumber]
    const winner = this.getWinner(current.squares)

    const status = winner
      ? `${winner} wins!`
      : current.squares.every(square => square)
        ? 'It is a draw!'
        : `Next player: ${this.state.xIsNext ? 'X' : 'O'}`

    const moves = history.map((_, step) => {
      return (
        <li key={step}>
          <button onClick={() => this.jumpTo(step)}>
            {step > 0 ? `Go to move ${step}` : 'Go to game start'}
          </button>
        </li>
      )
    })

    return (
      <div className="game">
        <div>
          <Board squares={current.squares} onClick={i => this.handleClick(i)} />
        </div>
        <div>
          <div className="game-info">
            <p>{status}</p>
            <ul>{moves}</ul>
          </div>
        </div>
      </div>
    )
  }
}

ReactDOM.render(<Game />, document.getElementById('root'))
