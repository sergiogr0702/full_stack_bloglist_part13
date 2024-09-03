CREATE TABLE Blogs (
    id SERIAL PRIMARY KEY,
    author text,
    url text NOT NULL,
    title text NOT NULL,
    likes integer DEFAULT 0
);

INSERT INTO Blogs (author, url, title) VALUES ('Dan Abramov', 'http://www.example.com', 'On let vs const');
INSERT INTO Blogs (author, url, title) VALUES ('Laurenz Albe', 'http://www.example.com', 'Gaps in sequences in PostgreSQL');