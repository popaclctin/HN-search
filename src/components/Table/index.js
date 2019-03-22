import React from "react";
import "./index.css";
import classNames from "classnames";

const Table = ({ list, ...rest }) => {
  const result = list.map(item => <Item key={item.objectID} item={item} />);
  return (
    <div className="table">
      {result}
      <Pagination nbPages={list.length} {...rest} />
    </div>
  );
};

const Item = ({ item }) => {
  const {
    title,
    url,
    author,
    points,
    num_comments,
    created_at_i,
    comment_text,
    objectID
  } = item;
  return (
    <div className="item">
      <h2>
        <a href={url}>{title}</a>
      </h2>
      <ul className="info">
        <li>
          <a
            href={`https://news.ycombinator.com/item?id=${objectID}`}
            title="See original post on HN"
          >
            {points} points
          </a>
        </li>
        <li>
          <a
            href={`https://news.ycombinator.com/user?id=${author}`}
            title={`See ${author} profile`}
          >
            {author}
          </a>
        </li>
        <li>
          <a
            href={`https://news.ycombinator.com/item?id=${objectID}`}
            title={new Date(created_at_i * 1000).toISOString()}
          >
            {timeAgo(Date.now() - created_at_i * 1000)}
          </a>
        </li>
        <li>
          <a
            href={`https://news.ycombinator.com/item?id=${objectID}`}
            title="See original post on HN"
          >
            {num_comments} comments
          </a>
        </li>
        {url && (
          <li>
            <a href={url}>({url})</a>
          </li>
        )}
      </ul>
      <div className="comment">{comment_text}</div>
    </div>
  );
};

const Pagination = ({ nbPages, selected, onClick }) => {
  nbPages = parseInt(nbPages);
  selected = parseInt(selected);
  let pages = [];
  for (let i = 0; i < nbPages; i++) {
    pages.push(
      <Page value={i + 1} key={i} selected={selected === i} onClick={onClick} />
    );
  }
  if (pages.length > 10) {
    if (selected + 4 < nbPages - 1) {
      pages.splice(
        selected + 5,
        nbPages - 6 - selected,
        <Page value="..." disabled={true} />
      );
    }
    if (selected - 5 > 0)
      pages.splice(1, selected - 6, <Page value="..." disabled={true} />);
  }

  return (
    <ul className="pages">
      {selected !== 0 && (
        <Page value="<<" onClick={() => onClick(selected - 1)} />
      )}
      {pages}
      {selected !== nbPages - 1 && (
        <Page value=">>" onClick={() => onClick(selected + 1)} />
      )}
    </ul>
  );
};

const Page = ({ value, selected, disabled, onClick }) => {
  const buttonClass = classNames(
    { selected: selected },
    { disabled: disabled }
  );
  return (
    <li className="page">
      <button
        disabled={disabled}
        className={buttonClass}
        onClick={() => onClick(value - 1)}
      >
        {value}
      </button>
    </li>
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

export default Table;
