import React, { Component } from "react";
import "./App.css";
import { data } from "./api-response.js";
import logo from "./img/logo-hn-search.webp";

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
      <img className="logo" src={logo} alt="HN Search logo" />
      <h1>Search Hacker News</h1>
      <input
        className="search"
        type="search"
        placeholder="Search stories by title, url or author"
      />
    </header>
  );
};

const Item = ({ item }) => {
  const { title, url, author, points, num_comments, created_at_i } = item;
  return (
    <div className="item">
      <p>
        <a href={url}>{title}</a>
      </p>
      <div className="info">
        <span>{points} points</span>
        <span>{author}</span>
        <span>{calcElapsedTime(created_at_i)}</span>
        <span>{num_comments} comments</span>
        <span>
          <a href={url}>({url})</a>
        </span>
      </div>
    </div>
  );
};

const calcElapsedTime = dt => {
  const now = new Date();
  const date = new Date(dt * 1000);
  let result;
  const elapsedSec = Math.floor((now - date) / 1000);
  if (elapsedSec < 60)
    result = `${elapsedSec} second${elapsedSec === 1 ? "" : "s"} ago`;

  const elapsedMin = Math.floor(elapsedSec / 60);
  if (elapsedMin < 60)
    result = `${elapsedMin} minute${elapsedMin === 1 ? "" : "s"} ago`;

  const elapsedHours = Math.floor(elapsedMin / 60);
  if (elapsedHours < 24)
    result = `${elapsedHours} hour${elapsedHours === 1 ? "" : "s"} ago`;

  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays < 31)
    result = `${elapsedDays} day${elapsedDays === 1 ? "" : "s"} ago`;

  const elapsedMonths = Math.floor(elapsedDays / 31);
  if (elapsedMonths < 12)
    result = `${elapsedMonths} month${elapsedMonths === 1 ? "" : "s"} ago`;
  else {
    const elapsedYears = Math.floor(elapsedMonths / 12);
    result = `${elapsedYears} year${elapsedYears === 1 ? "" : "s"} ago`;
  }
  return result;
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
