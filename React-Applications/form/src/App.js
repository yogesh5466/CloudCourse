import React from 'react';
import './App.css';
import axios from 'axios';


const valiproductnameForm = (errors) => {
  let valid = true;
  Object.values(errors).forEach(
    (val) => val.length > 0 && (valid = false)
  );
  return valid;
}

class App extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      productname: '',
      zipcode: '',
      phone: '',
      fileupload: '',
      errors: {
        productname: '',
        zipcode: '',
        fileupload: '',
        phone: ''
      }
    };
   }

  handleChange = e => {
    e.preventDefault();
    const { name, value } = e.target;
    let errors = this.state.errors;
    var validationdata = {
      val: value
    };
    switch (name) {
      case 'productname':
      axios.post(`http://localhost:3001/letters`,validationdata)
        .then(res => {
          if(res.data){
            errors.productname = '';
          }
          else{
            errors.productname = 'Enter name';
          }
        })
        break;
      case 'zipcode':
      axios.post(`http://localhost:3001/zip`,validationdata)
        .then(res => {
          if(res.data){
            errors.zipcode = '';
          }
          else{
            errors.zipcode = 'enter a number and of 5 digits';
          }
        })
        break;
      case 'fileupload':
      const data = new FormData();
      data.append('file',e.target.files[0]);
      axios.post('http://localhost:3001/checkfile',data)
        .then(res => {
          if(res.data){
            console.log("true");
            errors.fileupload = '';
          }
          else{
            console.log("false");
            errors.fileupload = 'upload file';
          }
        })
      break;
      case 'phone':
      axios.post(`http://localhost:3001/numbers`,validationdata)
        .then(res => {
          if(res.data){
            errors.phone = '';
          }
          else{
            errors.phone = 'enter a number';
          }
        })
        break;
      default:
        break;
    }

    if(name==='fileupload'){
      this.setState({errors,[name]:e.target.files[0]});
    }
    else{
      this.setState({errors, [name]: value});
    }


  }

  handleSubmit = e => {
    e.preventDefault();
    const user = {
      productname: this.state.productname,
      zipcode: this.state.zipcode,
      phone: this.state.phone,
      file: this.state.fileupload
    };
    console.log(user.productname);
    if(valiproductnameForm(this.state.errors)) {
      axios.post(`http://localhost:3001/`,user)
        .then(res => {
          if(res.data){
            const data = new FormData();
            data.append('file',this.state.fileupload);
            axios.post('http://localhost:3001/fileupload',data)
              .then(res => {
                if(res.data){
                  alert('Data sent');
                }
                else{
                  alert('Data not sent');
                }
              });
          }
          else{
            alert('Data not sent');
          }
        })
    }else{
      alert('Invalid Form');
    }
  }


  render(){
    const {errors} = this.state;
    return (
      <div className="wrapper">
      <form className='form-wrapper' onSubmit={this.handleSubmit}>
      <p>Shipping Info</p>
      <div className='productname'>
        <label htmlFor="productname">productname:</label>
        <input type='productname' name='productname' onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.productname.length > 0 &&
          <span className='error'>{errors.productname}</span>}
      </div>
      <br/>
      <div className='zipcode'>
        <label htmlFor="zipcode">Shipping City Zipcode:</label>
        <input type='number' name='zipcode' onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.zipcode.length > 0 &&
          <span className='error'>{errors.zipcode}</span>}
      </div>
      <br/>
      <div className='phone'>
        <label htmlFor="phone">Phone Number:</label>
        <input type='number' name='phone' onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.phone.length > 0 &&
          <span className='error'>{errors.phone}</span>}
      </div>
      <br/>
      <div className='fileupload'>
        <label htmlFor="fileupload">Product Image:</label>
        <input type='file' id='fileupload' name='fileupload' accept="image/png, image/jpeg" onChange={this.handleChange} onBlur={this.handleChange}/>
        {errors.fileupload.length > 0 &&
          <span className='error'>{errors.fileupload}</span>}
      </div>
      <br/>
      <br/>
      <div>
        <button className='submit'>Submit</button>
      </div>
      </form>
      </div>
    );
  }
}

export default App;
