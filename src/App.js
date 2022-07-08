import './App.css';
import React, { useState, createContext, useEffect } from "react";
import { FaGithub,FaTwitter,FaLinkedin,FaAdjust, FaHome } from "react-icons/fa";
import { useParams, BrowserRouter as Router, Route, Routes } from 'react-router-dom';

const showdown = require('showdown');
const showdownHighlight = require('showdown-highlight');
const converter = new showdown.Converter({metadata: true, extensions: [showdownHighlight({pre: true})]});
const themeContext = createContext();

function importAll(r) {
  return r.keys().map(r);
}

const postPathsGlobal = importAll(require.context('./post/', true, /\.(md)$/));

 function formatDate(value) {
    let date = new Date(value);
    const day = date.toLocaleString('en-GB', { day: '2-digit' });
    const month = date.toLocaleString('en-GB', { month: 'short' });
    const year = date.toLocaleString('en-GB', { year: 'numeric' });
    return day + '-' + month + '-' + year;
  }

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  }

  return (
    <themeContext.Provider value={isDarkTheme}>
      <div className="App container px-0 overflow-hidden">
        <Navbar toggleTheme={toggleTheme} />
        <Router>
          <Routes>
            <Route path="/" element={<ArticleList toggleTheme={toggleTheme} />} />
            <Route path=":id" element={<Article toggleTheme={toggleTheme} />} />
          </Routes>
        </Router>
        {/* {currentContent ? <Article text={currentContent} /> :<ArticleList toggleTheme={toggleTheme} handleArticleClick={handleArticleClick}  />} */}
        <Footer toggleTheme={toggleTheme} />
      </div>
    </themeContext.Provider>
  );
}

/*
  Lesson Learn:
  1.Search all file the local using require.context in Webpack, which already installed in create-react-app
  https://webpack.js.org/guides/dependency-management/#require-context
  2.Fetch by js
  https://javascript.info/fetch
  3.useEffect with empty [] to prevent infitie call due to trigger react to run the code again
  https://www.jianshu.com/p/6e525c3686ab
  4.After v18 of react, useEffect will call twice during Strict Mode
  https://stackoverflow.com/questions/60618844/react-hooks-useeffect-is-called-twice-even-if-an-empty-array-is-used-as-an-ar
*/
function ArticleList(props) {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let postArray = [];
      for (let post of postPathsGlobal) {
        await fetch(post)
                .then(response => {
                  return response.text();
                })
                .then(text => {
                  converter.makeHtml(text);
                  let articleMetadata = converter.getMetadata();
                  postArray.push({
                    title: articleMetadata.title,
                    date: new Date(articleMetadata.date),
                    cta: articleMetadata.cta,
                    preview: articleMetadata.preview,
                    link: articleMetadata.link
                  });
                })
      }
      
      setPosts(postArray.sort((a,b) => b.date - a.date));
    }

    fetchData();
  },[])

  return (
    <section className='articleList flex-grow-1'>
      <div className='article_preview_container'>
        {posts.map((post) => (
            <ArticlePreview link={post.link} title={post.title} preview={post.preview} date={formatDate(post.date)} />
        ))}
      </div>
    </section>
  )
}

function ArticlePreview(props) 
{
  // const onClick = (id) => {
  //   props.handleArticleClick(id);
  // }

  return (
    <div className='article_preview mx-auto'>
      <a href={"/" + props.link}><h3><b>{props.title}</b></h3></a>
      <small>{props.date}</small>
      <p>{props.preview}</p>
    </div>
  )
}

function Article(props) {
  const { id } = useParams();
  const [content, setContent] = useState("");

  //Need rework to prevent loop again to get the selected post
  useEffect(() => {
    postPathsGlobal.forEach(post => {
      fetch(post)
        .then(response => {
          return response.text();
        })
        .then(text => {
          converter.makeHtml(text);
          let articleMetadata = converter.getMetadata();
          if (articleMetadata.link === id)
          {
            setContent(text);
          }
        })
    });
  },[]);

  return (
    <div className='article_detail_container flex-grow-1'>
      <div className='article_detail mx-auto' dangerouslySetInnerHTML={{ __html: content ? converter.makeHtml(content) : "" }}></div>
    </div>
  )
}

//Navbar for the blog page
function Navbar() {
  return(
    <header className='header'>
    <div className="row no-gutters header-container">
      <div className='col-1' />
      <div className="col-9 my-auto">
       <b>Salty Bloooog</b>
       <a className="link-light m-2"
          href='./'
          rel="noopener noreferrer"
          role='button'>
            <FaHome />
          </a>
      </div>
      <div className="col-2 p-1">
      {/* <a className="link-light m-2"
          href='./'
          rel="noopener noreferrer"
          role='button'>
            <FaAdjust />
          </a> */}
      </div>
    </div>
  </header>
  )
}

//Footer for the blog page
function Footer() {
  return (
    <footer className="footer">
      <div className="row no-gutters footer-container">
        <div className='col-1' />
        <div className="col-9 my-auto">
          <a className="link-light m-2"
          href='https://twitter.com/Saltu_HKER'
          target="_blank"
          rel="noopener noreferrer"
          role='button'>
            <FaTwitter />
          </a>
          <a className="link-light m-2"
          href='https://github.com/AlexKo-Salty'
          rel="noopener noreferrer"
          target="_blank"
          role='button'>
            <FaGithub />
          </a>
          <a className="link-light m-2"
          href='https://www.linkedin.com/in/alex-ko-5672301a4/'
          rel="noopener noreferrer"
          target="_blank"
          role='button'>
            <FaLinkedin />
          </a>
          </div>
          <div className="col-2 my-auto">
            <div className='me-4 mt-1'>
              © 2022 Alex Ko
            </div>
        </div>
        </div>
    </footer>
  )
}

export default App;
