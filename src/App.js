import './App.css';
import React, { useState, createContext, useContext, useEffect } from "react";
import { FaGithub,FaTwitter,FaLinkedin,FaAdjust } from "react-icons/fa";

const matter = require('gray-matter');
const themeContext = createContext();

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(prev => !prev);
  }

  return (
    <themeContext.Provider value={isDarkTheme}>
      <div className="App container px-0 overflow-hidden">
        <Navbar toggleTheme={toggleTheme} />
        <ArticleList toggleTheme={toggleTheme} />
        <Footer toggleTheme={toggleTheme} />
      </div>
    </themeContext.Provider>
  );
}

function importAll(r) {
  return r.keys().map(r);
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
function ArticleList() {
  const [posts, setPosts] = useState([]);
  const postPaths = importAll(require.context('./post/', true, /\.(md)$/));

  //
  useEffect(() => {
    postPaths.forEach(post => {
      fetch(post)
        .then(response => {
          return response.text();
        })
        .then(text => {
          setPosts(prev => [...prev,text]);
        })
    });
  },[]);


  return (
    <section className='articleList flex-grow-1'>
      {postPaths} 
      <br />
      {posts}
    </section>
  )
}

function article() {

}

//Navbar for the blog page
function Navbar() {
  return(
    <header className='header'>
    <div className="row no-gutters">
      <div className='col-1' />
      <div className="col-9 p-1">

      </div>
      <div className="col-2 p-1 text-end">
        <button className='btn btn-dark me-4 mt-1'>
          <FaAdjust />
        </button>
      </div>
    </div>
  </header>
  )
}

//Footer for the blog page
function Footer() {
  return (
    <footer className="footer">
      <div className="row no-gutters">
        <div className='col-1' />
        <div className="col-9 p-1">
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
          <div className="col-2 p-3 text-end">
            <div className='me-4 mt-1'>
              © 2022 Alex Ko
            </div>
        </div>
        </div>
    </footer>
  )
}

export default App;
