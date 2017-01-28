import * as React from 'react'
import { Button, Card, CardText } from 'react-mdl';

class Counter extends React.Component<any, {}> {
  incrementIfOdd = () => {
    if (this.props.value % 2 !== 0) {
      this.props.onIncrement()
    }
  }

  incrementAsync = () => {
    setTimeout(this.props.onIncrement, 1000)
  }

  render() {
    const { state, onIncrement, onDecrement } = this.props
    return (
      <Card>
        Game time: {state && state.time}
      </Card>
    )
  }
}

export default Counter
