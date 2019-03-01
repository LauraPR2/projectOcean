import React, { Component } from 'react';
import api from '../../api';
import Map from './Map';


export default class AddDive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      visibility: 0,
      depth: 0,
      description: "",
      latLog: [],
      message: null
    }
    this.handleInputChange = this.handleInputChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
    this.foundLocation = this.foundLocation.bind(this)
  }

  handleInputChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  handleClick(e) {
    e.preventDefault()
    console.log(this.state.title, this.state.description)

    const formData = new FormData();
    formData.append("photo", this.state.chosenFile);
    formData.append("title", this.state.title);
    formData.append("visibility", this.state.visibility);
    formData.append("location", this.state.latLog);
    formData.append("depth", this.state.depth);
    formData.append("description", this.state.description);

    api.addDive(formData)
      .then(result => {
        console.log('SUCCESS!')
        this.setState({
          title: "",
          diveType: "",
          date: "",
          visibility: "",
          depth: "",
          description: "",
          message: `Your dive '${this.state.title}' has been created`
        })
        setTimeout(() => {
          this.setState({
            message: null
          })
        }, 2000)
      })
      .catch(err => this.setState({ message: err.toString() }))
  }

  foundLocation(latLog) {
    this.setState({
      latLog: latLog
    })
    console.log(this.state)
  }

  handleFileUpload = e => {
    this.setState({
      chosenFile: e.target.files[0]
    })
  }

  render() {
    return (
      <div className="AddDive">
        <h2>Add dive</h2>
        <form>
          Date: <input type="date" value={this.state.date} name="date" onChange={this.handleInputChange} /> <br />
          Title: <input type="text" value={this.state.title} name="title" onChange={this.handleInputChange} /> <br />
          <input type="file"
            onChange={(e) => this.handleFileUpload(e)}
          />
          Apnea or Scuba? <select value={this.state.diveType} name="diveType" onChange={this.handleInputChange}>
            <option value="Scuba">Scuba</option>
            <option value="Apnea">Apnea</option>
          </select> <br />
          Visibility: <input type="number" value={this.state.visibility} name="visibility" onChange={this.handleInputChange} /> <br />
          Depth: <input type="number" value={this.state.depth} name="depth" onChange={this.handleInputChange} /> <br />
          Description: <textarea value={this.state.description} name="description" cols="30" rows="10" onChange={this.handleInputChange} ></textarea> <br />
          <Map
            onClick={this.foundLocation}
            allowMovement={true}
            accessToken="pk.eyJ1IjoibGF1cmFwcjIiLCJhIjoiY2pydDhkNDVrMHFheTN5bXFsZnY0azNnMiJ9.07FzAj0enFs4Z4GP0chyvA" />


          <button onClick={(e) => this.handleClick(e)}>Create dive</button>
        </form>
        {this.state.message && <div className="info">
          {this.state.message}
        </div>}
      </div>
    );
  }
}