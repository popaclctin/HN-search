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

  setData(data) {
    this.setState({ data, isLoading: false });
  }

  fetchData(page = 0) {
    const { searchTerm, searchOpt, byOpt, forOpt } = this.state;
    const dateFilter = forOpt
      ? `created_at_i>${Math.floor((Date.now() - forOpt * 1000) / 1000)}`
      : "";
    this.setState({ isLoading: true });
    fetch(
      `${PATH_BASE}${byOpt}?${PARAM_SEARCH}${searchTerm}&${PARAM_TAGS}${searchOpt}&${PARAM_FILTERS}${dateFilter}&${PARAM_PAGE}${page}`
    )
      .then(response => response.json())
      .then(result => this.setData(result))
      .catch(error => this.setState({ error }));
  }

  handleInputChange(event) {
    this.setState({ searchTerm: event.target.value });
    this.fetchData();
  }

  handleSelectChange(event) {
    switch (event.target.name) {
      case "search": {
        this.setState({ searchOpt: event.target.value });
        break;
      }
      case "by": {
        this.setState({ byOpt: event.target.value });
        break;
      }
      case "for": {
        this.setState({ forOpt: event.target.value });
        break;
      }
      default:
        return;
    }
    this.fetchData();
  }

  handlePageClick(page) {
    this.setState({ page });
    this.fetchData(page);
  }

  render() {
    const { data, searchTerm, searchOpt, byOpt, forOpt, page } = this.state;
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
        <Table list={hits} selected={page} onClick={this.handlePageClick} />
      </div>
    );
  }
}

export default App;
