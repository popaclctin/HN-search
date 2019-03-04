import React, { Component } from "react";
import "./App.css";
import { data } from "./api-response.js";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      isLoading: false
    };
  }

  componentDidMount() {}

  render() {
    const { isLoading, data } = this.state;
    const hits = data ? data.hits : [];
    const list = hits.map(item => <Item key={item.objectID} item={item} />);
    return (
      <div className="App">
        <Header />
        <main>{!isLoading && list}</main>
        <Nav />
      </div>
    );
  }
}

const Header = props => {
  return (
    <header>
      <img src="#" alt="HN Search logo" />
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

const Nav = props => {
  return (
    <nav>
      <ul>
        <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#">Settings</a>
        </li>
        <li>
          <a href="#">Help</a>
        </li>
        <li>
          <a href="#">API</a>
        </li>
        <li>
          <a href="#">Hacker News</a>
        </li>
        <li>
          <a href="#">Fork/Contribute</a>
        </li>
        <li>
          <a href="#">Status</a>
        </li>
        <li>
          <a href="#">Cool apps</a>
        </li>
      </ul>
    </nav>
  );
};
export default App;
