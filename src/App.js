import React, { Component } from "react";
import "./App.css";

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <main />
        <footer />
      </div>
    );
  }
}

const Header = props => {
  return (
    <header>
      <img src="#" />
      <h1>Search Hacker News</h1>
      <input type="text" />
    </header>
  );
};

const Item = ({ item }) => {
  const { title, url, author, points, num_comments, created_at_i } = item;
  return (
    <div>
      <p>{title}</p>
      <div>
        <span>{points} points</span>&#124;
        <span>{author}</span>&#124;
        <span>{calcElapsedTime(created_at_i)}</span>&#124;
        <span>{num_comments} comments</span>&#124;
        <a href={url}>({url})</a>
      </div>
    </div>
  );
};

const calcElapsedTime = dt => {
  return "3 hours ago";
};

export default App;
