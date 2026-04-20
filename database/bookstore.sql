CREATE DATABASE IF NOT EXISTS bookstore;
USE bookstore;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE books (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    rating DECIMAL(2, 1) DEFAULT 0.0,
    reviews INT DEFAULT 0,
    category_id INT,
    image VARCHAR(500),
    badge VARCHAR(50),
    copies_sold VARCHAR(50),
    pdf_link VARCHAR(500),
    in_stock TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL
);


CREATE TABLE cart (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE,
    UNIQUE KEY unique_cart_item (user_id, book_id)
);


CREATE TABLE orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'processing', 'shipped', 'completed', 'cancelled') DEFAULT 'pending',
    shipping_name VARCHAR(100) NOT NULL,
    shipping_email VARCHAR(100) NOT NULL,
    shipping_address VARCHAR(255) NOT NULL,
    shipping_city VARCHAR(100) NOT NULL,
    shipping_zip VARCHAR(20) NOT NULL,
    shipping_phone VARCHAR(20) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);


CREATE TABLE order_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    book_id INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE CASCADE
);


CREATE TABLE contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE newsletter_subscribers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


INSERT INTO users (username, email, password, role) VALUES 
('admin', 'admin@bookstore.com', '$2y$10$8K1p/a0dR1xFKEkxjH5E5eJ5G4YzF5xHJ5nKEkxjH5E5eJ5G4YzF5', 'admin');


INSERT INTO categories (name, slug) VALUES
('Programming', 'programming'),
('Fiction', 'fiction'),
('Non-Fiction', 'non-fiction'),
('Psychology', 'psychology'),
('Web Development', 'web-development'),
('Design Patterns', 'design-patterns'),
('Science & Technology', 'science'),
('Self Help', 'self-help');


INSERT INTO books (title, author, description, price, rating, reviews, category_id, image, badge, in_stock) VALUES
('Clean Code', 'Robert C. Martin', 'A Handbook of Agile Software Craftsmanship', 44.99, 4.8, 1250, 1, 'https://m.media-amazon.com/images/I/41xShlnTZTL._SX376_BO1,204,203,200_.jpg', 'Bestseller', 1),
('Design Patterns', 'Erich Gamma et al.', 'Elements of Reusable Object-Oriented Software', 54.99, 4.7, 980, 6, 'https://i1.wp.com/springframework.guru/wp-content/uploads/2015/04/9780201633610.jpg?resize=520%2C648', 'Classic', 1),
('The Pragmatic Programmer', 'Andrew Hunt & David Thomas', 'Your Journey to Mastery', 49.99, 4.9, 1500, 1, 'https://th.bing.com/th/id/OIP.qj6BQ0g14hMcS78qxOl9iwHaJp', 'Must Read', 1),
('Code Complete', 'Steve McConnell', 'A Practical Handbook of Software Construction', 19.99, 4.7, 1120, 1, 'https://images-na.ssl-images-amazon.com/images/I/41JOmGowq-L._SX408_BO1,204,203,200_.jpg', 'Essential', 1),
('Head First Design Patterns', 'Eric Freeman & Elisabeth Robson', 'A Brain-Friendly Guide', 45.99, 4.7, 900, 6, 'https://images-na.ssl-images-amazon.com/images/I/61APhXCksuL._SX430_BO1,204,203,200_.jpg', 'Beginner Friendly', 1),
('Refactoring', 'Martin Fowler', 'Improving the Design of Existing Code', 46.99, 4.8, 850, 1, 'https://images-na.ssl-images-amazon.com/images/I/41LBzpPXCOL._SX379_BO1,204,203,200_.jpg', NULL, 1),
('You Dont Know JS', 'Kyle Simpson', 'A deep dive into the core mechanisms of JavaScript', 39.99, 4.6, 700, 5, '../images/you don know js book series.jfif', NULL, 1),
('Eloquent JavaScript', 'Marijn Haverbeke', 'A Modern Introduction to Programming', 35.99, 4.5, 580, 5, 'https://images-na.ssl-images-amazon.com/images/I/91asIC1fRwL.jpg', NULL, 1),
('The Art of Computer Programming', 'Donald E. Knuth', 'Comprehensive coverage of algorithms and data structures', 190.00, 4.9, 400, 1, 'https://media.elefant.ro/mnresize/1000/-/images/28/1736328/the-art-of-computer-programming-volume-1-fundamental-algorithms-hardcover-3rd-ed_1_fullsize.jpg', NULL, 1),
('Introduction to Algorithms', 'Thomas H. Cormen et al.', 'Comprehensive introduction to algorithms', 80.00, 4.8, 650, 1, 'https://imgv2-2-f.scribdassets.com/img/document/544555770/original/1f27e81b4c/1702740355?v=1', NULL, 1),
('Cracking the Coding Interview', 'Gayle Laakmann McDowell', '189 Programming Questions and Solutions', 35.99, 4.9, 2200, 1, 'https://th.bing.com/th/id/R.1146e2b3ef30e028082c77d4ddb746fe', 'Bestseller', 1),
('Programming Pearls', 'Jon Bentley', 'A treasure trove of practical programming techniques', 29.99, 4.6, 450, 1, 'https://th.bing.com/th/id/R.66ba7d2264d2c26b783d5a705571b6fd', NULL, 1),
('To Kill a Mockingbird', 'Harper Lee', 'A classic novel about justice and racial inequality', 44.99, 4.8, 650, 2, '../images/to kill a mokingbird.jfif', 'Classic', 1),
('1984', 'George Orwell', 'A dystopian novel exploring surveillance, control, and truth', 29.99, 4.7, 1200, 2, '../images/George Orwell BBC Arena Documentary, 1984_ this….jfif', NULL, 1),
('Pride and Prejudice', 'Jane Austen', 'A classic romance novel about love, class, and society', 24.99, 4.6, 950, 2, '../images/The image depicts a classic book cover for Jane… (2).jfif', NULL, 1),
('The Great Gatsby', 'F. Scott Fitzgerald', 'A story of wealth, love, and the American dream', 27.99, 4.5, 870, 2, '../images/Vintage Book Cover Print _The Great Gatsby_ - F….jfif', NULL, 1),
('Sapiens: A Brief History of Humankind', 'Yuval Noah Harari', 'Explores the history and impact of Homo sapiens', 39.99, 4.8, 2100, 3, '../images/From a renowned historian comes a groundbreaking… (1).jfif', 'Bestseller', 1),
('Educated', 'Tara Westover', 'A memoir about resilience, family, and the pursuit of education', 34.99, 4.7, 1600, 3, '../images/Educated by Tara Westover on Apple Books (1).jfif', NULL, 1),
('Becoming', 'Michelle Obama', 'The inspiring memoir of the former First Lady', 36.99, 4.9, 2500, 3, '../images/Becoming - Michelle Obama.jfif', 'Must Read', 1),
('Thinking, Fast and Slow', 'Daniel Kahneman', 'Examines two modes of thought', 42.99, 4.8, 3000, 4, '../images/download (1).jfif', 'Bestseller', 1),
('Mans Search for Meaning', 'Viktor E. Frankl', 'Reflections on life and finding meaning', 19.99, 4.9, 2800, 4, '../images/Man s search for meaning_.jfif', 'Classic', 1),
('The Power of Habit', 'Charles Duhigg', 'Explores how habits are formed and changed', 33.99, 4.6, 1900, 4, '../images/The Power of Habit_ A Book Review.jfif', NULL, 1),
('Influence: The Psychology of Persuasion', 'Robert B. Cialdini', 'A classic book on persuasion and human behavior', 15.99, 4.7, 2200, 4, '../images/_Influence_ By Robert Cialdini  This book was….jfif', NULL, 1),
('HTML & CSS: Design and Build Websites', 'Jon Duckett', 'Beginner-friendly guide to HTML and CSS', 15.99, 4.7, 3200, 5, '../images/abed8b64-1afd-4fc4-bdc2-6f0fa1385941.jfif', 'Beginner Friendly', 1),
('JavaScript: The Good Parts', 'Douglas Crockford', 'Highlighting the most effective features of JavaScript', 109.99, 4.6, 2800, 5, '../images/JavaScript_ The Modern Parts.jfif', NULL, 1),
('Dont Make Me Think, Revisited', 'Steve Krug', 'Classic usability guide for intuitive web design', 102.99, 4.9, 5000, 5, '../images/Great book on user experience_ Don t make me….jfif', 'Bestseller', 1),
('Learning Web Design (5th Edition)', 'Jennifer Niederst Robbins', 'Comprehensive introduction to HTML, CSS, JavaScript', 119.99, 4.7, 2800, 5, '../images/Learning Web Design_ A Beginner s Guide to HTML… (1).jfif', NULL, 1);


