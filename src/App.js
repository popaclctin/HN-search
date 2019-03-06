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
        <span>{timeAgo(Date.now() - created_at_i * 1000)}</span>
        <span>{num_comments} comments</span>
        <span>
          <a href={url}>({url})</a>
        </span>
      </div>
    </div>
  );
};

const timeAgo = duration => {
  let ago = Math.floor(duration / 1000);
  let part = 0;

  if (ago < 2) return "a moment ago";
  if (ago < 60) return `${ago} seconds ago`;

  if (ago < 120) return `a minute ago`;
  if (ago < 3600) {
    while (ago >= 60) {
      ago -= 60;
      part += 1;
    }
    return `${part} minutes ago`;
  }

  if (ago < 7200) return `an hour ago`;
  if (ago < 24 * 3600) {
    while (ago >= 3600) {
      ago -= 3600;
      part += 1;
    }
    return `${part} hours ago`;
  }

  if (ago < 2 * 24 * 3600) return "a day ago";
  if (ago < 30 * 24 * 3600) {
    while (ago >= 24 * 3600) {
      ago -= 24 * 3600;
      part += 1;
    }
    return `${part} days ago`;
  }

  if (ago < 2 * 30 * 24 * 3600) return `a month ago`;
  if (ago < 12 * 30 * 24 * 3600) {
    while (ago >= 30 * 24 * 3600) {
      ago -= 30 * 24 * 3600;
      part += 1;
    }
    return `${part} months ago`;
  }

  if (ago < 2 * 12 * 30 * 24 * 3600) return `a year ago`;
  if (ago < 39 * 12 * 30 * 24 * 3600) {
    while (ago >= 12 * 30 * 24 * 3600) {
      ago -= 12 * 30 * 24 * 3600;
      part += 1;
    }
    return `${part} years ago`;
  }

  return "never";
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
