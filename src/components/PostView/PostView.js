/**
*
* PostView
*
*/
import React from 'react';
import axios from 'axios';
import { Card, CardActions, CardHeader, CardTitle, CardText } from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Badge from 'material-ui/Badge';
import SentimentVerySatisfied from 'material-ui/svg-icons/social/sentiment-very-satisfied';
import SentimentVeryDissatisfied from 'material-ui/svg-icons/social/sentiment-very-dissatisfied';
import ReportProblem from 'material-ui/svg-icons/action/report-problem';
import Favorite from 'material-ui/svg-icons/action/favorite';
import IconButton from 'material-ui/IconButton';

class PostView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }

  componentDidMount(){
    this.setState({
      helpful: this.props.post.helpful,
      unhelpful: this.props.post.unhelpful,
      flag: this.props.post.flag,
      favorites: this.props.post.favorites,
      sentiment: this.props.post.sentiment || [],
      userVote: this.props.sentiment,
      userFlag: this.props.flag,
      userFavorites: this.props.favorites
    });
    console.log('PROPS:', this.props);
  }

  isHelpful() { //unclicking helpful
    console.log('State before +Click:', this.state);
    if (this.state.userVote.length === 1) {

      if (this.state.userVote[0].helpfulness) {  //<--- addresses the true property
        return axios.put('http://localhost:8000/api/posts/' + this.props.post.phase + '/' + this.props.post.id + '/vote/null', {
          email: this.props.post.user.email,
          helpful: this.state.helpful - 1,
          unhelpful: this.state.unhelpful,
          sentiment: this.state.sentiment - 1,
        })
        .then(()=>{
          console.log('Clicked helpful 2nd time');
          this.setState({
            helpful: this.state.helpful - 1,
            sentiment: this.state.sentiment - 1,
            userVote: []
          });
        })

      } else { //<--- addresses the false property
       //change their last vote from false to true
        return axios.put('http://localhost:8000/api/posts/' + this.props.post.phase + '/' + this.props.post.id + '/vote/helpful', {
          email: this.props.post.user.email,
          helpful: this.state.helpful + 1,
          unhelpful: this.state.unhelpful - 1,
          sentiment: this.state.sentiment + 2,
          helpfulness: true,
        })
        .then(() => {
          console.log('clicked helpful from unhelpful');
          this.setState({
            helpful: this.state.helpful + 1,
            unhelpful: this.state.unhelpful - 1,
            sentiment: this.state.sentiment + 2,
            userVote: [{helpfulness: true}]
          });
        })
      }
    } else { //<---- clicking helpful the first time
      return axios.post('http://localhost:8000/api/posts/' + this.props.post.phase + '/' + this.props.post.id + '/vote/helpful', {
        email: this.props.post.user.email,
        sentiment: this.state.sentiment + 1,
        helpful: this.state.helpful + 1,
      })
      .then(()=>{
        console.log('first helpful');
        this.setState({
          sentiment: this.state.sentiment + 1,
          helpful: this.state.helpful + 1,
          userVote: [{ helpfulness: true}]
        });
      })
    }
  }

  isUnhelpful() { //unclicking unhelpful
    console.log('State before -Click:', this.state);
    if (this.state.userVote.length === 1) {
      if (!this.state.userVote[0].helpfulness) {  //<--- addresses the true property
        return axios.put('http://localhost:8000/api/posts/' + this.props.post.phase + '/' + this.props.post.id + '/vote/null', {
          email: this.props.post.user.email,
          helpful: this.state.helpful,
          unhelpful: this.state.unhelpful - 1,
          sentiment: this.state.sentiment + 1,
        })
        .then(()=>{
          console.log('clicked unhelpful 2nd time');
          this.setState({
            unhelpful: this.state.unhelpful - 1,
            sentiment: this.state.sentiment + 1,
            userVote: []
          });
        })
      } else { //<--- addresses the false property
       //change their last vote from true to false
        return axios.put('http://localhost:8000/api/posts/' + this.props.post.phase + '/' + this.props.post.id + '/vote/unhelpful', {
          email: this.props.post.user.email,
          helpful: this.state.helpful - 1,
          unhelpful: this.state.unhelpful + 1,
          sentiment: this.state.sentiment - 2,
          helpfulness: false,
        })
        .then(()=>{
          console.log('clicked unhelpful from helpful');
          this.setState({
            helpful: this.state.helpful - 1,
            unhelpful: this.state.unhelpful + 1,
            sentiment: this.state.sentiment - 2,
            userVote: [{ helpfulness: false }]
          });
        })
      }
    } else { //<---- clicking unhelpful the first time
      return axios.post('http://localhost:8000/api/posts/' + this.props.post.phase + '/' + this.props.post.id + '/vote/unhelpful', {
        email: this.props.post.user.email,
        sentiment: this.state.sentiment - 1,
        unhelpful: this.state.unhelpful + 1,
      })
      .then(()=>{
        console.log('first unhelpful');
        this.setState({
          sentiment: this.state.sentiment - 1,
          unhelpful: this.state.unhelpful + 1,
          userVote: [{ helpfulness: false}]
        });
      })
    }
  }

  favorite() {

  }

  flag() {

  }

  render() {
    const cardStyle = {
      width: 600,
      margin: 20,
      overflow: 'auto',
    };
    const center = {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    };
    return (
      <div>
        <div style={center}>
          <div style={{ margin: 20 }}>
            <Card
              style={cardStyle}
            >
              <CardHeader
                title={this.props.post.anon ? 'Anonymous' : this.props.post.user.name}
                subtitle={this.props.post.user.job + ' - ' + this.props.post.user.location}
                avatar={this.props.post.user.avatar}
              />
            <CardTitle titleStyle={{ 'text-align': 'center' }} title={this.props.post.title} />
              <CardText>
                {this.props.post.message}
              </CardText>
              <CardActions>
                <FlatButton label="Helpful" onClick={this.isHelpful.bind(this)}/>
                  <Badge
                    badgeContent={this.state.helpful}
                    primary={true}
                  >
                    <SentimentVerySatisfied />
                  </Badge>
                <FlatButton label="Unhelpful" onClick={this.isUnhelpful.bind(this)}/>
                  <Badge
                    badgeContent={this.state.unhelpful}
                    primary={true}
                  >
                    <SentimentVeryDissatisfied />
                  </Badge>
              </CardActions>
            </Card>
          </div>
        </div>
      </div>
    );
  }
}

export default PostView;
