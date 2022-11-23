import React from "react";
import { View, Button, TextInput, Text, StyleSheet } from "react-native";

class StatusBar extends React.Component {
  render() {
    return <View style={{ height: 40, backgroundColor: "black" }} />;
    ``;
  }
}

class HomeButton extends React.Component {
  render() {
    return <View style={{ height: 40, backgroundColor: "black" }} />;
  }
}

class CalcDisplay extends React.Component {
  render() {
    return (
      <View style={styles.calcDisplayView}>
        <Text style={styles.calcDisplayText}>{this.props.value}</Text>
      </View>
    );
  }
}

class CalcButton extends React.Component {
  render() {
    return (
      <View style={this.props.className}>
        <View style={styles.calcButtonView}>
          <Text
            onPress={() => this.props.onPress()}
            style={styles.calcButtonText}
          >
            {this.props.value}
          </Text>
        </View>
      </View>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);
    this.ops = ["÷", "x", "+", "-"];
    this.state = {
      currentTextStr: "0",
      history: [
        {
          inputVal1: undefined,
          inputVal2: undefined,
          finalVal: undefined,
          appliedOp: undefined,
        },
      ],
      clearAll: true, // what does this do
      displayingResult: false, // toggled after an operation so that additionally inputted digits won't be submitted
    };
  }

  clearMemory() {
    const history = this.state.history.slice();
    if (this.state.clearAll) {
      // if AC is on
      // set inputVal1, inputVal2, appliedOp of most recent history obj to undefined
      history[history.length - 1].inputVal1 = undefined;
      history[history.length - 1].inputVal2 = undefined;
      history[history.length - 1].appliedOp = undefined;
      this.setState({
        history: history,
      });
    } else {
      // if C is on
      // remove latest op or value
      if (history[history.length - 1].appliedOp != undefined) {
        history[history.length - 1].appliedOp = undefined;
        this.setState({
          clearAll: true,
          history: history,
        });
      } else if (this.state.currentTextStr != "0") {
        this.setState({
          currentTextStr: "0",
          clearAll: true,
        });
      }
    }
  }

  equate() {
    // convert currenttextstr to float. apply the operation that is in the most recent frame of history
    // write into history the values of inputVal2 and finalVal`

    const history = this.state.history.slice(); // used this to get the most recent inputVal1 and operations
    const inputVal1 = history[history.length - 1].inputVal1;
    const inputVal2 = parseFloat(this.state.currentTextStr);
    const appliedOp = history[history.length - 1].appliedOp;

    let finalVal;

    switch (appliedOp) {
      case 0: //"/":
        finalVal = inputVal2 == 0 ? "Not a number" : inputVal1 / inputVal2;
        break;
      case 1: //"*":
        finalVal = inputVal1 * inputVal2;
        break;
      case 2: //"+":
        finalVal = inputVal1 + inputVal2;
        break;
      case 3: //"-":
        finalVal = inputVal1 - inputVal2;
        break;
      default: // no operator was selected. return so that a new object in history is not created
        return;
    }

    history[history.length - 1].inputVal2 = inputVal2;
    history[history.length - 1].finalVal = finalVal;

    this.setState({
      currentTextStr: finalVal,
      history: history.concat({
        inputVal1: undefined,
        inputVal2: undefined,
        finalVal: undefined,
        appliedOp: undefined,
      }),
      displayingResult: true,
    });

    // [i think this will happen automatically] if final val is something and inputval1 is nothing, set inputval1 to finalval. if digits are entered, then don't do this.
  }

  // incorp this function into apply op?
  changeSignOfText() {
    // if first char is "-", remove it. if not add it
    const currentTextString = this.state.currentTextStr;
    const out =
      currentTextString.charAt(0) == "-"
        ? currentTextString.substring(1)
        : "-".concat(currentTextString);
    this.setState({
      currentTextStr: out,
      displayingResult: true,
    });
  }

  // incorp this function into apply op?
  convertTextToPercent() {
    const currentTextString = this.state.currentTextStr;
    const out = (parseFloat(currentTextString) / 100).toString();
    this.setState({
      currentTextStr: out,
      displayingResult: true,
    });
  }

  applyOperation(op) {
    // append to history: take current displayed text, convert to float, save to current history frame as inputVal1. change appliedOp
    // clear current text
    const history = this.state.history.slice();
    history[history.length - 1].inputVal1 = parseFloat(
      this.state.currentTextStr
    );
    history[history.length - 1].appliedOp = op;

    this.setState({
      history: history,
      displayingResult: true,
    });
  }

