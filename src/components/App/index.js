import React, { Component } from "react";
import Search from "Search";
import "./index.css";
import classNames from "classnames";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data,
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
    const { searchOpt, byOpt, forOpt } = this.state;
    const dateFilter = forOpt
      ? `created_at_i>${Math.floor((Date.now() - forOpt * 1000) / 1000)}`
      : "";
    this.setState({ isLoading: true });
    console.log(
      `${PATH_BASE}${byOpt}?${PARAM_SEARCH}${searchTerm}&${PARAM_TAGS}${searchOpt}&${PARAM_FILTERS}${dateFilter}&${PARAM_PAGE}${page}`
    );
    fetch(
      `${PATH_BASE}${byOpt}?${PARAM_SEARCH}${searchTerm}&${PARAM_TAGS}${searchOpt}&${PARAM_FILTERS}${dateFilter}&${PARAM_PAGE}${page}`
    )
      .then(response => response.json())
      .then(result => this.setData(result))
      .catch(error => this.setState({ error }));
  }

  handleInputChange(event) {
    const searchTerm = event.target.value;
    this.setState({ searchTerm });
    this.fetchData(searchTerm);
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
    this.fetchData(this.state.searchTerm);
  }

  render() {
    const {
      isLoading,
      data,
      searchTerm,
      searchOpt,
      byOpt,
      forOpt
    } = this.state;
    const hits = data ? data.hits : [];
    const list = hits.map(item => <Item key={item.objectID} item={item} />);
    return (
      <div className="App">
        <Search
          searchValue={searchTerm}
          handleInputChange={this.handleInputChange}
          nbResults={data.nbHits}
          fetchTime={data.processingTimeMS / 1000}
          searchOpt={searchOpt}
          byOpt={byOpt}
          forOpt={forOpt}
          handleSelectChange={handleSelectChange}
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

export default App;
