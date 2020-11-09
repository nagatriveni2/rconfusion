import React,{Component} from 'react';
import Header from './HeaderComponent';
import Footer from './FooterComponent';
import Home from './HomeComponent'
import Menu from './MenuComponent';
import Contact from './ContactComponent';
import About from './AboutComponent';
import DishDetail from './DishdetailComponent';
import { Switch, Route, Redirect, withRouter } from 'react-router-dom'
import { connect } from 'react-redux';

//Importamos archivos de terceros

const mapStateToProps = state => {
  return {
    dishes: state.dishes,
    comments: state.comments,
    promotions: state.promotions,
    leaders: state.leaders
  }
}


class Main extends Component {
  constructor(props){
    super(props);
    
  }

  onDishSelect(dishId){
    this.setState({selectedDish: dishId});
  }

  render(){
    const HomePage = () => {
      return(
          <Home 
              dish={this.props.dishes.filter((dish) => dish.featured)[0]}
              promotion={this.props.promotions.filter((promo) => promo.featured)[0]}
              leader={this.props.leaders.filter((leader) => leader.featured)[0]}
          />
      );
    }

    const ContactPage =()=>{
      return(
        <Contact/>
      );
    }

    const AboutPage =()=>{
      return(
        <About leaders={this.props.leaders}/>
      );
    }



    const DishWithId =({match})=>{
      return(
        <DishDetail
          dish={this.props.dishes.filter((dish)=> dish.id===parseInt(match.params.dishId,10))[0]}
          comments={this.props.comments.filter((comment)=>comment.dishId===parseInt(match.params.dishId,10))}
          >
        </DishDetail>
      );
    }


    return (
      <div>
        <Header/>
        <Switch>
          <Route path="/home" component={HomePage}/>
          <Route exact path="/menu"
          component={()=>
            <div>
              <Menu dishes={this.props.dishes} onClick={(dishId)=>this.onDishSelect(dishId)}/>
              <DishDetail className="text-center" dish={this.props.dishes.filter((dish) => dish.id === this.props.selectedDish)[0]}></DishDetail>
            </div>
          }/>
        <Route path="/menu/:dishId" component={DishWithId}/>
        <Route exact path="/contactus" component={ContactPage}/>
        <Route exact path="/aboutus" component={AboutPage}/>
        <Redirect to="/home"/>
        </Switch>
        <Footer/>
      </div>
    );
  }
}

export default withRouter(connect(mapStateToProps)(Main));