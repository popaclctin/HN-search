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

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      isLoading: false,
      searchValue: "",
      searchOpt: "story",
      byOpt: "search",
      forOpt: "",
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
    const { searchTerm, searchOpt, byOpt, forOpt } = this.state;
    let url = PATH_BASE;
    url = url.concat(byOpt, "?");
    if (searchTerm) {
      url = url.concat(PARAM_SEARCH, searchTerm, "&");
    }
    if (searchOpt) {
      url = url.concat(PARAM_TAGS, searchOpt, "&");
    }
    if (forOpt) {
      url = url.concat(
        PARAM_FILTERS,
        `created_at_i>${Math.floor((Date.now() - forOpt * 1000) / 1000)}`,
        "&"
      );
    }
    url = url.concat(PARAM_PAGE, page);
    this.setState({ isLoading: true });
    console.log(url);
    fetch(url)
      .then(response => response.json())
      .then(result => this.setState({ data: result, isLoading: false }))
      .catch(error => this.setState({ error }));
  }

  handleInputChange(event) {
    this.setState({ searchTerm: event.target.value }, this.fetchData());
  }

  handleSelectChange(event) {
    const { name, value } = event.target;
    this.setState({ [name]: value }, this.fetchData());
  }

  handlePageClick(page) {
    this.setState({ page }, this.fetchData(page));
  }

  render() {
    const {
      data,
      searchTerm,
      searchOpt,
      byOpt,
      forOpt,
      page,
      isLoading,
      error
    } = this.state;
    const hits = data ? data.hits : [];
    return (
      <div className="App">
        <Search
          searchValue={searchTerm}
          handleInputChange={this.handleInputChange}
          nbResults={data && data.nbHits}
          fetchTime={data && data.processingTimeMS / 1000}
          searchOpt={searchOpt}
          byOpt={byOpt}
          forOpt={forOpt}
          handleSelectChange={this.handleSelectChange}
        />
        {!isLoading && (
          <Table list={hits} selected={page} onClick={this.handlePageClick} />
        )}
        {error && <div>{error}</div>}
      </div>
    );
  }
}

export default App;
