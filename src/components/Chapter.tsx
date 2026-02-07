.chapter-num {
  font-family: 'Georgia', serif;
  text-transform: uppercase;
  font-size: 0.8rem;
  letter-spacing: 2px;
  color: #999;
}

.chapter-title {
  font-family: 'Playfair Display', serif;
  color: #8d4925;
  font-style: italic;
  font-size: 2.5rem;
  margin: 10px 0 30px 0;
}

/* El truco de la Letra Capital */
.chapter-text::first-letter {
  float: left;
  font-size: 4rem;
  line-height: 1;
  padding-right: 10px;
  font-family: 'Playfair Display', serif;
  color: #333;
}