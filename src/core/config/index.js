"use strict";

module.exports = {
  actionNames: [
    "create",
    "destroy",
    "edit",
    "find",
    "index",
    "list",
    "new",
    "show",
    "update"
  ],
  seedDirectories: [
    "app",
    "app/assets",
    "app/assets/images",
    "app/controllers",
    "app/models",
    "app/views",
    "bin",
    "config",
    "db",
    "db/migrations",
    "public",
    "public/assets",
    "public/assets/images",
    "test",
    "test/controllers",
    "test/fixtures",
    "test/helpers",
    "test/models"
  ],
  templates: {
    editorConfig: `
    # http://editorconfig.org
    root = true

    [*]
    charset = utf-8
    end_of_line = lf
    indent_size = 2
    indent_style = space
    insert_final_newline = true
    max_line_length = 80
    trim_trailing_whitespace = true
    `,
    errors: {
      routing: (err, msg) => `
      <!doctype html>
      <html>
        <head>
          <title>Controller: Exception</title>

          <style type="text/css" media="screen">
            body {
              margin: 0;
              margin-bottom: 25px;
              padding: 0;
              background-color: #f0f0f0;
              font-family: "Lucida Grande", "Bitstream Vera Sans", "Verdana";
              font-size: 13px;
              color: #333;
            }

            header {
              width: 100%;
              color: #f0f0f0;
              background: #24252a;
              padding: 0.5em 1.5em;
            }

            header h1 {
              margin: 0.2em 0;
              line-height: 1.1em;
              font-size: 2em;
            }

            main h2 {
              color: #24252a;
              padding: 0 1.5em;
            }
          </style>
        </head>
        <body>
          <header>
            <h1>${err}</h1>
          </header>

          <main>
            <h2>${msg}</h2>
          </main>
        </body>
      </html>
      `
    },
    welcome: () => `
    <!doctype html>
    <html>
      <head>
        <title>The Boring Framework: Welcome aboard</title>

        <style type="text/css" media="screen">
          body {
            margin: 0;
            margin-bottom: 25px;
            padding: 0;
            background-color: #f0f0f0;
            font-family: "Lucida Grande", "Bitstream Vera Sans", "Verdana";
            font-size: 13px;
            color: #333;
          }

          #page {
            background-color: #f0f0f0;
            width: 750px;
            margin: 0;
            margin-left: auto;
            margin-right: auto;
          }

          #content {
            float: left;
            background-color: white;
            border: 3px solid #aaa;
            border-top: none;
            padding: 25px;
            width: 500px;
          }

          .filename {
            font-style: italic;
          }

          header {
            background-repeat: no-repeat;
            background-position: top left;
            height: 64px;
            padding-left: 75px;
            padding-right: 30px;
          }

          header h1 {
            margin: 0;
          }

          header h2 {
            margin: 0;
            color: #888;
            font-weight: normal;
            font-size: 16px;
          }

          #about {
            padding-left: 75px;
            padding-right: 30px;
          }

          #about h3 {
            margin: 0;
            margin-bottom: 10px;
            font-size: 14px;
          }

          #about-content {
            background-color: #ffd;
            border: 1px solid #fc0;
            margin-left: -55px;
            margin-right: -10px;
          }

          #about-content table {
            margin-top: 10px;
            margin-bottom: 10px;
            font-size: 11px;
            border-collapse: collapse;
          }

          #about-content td {
            padding: 10px;
            padding-top: 3px;
            padding-bottom: 3px;
          }

          #about-content td.name  {
            font-weight: bold;
            vertical-align: top;
            color: #555;
          }

          #about-content td.value {
            color: #000
          }

          #about-content ul {
            padding: 0;
            list-style-type: none;
          }

          #about-content.failure {
            background-color: #fcc;
            border: 1px solid #f00;
          }

          #about-content.failure p {
            margin: 0;
            padding: 10px;
          }

          #getting-started {
            padding-left: 75px;
            padding-right: 30px;
          }

          #getting-started {
            border-top: 1px solid #ccc;
            margin-top: 25px;
            padding-top: 15px;
          }

          #getting-started h1 {
            margin: 0;
            font-size: 20px;
          }

          #getting-started h2 {
            margin: 0;
            font-size: 14px;
            font-weight: normal;
            color: #333;
            margin-bottom: 25px;
          }

          #getting-started ol {
            margin-left: 0;
            padding-left: 0;
          }

          #getting-started li {
            font-size: 18px;
            color: #888;
            margin-bottom: 25px;
          }

          #getting-started li h2 {
            margin: 0;
            font-weight: normal;
            font-size: 18px;
            color: #333;
          }

          #getting-started li p {
            color: #555;
            font-size: 13px;
          }

          #sidebar {
            float: right;
            width: 175px;
          }

          #sidebar ul {
            margin-left: 0;
            padding-left: 0;
          }

          #sidebar ul h3 {
            margin-top: 25px;
            font-size: 16px;
            padding-bottom: 10px;
            border-bottom: 1px solid #ccc;
          }

          #sidebar li {
            list-style-type: none;
          }

          #sidebar ul.links li {
            margin-bottom: 5px;
          }

          footer {
            clear: both;
          }
        </style>
      </head>
      <body>
        <div id="page">
          <main id="content">
            <header>
              <h1>Welcome aboard</h1>
              <h2>You&#39;re building your app with The Boring Framework!</h2>
            </header>

            <div id="about">
              <h3><a href="/boring/info/properties" onclick="about(); return false">About your application&#39;s environment</a></h3>
              <div id="about-content" style="display: none"></div>
            </div>

            <div id="getting-started">
              <h1>Getting started</h1>

              <ol>
                <li>
                  <h2>Use <code>./bin/boring.sh generate</code> to create your controllers, actions and models</h2>
                  <p>To see all available options, run it without parameters.</p>
                </li>

                <li>
                  <h2>Set up a root route to replace this page</h2>
                  <p>You&#39;re seeing this page because you&#39;re running in development mode and you haven't set a root route yet.</p>
                  <p>Configure a root route in <span class="filename">config/all.js</span>.</p>
                </li>

                <li>
                  <h2>Configure your database</h2>
                  <p>If you're not using SQLite (the default), edit the database in <span class="filename">config/index.js</span> with your connection information.</p>
                </li>
              </ol>
            </div>
          </main>

          <aside id="sidebar">
            <ul id="sidebar-items">
              <li>
                <h3>Browse the documentation</h3>
                <ul class="links">
                  <li><a rel="noopener noreferrer" target="_blank" href="https://github.com/sodacitylabs/boring-framework/wiki">Guides</a></li>
                  <li><a rel="noopener noreferrer" target="_blank" href="https://nodejs.org">NodeJS core</a></li>
                </ul>
              </li>
            </ul>
          </aside>

          <footer>&nbsp;</div>
        </div>

        <script>
          function about() {
            var info = document.getElementById('about-content'),
                xhr;

            if (info.innerHTML === '') {
              xhr = new XMLHttpRequest();
              xhr.open("GET", "/boring/info/properties", false);
              xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
              xhr.send("");
              info.innerHTML = xhr.responseText;
            }

            info.style.display = info.style.display === 'none' ? 'block' : 'none';
          }
        </script>
      </body>
    </html>
    `
  },
  versions: {
    ejs: "2.6.1",
    eslint: "5.8.0",
    knex: "0.15.2",
    lodash: "4.17.10",
    npm: "0.4.0",
    nodemon: "1.18.9",
    prettier: "1.14.2",
    sqlite3: "4.0.3",
    uuid: "3.3.2"
  },
  viewActionNames: ["index", "new", "show", "edit"]
};
