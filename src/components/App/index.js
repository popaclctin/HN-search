import React, { Component } from "react";
import Search from "../Search";
import Table from "../Table";
import "./index.css";
import {
  PATH_BASE,
  PARAM_SEARCH,
  PARAM_TAGS,
  PARAM_FILTERS,
  PARAM_PAGE
} from "../../constants";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false,
      searchValue: "",
      optSearch: "story",
      optBy: "search",
      optFor: "",
      searchTerm: "",
      error: null,
      page: 0
    };
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSelectChange = this.handleSelectChange.bind(this);
    this.handlePageClick = this.handlePageClick.bind(this);
  }

  componentDidMount() {
    this.fetchData();
  }

  fetchData(page = 0) {
    this.setState({ isLoading: true });
    const { searchTerm, optSearch, optBy, optFor } = this.state;
    let url = PATH_BASE;
    url = url.concat(optBy, "?");
    if (searchTerm) {
      url = url.concat(PARAM_SEARCH, searchTerm, "&");
    }
    if (optSearch) {
      url = url.concat(PARAM_TAGS, optSearch, "&");
    }
    if (optFor) {
      url = url.concat(
        PARAM_FILTERS,
        `created_at_i>${Math.floor((Date.now() - optFor * 1000) / 1000)}`,
        "&"
      );
    }
    url = url.concat(PARAM_PAGE, page);
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(result => this.setState({ data: result, isLoading: false, page }))
      .catch(error => this.setState({ error }));
  }

  handleInputChange(event) {
    this.setState({ searchTerm: event.target.value }, this.fetchData);
  }

  handleSelectChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value }, this.fetchData);
  }

  handlePageClick(page) {
    this.setState({ page }, () => this.fetchData(page));
  }

  render() {
    const {
      data,
      searchTerm,
      optSearch,
      optBy,
      optFor,
      page,
      isLoading,
      error
    } = this.state;
    const hits = data ? data.hits : [];
    return (
      <div className="app">
        <Search
          searchValue={searchTerm}
          handleInputChange={this.handleInputChange}
          nbResults={data && data.nbHits}
          fetchTime={data && data.processingTimeMS / 1000}
          optSearch={optSearch}
          optBy={optBy}
          optFor={optFor}
          handleSelectChange={this.handleSelectChange}
        />
        {isLoading ? (
          <div class="spinner">
            <FontAwesomeIcon icon={faSpinner} spin size="3x" />
          </div>
        ) : (
          <Table list={hits} selected={page} onClick={this.handlePageClick} />
        )}
        {error && <div>{error}</div>}
      </div>
    );
  }
}

export default App;
