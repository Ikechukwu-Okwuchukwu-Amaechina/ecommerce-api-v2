require('dotenv').config();
const { connectDB, disconnectDB } = require('./config/db');
const Product = require('./models/Product');

const seedProducts = async () => {
  try {
    console.log('Connecting to database...');
    await connectDB();
    console.log('Connected to database.');

    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Existing products cleared.');

    const products = [
      {
        name: 'Wireless Noise-Canceling Headphones',
        price: 299.99,
        stock: 50,
        description: 'Premium wireless headphones with industry-leading noise cancellation, long battery life, and comfortable over-ear design.',
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Smart Fitness Watch',
        price: 199.50,
        stock: 120,
        description: 'Advanced fitness tracker with heart rate monitoring, GPS, sleep tracking, and water resistance.',
        imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Mechanical Gaming Keyboard',
        price: 129.00,
        stock: 85,
        description: 'RGB backlit mechanical keyboard with tactile switches for responsive gaming and typing.',
        imageUrl: 'https://images.unsplash.com/photo-1595225476474-87563907a212?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Ultra-HD 4K Monitor',
        price: 349.99,
        stock: 30,
        description: '27-inch 4K UHD monitor with stunning color accuracy and wide viewing angles for professionals and gamers.',
        imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Portable Bluetooth Speaker',
        price: 59.99,
        stock: 200,
        description: 'Compact and waterproof Bluetooth speaker delivering powerful sound and deep bass on the go.',
        imageUrl: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Ergonomic Office Chair',
        price: 249.00,
        stock: 45,
        description: 'Adjustable ergonomic chair with lumbar support, breathable mesh back, and comfortable seat cushion.',
        imageUrl: 'https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Stainless Steel Water Bottle',
        price: 24.99,
        stock: 300,
        description: 'Insulated water bottle that keeps drinks cold for 24 hours or hot for 12 hours.',
        imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=1000&auto=format&fit=crop'
      },
      {
        name: 'Professional DSLR Camera',
        price: 1299.99,
        stock: 15,
        description: 'High-resolution DSLR camera with interchangeable lenses, 4K video recording, and fast autofocus.',
        imageUrl: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=1000&auto=format&fit=crop'
      }
    ];

    console.log('Inserting sample products...');
    await Product.insertMany(products);
    console.log(`Successfully added ${products.length} products to the database.`);

  } catch (error) {
    console.error('Error seeding data:', error);
  } finally {
    await disconnectDB();
    console.log('Database connection closed.');
    process.exit(0);
  }
};

seedProducts();
