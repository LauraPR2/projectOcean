import React, { Component } from 'react';
import api from '../../api';
import Map from './Map';
import { Col, Row, Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';
import { type } from 'os';
import Rating from './Rating'
import { Link } from 'react-router-dom';


export default class AddDive extends Component {
  constructor(props) {
    super(props)
    this.state = {
      title: "",
      visibility: 0,
      depth: 0,
      description: "",
      rating: 0,
      latLog: [],
      message: null,
      diveType: "",
      chosenFiles: [],
      finished: false
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
    for (var i = 0; i < this.state.chosenFiles.length; i++) {
      formData.append("photo", this.state.chosenFiles[i]);
    }
    formData.append("title", this.state.title);
    formData.append("visibility", this.state.visibility);
    formData.append("location", this.state.latLog);
    formData.append("depth", this.state.depth);
    formData.append("rating", this.state.rating)
    formData.append("description", this.state.description);
    formData.append("date", this.state.date);
    formData.append("diveType", this.state.diveType);

    api.addDive(formData)
      .then(result => {
        console.log('SUCCESS!')
        this.setState({
          title: "",
          diveType: "",
          date: "",
          visibility: "",
          depth: "",
          rating: "",
          description: "",
          message: `Your dive '${this.state.title}' has been created`
        })
        setTimeout(() => {
          this.setState({
            message: null,
            finished: true,
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
    if (!e.target.files || e.target.files.length == 0) return
    this.state.chosenFiles.push(e.target.files[0])
    this.setState({
      chosenFiles: this.state.chosenFiles
    })
  }

  updateRating = number => {
    this.setState({
      rating: number
    })
  }

  render() {
    return (
      <div className="profilepage">
        <Form className='diveCard shadow'>
          <h2>Add dive</h2>
          <div className="row">
            <div className="col-9">
              <FormGroup>
                <Label for="diveTypeSelect">Apnea or Scuba? </Label>
                <Input type="select" id="diveTypeSelect" value={this.state.diveType} name="diveType" onChange={this.handleInputChange}>
                  <option value="Scuba">Scuba</option>
                  <option value="Apnea">Apnea</option>
                </Input>
              </FormGroup>
              <FormGroup>
                <Label for="exampleDate">Date: </Label>
                <Input id="exampleDate" type="date" value={this.state.date} name="date" onChange={this.handleInputChange} />

              </FormGroup>
              <FormGroup>
                <Label>Visibility: </Label>
                <Input type="number" value={this.state.visibility} name="visibility" onChange={this.handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label>Depth: </Label>
                <Input type="number" value={this.state.depth} name="depth" onChange={this.handleInputChange} />
              </FormGroup>
              <FormGroup>
                <Label>Rating</Label>
                <Rating onUpdated={this.updateRating}>
                  {this.state.rating}
                </Rating>
              </FormGroup>

            </div>
            <div className="tMap flex col-3">
              <Map
                onClick={this.foundLocation}
                allowMovement={true}
                accessToken="pk.eyJ1IjoibGF1cmFwcjIiLCJhIjoiY2pydDhkNDVrMHFheTN5bXFsZnY0azNnMiJ9.07FzAj0enFs4Z4GP0chyvA" />
            </div>
          </div>
          <FormGroup>
            <Label for="title">Title: </Label>
            <Input id="title" type="text" value={this.state.title} name="title" onChange={this.handleInputChange} />
          </FormGroup>
          <FormGroup>
            <Label>Description: </Label><br />
            <Input type="textarea" value={this.state.description} name="description" cols="30" rows="10" onChange={this.handleInputChange} />
          </FormGroup>

          <FormGroup>
            {this.state.chosenFiles.map((f, i) => {
              return <div key={i}>{f.name}</div>
            })}
            <div className="fileUpload btn btn-primary">
              <span>Upload</span>
              <input type="file" class="upload" onChange={(e) => this.handleFileUpload(e)} />
            </div>
          </FormGroup>

          <FormGroup>
            <Button onClick={(e) => this.handleClick(e)}>Create dive</Button>
            {this.state.finished
              ? <Link to="/dives/0">Back to dives</Link>
              : <div></div>
            }
          </FormGroup>
        </Form>
        {this.state.message && <div className="info">
          {this.state.message}
        </div>}
      </div>
    );
  }
}