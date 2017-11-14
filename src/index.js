import React from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import $ from 'jquery';
import './css/index.css';

const UserHeader = (props) => {
  const string = "Camper's Username";
  return (
    <ul className="list-title">
      <li>#</li>
      <li>{string}</li>
      <li onClick={props.handleRecentClick}>
        Points (past 30 days){props.recentData ? <span> &#9661;</span> : ""}
      </li>
      <li onClick={props.handleAllTimeClick}>
        All Time Points{props.recentData ? "" : <span> &#9661;</span>}
      </li>
    </ul>
  );
} // end of UserHeader stateless function

UserHeader.propTypes = {
  recentData: PropTypes.bool.isRequired,
  handleRecentClick: PropTypes.func.isRequired,
  handleAllTimeClick: PropTypes.func.isRequired
}

const User = (props) => {
  return (
    <ul className="campers" key={props.user.username}>
      <li><p>{props.rank}</p></li>
      <li>
        <img
          className="dummy-image"
          src={props.user.img}
          href={props.user.img}
          alt="Profile." />
        <a href={props.web}>{props.user.username}</a>
      </li>
      <li><p>{props.user.recent}</p></li>
      <li><p>{props.user.alltime}</p></li>
    </ul>
  );
} // end of User stateless function

User.propTypes = {
  user: PropTypes.object.isRequired,
  rank: PropTypes.number.isRequired,
  web: PropTypes.string.isRequired
}

class UserRow extends React.Component {
  render() {
    const web = "www.freecodecamp.org";
    let rank = 1;
    let rows = [];
    let key = 0;
    this.props.data.forEach(function(user) {
      key++;
      rows.push(
        <User rank={rank++} user={user} web={web} key={key} />
      );
    });
    return (
      <div>
        {this.props.reverse ? rows.reverse() : rows}
      </div>
    );
  } // end of rendering
} // end of UserTable stateless component

UserRow.propTypes = {
  recentData: PropTypes.bool.isRequired,
  data: PropTypes.array.isRequired,
  reverse: PropTypes.bool.isRequired
}

class LeaderboardTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataAPI: [],
      recentData: true,
      reverse: false,
    };
    this.dataFetch = this.dataFetch.bind(this);
    this.refresh = this.refresh.bind(this);
    this.handleRecentClick = this.handleRecentClick.bind(this);
    this.handleAllTimeClick = this.handleAllTimeClick.bind(this);
  } // end of constructor

  dataFetch() {
    $.ajax({
      type: "GET",
      url: this.state.recentData ?
        this.props.recentAPI :
        this.props.alltimeAPI,
      cache: false,
      success: function(data) {
        this.setState({
          dataAPI: data,
        });
      }.bind(this)
    });
  } // end of dataFetch

  componentDidMount() {
    this.dataFetch();
  } // end of componentDidMount

  refresh() {
    setTimeout(
      () => this.dataFetch(),
      10
    );
  }

  handleRecentClick() {
    if (this.state.recentData) {
      this.setState({
        reverse: true,
      });
    }
    if (!this.state.recentData) {
      this.setState(prevState => ({
        recentData: !prevState.recentData,
        reverse: false,
      }));
      this.refresh();
    }
  } // end of handleRecentClick

  handleAllTimeClick() {
    if (!this.state.recentData) {
      this.setState({
        reverse: true,
      });
    }
    if (this.state.recentData) {
      this.setState(prevState => ({
        recentData: !prevState.recentData,
        reverse: false,
      }));
      this.refresh();
    }
  } // end of handleAllTimeClick

  render() {
    return (
      <div className="list-container">
        <UserHeader
          recentData={this.state.recentData}
          handleRecentClick={this.handleRecentClick}
          handleAllTimeClick={this.handleAllTimeClick}
        />
        <UserRow
          recentData={this.state.recentData}
          data={this.state.dataAPI}
          reverse={this.state.reverse}
        />
      </div>
    );
  } // end of rendering
} // end of LeaderboardTable stateful component

LeaderboardTable.propTypes = {
  recentAPI: PropTypes.string.isRequired,
  alltimeAPI: PropTypes.string.isRequired
}

const LeaderboardHeader = () => {
  const string = "freeCodeCamp's Leaderboard"
  return (
    <div className="header">
      <a href="www.freecodecamp.com">
        <img className="logo" alt="freeCodeCamp Logo" src="https://cdn.rawgit.com/Deftwun/e3756a8b518cbb354425/raw/6584db8babd6cbc4ecb35ed36f0d184a506b979e/free-code-camp-logo.svg" />
        </a>
      <h1>{string}</h1>
    </div>
  );
} // end of LeaderboardHeader stateless function

const SortingLeaderboardTable = (props) => {
  return (
    <div className="container">
      <LeaderboardHeader />
      <LeaderboardTable
        recentAPI={props.recentAPI}
        alltimeAPI={props.alltimeAPI}
      />
    </div>
  );
} // end of SortingLeaderboardTable stateless function

SortingLeaderboardTable.propTypes = {
  recentAPI: PropTypes.string.isRequired,
  alltimeAPI: PropTypes.string.isRequired
}

ReactDOM.render(
  <SortingLeaderboardTable
    recentAPI="https://fcctop100.herokuapp.com/api/fccusers/top/recent"
    alltimeAPI="https://fcctop100.herokuapp.com/api/fccusers/top/alltime"/>,
  document.getElementById('root')
);
