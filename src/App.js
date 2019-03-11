import React, { Component } from "react";
import "./App.css";
import { data } from "./api-response.js";
import logo from "./img/logo-hn-search.webp";
import classNames from "classnames";

const PATH_BASE = "https://hn.algolia.com/api/v1/";
const PARAM_SEARCH = "query=";
const PARAM_TAGS = "tags=";
const PARAM_FILTERS = "numericFilters=";
const PARAM_PAGE = "page=";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
      isLoading: false,
      searchValue: "",
      searchOption: "story",
      byOption: "search",
      forOption: "",
      searchTerm: "",
      error: null,
      page: 0
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.fetchData = this.fetchData.bind(this);
  }

  componentDidMount() {
    const { searchTerm } = this.state;
    this.fetchData(searchTerm);
  }

  setData(data) {
    this.setState({ data, isLoading: false });
  }

  fetchData(searchTerm, page = 0) {
    const { searchOption, byOption, forOption } = this.state;
    const dateFilter = forOption
      ? `created_at_i>${Math.floor((Date.now() - forOption * 1000) / 1000)}`
      : "";
    this.setState({ isLoading: true });
    console.log(
      `${PATH_BASE}${byOption}?${PARAM_SEARCH}${searchTerm}&${PARAM_TAGS}${searchOption}&${PARAM_FILTERS}${dateFilter}&${PARAM_PAGE}${page}`
    );
    fetch(
      `${PATH_BASE}${byOption}?${PARAM_SEARCH}${searchTerm}&${PARAM_TAGS}${searchOption}&${PARAM_FILTERS}${dateFilter}&${PARAM_PAGE}${page}`
    )
      .then(response => response.json())
      .then(result => this.setData(result))
      .catch(error => this.setState({ error }));
  }

  handleChange(event) {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    this.fetchData(searchTerm);
  }

  handleSelectChange(event) {
    switch (event.target.name) {
      case "search": {
        this.setState({ searchOption: event.target.value });
        break;
      }
      case "by": {
        this.setState({ byOption: event.target.value });
        break;
      }
      case "for": {
        this.setState({ forOption: event.target.value });
        break;
      }
      default:
        return;
    }
    this.fetchData(this.state.searchTerm);
  }

  render() {
    const {
      isLoading,
      data,
      searchTerm,
      searchOption,
      byOption,
      forOption
    } = this.state;
    const hits = data ? data.hits : [];
    const list = hits.map(item => <Item key={item.objectID} item={item} />);
    return (
      <div className="App">
        <Header searchValue={searchTerm} handleChange={this.handleChange} />
        <SearchOptions
          handleSelectChange={this.handleSelectChange}
          searchOption={searchOption}
          byOption={byOption}
          forOption={forOption}
          nbResults={data.nbHits}
          fetchTime={data.processingTimeMS / 1000}
        />
        <main>
          {!isLoading && list}
          <Pages
            nbPages={data.nbPages}
            selected={data.page}
            onClick={this.fetchData}
            searchTerm={searchTerm}
          />
        </main>
        <Nav />
      </div>
    );
  }
}

const Header = ({ searchValue, handleChange }) => {
  return (
    <header>
      <img className="logo" src={logo} alt="HN Search logo" />
      <h1>Search Hacker News</h1>
      <input
        className="search"
        type="search"
        placeholder="Search stories by title, url or author"
        value={searchValue}
        onChange={handleChange}
      />
    </header>
  );
};

const SearchOptions = ({
  nbResults,
  fetchTime,
  searchOption,
  byOption,
  forOption,
  handleSelectChange
}) => {
  return (
    <div className="searchOptions">
      <div className="options">
        <label>
          Search
          <select
            name="search"
            value={searchOption}
            onChange={handleSelectChange}
          >
            <option value="">All</option>
            <option value="story">Stories</option>
            <option value="comment">Comments</option>
          </select>
        </label>
        <label>
          by
          <select name="by" value={byOption} onChange={handleSelectChange}>
            <option value="search">Popularity</option>
            <option value="search_by_date">Date</option>
          </select>
        </label>
        <label>
          for
          <select name="for" value={forOption} onChange={handleSelectChange}>
            <option value="">All time</option>
            <option value="86400">Past 24h</option>
            <option value="604800">Past Week</option>
            <option value="18144000">Past Month</option>
            <option value="217728000">Past Year</option>
          </select>
        </label>
      </div>
      <div className="stats">
        {nbResults} results ({fetchTime} seconds)
      </div>
    </div>
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

const Pages = ({ nbPages, selected, onClick, searchTerm }) => {
  nbPages = parseInt(nbPages);
  selected = parseInt(selected);
  let pages = [];
  for (let i = 0; i < nbPages; i++) {
    pages.push(
      <Page
        value={i + 1}
        key={i}
        selected={selected === i}
        onClick={onClick}
        searchTerm={searchTerm}
      />
    );
  }
  if (pages.length > 10) {
    if (selected + 4 < nbPages - 1) {
      pages.splice(
        selected + 5,
        nbPages - 6 - selected,
        <Page value="..." disabled="true" />
      );
    }
    if (selected - 5 > 0)
      pages.splice(1, selected - 6, <Page value="..." disabled="true" />);
  }
  return (
    <ul className="pages">
      {selected !== 0 && <Page value="<<" />}
      {pages}
      {selected !== nbPages - 1 && <Page value=">>" />}
    </ul>
  );
};

//de adaugat onClick
const Page = ({ value, selected, disabled, onClick, searchTerm }) => {
  const buttonClass = classNames(
    { selected: selected },
    { disabled: disabled }
  );
  return (
    <li className="page">
      <button
        disabled={disabled}
        className={buttonClass}
        onClick={() => onClick(searchTerm, value - 1)}
      >
        {value}
      </button>
    </li>
  );
};

const Nav = props => {
  return (
    <nav>
      <ul>
        <li>
          <a href="www.example.com">About</a>
        </li>
        <li>
          <a href="www.example.com">Settings</a>
        </li>
        <li>
          <a href="www.example.com">Help</a>
        </li>
        <li>
          <a href="www.example.com">API</a>
        </li>
        <li>
          <a href="www.example.com">Hacker News</a>
        </li>
        <li>
          <a href="www.example.com">Fork/Contribute</a>
        </li>
        <li>
          <a href="www.example.com">Status</a>
        </li>
        <li>
          <a href="www.example.com">Cool apps</a>
        </li>
      </ul>
    </nav>
  );
};
export default App;
