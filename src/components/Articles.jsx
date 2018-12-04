import React, { Component } from "react";
import * as api from "../api";
import { Link, navigate } from "@reach/router";
import PostArticle from "./PostArticle";
import Vote from "./Vote";
import formatDate from "./utils/formatDate";

export default class Articles extends Component {
  state = {
    articles: [],
    loading: true
  };
  render() {
    if (this.state.loading)
      return (
        <div className="loading">
          <i className="fa fa-spinner fa-pulse" aria-hidden="true" />
        </div>
      );
    return (
      <div>
        <PostArticle addArticle={this.addArticle} user={this.props.user} />
        <section>
          {this.state.loading ? (
            <h1>Loading...</h1>
          ) : (
            <div>
              {this.state.articles.map(article => {
                return (
                  <div className="articles" key={article._id}>
                    <div className="article-stub">
                      <div className="votes">
                        <Vote
                          votes={article.votes}
                          _id={article._id}
                          section={"articles"}
                        />
                      </div>
                      <div className="meta-info">
                        Posted by {article.created_by.username}{" "}
                        <img
                          src={article.created_by.avatar_url}
                          onError={e => (e.target.src = "/default.jpeg")}
                          className="tiny-avatar"
                          alt="default user avatar"
                        />
                        {" | "}
                        {formatDate(article.created_at)}
                      </div>
                      <span className="topic-cat">
                        <strong>nc/{article.belongs_to}</strong>
                      </span>

                      <Link
                        to={`/articles/${article._id}`}
                        className="article-title"
                      >
                        <strong>{article.title}</strong>
                      </Link>
                      <p className="article-body">
                        {article.body
                          .split(" ")
                          .slice(0, 40)
                          .join(" ")}
                        {article.body.split(" ").length > 40 && (
                          <i className="fas fa-arrow-right" />
                        )}
                      </p>
                      <Link
                        key={article._id}
                        to={`/articles/${article._id}/comments`}
                      >
                        <span className="article-comments">
                          {`${
                            article.comment_count
                          } ${(article.comment_count === 1 && `Comment`) ||
                            `Comments`}`}
                          <i className="fas fa-comment" />
                        </span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>
    );
  }

  componentDidMount() {
    this.fetchArticles();
  }

  componentDidUpdate(prevProps) {
    const { topic } = this.props;
    if (prevProps.topic !== topic) this.fetchArticles();
  }

  fetchArticles = () => {
    const { topic } = this.props;
    api
      .getArticles(topic)
      .then(articles => {
        articles.sort(function(a, b) {
          return new Date(b.created_at) - new Date(a.created_at);
        });
        this.setState({
          articles: articles,
          loading: false
        });
      })
      .catch(err => {
        navigate("/error", {
          replace: true,
          state: {
            errCode: err.response.status,
            errMsg: err.response.data.msg
          }
        });
      });
  };

  addArticle = newArticle => {
    this.setState({ articles: [newArticle, ...this.state.articles] });
  };
}
