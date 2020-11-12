import React, { Component } from 'react'; 
import { Card, CardImg, CardText, CardBody, Modal, ModalHeader, ModalBody, Label, 
    Row, Col, CardTitle, Breadcrumb, BreadcrumbItem, Button, ListGroup, ListGroupItemText } from 'reactstrap';
import { Link } from 'react-router-dom';
import { Loading } from './LoadingComponent';
import { baseUrl } from '../shared/baseUrl';

import { Control, LocalForm, Errors } from 'react-redux-form';

    const maxLength = (len) => (val) => !(val) || (val.length <= len);
    const minLength = (len) => (val) => val && (val.length >= len);

    function RenderDish({dish}) {
        return (
            <div className="col-12 col-md-5 m-1">
                <Card>
                <CardImg top src={baseUrl + dish.image} alt={dish.name} />                        
                    <CardBody>
                        <CardTitle>{dish.name}</CardTitle>
                        <CardText>{dish.description}</CardText>
                    </CardBody>
                </Card>
            </div>
        );
    }

    function RenderComments({comments, postComment, dishId}) {
        if (comments == null) {
            return(
                <div></div>
            )
        }   
        return (

            <div className="col-12 col-md-5 m-1">
                <h4>Comments</h4>
                <ListGroup>
                {comments.map((comment) =>
                    <ListGroupItemText key={comment.id} className="list-unstyled">                       
                        {comment.comment}
                        <br />
                        <br />
                        -- {comment.author} , {new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: '2-digit'}).format(new Date(Date.parse(comment.date)))}
                        <br />
                    </ListGroupItemText>                                    
                )}
                </ListGroup>
                <CommentForm dishId={dishId} postComment={postComment} />

            </div>
        );
    }

    class CommentForm extends Component {
        constructor(props) {
            super(props);
    
            this.state = {
                isModalOpen: false
            };
    
            this.toggleModal = this.toggleModal.bind(this);
        }
        
        toggleModal() {
            this.setState({
                isModalOpen: !this.state.isModalOpen
            });
        }
    
        handleSubmit(values) {
            
            this.toggleModal();
            this.props.postComment(this.props.dishId, values.rating, values.author, values.comment);
        }

    
        render() {
            return(
                <div> 
                    <Button outline onClick={this.toggleModal}>
                            <span className="fa fa-pencil fa-lg"></span> Submit Comment
                    </Button>
    
                    <Modal isOpen={this.state.isModalOpen} toggle={this.state.toggleModal}>
                        <ModalHeader toggle={this.toggleModal}>Submit Comment</ModalHeader>
                        <ModalBody>
                            <LocalForm onSubmit={(values) => this.handleSubmit(values)}>
                                <Row className="form-group">
                                    <Col>
                                        <Label>Rating </Label>
                                        <Control.select model=".rating" name="rating"
                                            defaultValue="1" 
                                            className="form-control">
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                        </Control.select>
                                    </Col>
                                </Row>
                                <Row className="form-group">
                                    <Col>
                                        <Label htmlFor="author" >Your Name</Label>
                                        <Control.text model=".author" id="author" name="author"
                                            placeholder="Your Name"
                                            className="form-control"
                                            validators={{
                                                minLength: minLength(3), maxLength: maxLength(15)
                                            }}
                                             />
                                        <Errors
                                            className="text-danger"
                                            model=".author"
                                            show="touched"
                                            messages={{
                                                minLength: 'Must be greater than 2 characters',
                                                maxLength: 'Must be 15 characters or less'
                                            }}
                                         />
                                    </Col>
                                </Row>
    
                                <Row className="form-group">
                                    <Col>
                                        <Label htmlFor="comment">Comment</Label>
                                        <Control.textarea model=".comment" id="comment" name="comment"
                                            rows="6"
                                            className="form-control" />
                                    </Col>
                                </Row>
                                
                                <Button type="submit" value="submit" color="primary">Submit</Button>
                            </LocalForm>
                        </ModalBody>
                    </Modal>
                </div>
            )
        }
    }

    const DishDetail = (props) => {

        if (props.isLoading) {
            return(
                <div className="container">
                    <div className="row">            
                        <Loading />
                    </div>
                </div>
            );
        }
        else if (props.errMess) {
            return(
                <div className="container">
                    <div className="row">            
                        <h4>{props.errMess}</h4>
                    </div>
                </div>
            );
        }
        
        else if (props.dish != null)  {
            return (
                <div className="container">
                <div className="row">
                    <Breadcrumb>
                        <BreadcrumbItem><Link to="/menu">Menu</Link></BreadcrumbItem>
                        <BreadcrumbItem active>{props.dish.name}</BreadcrumbItem>
                    </Breadcrumb>
                    <div className="col-12">
                        <h3>{props.dish.name}</h3>
                        <hr />
                    </div>                
                </div>
                <div className="row">
                    <div className="col-12 col-md-5 m-1">
                        <RenderDish dish={props.dish} />
                    </div>
                    <div className="col-12 col-md-5 m-1">
                    <RenderComments comments={props.comments}
                        postComment={props.postComment}
                    dishId={props.dish.id}
          />
                    </div>
                </div>
                </div>
            );   
        
        }      
        else 
        return(<div></div>); 
    
        
        
    }     

export default DishDetail;