  appendCurrentText(d) {
    // make sure this is in line with good react practices regarding mutables
    // also you shouldn't perform equations with state because it's calculated asyncronously

    // this will change clearall from "AC" to "C" whenever any text has been entered
    if (this.state.clearAll) {
      this.setState({
        clearAll: false,
      });
    }

    if (this.state.displayingResult) {
      this.setState({
        currentTextStr: d.toString(),
        displayingResult: false,
      });
      return;
    }

    const value = this.state.currentTextStr;

    // if there is already a decimal in the text, don't allow another one to be added
    if (d == "." && value.indexOf(".") != -1) return;

    // this if statement makes it so there isn't a leading 0 in the displayed text
    let newval = value == "0" ? d.toString() : value.toString() + d.toString();

    if (newval == ".") newval = "0.";

    this.setState({
      currentTextStr: newval,
    });
  }

  renderButton(func, param) {
    let f,
      textVal = param,
      className = [styles.calcButtonView, styles.flex1];
    switch (func) {
      case "digit":
        f = () => this.appendCurrentText(param);
        param === "0"
          ? className.push(styles.flex2)
          : className.push(styles.flex1); // adjusts the width of the zero button
        className.push(styles.digitButton);
        break;
      case "op":
        f = () => this.applyOperation(param);
        textVal = this.ops[parseInt(param)];
        const history = this.state.history.slice();
        history[history.length - 1].appliedOp == param // this code makes sure the active operation button is a darker colour
          ? className.push(styles.opButtonActive)
          : className.push(styles.opButton);
        break;
      case "eq":
        f = () => this.equate(param);
        className.push(styles.opButton);
        break;
      case "clear":
        f = () => this.clearMemory();
        className.push(styles.otherButton);
        this.state.clearAll ? (textVal = "AC") : (textVal = "C");
        break;
      case "sign":
        f = () => this.changeSignOfText();
        className.push(styles.otherButton);
        break;
      case "percent":
        f = () => this.convertTextToPercent();
        className.push(styles.otherButton);
        break;
    }
    return <CalcButton onPress={f} value={textVal} className={className} />;
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        <StatusBar />
        <CalcDisplay value={this.state.currentTextStr} />
        <View style={styles.calcInput}>
          <View style={styles.calcInputRow}>
            {this.renderButton("clear")}
            {this.renderButton("sign", "±")}
            {this.renderButton("percent", "%")}
            {this.renderButton("op", 0)}
          </View>
          <View style={styles.calcInputRow}>
            {this.renderButton("digit", "7")}
            {this.renderButton("digit", "8")}
            {this.renderButton("digit", "9")}
            {this.renderButton("op", 1)}
          </View>
          <View style={styles.calcInputRow}>
            {this.renderButton("digit", "4")}
            {this.renderButton("digit", "5")}
            {this.renderButton("digit", "6")}
            {this.renderButton("op", 2)}
          </View>
          <View style={styles.calcInputRow}>
            {this.renderButton("digit", "1")}
            {this.renderButton("digit", "2")}
            {this.renderButton("digit", "3")}
            {this.renderButton("op", 3)}
          </View>
          <View style={styles.calcInputRow}>
            {this.renderButton("digit", "0")}
            {this.renderButton("digit", ".")}
            {this.renderButton("eq", "=")}
          </View>
        </View>
        <HomeButton />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  calcDisplayView: {
    height: 200,
    padding: 20,
    backgroundColor: "black",
    justifyContent: "flex-end",
  },

  calcDisplayText: {
    fontSize: 65,
    textAlign: "right",
    color: "white",
  },

  calcInputRow: {
    flexDirection: "row",
    flex: 1,
  },

  calcInput: {
    backgroundColor: "black",
    flexDirection: "column",
    flex: 1,
    padding: 5,
  },

  calcButtonText: {
    color: "white",
    fontSize: 30,
    textAlign: "center",
    padding: 10,
  },

  calcButtonView: {
    borderRadius: 10,
    // padding: 10,
    margin: 10,
  },

  opButton: {
    backgroundColor: "orange",
  },

  opButtonActive: {
    backgroundColor: "darkorange",
  },

  // opButtonPressed: {
  //   backgroundColor: "orange",
  // },

  digitButton: {
    backgroundColor: "grey", //remove this later
    // backgroundColor: "grey",
  },

  otherButton: {
    backgroundColor: "lightgrey",
  },

  flex1: {
    flex: 1,
  },

  flex2: {
    flex: 2,
  },
});

export default Calculator;
