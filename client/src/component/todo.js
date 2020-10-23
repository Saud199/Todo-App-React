import React, { Component } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
//import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import Swal from 'sweetalert2';
//import { AppBar, Toolbar, Typography, Avatar } from '@material-ui/core'
import axios from 'axios';




class Todo extends Component {

    
    constructor() {
        super();
        this.state ={
          todoArray : [],
          taskID : ''
          
        }
    
    }

    componentDidMount() {
        const { todoArray } = this.state;
        axios.get('/api/todoDB/')
             .then(res => {

                //todoArray.push(res.data.map(todo => todo.name))
                //this.setState({todoArray})
                //alert(todoArray);

                for(var i=0;i<res.data.length;i++) {
                    var obj = {
                        id : res.data[i]._id,
                        name : res.data[i].name,
                        date : res.data[i].added_date
                    }
                    todoArray.push(obj)
                    //alert(todoArray[0].name)
                    this.setState({todoArray})
                }

             })
             .catch(err => {
                 console.log(err);
             })

    }


    addTodo() {
        const { todoArray } = this.state;

        var todo = document.getElementById('taskName').value; 

        if(todo.length > 0) {

            const newTodo = {
                name : todo
            }
            
            axios.post('/api/todoDB' , newTodo)
                 .then((res) => {

                    Swal.fire({
                        title: 'Success',
                        text: "Task has been added",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                    })
                    // .then((result) => {
                    //     if (result.value) {
                    //         window.location = '/';
                    //     }
                    // })

                    var obj = {
                        id : res.data._id,
                        name : res.data.name,
                        date : res.data.added_date
                    }
                    this.setState({todoArray : this.state.todoArray.concat(obj)})
                })
        }

        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please type something'
            })
        }
        document.getElementById('taskName').value=""; 
        
    }

    getTaskID(i) {
        this.setState({taskID : i});
    }


    updateTodo() { //alert(this.state.taskID)
        const { todoArray , taskID } = this.state;

        // const todo = prompt("Enter Task...");
        var todo = document.getElementById("updatedNewTask").value;

        const updatedTodo = {
            name : todo
        } 

        if(updatedTodo.name != null) {
            axios.put('/api/todoDB/'+todoArray[taskID].id , updatedTodo)
                 .then((res) => {

                    Swal.fire({
                        title: 'Success',
                        text: "Task has been updated",
                        icon: 'success',
                        showCancelButton: false,
                        confirmButtonColor: '#3085d6',
                        cancelButtonColor: '#d33',
                        confirmButtonText: 'Ok'
                    })
                    // .then((result) => {
                    //     if (result.value) {
                    //         window.location = '/';
                    //     }
                    //    })

                    var obj = {
                        id : res.data._id,
                        name : res.data.name,
                        date : res.data.added_date
                    }
                    // var updatedArray = this.state.todoArray.slice(0);   // Copying todoArray Data in updatedArray
                    // updatedArray.splice( i , 1 , obj )      // Inserting updated data in the updatedArray
                    // this.setState({todoArray : this.state.todoArray = updatedArray.splice(0)})
                    this.state.todoArray.splice( taskID , 1 , obj )
                    this.setState({todoArray})
                 })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Please type something'
            })
        }
        document.getElementById("updatedNewTask").value="";

    }


    deleteTodo(i) {
        const { todoArray } = this.state;
        //alert(todoArray[i].id);

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.value) {

              axios.delete('/api/todoDB/'+todoArray[i].id)
              this.setState({todoArray: this.state.todoArray.filter(todo => todo.id != todoArray[i].id)})

              Swal.fire(
                'Deleted!',
                'Your task has been deleted.',
                'success'
              )

            }
          })

        
    }



    render() {
        const { todoArray } = this.state;

        return(

            <div style={{
                margin : '10px',
                boder : '2px solid #ec',
            }}>

                <AppBar position="static">
                    <Toolbar>
                        {/* <Avatar alt="Logo" src={require('../images/icon.png')}/> */}
                        <Typography variant="h6" style={{flexGrow : 1}} align="center">Todo App</Typography>
                    </Toolbar>
                </AppBar>

                <br/><br/>
    

                <div className="row" style={{textAlign:"center"}}>
                    <div className="col-sm-3">

                    </div>
                    <div className="col-sm-3">
                        <input type="text" id="taskName" className="form-control" style={{margin: '2px'}} ></input>
                    </div>
                    <div className="col-sm-3">
                        <Button style={{margin : '2px',backgroundColor : '#62DC2C', fontWeight : 900, color : '#FFFFFF', width: 150}} variant="contained" onClick={() => this.addTodo()}>Add Task</Button>
                    </div>
                </div>
                
                <br/><br/>
                
                <div className="container"> 
                    <div className="row">
                {todoArray.map((val , ind) => {
                    return(
                        <Card className="mx-2 my-2" key={val.id} style={{width : 345, display:"inline-block",  textAlign:"center", backgroundColor : "#D3D3D3"}}>

                            <CardActionArea>

                                <img src={require('../images/icon.png')} style={{height : 140}} />
                                <Typography gutterBottom variant="h5" component="h2">{val.name}</Typography>

                            </CardActionArea>

                   
                            <Button style={{margin : '10px',backgroundColor : '#F43131', fontWeight : 900, color : '#FFFFFF'}} variant="contained" onClick={() => this.deleteTodo(ind)}>Delete Task</Button>
                            {/* <Button style={{margin : '10px',backgroundColor : '#31B0F4', fontWeight : 900, color : '#FFFFFF'}} variant="contained" onClick={() => this.updateTodo(ind)}>Update Task</Button> */}
                            <Button data-toggle="modal" data-target="#exampleModalCenter" style={{margin : '10px',backgroundColor : '#31B0F4', fontWeight : 900, color : '#FFFFFF'}} variant="contained" onClick={() => this.getTaskID(ind)}>Update Task</Button>
               
                    

                        </Card>
                    )
                })}
                    </div>
                </div>

                <div className="modal fade" id="exampleModalCenter" tabIndex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true">
                    <div className="modal-dialog modal-dialog-centered" role="document">
                        <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLongTitle">Update Task</h5>
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <div class="form-group">
                                <label for="updatedNewTask">Enter Task</label>
                                <input type="text" class="form-control" id="updatedNewTask"></input>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                            <button type="button" data-dismiss="modal" onClick={() => this.updateTodo()} className="btn btn-primary">Update Task</button>
                        </div>
                        </div>
                    </div>
                </div>
                <br/>

                {/* <div style={{left:0,bottom:0,backgroundColor:'#343434',color:'#FFFFFF',textAlign:"center",width : '100%', height: 150}}>
                    <p style={{display:'inline-block' , fontSize : '25px'}}>Made Using</p>
                    <img src={require('../images/mern_logo2.png')} style={{height : 150, display:'inline-block'}} />
                </div> */}

                <div style={{height: '150px' , width: '100%'  , display: "flex" , alignItems: "center" , justifyContent : "center" , backgroundColor:'#343434'}}>
                    <div style={{color:'#FFFFFF'}}>
                        <p style={{display:'inline-block' , fontSize : '20px'}}>Made Using</p>
                        <img src={require('../images/mern_logo2.png')} style={{height : 80, display:'inline-block'}} />
                    </div>
                </div>
        </div>
        );
    }

}


export default Todo;