INSERT INTO books (title, author, description, price, rating, reviews, category_id, image, badge, copies_sold, pdf_link, in_stock) VALUES
('Atomic Habit', 'James Clear', 'Tiny Changes, Remarkable Results', 44.99, 4.8, 5000, 8, 'images/Buy -https___amzn_to_4nzgrkI_Reading Atomic Habits….jfif.crdownload', 'Bestseller', 'over 15M+ copies sold', 'images/Atomic Habits by James Clear.pdf.pdf', 1),
('Rich Dad Poor Dad', 'Robert Kiyosaki', 'What the Rich Teach Their Kids About Money', 54.99, 4.9, 8000, 8, 'images/Rich Dad, Poor Dad by Robert T_ Kiyosaki is a….jfif.crdownload', 'Classic', 'over 40M+ copies sold', 'images/Rich-Dad-Poor-Dad.pdf', 1),
('The Alchemist', 'Paulo Coelho', 'A fable about following your dream', 49.99, 4.9, 10000, 2, 'images/18 Self-Help Books That Are Actually Pretty Helpful.jfif', 'Must Read', 'over 65M+ copies sold', NULL, 1),
('The Subtle Art of Not Giving a F*ck', 'Mark Manson', 'A Counterintuitive Approach to Living a Good Life', 47.99, 4.7, 6000, 8, 'images/download.jfif', 'Comprehensive', 'over 15M+ copies sold', NULL, 1),
('The Secret', 'Rhonda Byrne', 'The power of positive thinking', 46.99, 4.8, 7000, 8, 'images/The Secret Book by Rhonda Byrne Hardcover The Law Of Attraction Manifestation.jfif', 'Essential', 'over 35M+ copies sold', 'images/The Secret (Rhonda Byrne).pdf', 1),
('Harry Potter', 'J.K. Rowling', 'The boy who lived', 45.99, 4.7, 15000, 2, 'images/Everyone needs a little HP in their blood_.jfif.crdownload', 'Beginner Friendly', 'over 500M+ copies sold', NULL, 1);