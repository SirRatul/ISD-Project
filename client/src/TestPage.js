import React, { Component } from "react";

export default class TestPage extends Component {
  setGender(event) {
    console.log(event.target.value);
  }
  render() {
    return (
      <div>
        <input type="radio" value="MALE" name="gender" />
        <h3 className="abc">Patient</h3>
      </div>
    );
  }
}
